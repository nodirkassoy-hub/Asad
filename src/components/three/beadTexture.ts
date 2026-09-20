import * as THREE from "three";

/** deterministic pseudo-random from ints (stable across renders) */
function rnd(a: number, b: number, s: number): number {
  const x = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Builds a tileable canvas texture that looks like a packed bed of EPS foam
 * beads: individual round granules with a soft specular highlight and thin
 * darker seams between them.
 */
export function createBeadTexture(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // seams between beads
  ctx.fillStyle = "#b9c0c9";
  ctx.fillRect(0, 0, size, size);

  const cells = 48;
  const cell = size / cells;

  for (let gy = 0; gy < cells; gy++) {
    for (let gx = 0; gx < cells; gx++) {
      const jx = (rnd(gx, gy, 1) - 0.5) * cell * 0.45;
      const jy = (rnd(gx, gy, 2) - 0.5) * cell * 0.45;
      const cx = gx * cell + cell / 2 + jx;
      const cy = gy * cell + cell / 2 + jy;
      const r = cell * (0.4 + rnd(gx, gy, 3) * 0.12);
      const light = 233 + Math.round(rnd(gx, gy, 4) * 16);

      // draw with wrap so the texture tiles seamlessly
      for (let ox = -size; ox <= size; ox += size) {
        for (let oy = -size; oy <= size; oy += size) {
          const x = cx + ox;
          const y = cy + oy;
          if (x < -r || x > size + r || y < -r || y > size + r) continue;
          const g = ctx.createRadialGradient(x - r * 0.34, y - r * 0.38, r * 0.12, x, y, r);
          const hi = Math.min(255, light + 22);
          g.addColorStop(0, `rgb(${hi},${hi},${Math.min(255, hi + 2)})`);
          g.addColorStop(0.55, `rgb(${light},${light},${Math.min(255, light + 4)})`);
          g.addColorStop(1, `rgb(${light - 44},${light - 40},${light - 30})`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
