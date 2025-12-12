"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating Geometric Shape - Modern wireframe design
function FloatingGeometry({ position, geometry, speed, color }: { 
  position: [number, number, number], 
  geometry: 'box' | 'octahedron' | 'icosahedron' | 'torus',
  speed: number,
  color: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003 * speed;
      meshRef.current.rotation.y += 0.002 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = meshRef.current?.rotation.x || 0;
      wireframeRef.current.rotation.y = meshRef.current?.rotation.y || 0;
      wireframeRef.current.position.y = meshRef.current?.position.y || position[1];
    }
  });

  const geometryComponent = useMemo(() => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.8, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.8, 0]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.2, 16, 32]} />;
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
    }
  }, [geometry]);

  return (
    <group position={position}>
      {/* Solid mesh with glass effect */}
      <mesh ref={meshRef}>
        {geometryComponent}
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.25}
          metalness={0.3}
          roughness={0.2}
          transmission={0.7}
          thickness={0.3}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <lineSegments ref={wireframeRef}>
        {geometryComponent}
        <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={1} />
      </lineSegments>
    </group>
  );
}

// Connecting Lines between shapes on sides
function ConnectingLines() {
  const linesRefLeft = useRef<THREE.LineSegments>(null);
  const linesRefRight = useRef<THREE.LineSegments>(null);
  
  useFrame((state) => {
    if (linesRefLeft.current) {
      linesRefLeft.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (linesRefRight.current) {
      linesRefRight.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + Math.PI) * 0.1;
    }
  });

  const { leftPoints, rightPoints } = useMemo(() => {
    const leftPointsArray = [];
    const rightPointsArray = [];
    
    // Left side web
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      leftPointsArray.push(
        new THREE.Vector3(-5 + Math.cos(angle) * 1.5, Math.sin(angle * 2) * 2.5, -2 + Math.sin(angle) * 1.5)
      );
    }
    
    // Right side web
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      rightPointsArray.push(
        new THREE.Vector3(5 + Math.cos(angle) * 1.5, Math.sin(angle * 2) * 2.5, -2 + Math.sin(angle) * 1.5)
      );
    }
    
    return { leftPoints: leftPointsArray, rightPoints: rightPointsArray };
  }, []);

  const leftGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(leftPoints);
    const indices = [];
    for (let i = 0; i < leftPoints.length; i++) {
      indices.push(i, (i + 1) % leftPoints.length);
      indices.push(i, (i + 2) % leftPoints.length);
    }
    geo.setIndex(indices);
    return geo;
  }, [leftPoints]);

  const rightGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(rightPoints);
    const indices = [];
    for (let i = 0; i < rightPoints.length; i++) {
      indices.push(i, (i + 1) % rightPoints.length);
      indices.push(i, (i + 2) % rightPoints.length);
    }
    geo.setIndex(indices);
    return geo;
  }, [rightPoints]);

  return (
    <>
      <lineSegments ref={linesRefLeft} geometry={leftGeometry}>
        <lineBasicMaterial color="#10b981" transparent opacity={0.25} />
      </lineSegments>
      <lineSegments ref={linesRefRight} geometry={rightGeometry}>
        <lineBasicMaterial color="#059669" transparent opacity={0.25} />
      </lineSegments>
    </>
  );
}

// Energy Particles - Distributed evenly (works for both mobile and desktop)
function EnergyParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const count = 70;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color1 = new THREE.Color('#10b981');
    const color2 = new THREE.Color('#059669');
    
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere pattern
      const radius = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = radius * Math.cos(phi) - 3; // z: mostly behind
      
      const mixColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
      
      sizes[i] = Math.random() * 0.025 + 0.01;
    }
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      particlesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
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
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
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
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Scene - Responsive positioning
function ModernScene({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    // Mobile/Tablet: More spread out to the sides
    return (
      <>
        {/* Shapes positioned to the sides */}
        <FloatingGeometry position={[-4, 2.5, -3]} geometry="icosahedron" speed={1} color="#10b981" />
        <FloatingGeometry position={[4, -1, -4]} geometry="octahedron" speed={0.8} color="#059669" />
        <FloatingGeometry position={[-4.5, -2, -3]} geometry="box" speed={0.7} color="#34d399" />
        <FloatingGeometry position={[4.5, 3, -5]} geometry="torus" speed={0.6} color="#6ee7b7" />
        
        {/* Energy Particles */}
        <EnergyParticles />
      </>
    );
  }

  // Desktop: Positioned on sides, more spread out
  return (
    <>
      {/* Geometric Shapes - Positioned on left and right sides */}
      {/* Left side shapes */}
      <FloatingGeometry position={[-5, 2, -2]} geometry="icosahedron" speed={1} color="#10b981" />
      <FloatingGeometry position={[-5.5, -0.5, -3]} geometry="octahedron" speed={0.8} color="#059669" />
      <FloatingGeometry position={[-4.5, -2.5, -1]} geometry="torus" speed={0.6} color="#6ee7b7" />
      
      {/* Right side shapes */}
      <FloatingGeometry position={[5, 1, -2]} geometry="box" speed={0.7} color="#34d399" />
      <FloatingGeometry position={[5.5, -1.5, -3]} geometry="octahedron" speed={0.9} color="#10b981" />
      <FloatingGeometry position={[4.5, 3, -1]} geometry="icosahedron" speed={0.85} color="#059669" />
      
      {/* Connecting Lines */}
      <ConnectingLines />
      
      {/* Energy Particles */}
      <EnergyParticles />
    </>
  );
}

// Main Component - Modern Geometric 3D Design (Responsive)
export default function Hero3DModern() {
  const [isMobile, setIsMobile] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  console.log('[Hero3DModern] Component rendering, isMobile:', isMobile);

  React.useEffect(() => {
    console.log('[Hero3DModern] useEffect mounted');
    
    // Log container dimensions
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const styles = window.getComputedStyle(containerRef.current);
      console.log('[Hero3DModern] Container dimensions:', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        zIndex: styles.zIndex,
        position: styles.position,
        overflow: styles.overflow
      });
      
      // Check parent element
      const parent = containerRef.current.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const parentStyles = window.getComputedStyle(parent);
        console.log('[Hero3DModern] Parent dimensions:', {
          tagName: parent.tagName,
          className: parent.className,
          width: parentRect.width,
          height: parentRect.height,
          position: parentStyles.position,
          overflow: parentStyles.overflow
        });
      }
    } else {
      console.warn('[Hero3DModern] Container ref is null!');
    }
    
    // Check screen size
    const checkMobile = () => {
      console.log('[Hero3DModern] checkMobile called, window.innerWidth:', window.innerWidth);
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Initial check
    checkMobile();

    // Listen to resize
    window.addEventListener('resize', checkMobile);
    return () => {
      console.log('[Hero3DModern] useEffect cleanup');
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-green-50/60 via-emerald-50/40 to-white"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        key="hero-3d-canvas"
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl, scene, camera }) => {
          console.log('[Hero3DModern] Canvas created successfully');
          console.log('[Hero3DModern] WebGL Renderer:', {
            domElement: gl.domElement,
            canvasWidth: gl.domElement.width,
            canvasHeight: gl.domElement.height,
            clientWidth: gl.domElement.clientWidth,
            clientHeight: gl.domElement.clientHeight,
            pixelRatio: gl.getPixelRatio(),
          });
          console.log('[Hero3DModern] Scene children count:', scene.children.length);
          console.log('[Hero3DModern] Camera position:', camera.position);
          gl.setClearColor(0x000000, 0);
          
          // Log canvas computed styles
          const canvasStyles = window.getComputedStyle(gl.domElement);
          console.log('[Hero3DModern] Canvas styles:', {
            width: canvasStyles.width,
            height: canvasStyles.height,
            display: canvasStyles.display,
            visibility: canvasStyles.visibility,
            opacity: canvasStyles.opacity,
          });
        }}
        onError={(error) => {
          console.error('[Hero3DModern] Canvas error:', error);
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} color="#ffffff" />
        <pointLight position={[-5, 3, 0]} color="#10b981" intensity={1.5} />
        <pointLight position={[5, -3, 0]} color="#059669" intensity={1.5} />
        
        <ModernScene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
