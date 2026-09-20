import { PRODUCT_MAP, unitPrice, formatMoney, formatUnit, type ProductId } from "@/data/products";

export interface SearchConfig {
  productId: ProductId;
  density: number;
  thickness: number;
  /** true when the row shows a default (not query-matched) configuration */
  isDefault: boolean;
}

export interface SearchRow {
  key: string;
  productId: ProductId;
  density: number;
  thickness: number;
  price: number;
  priceLabel: string;
  isDefault: boolean;
}

const NAMES: Record<ProductId, string[]> = {
  oq: ["oq penaplast", "white penaplast", "белый пенопласт", "white eps", "oq eps", "белый eps", "white foam"],
  qora: ["qora penaplast", "black penaplast", "чёрный пенопласт", "black eps", "qora eps", "чёрный eps", "black foam"],
  crushed: ["maydalangan penaplast", "crushed penaplast", "дрезденка", "crushed eps", "mayda penaplast", "penaplast donachalari", "crushed foam", "eps granules", "drizden"],
};

/**
 * Real search: matches product names (any language), densities and thicknesses.
 * "12"  -> products available in 12 kg/m3
 * "20 sm" / "20" -> products with 20 cm thickness
 */
export function searchProducts(query: string): SearchRow[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [
      rowFor("oq", 10, 5, true),
      rowFor("qora", 10, 5, true),
      rowFor("crushed", 0, 0, true),
    ];
  }

  const digits = q.match(/\d+/g) ?? [];
  const densityHits = digits
    .map((d) => parseInt(d, 10))
    .filter((d) => [7, 10, 12, 14, 15, 16, 18, 20].includes(d));
  const thicknessHits = digits
    .map((d) => parseInt(d, 10))
    .filter((d) => [1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60].includes(d));
  const hasDigits = digits.length > 0;

  const nameMatches = (pid: ProductId) =>
    !hasDigits ? NAMES[pid].some((n) => n.includes(q) || q.includes(n)) : false;

  const rows: SearchRow[] = [];
  const seen = new Set<string>();
  const push = (r: SearchRow) => {
    const k = r.key;
    if (!seen.has(k) && rows.length < 12) {
      seen.add(k);
      rows.push(r);
    }
  };

  for (const pid of ["oq", "qora", "crushed"] as ProductId[]) {
    const product = PRODUCT_MAP[pid];

    if (nameMatches(pid)) {
      push(rowFor(pid, 10, 5, true));
      continue;
    }

    if (hasDigits) {
      const ds = product.densityEnabled ? densityHits : [];
      const ts = product.thicknessEnabled ? thicknessHits : [];
      if (ds.length && ts.length) {
        for (const d of ds) for (const t of ts) push(rowFor(pid, d, t, false));
      } else if (ds.length) {
        for (const d of ds) push(rowFor(pid, d, 10, false));
      } else if (ts.length) {
        for (const t of ts) push(rowFor(pid, 10, t, false));
      }
    }
  }

  return rows;
}

function rowFor(pid: ProductId, density: number, thickness: number, isDefault: boolean): SearchRow {
  const product = PRODUCT_MAP[pid];
  const d = product.densityEnabled ? density : 0;
  const t = product.thicknessEnabled ? thickness : 0;
  const price = unitPrice(product, d || 12);
  return {
    key: `${pid}-${d}-${t}`,
    productId: pid,
    density: d,
    thickness: t,
    price,
    priceLabel: `${formatMoney(price)} ${formatUnit(product)}`,
    isDefault,
  };
}

export function validateUzPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  // +998 99 513 22 22  -> 998995132222 (12)
  if (digits.length === 12) return digits.startsWith("998") || digits.startsWith("8998") || digits.startsWith("7998");
  // 99 513 22 22 -> local 9 digits starting with 9
  if (digits.length === 9) return digits.startsWith("9");
  return false;
}
