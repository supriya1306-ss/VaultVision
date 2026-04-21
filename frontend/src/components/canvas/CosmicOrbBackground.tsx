"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, Stars, Center, PerspectiveCamera, Sparkles, MeshDistortMaterial, ContactShadows } from "@react-three/drei";
import * as THREE from 'three';

function MediaCard({ angle, radius, delay, imageUrl, title, status }: { angle: number, radius: number, delay: number, imageUrl: string, title: string, status: string }) {
  const ref = useRef<THREE.Group>(null);
  const dataBarRef1 = useRef<THREE.Mesh>(null);
  const dataBarRef2 = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() + delay;
    const x = Math.cos(angle + time * 0.1) * radius;
    const z = Math.sin(angle + time * 0.1) * radius;
    const y = Math.sin(time * 0.3) * 1.5;
    
    if (ref.current) {
      ref.current.position.set(x, y, z);
      ref.current.rotation.y = -(angle + time * 0.1) + Math.PI / 2;
      ref.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    if (dataBarRef1.current) {
      dataBarRef1.current.scale.x = 0.3 + Math.sin(time * 2) * 0.2;
    }
    if (dataBarRef2.current) {
      dataBarRef2.current.scale.x = 0.4 + Math.cos(time * 3) * 0.25;
    }
    if (pulseRef.current) {
      pulseRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.05);
      (pulseRef.current.material as any).opacity = 0.2 + Math.sin(time * 4) * 0.1;
    }
  });

  const texture = useMemo(() => new THREE.TextureLoader().load(imageUrl), [imageUrl]);

  return (
    <group ref={ref}>
      {/* Glow behind the card */}
      <mesh scale={[1.4, 1.0, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={status === 'ALERT' ? "#ff3366" : "#4D4DFF"} transparent opacity={0.15} />
      </mesh>
      
      {/* Main card body - Glassy */}
      <mesh>
        <planeGeometry args={[1.4, 0.9]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer Border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.42, 0.92]} />
        <meshBasicMaterial color={status === 'ALERT' ? "#ff3366" : "#4D4DFF"} transparent opacity={0.2} wireframe />
      </mesh>
      
      {/* UI Header Area */}
      <mesh position={[0, 0.38, 0.01]}>
        <planeGeometry args={[1.3, 0.08]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>

      {/* Header Text Placeholder (Dot) */}
      <mesh position={[-0.58, 0.38, 0.02]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color={status === 'ALERT' ? "#ff3366" : "#00ff88"} />
      </mesh>
      
      {/* Content Image Area */}
      <mesh position={[-0.3, -0.05, 0.01]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={texture} transparent opacity={0.8} />
      </mesh>

      {/* Scanning Overlay on Image */}
      <mesh position={[-0.3, -0.05, 0.02]} ref={pulseRef}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial color={status === 'ALERT' ? "#ff3366" : "#00E5FF"} transparent opacity={0.1} />
      </mesh>

      {/* Data Section (Right side of card) */}
      <group position={[0.4, -0.05, 0.01]}>
        {/* Title Bar */}
        <mesh position={[0, 0.25, 0]}>
          <planeGeometry args={[0.5, 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
        
        {/* Fake Data Bars */}
        <mesh position={[-0.1, 0.15, 0]} ref={dataBarRef1}>
          <planeGeometry args={[0.3, 0.03]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.05, 0.08, 0]} ref={dataBarRef2}>
          <planeGeometry args={[0.4, 0.03]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} />
        </mesh>

        {/* Status Badge */}
        <mesh position={[0, -0.15, 0]}>
          <planeGeometry args={[0.45, 0.12]} />
          <meshBasicMaterial color={status === 'ALERT' ? "#ff3366" : "#00ff88"} transparent opacity={0.2} />
        </mesh>
        <mesh position={[0, -0.15, 0.01]}>
          <planeGeometry args={[0.4, 0.08]} />
          <meshBasicMaterial color={status === 'ALERT' ? "#ff3366" : "#00ff88"} transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function CosmicOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.15;
      wireRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Core Glass Sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.8, 64, 64]} />
          <MeshTransmissionMaterial 
            backside
            backsideThickness={5}
            thickness={2}
            chromaticAberration={0.06}
            anisotropy={0.3}
            distortion={0.3}
            distortionScale={0.3}
            temporalDistortion={0.5}
            resolution={1024}
            color="#1a0033"
            envMapIntensity={2}
          />
        </mesh>

        {/* Digital Wireframe Overlay */}
        <mesh ref={wireRef}>
          <sphereGeometry args={[2.82, 32, 32]} />
          <meshBasicMaterial 
            color="#4D4DFF" 
            wireframe 
            transparent 
            opacity={0.3} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Additional Internal Glow */}
        <mesh>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshBasicMaterial 
            color="#8A2BE2" 
            transparent 
            opacity={0.2} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Intense Center Light */}
        <pointLight distance={12} intensity={250} color="#ffffff" />
        <pointLight distance={15} intensity={100} color="#ff33cc" position={[2, 2, 2]} />
        <pointLight distance={15} intensity={100} color="#00e5ff" position={[-2, -2, -2]} />
      </group>
    </Float>
  );
}

function ShootingStar({ delay, imageUrl }: { delay: number, imageUrl: string }) {
  const ref = useRef<THREE.Group>(null);
  
  // Randomize initial position AND direction for uniformity
  const { startPos, velocity } = useMemo(() => {
    return {
      startPos: [
        (Math.random() - 0.5) * 50, // wide X spawn
        (Math.random() - 0.5) * 40, // wide Y spawn
        (Math.random() - 0.5) * 20 - 15 // depth
      ],
      velocity: [
        (Math.random() - 0.5) * 100, // random X direction
        (Math.random() - 0.5) * 80,  // random Y direction
        (Math.random() - 0.5) * 10   // slight Z drift
      ]
    };
  }, []);

  useFrame((state) => {
    const time = (state.clock.getElapsedTime() + delay) % 3;
    const progress = time / 3;
    
    if (ref.current) {
      // Multi-directional movement
      ref.current.position.x = startPos[0] + (progress * velocity[0]);
      ref.current.position.y = startPos[1] + (progress * velocity[1]);
      ref.current.position.z = startPos[2] + (progress * velocity[2]);
      
      // Face the direction of travel
      ref.current.lookAt(
        ref.current.position.x + velocity[0],
        ref.current.position.y + velocity[1],
        ref.current.position.z + velocity[2]
      );
      
      const scale = progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1;
      ref.current.scale.setScalar(scale);
      
      const trail = ref.current.children[1] as THREE.Mesh;
      const newsCard = ref.current.children[2] as THREE.Mesh;

      if (trail && (trail.material as any)) {
        (trail.material as any).opacity = progress > 0.8 ? (1 - progress) * 5 : 0.6;
      }
      if (newsCard && (newsCard.material as any)) {
        (newsCard.material as any).opacity = progress < 0.2 ? (progress - 0.1) * 10 : progress > 0.7 ? (1 - progress) * 3 : 0.8;
      }
    }
  });

  return (
    <group ref={ref}>
      {/* High-intensity "Star" head */}
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight intensity={10} distance={3} color="#00E5FF" />
      </mesh>
      
      {/* Vibrant Trail - oriented automatically by lookAt */}
      <mesh position={[0, 0, -1.5]}>
        <cylinderGeometry args={[0.005, 0.04, 3, 8]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Sports News Image Card */}
      <mesh position={[0, 0.2, -0.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0} 
          side={THREE.DoubleSide}
          map={new THREE.TextureLoader().load(imageUrl)}
        />
        <mesh position={[0, 0, -0.01]} scale={[1.05, 1.05, 1]}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.2} />
        </mesh>
      </mesh>
    </group>
  );
}

function NewsShooters() {
  const sportsImages = useMemo(() => [
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80", // Football
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80", // Basketball
    "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=400&q=80", // F1
    "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&q=80", // Tennis
    "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&q=80", // Soccer
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80", // Stadium
    "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400&q=80", // Baseball
    "https://images.unsplash.com/photo-1461896646984-81ae67b86122?w=400&q=80", // Running
    "https://images.unsplash.com/photo-1519861155730-0b5fbd0dd899?w=400&q=80", // Basketball 2
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=400&q=80", // Tech/Stats
  ], []);

  const stars = useMemo(() => 
    Array.from({ length: 15 }).map((_, i) => ({
      delay: i * 0.8,
      imageUrl: sportsImages[i % sportsImages.length]
    })), [sportsImages]);

  return (
    <group>
      {stars.map((star, i) => (
        <ShootingStar key={i} {...star} />
      ))}
    </group>
  );
}

function GlowingRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 0.015, 16, 128]} />
        <meshBasicMaterial color="#ff33cc" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      
      <mesh rotation={[Math.PI / 2.2, Math.PI / 4, 0]}>
        <torusGeometry args={[5.5, 0.01, 16, 128]} />
        <meshBasicMaterial color="#4D4DFF" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      
      <mesh rotation={[Math.PI / 1.8, -Math.PI / 6, 0]}>
        <torusGeometry args={[6, 0.008, 16, 128]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Adding a distant ring */}
      <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]}>
        <torusGeometry args={[12, 0.005, 8, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export function CosmicOrbBackground() {
  const cardData = useMemo(() => [
    { title: "EPL Live Feed", status: "SAFE", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80" },
    { title: "NBA Stream #4", status: "ALERT", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80" },
    { title: "F1 Grand Prix", status: "SAFE", img: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=400&q=80" },
    { title: "UFC 299", status: "SAFE", img: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&q=80" },
    { title: "Champions League", status: "ALERT", img: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&q=80" },
    { title: "Tennis Open", status: "SAFE", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80" },
  ], []);

  const cards = useMemo(() => {
    return cardData.map((data, i) => ({
      angle: (i / cardData.length) * Math.PI * 2,
      radius: 8.5 + Math.random() * 1.5,
      delay: Math.random() * 10,
      imageUrl: data.img,
      title: data.title,
      status: data.status
    }));
  }, [cardData]);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-[#0a051d] overflow-hidden">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={45} />
        <ambientLight intensity={0.4} />
        
        <Stars radius={100} depth={50} count={7000} factor={5} saturation={0.8} fade speed={1} />
        <Sparkles count={150} scale={25} size={2.5} speed={0.5} opacity={0.3} color="#ffffff" />
        
        <group>
          <CosmicOrb />
          <GlowingRings />
          <NewsShooters />
          {cards.map((card, i) => (
            <MediaCard key={i} {...card} />
          ))}
        </group>
        
        <Environment preset="night" />
        
        {/* Post-processing like glow can be added here if needed, but standard material properties are effective too */}
      </Canvas>
      
      {/* Background radial gradients for depth and atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(77,77,255,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,51,204,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a051d]/50 to-[#0a051d] pointer-events-none" />
    </div>
  );
}
