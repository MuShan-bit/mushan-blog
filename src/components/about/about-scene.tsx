"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Group } from "three";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useTheme } from "next-themes";

type AboutSceneProps = {
  keywords: string[];
};

type Token = {
  word: string;
  position: [number, number, number];
  scale: [number, number, number];
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onChange = () => setReduced(media.matches);

    onChange();
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function createPortraitTokens(words: string[], density: number) {
  const tokens: Token[] = [];
  let index = 0;

  for (let y = 1.4; y >= -1.95; y -= 0.18) {
    for (let x = -1.4; x <= 1.4; x += 0.16) {
      const head = (x * x) / 0.72 + ((y - 0.42) * (y - 0.42)) / 1.18 < 1;
      const neck = Math.abs(x) < 0.18 && y < -0.35 && y > -0.9;
      const shoulders =
        ((x * x) / 1.8 + ((y + 1.25) * (y + 1.25)) / 0.62 < 1.08 && y < -0.55) ||
        ((x * x) / 0.48 + ((y + 0.78) * (y + 0.78)) / 0.48 < 1 && y < -0.2);

      if (!head && !neck && !shoulders) {
        continue;
      }

      if ((index + Math.abs(Math.round(x * 10))) % density !== 0) {
        index += 1;
        continue;
      }

      const z = head ? Math.cos(x * 2.2) * 0.24 + Math.sin(y * 2.1) * 0.12 : Math.sin(x * 3.1) * 0.16;
      const word = words[index % words.length];
      const width = Math.max(0.35, Math.min(0.9, word.length * 0.12));
      const height = 0.14 + (head ? 0.02 : 0);

      tokens.push({
        word,
        position: [x + Math.sin(index) * 0.02, y + Math.cos(index * 0.7) * 0.02, z],
        scale: [width, height, 1],
      });

      index += 1;
    }
  }

  return tokens;
}

function createWordTexture(word: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '600 58px "PingFang SC", "Noto Sans SC", sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 18;
  context.fillText(word, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function PortraitField({
  color,
  motionEnabled,
  density,
  keywords,
}: {
  color: string;
  motionEnabled: boolean;
  density: number;
  keywords: string[];
}) {
  const groupRef = useRef<Group>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(window.scrollY / max);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tokens = useMemo(() => createPortraitTokens(keywords, density), [density, keywords]);
  const textures = useMemo(() => {
    const map = new Map<string, THREE.CanvasTexture>();

    [...new Set(keywords)].forEach((word) => {
      const texture = createWordTexture(word, color);
      if (texture) {
        map.set(word, texture);
      }
    });

    return map;
  }, [color, keywords]);

  useEffect(() => {
    return () => {
      textures.forEach((texture) => texture.dispose());
    };
  }, [textures]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const targetY = motionEnabled ? -0.85 * scrollProgress : 0;
    const targetRotationY = 0.42 + state.pointer.x * 0.2 + scrollProgress * 0.22;
    const targetRotationX = -0.08 + state.pointer.y * 0.12;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.06);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      motionEnabled ? Math.sin(state.clock.elapsedTime * 0.35) * 0.08 : 0,
      0.04,
    );
  });

  return (
    <group ref={groupRef}>
      {tokens.map((token, index) => (
        <sprite key={`${token.word}-${index}`} position={token.position} scale={token.scale}>
          <spriteMaterial
            attach="material"
            transparent
            depthWrite={false}
            toneMapped={false}
            opacity={0.86 - (index % 5) * 0.08}
            map={textures.get(token.word) ?? null}
          />
        </sprite>
      ))}

      {Array.from({ length: 48 }).map((_, index) => (
        <mesh
          key={`halo-${index}`}
          position={[
            Math.sin(index * 2.2) * 1.5,
            Math.cos(index * 1.3) * 1.5,
            -1.3 + (index % 6) * 0.18,
          ]}
        >
          <sphereGeometry args={[0.016 + (index % 4) * 0.006, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.1 + (index % 3) * 0.04} />
        </mesh>
      ))}
    </group>
  );
}

function FallbackWords({ keywords }: { keywords: string[] }) {
  return (
    <div className="glass-panel flex h-full min-h-[24rem] flex-col justify-between rounded-[2rem] p-6">
      <div className="space-y-4">
        <p className="section-kicker text-sm font-semibold">Text Portrait</p>
        <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
          用文字勾勒出一个仍在生长中的自己。
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-border bg-accent-soft px-4 py-2 text-sm text-accent-strong"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AboutScene({ keywords }: AboutSceneProps) {
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const density = useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => (window.innerWidth < 768 ? 3 : 2),
    () => 2,
  );

  if (!mounted || reducedMotion) {
    return <FallbackWords keywords={keywords} />;
  }

  const color = resolvedTheme === "dark" ? "#d6fde8" : "#124d39";

  return (
    <div className="glass-panel relative h-full min-h-[24rem] overflow-hidden rounded-[2rem]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.38),transparent_42%),radial-gradient(circle_at_20%_85%,rgba(120,221,178,0.12),transparent_28%)]" />
      <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0.25, 4.8]} fov={38} />
        <ambientLight intensity={0.8} />
        <pointLight intensity={1.4} position={[3, 4, 3]} color={color} />
        <pointLight intensity={0.6} position={[-3, -2, 1]} color="#8ec5ff" />
        <PortraitField color={color} motionEnabled density={density} keywords={keywords} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-xs text-muted">
        <span>3D.js 文本形象滚动视差</span>
        <span>scroll + pointer parallax</span>
      </div>
    </div>
  );
}
