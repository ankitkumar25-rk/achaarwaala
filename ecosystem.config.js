module.exports = {
  apps: [
    {
      name: 'achaarwaala-backend',
      script: 'backend/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
