import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface LaunchPadPromoProps {
  headline?: string;
  tagline?: string;
  features?: string[];
  cta?: string;
  url?: string;
}

export const LaunchPadPromo: React.FC<LaunchPadPromoProps> = ({
  headline = "LaunchPad",
  tagline = "AI-Powered Landing Pages Built to Convert",
  features = ["48-Hour Delivery", "No AI Token Costs", "Stunning Design"],
  cta = "Start Your Project",
  url = "open-eagle-d86j.here.now"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient animation
  const bgShift = interpolate(frame, [0, 300], [0, 50]);

  // Headline animation
  const headlineScale = spring({ frame, fps, config: { damping: 15 }, from: 0.5, to: 1 });
  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Tagline animation
  const taglineY = interpolate(frame, [20, 50], [50, 0], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });

  // Features animation (staggered)
  const feature1Opacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
  const feature2Opacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });
  const feature3Opacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" });

  // CTA animation
  const ctaOpacity = interpolate(frame, [140, 170], [0, 1], { extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 140, fps, config: { damping: 12 }, from: 0.8, to: 1 });

  // URL animation
  const urlOpacity = interpolate(frame, [180, 200], [0, 1], { extrapolateRight: "clamp" });

  // Typewriter effect for tagline
  const charsToShow = Math.min(Math.floor(interpolate(frame, [30, 90], [0, tagline.length])), tagline.length);
  const displayedTagline = tagline.slice(0, charsToShow);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f0f1a ${bgShift}%, #1a1a2e ${100 - bgShift}%)`,
        fontFamily: "'Inter', sans-serif",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Content container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 1600,
        }}
      >
        {/* Rocket icon */}
        <div
          style={{
            fontSize: 100,
            marginBottom: 30,
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
          }}
        >
          🚀
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 140,
            fontWeight: 900,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
            letterSpacing: -4,
          }}
        >
          {headline}
        </h1>

        {/* Tagline with typewriter */}
        <p
          style={{
            fontSize: 48,
            color: "#9ca3af",
            marginTop: 30,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
          }}
        >
          {displayedTagline}
          <span
            style={{
              borderRight: "3px solid #8b5cf6",
              marginLeft: 2,
              animation: "blink 1s infinite",
            }}
          />
        </p>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 80,
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: [feature1Opacity, feature2Opacity, feature3Opacity][i],
                transform: `translateY(${interpolate(frame, [60 + i * 20, 80 + i * 20], [20, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                ✓
              </div>
              <span
                style={{
                  fontSize: 32,
                  color: "#e5e7eb",
                  fontWeight: 500,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 80,
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
          }}
        >
          <div
            style={{
              padding: "28px 64px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 20,
              fontSize: 36,
              fontWeight: 700,
              color: "#fff",
              boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
            }}
          >
            {cta} →
          </div>
        </div>

        {/* URL */}
        <p
          style={{
            fontSize: 28,
            color: "#6b7280",
            marginTop: 40,
            opacity: urlOpacity,
          }}
        >
          {url}
        </p>
      </div>
    </AbsoluteFill>
  );
};
