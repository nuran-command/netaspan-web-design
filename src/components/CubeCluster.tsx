"use client";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Edges } from "@react-three/drei";
import * as THREE from "three";

function ServerModule({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Outer Frame */}
      <mesh>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.1}
        />
        <Edges scale={1.0} threshold={15} color="#2a2a2a" />
      </mesh>
      
      {/* Inner Server / Glass Body */}
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.05} smoothness={4}>
        <meshPhysicalMaterial
          color="#444"
          metalness={0.9}
          roughness={0.1}
          transmission={0.8}
          thickness={0.5}
          ior={1.5}
        />
      </RoundedBox>

      {/* Underside Emissive Glow */}
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial color="#FF6B00" toneMapped={false} />
      </mesh>
      
      <pointLight position={[0, -0.6, 0]} color="#FF6B00" intensity={2} distance={2} />
    </group>
  );
}

export default function CubeCluster() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.2} // XYZ rotation intensity
      floatIntensity={1.5} // Up/down float intensity
      floatingRange={[-0.2, 0.2]} // Range of y-axis values the object will float within
    >
      <group ref={group} scale={1.5}>
        <ServerModule position={[0, 0, 0]} />
        <ServerModule position={[1.1, 0, 0]} />
        <ServerModule position={[0, 1.1, 0]} />
        <ServerModule position={[1.1, 1.1, 0]} />
        <ServerModule position={[0, 0, 1.1]} />
        <ServerModule position={[1.1, 0, 1.1]} />
        <ServerModule position={[0, 1.1, 1.1]} />
        <ServerModule position={[1.1, 1.1, 1.1]} />
      </group>
    </Float>
  );
}
