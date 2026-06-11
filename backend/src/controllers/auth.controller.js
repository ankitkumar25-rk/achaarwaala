import prisma from '../lib/prisma.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../config/paseto.js';
import { createError } from '../middleware/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (process.env.FIREBASE_PROJECT_ID && !getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 15 * 60 * 1000,
  path: '/',
};

const REFRESH_COOKIE_OPTS = {
  ...COOKIE_OPTS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function issueTokens(user) {
  const payload = { sub: user.id, phone: user.phone, role: user.role };
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(payload),
    signRefreshToken(payload),
  ]);

  try {
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (err) {
    console.error('[auth] refresh token persistence failed:', err.message);
  }

  return { accessToken, refreshToken };
}

export const verifyFirebase = asyncHandler(async (req, res) => {
  const { idToken, name, email } = req.body;
  
  if (!idToken) throw createError('Firebase ID Token required', 400);
  if (!getApps().length) throw createError('Firebase Admin not configured. Please add keys to .env', 500);

  let decodedToken;
  try {
    decodedToken = await getAuth().verifyIdToken(idToken);
  } catch (err) {
    throw createError('Invalid Firebase token', 401);
  }
  
  const phone = decodedToken.phone_number;
  if (!phone) throw createError('No phone number found in Firebase token', 400);

  let user = await prisma.user.findUnique({ where: { phone } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        name: name || 'User',
        email: email || null,
      }
    });
  } else if ((name && name !== user.name) || (email && email !== user.email)) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        email: email || user.email,
      }
    });
  }

  const { accessToken, refreshToken } = await issueTokens(user);

  res.cookie('access_token', accessToken, COOKIE_OPTS);
  res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTS);

  res.json({
    success: true,
    data: { 
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      accessToken,
      refreshToken
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token || req.body.refreshToken;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => {});
  }
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const refresh = asyncHandler(async (req, res) => {
  const authHeader = req.headers?.authorization;
  let token = req.cookies?.refresh_token;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    token = req.body?.refreshToken;
  }
  if (!token) throw createError('Refresh token required', 401);

  let payload;
  try {
    payload = await verifyToken(token);
  } catch (err) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return res.status(401).json({ success: false, error: 'REFRESH_TOKEN_EXPIRED', message: 'Session expired' });
  }

  if (payload.purpose !== 'refresh') throw createError('Invalid token', 401);

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return res.status(401).json({ success: false, error: 'REFRESH_TOKEN_EXPIRED', message: 'Session expired' });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw createError('User not found', 401);

  await prisma.refreshToken.delete({ where: { token } }).catch(() => {});
  const { accessToken, refreshToken: newRefreshToken } = await issueTokens(user);

  res.cookie('access_token', accessToken, COOKIE_OPTS);
  res.cookie('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTS);

  res.json({ 
    success: true, 
    user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
    accessToken,
    refreshToken: newRefreshToken
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, phone: true, email: true, role: true, avatarUrl: true, createdAt: true },
  });
  if (!user) throw createError('User not found', 404);
  res.json({ 
    success: true, 
    user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, avatarUrl: user.avatarUrl } 
  });
});
