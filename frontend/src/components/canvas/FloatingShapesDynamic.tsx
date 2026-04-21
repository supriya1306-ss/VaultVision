"use client";
import dynamic from "next/dynamic";

export const FloatingShapes = dynamic(() => import("./FloatingShapes"), { ssr: false });
