import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";

interface SlideGeniusPromoProps {
  headline?: string;
  subheadline?: string;
  tagline?: string;
  features?: string[];
  cta?: string;
}

export const SlideGeniusPromo: React.FC<SlideGeniusPromoProps> = ({
  headline = "SlideGenius",
  subheadline = "15 Presentation Styles, Zero Design Work",
  tagline = "Turn any content into stunning slides",
  features = ["Anti-Gravity Minimal", "Modern Newspaper", "Tech-Art Neon"],
  cta = "Generate Your Deck",
}) => {
  const frame = useCurrentFrame();
  
  // Anti-gravity aesthetic: calm, minimal, inevitable
  const bgGradient = "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)";
  
  // Headline fade in with subtle float
  const headlineOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: "clamp" });
  
  // Subheadline delayed entrance
  const subOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [30, 60], [20, 0], { extrapolateRight: "clamp" });
  
  // Tagline entrance
  const tagOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
  
  // Feature cards stagger
  const featuresOpacity = features.map((_, i) => 
    interpolate(frame, [90 + i * 15, 105 + i * 15], [0, 1], { extrapolateRight: "clamp" })
  );
  const featuresY = features.map((_, i) => 
    interpolate(frame, [90 + i * 15, 105 + i * 15], [20, 0], { extrapolateRight: "clamp" })
  );
  
  // CTA entrance
  const ctaOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" });
  const ctaScale = spring({
    frame: frame - 150,
    fps: 30,
    config: { damping: 12, stiffness: 200 }
  });
  
  // Subtle gradient orbs (anti-gravity feel)
  const orb1Opacity = interpolate(frame, [0, 60], [0, 0.15], { extrapolateRight: "clamp" });
  const orb2Opacity = interpolate(frame, [30, 90], [0, 0.1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: bgGradient, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Anti-gravity gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          opacity: orb1Opacity,
          filter: "blur(60px)"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          opacity: orb2Opacity,
          filter: "blur(80px)"
        }}
      />
      
      {/* Main content */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "80px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Logo/Badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 40,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`
        }}>
          <div style={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)"
          }}>
            <span style={{ fontSize: 24, color: "white" }}>✦</span>
          </div>
          <span style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#64748B",
            letterSpacing: "0.05em"
          }}>KINGDOM CLAW</span>
        </div>
        
        {/* Headline */}
        <h1 style={{
          fontSize: 120,
          fontWeight: 700,
          color: "#0F172A",
          margin: 0,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          letterSpacing: "-0.03em",
          textAlign: "center"
        }}>
          {headline}
        </h1>
        
        {/* Subheadline */}
        <p style={{
          fontSize: 32,
          fontWeight: 400,
          color: "#475569",
          margin: "20px 0 0 0",
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          textAlign: "center"
        }}>
          {subheadline}
        </p>
        
        {/* Tagline */}
        <p style={{
          fontSize: 20,
          fontWeight: 500,
          color: "#6366F1",
          margin: "40px 0 0 0",
          opacity: tagOpacity,
          letterSpacing: "0.02em"
        }}>
          {tagline}
        </p>
        
        {/* Feature cards */}
        <div style={{
          display: "flex",
          gap: 24,
          marginTop: 60
        }}>
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: 16,
                padding: "24px 32px",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
                opacity: featuresOpacity[i],
                transform: `translateY(${featuresY[i]}px)`,
              }}
            >
              <span style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#1E293B"
              }}>{feature}</span>
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
          <div style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            color: "white",
            padding: "20px 48px",
            borderRadius: 12,
            fontSize: 20,
            fontWeight: 600,
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.3)",
            letterSpacing: "0.01em"
          }}>
            {cta}
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            width: interpolate(frame, [180, 240], [0, 200], { extrapolateRight: "clamp" }),
            height: 3,
            background: "linear-gradient(90deg, transparent, #6366F1, transparent)",
            borderRadius: 2,
            opacity: interpolate(frame, [180, 210], [0, 0.5], { extrapolateRight: "clamp" })
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
