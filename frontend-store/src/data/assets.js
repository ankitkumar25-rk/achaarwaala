import imgLeft from '../assets/images/78d24d8c-b63f-4b3e-a9f3-6f5752927c0a.png';
import imgTopRight from '../assets/images/60bc9565-b5f4-454d-a8e5-36addfed5fd0 (1).png';
import imgBottomRight from '../assets/images/b085284f-af0d-4da2-8ead-aa66bd3075eb.png';

// Brand exports
export const brandAssets = {
  logo: imgLeft,
  logoDark: imgLeft,
  favicon: imgLeft,
};

// Category registry
export const categoryRegistry = [
  { key: "MANGO", label: "Mango Specialities" },
  { key: "CHILLI", label: "Artisanal Chilli" },
  { key: "DESERT", label: "Desert Delicacies" },
  { key: "HERITAGE", label: "Heritage Blends" },
];

export const categoryImages = {
  MANGO: imgBottomRight,
  CHILLI: imgLeft,
  DESERT: imgTopRight,
  HERITAGE: imgBottomRight,
};

export const productImagesBySlug = {
  "heritage-mango": imgBottomRight,
  "rustic-chilli": imgLeft,
  "ker-sangri": imgTopRight,
  "ancestral-lemon": imgBottomRight,
  "spicy-garlic": imgLeft,
  "dry-mango-amchur": imgTopRight,
};

export const getProductImage = (slug) => productImagesBySlug[slug] || imgBottomRight;
