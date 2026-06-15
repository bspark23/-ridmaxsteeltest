import { Item } from "@/models/content";

export const PRODUCT_IMAGES: Record<string, string[]> = {
  "brush materials": [
    "/images/brush material/_KOS6404.jpg",
    "/images/brush material/_KOS6405.jpg",
    "/images/brush material/_KOS6406.jpg",
    "/images/brush material/_KOS8726.jpg",
    "/images/brush material/_KOS8728.jpg",
    "/images/brush material/_KOS8730.jpg",
  ],
  "angle materials": [
    "/images/angle materials/_KOS8847.jpg",
    "/images/angle materials/_KOS8853.jpg",
    "/images/angle materials/_KOS8877 copy.jpg",
    "/images/angle materials/_KOS8887.jpg",
  ],
  "checker materials": [
    "/images/Cheacker Materials/_KOS8674.jpg",
    "/images/Cheacker Materials/_KOS8682.jpg",
    "/images/Cheacker Materials/_KOS8689.jpg",
    "/images/Cheacker Materials/_KOS8690.jpg",
  ],
  "flat bar materials": [
    "/images/flatbar/_KOS8894.jpg",
    "/images/flatbar/_KOS8896.jpg",
  ],
  "galvanise steel product": [
    "/images/gaiva/_KOS6495.jpg",
    "/images/gaiva/_KOS6498.jpg",
    "/images/gaiva/_KOS6499.jpg",
    "/images/gaiva/_KOS6502.jpg",
    "/images/gaiva/_KOS6503.jpg",
    "/images/gaiva/_KOS6504.jpg",
    "/images/gaiva/_KOS6505.jpg",
    "/images/gaiva/_KOS6506.jpg",
    "/images/gaiva/_KOS6507.jpg",
    "/images/gaiva/_KOS6508.jpg",
    "/images/gaiva/_KOS6509.jpg",
  ],
  "mild steel product": [
    "/images/mild/_KOS6543.jpg",
    "/images/mild/_KOS6534.jpg",
    "/images/mild/_KOS6544.jpg",
    "/images/mild/_KOS6579.jpg",
    "/images/mild/_KOS6580.jpg",
    "/images/mild/_KOS6583.jpg",
    "/images/mild/_KOS6584.jpg",
    "/images/mild/_KOS6587.jpg",
    "/images/mild/_KOS6588.jpg",
    "/images/mild/_KOS6590.jpg",
    "/images/mild/_KOS6593.jpg",
    "/images/mild/_KOS6594.jpg",
    "/images/mild/_KOS6595.jpg",
    "/images/mild/_KOS6601.jpg",
    "/images/mild/_KOS6602.jpg",
    "/images/mild/_KOS6605.jpg",
  ],
  "mirror black": [
    "/images/Mirror/_KOS6410.jpg",
    "/images/Mirror/_KOS6417.jpg",
    "/images/Mirror/_KOS8707.jpg",
    "/images/Mirror/_KOS8709.jpg",
  ],
  "mirror blue": ["/images/blue/_KOS6479.jpg", "/images/blue/_KOS6481.jpg"],
  "mirror gold": [
    "/images/gold/_KOS6419.jpg",
    "/images/gold/_KOS6422.jpg",
    "/images/gold/_KOS8692.jpg",
    "/images/gold/_KOS8699.jpg",
  ],
  "mirror stainless sheet": [
    "/images/stainless/_KOS8719.jpg",
    "/images/stainless/_KOS8720.jpg",
  ],
  "perforated materials": [
    "/images/perforated/_KOS8772.jpg",
    "/images/perforated/_KOS8781.jpg",
    "/images/perforated/_KOS8782.jpg",
  ],
  "solid rod materials": [
    "/images/solid/_KOS8902.jpg",
    "/images/solid/_KOS8905.jpg",
    "/images/solid/_KOS8906.jpg",
    "/images/solid/_KOS8932.jpg",
    "/images/solid/_KOS8935.jpg",
    "/images/solid/_KOS8936.jpg",
  ],
  "stainless round pipe": [
    "/images/spipe/_KOS8743.jpg",
    "/images/spipe/_KOS8747.jpg",
    "/images/spipe/_KOS8750.jpg",
  ],
  "stainless square pipe": [
    "/images/square/_KOS8916.jpg",
    "/images/square/_KOS8919.jpg",
    "/images/square/_KOS8920.jpg",
    "/images/square/_KOS8940.jpg",
    "/images/square/_KOS8942.jpg",
  ],
  "stainless steel accessories": [
    "/images/accessories/_KOS8791.jpg",
    "/images/accessories/_KOS8797.jpg",
    "/images/accessories/_KOS8801 copy.jpg",
    "/images/accessories/_KOS8806.jpg",
    "/images/accessories/_KOS8810 copy.jpg",
    "/images/accessories/_KOS8814.jpg",
    "/images/accessories/_KOS8820.jpg",
    "/images/accessories/_KOS8821.jpg",
    "/images/accessories/_KOS8824.jpg",
    "/images/accessories/_KOS8827.jpg",
    "/images/accessories/_KOS8828.jpg",
    "/images/accessories/_KOS8832.jpg",
    "/images/accessories/_KOS8833.jpg",
    "/images/accessories/_KOS8835.jpg",
    "/images/accessories/_KOS8836.jpg",
    "/images/accessories/_KOS8838.jpg",
  ],
};

const PRODUCT_ALIASES: Record<string, string> = {
  "corrugated roofing sheet": "galvanise steel product",
  "flat bar": "flat bar materials",
  "iron rods (tmt bars)": "mild steel product",
  "square hollow section": "stainless square pipe",
  "steel pipes": "stainless round pipe",
};

function keyFor(title: string) {
  return title.toLowerCase().trim();
}

export function getProductSlides(item: Item, catalogueItems: Item[] = []) {
  if (item.images && item.images.length > 0) return item.images;

  const key = keyFor(item.title);
  const alias = PRODUCT_ALIASES[key];
  const catalogueMatch = catalogueItems.find((candidate) => {
    const candidateKey = keyFor(candidate.title);
    return candidateKey === key || candidateKey === alias;
  });

  if (catalogueMatch?.images && catalogueMatch.images.length > 0) {
    return catalogueMatch.images;
  }

  const mapped = PRODUCT_IMAGES[alias ?? key];
  if (mapped && mapped.length > 0) return mapped;

  if (catalogueMatch?.image) return [catalogueMatch.image];
  if (item.image) return [item.image];
  return [];
}
