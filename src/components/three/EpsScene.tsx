"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { createBeadTexture } from "./beadTexture";

function isCoarse(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
}

/* ---------------- EPS block: displaced box with bead texture ---------------- */

function EpsBlock({ tex }: { tex: THREE.Texture }) {
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(2.3, 1.35, 1.05, 28, 18, 14);
    g.computeVertexNormals();
    return g;
  }, []);

  useMemo(() => {
    tex.repeat.set(2.4, 2.4);
  }, [tex]);

  return (
    <mesh geometry={geometry} position={[-0.55, 0.72, 0]} rotation={[0, -0.35, 0]} castShadow receiveShadow>
      <meshStandardMaterial
        map={tex}
        bumpMap={tex}
        bumpScale={0.12}
        displacementMap={tex}
        displacementScale={0.045}
        color="#f2f5f8"
        roughness={0.93}
        metalness={0.02}
      />
    </mesh>
  );
}

/* ---------------- bead cluster: instanced granules ---------------- */

function BeadCluster() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const coarse = isCoarse();
  const count = coarse ? 650 : 1500;

  const { matrices, colors } = useMemo(() => {
    const m: THREE.Matrix4[] = [];
    const c: THREE.Color[] = [];
    const R = 1.05;
    const M = new THREE.Matrix4();
    const P = new THREE.Vector3();
    const Q = new THREE.Quaternion();
    const S = new THREE.Vector3();
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      const ang = rand() * Math.PI * 2;
      const rad = Math.sqrt(rand()) * R;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad * 0.8;
      const dome = (1 - Math.pow(rad / R, 1.8)) * 0.55;
      const y = Math.max(0.05, dome * (0.55 + rand() * 0.5) + rand() * 0.05);
      const s = 0.052 + rand() * 0.042;
      P.set(x, y, z);
      Q.setFromEuler(new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI));
      S.set(s, s, s);
      M.compose(P, Q, S);
      m.push(M.clone());
      const v = 224 + Math.round(rand() * 30);
      c.push(new THREE.Color(`rgb(${v},${Math.min(255, v + 1)},${Math.min(255, v + 3)})`));
    }
    return { matrices: m, colors: c };
  }, [count]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      mesh.setMatrixAt(i, matrices[i]);
      mesh.setColorAt(i, colors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [matrices, colors, count]);

  return (
    <group position={[1.5, 0.05, 0.1]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial roughness={0.85} metalness={0.02} />
      </instancedMesh>
      {/* dark tray under the beads */}
      <mesh position={[0, -0.015, 0]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.42, 0.09, 48]} />
        <meshStandardMaterial color="#0c1424" roughness={0.45} metalness={0.55} />
      </mesh>
    </group>
  );
}

/* ---------------- labels ---------------- */

function LabelChip({ position, children }: { position: [number, number, number]; children: React.ReactNode }) {
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap rounded-full border border-cyan-300/30 bg-[#081120]/80 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.18em] text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.25)] backdrop-blur-md sm:text-[11px]">
        {children}
      </div>
    </Html>
  );
}

/* ---------------- controls ---------------- */

function Controls() {
  const [auto, setAuto] = useState(true);
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    const el = gl.domElement;
    const stop = () => setAuto(false);
    el.addEventListener("pointerdown", stop);
    el.addEventListener("wheel", stop, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
    };
  }, [gl]);

  return (
    <OrbitControls
      makeDefault
      target={[0.35, 0.72, 0]}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={2.3}
      maxDistance={8.5}
      minPolarAngle={0.12}
      maxPolarAngle={1.5}
      autoRotate={auto}
      autoRotateSpeed={0.55}
    />
  );
}

/* ---------------- scene ---------------- */

function Scene({
  tex,
  labelBlock,
  labelBeads,
}: {
  tex: THREE.Texture;
  labelBlock: string;
  labelBeads: string;
}) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[5, 7, 4]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[-5, 3, -4]} color="#22d3ee" intensity={45} />
      <pointLight position={[4, 1.6, -3.5]} color="#3b82f6" intensity={26} />

      <EpsBlock tex={tex} />
      <BeadCluster />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[6, 48]} />
        <meshStandardMaterial color="#0a111e" roughness={0.85} metalness={0.2} />
      </mesh>
      <ContactShadows position={[0, 0, 0.01]} opacity={0.6} scale={12} blur={2.6} far={4} resolution={512} color="#000000" />

      <LabelChip position={[-0.6, 2.0, 0]}>{labelBlock}</LabelChip>
      <LabelChip position={[1.5, 1.45, 0.1]}>{labelBeads}</LabelChip>

      <Controls />
    </>
  );
}

export default function EpsScene({ labelBlock, labelBeads }: { labelBlock: string; labelBeads: string }) {
  const tex = useMemo(() => createBeadTexture(1024), []);

  return (
    <Canvas
      shadows
      dpr={[1, isCoarse() ? 1.5 : 1.75]}
      camera={{ position: [3.4, 2.1, 4.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!touch-none"
    >
      <Scene tex={tex} labelBlock={labelBlock} labelBeads={labelBeads} />
    </Canvas>
  );
}
