"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// TEST VERSION - Super obvious big red cube
function TestCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} scale={3}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

// TEST 3D Scene - Simple and OBVIOUS
export default function Hero3DBackgroundTest() {
  return (
    <div className="absolute inset-0 -z-10 bg-blue-200">
      {/* Blue background so we know div is there */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <TestCube />
      </Canvas>
      
      {/* Text overlay to confirm component is loaded */}
      <div className="absolute top-4 left-4 bg-black text-white p-2 text-xs font-mono">
        3D Component Loaded ✓
      </div>
    </div>
  );
}
