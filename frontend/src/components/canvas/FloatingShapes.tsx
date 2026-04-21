"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        
        {/* Main large distortion blob */}
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2} position={[-4, 1, -2]}>
          <mesh>
            <sphereGeometry args={[2, 64, 64]} />
            <MeshDistortMaterial 
              color="#ff33cc" 
              attach="material" 
              distort={0.4} 
              speed={2} 
              roughness={0.1}
              metalness={0.2}
              transmission={0.8}
              ior={1.5}
            />
          </mesh>
        </Float>

        {/* Floating secondary accent blob */}
        <Float speed={3} rotationIntensity={2} floatIntensity={1.5} position={[5, -2, -6]}>
          <mesh>
            <sphereGeometry args={[3, 64, 64]} />
            <MeshDistortMaterial 
              color="#00E5FF" 
              attach="material" 
              distort={0.6} 
              speed={1.5}
              roughness={0.1}
              transmission={0.9}
            />
          </mesh>
        </Float>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
