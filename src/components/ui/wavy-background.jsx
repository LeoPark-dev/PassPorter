"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  audioData = null,
  ...props
}) => {
  const noise = createNoise3D();
  let w,
    h,
    nt,
    i,
    x,
    ctx,
    canvas;
  const canvasRef = useRef(null);
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];
  const drawWave = (n) => {
    nt += getSpeed();
    const hasAudioData = audioData && audioData.length > 0;
    
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      
      if (hasAudioData) {
        // 오디오 데이터를 사용하여 파형 생성
        for (x = 0; x < w; x += 5) {
          const audioIndex = Math.floor((x / w) * audioData.length);
          const audioValue = audioData[Math.min(audioIndex, audioData.length - 1)] || 0;
          const audioNormalized = (audioValue / 255) * 200; // 0-200 범위로 정규화
          
          // 노이즈와 오디오 데이터를 결합
          const noiseValue = noise(x / 800, 0.3 * i, nt) * 100;
          const audioWave = audioNormalized * (1 + i * 0.3); // 각 파도마다 다른 강도
          var y = noiseValue + audioWave - 100; // 중앙 정렬
          ctx.lineTo(x, y + h * 0.5);
        }
      } else {
        // 기본 노이즈 기반 파형
        for (x = 0; x < w; x += 5) {
          var y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5);
        }
      }
      
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId;
  const render = () => {
    // 이전 프레임 완전히 지우기
    ctx.clearRect(0, 0, w, h);
    
    // 배경 채우기
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    
    // 파도 그리기 (4개만)
    ctx.globalAlpha = 1;
    drawWave(4);
    
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(typeof window !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome"));
  }, []);

  return (
    <div
      className={cn("h-full w-full flex flex-col items-center justify-center", containerClassName)}>
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
