"use client";

import { PlayCircle } from "lucide-react";
import { VideoSectionProps } from "./types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function VideoSection({ imageUrl, videoUrl }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsPlaying(true);
        }
      },
      { threshold: 0.5 },
    );

    const current = containerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div ref={containerRef} className="lg:max-w-3xl mt-20 mx-auto w-full px-4">
      <div className="relative rounded-3xl overflow-hidden aspect-video group shadow-lg">
        {!isPlaying ? (
          <>
            <Image
              src={imageUrl}
              alt="Video thumbnail"
              className="object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/50 cursor-pointer">
              <PlayCircle className="w-16 h-16 text-white opacity-90 transition-transform group-hover:scale-110" />
            </div>
          </>
        ) : (
          <iframe
            className="w-full h-full"
            src={videoUrl + "?autoplay=1&mute=1"}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
}
