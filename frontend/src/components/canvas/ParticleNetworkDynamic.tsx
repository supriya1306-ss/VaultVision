"use client";
import dynamic from "next/dynamic";

export const ParticleNetwork = dynamic(() => import("./ParticleNetwork"), { ssr: false });
