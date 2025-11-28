"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Main Gradient Sphere - Professional & Clean - Centered Behind Text
function GradientSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const { clock } = state;

    if (meshRef.current) {
      // Very subtle rotation
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.15;
    }

    // Animate emissive intensity for subtle glow pulse
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 
        0.15 + Math.sin(clock.getElapsedTime() * 0.5) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]} scale={2.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#a855f7"
        emissive="#ec4899"
        emissiveIntensity={0.15}
        roughness={0.3}
        metalness={0.7}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// Floating Ring - Orbiting around centered sphere
function FloatingRing({ radius = 3.5, speed = 1, offset = 0 }: { radius?: number; speed?: number; offset?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const t = state.clock.getElapsedTime() * speed + offset;
      ringRef.current.position.x = Math.cos(t) * radius;
      ringRef.current.position.z = Math.sin(t) * radius - 3;
      ringRef.current.rotation.x = t * 0.25;
      ringRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[0.25, 0.06, 16, 32]} />
      <meshStandardMaterial
        color="#c084fc"
        emissive="#c084fc"
        emissiveIntensity={0.2}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

// Ambient Particles - Subtle background effect (evenly distributed)
function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Distribute particles evenly around the scene
      positions[i * 3] = (Math.random() - 0.5) * 16; // x: -8 to 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12; // y: -6 to 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3; // z: -8 to 2 (behind text)
      sizes[i] = Math.random() * 0.02 + 0.01;
    }
    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ec4899"
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main 3D Scene - Professional Setup (Centered, Subtle)
export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-green-50/70 via-emerald-50/50 to-white">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: 'transparent' }}
      >
        {/* Subtle Lighting Setup - Centered and balanced */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 3]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-3, 2, -2]} color="#a855f7" intensity={0.7} />
        <pointLight position={[3, -2, -2]} color="#ec4899" intensity={0.7} />

        {/* Main 3D Objects - Centered behind text */}
        <GradientSphere />
        
        {/* Floating Rings - Slower and more subtle */}
        <FloatingRing radius={3.0} speed={0.2} offset={0} />
        <FloatingRing radius={3.5} speed={0.18} offset={Math.PI} />
        <FloatingRing radius={4.0} speed={0.15} offset={Math.PI / 2} />
        
        {/* Background Particles */}
        <AmbientParticles />
      </Canvas>
    </div>
  );
}
