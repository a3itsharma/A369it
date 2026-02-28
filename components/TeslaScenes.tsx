import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, Sphere, Torus } from '@react-three/drei';
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
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group ref={ref}>
        {/* Trident Base */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 3, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
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
        {/* Glow */}
        <Sphere args={[0.1, 16, 16]} position={[0, 1.9, 0]}>
          <meshBasicMaterial color="#6BB9C4" />
        </Sphere>
      </group>
    </Float>
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
          
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};
