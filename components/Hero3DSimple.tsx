"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple floating particle
function FloatingParticle({ position, speed, color }: { position: [number, number, number], speed: number, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Gradient background plane
function GradientBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime * 0.2;
    }
  });

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorTop: { value: new THREE.Color('#f3e7ff') }, // Light purple
        uColorBottom: { value: new THREE.Color('#fce7f3') }, // Light pink
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorTop;
        uniform vec3 uColorBottom;
        varying vec2 vUv;
        
        void main() {
          // Animated gradient with wave
          float wave = sin(vUv.x * 3.0 + uTime) * 0.1;
          float gradient = vUv.y + wave;
          vec3 color = mix(uColorBottom, uColorTop, gradient);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} material={shaderMaterial}>
      <planeGeometry args={[50, 50]} />
    </mesh>
  );
}

// Particles Scene
function ParticlesScene() {
  // Generate random particles with purple-pink colors
  const particles = useMemo(() => {
    const colors = ['#a855f7', '#ec4899', '#d946ef', '#f472b6'];
    const particleArray = [];
    
    for (let i = 0; i < 20; i++) {
      particleArray.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5
        ] as [number, number, number],
        speed: 0.3 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    return particleArray;
  }, []);

  return (
    <>
      <GradientBackground />
      {particles.map((particle, index) => (
        <FloatingParticle
          key={index}
          position={particle.position}
          speed={particle.speed}
          color={particle.color}
        />
      ))}
    </>
  );
}

// Main 3D Component - Simple and Responsive
export default function Hero3DSimple() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <ParticlesScene />
      </Canvas>
    </div>
  );
}
