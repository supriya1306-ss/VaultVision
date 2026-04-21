"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, Stars, Center } from "@react-three/drei";
import * as THREE from 'three';

function GlowingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 4]} />
        <MeshTransmissionMaterial 
          backside
          backsideThickness={1}
          thickness={0.5}
          chromaticAberration={2}
          anisotropy={1}
          distortion={1}
          distortionScale={0.5}
          temporalDistortion={0.1}
          resolution={1024}
          color="#ffcce6"
        />
      </mesh>
      {/* Internal warm glow */}
      <pointLight distance={10} intensity={20} color="#ff33cc" position={[0, 0, 0]} />
    </Float>
  );
}

function SmallFloatingGeometries() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.05;
      group.current.children.forEach((child, i) => {
        child.rotation.x += delta * (i % 2 === 0 ? 0.2 : -0.2);
        child.rotation.y += delta * 0.1;
      });
    }
  });

  const positionSpread = 15;
  const count = 12;

  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * positionSpread,
            (Math.random() - 0.5) * positionSpread,
            (Math.random() - 0.5) * positionSpread - 5
          ]}
        >
          {i % 3 === 0 ? <boxGeometry args={[0.5, 0.5, 0.5]} /> : i % 3 === 1 ? <octahedronGeometry args={[0.4]} /> : <torusGeometry args={[0.3, 0.1, 16, 32]} />}
          <MeshTransmissionMaterial 
            thickness={0.2}
            roughness={0}
            transmission={1}
            ior={1.5}
            chromaticAberration={1}
            color={i % 2 === 0 ? "#e0e7ff" : "#fce7f3"}
          />
        </mesh>
      ))}
    </group>
  );
}

export function BrightOrbBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#4D4DFF" />
        
        <Center>
          <GlowingOrb />
        </Center>
        <SmallFloatingGeometries />
        
        {/* Adds a nice preset environment reflection for the glass to look realistic */}
        <Environment preset="city" />
      </Canvas>
      {/* Background radial gradient overlay to blend 3D canvas smoothly into the clean UI */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.8)_80%)]"></div>
    </div>
  );
}
