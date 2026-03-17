'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type MediaItem = {
  id: string;
  title?: string;
  type: 'image' | 'video';
  url?: string;
  linkUrl?: string | null;
};

function generateSpherePositions(count: number, radius: number) {
  const positions: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  if (count === 1) {
    // Keep single item away from poles
    positions.push(new THREE.Vector3(0, 0.25 * radius, Math.sqrt(1 - 0.25 * 0.25) * radius));
    return positions;
  }

  // Avoid north/south poles so media doesn't cluster on the "nodes"
  const poleClamp = 0.78; // max |y| on unit sphere

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = (1 - t * 2) * poleClamp;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    positions.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return positions;
}

function CameraRig({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!target) return;

    const desired = target.clone().multiplyScalar(1.8);

    camera.position.lerp(desired, 0.06);

    lookAt.current.lerp(target, 0.08);
    camera.lookAt(lookAt.current);
  });

  return null;
}

type MediaBillboardProps = {
  item: MediaItem;
  position: THREE.Vector3;
  onSelect: (item: MediaItem, position: THREE.Vector3) => void;
  isSelected: boolean;
};

function MediaBillboard({
  item,
  position,
  onSelect,
  isSelected,
}: MediaBillboardProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!item.url) return;

    let mounted = true;
    setIsReady(false);

    if (item.type === 'image') {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(
        item.url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.needsUpdate = true;

          if (mounted) {
            setTexture(tex);
            setIsReady(true);
          }
        },
        undefined,
        () => {
          if (mounted) setIsReady(false);
        },
      );
    }

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.url;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      const markReady = () => {
        if (!mounted) return;
        setIsReady(true);
      };
      video.addEventListener('loadeddata', markReady);
      video.addEventListener('canplay', markReady);
      video.play().catch(() => {});

      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;

      if (mounted) setTexture(tex);
    }

    return () => {
      mounted = false;
    };
  }, [item]);

  const outwardPosition = useMemo(
    () => position.clone().multiplyScalar(1.05),
    [position]
  );

  const quaternion = useMemo(() => {
    // Make the card face outward, but keep it vertically "upright"
    // (i.e. its local +Y aligns with world +Y projected onto the tangent plane).
    const normal = position.clone().normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);

    // Tangent axis around the sphere (card local +X)
    let xAxis = new THREE.Vector3().crossVectors(worldUp, normal);
    if (xAxis.lengthSq() < 1e-6) {
      // If we're close to a pole, fall back to a different reference axis
      xAxis = new THREE.Vector3().crossVectors(new THREE.Vector3(1, 0, 0), normal);
    }
    xAxis.normalize();

    // Upright axis on the tangent plane (card local +Y)
    const yAxis = new THREE.Vector3().crossVectors(normal, xAxis).normalize();

    const m = new THREE.Matrix4().makeBasis(xAxis, yAxis, normal);
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, [position]);

  return (
    <group
      position={outwardPosition.toArray()}
      quaternion={quaternion}
      onClick={(e) => {
        e.stopPropagation();

        if (item.type === 'video' && item.linkUrl) {
          window.open(item.linkUrl, '_blank');
          return;
        }

        onSelect(item, position);
      }}
    >
      <mesh>
        <planeGeometry args={[0.7, 1.1]} />
        <meshBasicMaterial
          map={texture ?? undefined}
          color={texture ? (isSelected ? '#ffffff' : '#ffffff') : '#000000'}
          toneMapped={false}
          transparent
          opacity={isReady ? 1 : 0}
        />
      </mesh>
    </group>
  );
}

function GlobeContents({
  items,
  onSelect,
  selectedId,
  setCameraTarget,
}: {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
  selectedId?: string;
  setCameraTarget: (v: THREE.Vector3 | null) => void;
}) {
  const positions = useMemo(
    () => generateSpherePositions(items.length || 1, 4),
    [items.length]
  );

  return (
    <>
      {items.map((item, index) => (
        <MediaBillboard
          key={item.id || `${item.type}-${item.url ?? "no-url"}-${index}`}
          item={item}
          position={positions[index]}
          isSelected={item.id === selectedId}
          onSelect={(i, pos) => {
            onSelect(i);
            setCameraTarget(pos);
          }}
        />
      ))}

      <mesh>
        <sphereGeometry args={[4.02, 32, 32]} />
        <meshBasicMaterial
          wireframe
          color="#ffffff"
          transparent
          opacity={0.06}
        />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
      />
      <ambientLight intensity={1} />
    </>
  );
}

export function MediaGlobe({ items }: { items: MediaItem[] }) {
  const safeItems = items?.filter((i) => i.url) ?? [];

  const [selected, setSelected] = useState<MediaItem | null>(safeItems[0] ?? null);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full h-[65vh] md:h-[75vh]">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <CameraRig target={cameraTarget} />

          <GlobeContents
            items={safeItems}
            onSelect={setSelected}
            selectedId={selected?.id}
            setCameraTarget={setCameraTarget}
          />
        </Canvas>
      </div>

      <div className="mt-6 text-center min-h-[3rem] px-4">
        {selected && (
          <p className="text-sm md:text-base text-white">
            {selected.title}
          </p>
        )}
      </div>
    </div>
  );
}

