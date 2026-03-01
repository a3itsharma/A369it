import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, Sphere, Torus, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const MarsPlanetContent = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const arcsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (arcsRef.current) {
      arcsRef.current.rotation.z += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#D47B60" 
          roughness={0.9} 
          metalness={0.1} 
          emissive="#7D3C2E"
          emissiveIntensity={0.1}
        />
      </Sphere>
      <group ref={arcsRef}>
        {[...Array(5)].map((_, i) => (
          <Torus key={i} args={[2.5 + i * 0.2, 0.01, 16, 100]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <meshBasicMaterial color="#6BB9C4" transparent opacity={0.2} wireframe />
          </Torus>
        ))}
      </group>
    </Float>
  );
};

export const MarsHeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#D47B60" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6BB9C4" />
          
          <MarsPlanetContent />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

const TridentContent = () => {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const arcsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.02; // Faster rotation
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.2 + Math.random() * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
    }
    if (arcsRef.current) {
      arcsRef.current.rotation.z = state.clock.elapsedTime * 5;
      arcsRef.current.rotation.x = state.clock.elapsedTime * 3;
      arcsRef.current.children.forEach((child, i) => {
        child.scale.x = 1 + Math.random() * 0.5;
        child.scale.y = 1 + Math.random() * 0.5;
        const material = (child as THREE.Mesh).material as THREE.Material;
        material.opacity = 0.5 + Math.random() * 0.5;
      });
    }
  });

  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={2}>
      <group ref={ref}>
        {/* Trident Base */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 3, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} emissive="#000000" />
        </mesh>
        {/* Trident Prongs */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[-0.4, 1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0.4, 1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
        </mesh>
        
        {/* Electric Arcs */}
        <group ref={arcsRef} position={[0, 1.5, 0]}>
          {[...Array(6)].map((_, i) => (
            <Torus key={i} args={[0.3 + Math.random() * 0.2, 0.01, 8, 32]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
              <meshBasicMaterial color="#00D2FF" transparent opacity={0.8} />
            </Torus>
          ))}
        </group>

        {/* Glow */}
        <Sphere ref={glowRef} args={[0.15, 32, 32]} position={[0, 1.9, 0]}>
          <meshBasicMaterial color="#00D2FF" transparent opacity={0.9} />
        </Sphere>
        <pointLight position={[0, 1.9, 0]} intensity={5} color="#00D2FF" distance={5} />
      </group>
    </Float>
  );
};

const TridentParticles = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // React to pointer movements
      const targetX = state.pointer.x * 1.5;
      const targetY = state.pointer.y * 1.5;
      
      // Smoothly interpolate current position towards target pointer position
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
      
      // Add a slow rotation for ambient effect
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <Sparkles 
        count={150} 
        scale={5} 
        size={2} 
        speed={0.4} 
        opacity={0.6} 
        color="#00D2FF" 
        noise={0.2}
      />
      <Sparkles 
        count={50} 
        scale={7} 
        size={4} 
        speed={0.2} 
        opacity={0.4} 
        color="#6BB9C4" 
        noise={0.5}
      />
    </group>
  );
};

export const TeslaTridentScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} color="#6BB9C4" />
          
          <TridentContent />
          <TridentParticles />
          
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};
