"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type CardImageProps = {
  small: string;
  large: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function CardImage({
  small,
  large,
  alt,
  width = 64,
  height = 88,
  className = "",
}: CardImageProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <Image
        src={small}
        alt={alt}
        width={width}
        height={height}
        className={`cursor-zoom-in transition-transform hover:scale-105 ${className}`}
        onClick={() => setShowOverlay(true)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowOverlay(true);
        }}
        role="button"
        aria-label="Show large card image"
      />
      <Dialog open={showOverlay} onOpenChange={setShowOverlay}>
        <DialogContent className="flex items-center justify-center bg-black/80 p-0 max-w-3xl">
          <Image
            src={large}
            alt={alt}
            width={828}
            height={1140}
            className="max-h-screen max-w-screen object-contain rounded shadow-lg"
            draggable={false}
            priority
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
