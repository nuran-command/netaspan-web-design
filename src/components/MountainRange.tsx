"use client";
import React from "react";

/**
 * MountainRange trigger component.
 * The actual visual layers have been moved to the Global Atmosphere system
 * to prevent sectional boundary clipping.
 */
export default function MountainRange() {
  return (
    <div className="absolute inset-0 w-full pointer-events-none -z-10 bg-transparent" />
  );
}
