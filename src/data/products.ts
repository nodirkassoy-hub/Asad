export type ProductId = "oq" | "qora" | "crushed";

export interface Product {
  id: ProductId;
  /** i18n key for the product name */
  nameKey: string;
  /** i18n key for the short description */
  descKey: string;
  image: string;
  /** i18n key for the applications list (array) */
  appsKey: string;
  densityEnabled: boolean;
  thicknessEnabled: boolean;
  priceMode: "per_m3" | "per_kg";
  accent: string; // tailwind gradient classes for card glow
}

export const DENSITIES = [7, 10, 12, 14, 15, 16, 18, 20] as const;
export type Density = (typeof DENSITIES)[number];

/** Block price per m3 by density, USD */
export const DENSITY_PRICES: Record<number, number> = {
  7: 32,
  10: 40,
  12: 50,
  14: 62,
  15: 67,
  16: 71,
  18: 79,
  20: 87,
};

/** Crushed penaplast price: USD per kilogram */
export const CRUSHED_PRICE_PER_KG = 0.7;

export const THICKNESSES = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60] as const;
export type Thickness = (typeof THICKNESSES)[number];

export const MAX_THICKNESS = 60;

/** Standard block footprint, cm */
export const BLOCK_LENGTH = 100;
export const BLOCK_WIDTH = 50;

export const PRODUCTS: Product[] = [
  {
    id: "oq",
    nameKey: "product.oq.name",
    descKey: "product.oq.desc",
    image: "/images/product-oq.jpg",
    appsKey: "product.oq.apps",
    densityEnabled: true,
    thicknessEnabled: true,
    priceMode: "per_m3",
    accent: "from-cyan-400/25 to-sky-500/10",
  },
  {
    id: "qora",
    nameKey: "product.qora.name",
    descKey: "product.qora.desc",
    image: "/images/product-qora.jpg",
    appsKey: "product.qora.apps",
    densityEnabled: true,
    thicknessEnabled: true,
    priceMode: "per_m3",
    accent: "from-slate-400/20 to-brand-500/10",
  },
  {
    id: "crushed",
    nameKey: "product.crushed.name",
    descKey: "product.crushed.desc",
    image: "/images/product-maydalangan.jpg",
    appsKey: "product.crushed.apps",
    densityEnabled: false,
    thicknessEnabled: false,
    priceMode: "per_kg",
    accent: "from-cyan-300/20 to-blue-500/10",
  },
];

export const PRODUCT_MAP: Record<ProductId, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p])
) as Record<ProductId, Product>;

export function unitPrice(product: Product, density: number): number {
  if (product.priceMode === "per_kg") return CRUSHED_PRICE_PER_KG;
  return DENSITY_PRICES[density] ?? DENSITY_PRICES[12];
}

export function formatMoney(n: number): string {
  const r = Math.round(n * 100) / 100;
  if (Number.isInteger(r)) return `$${r}`;
  return `$${r.toFixed(2)}`;
}

export function formatUnit(product: Product): string {
  return product.priceMode === "per_kg" ? "/ kg" : "/ m³";
}
