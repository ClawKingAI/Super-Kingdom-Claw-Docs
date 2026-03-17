import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface ProphecyCallProps {
  headline?: string;
  subheadline?: string;
  date?: string;
  time?: string;
}

export const ProphecyCall: React.FC<ProphecyCallProps> = ({
  headline = "Understanding the Times",
  subheadline = "A Call to Discernment",
  date = "Thursday",
  time = "6:30 PM EST",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" });
  
  const timeOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
  const timeScale = spring({ frame: frame - 60, fps, config: { damping: 50, stiffness: 100 } });

  const ctaOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" });

  // Pulsing glow
  const glowIntensity = Math.sin(frame * 0.08) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0c1445 0%, #1a0a2e 50%, #2d1b4e 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Subtle light effect */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(99,102,241,${glowIntensity * 0.15}) 0%, transparent 60%)`,
        }}
      />

      {/* Headline */}
      <div
        style={{
          fontSize: 90,
          fontWeight: "bold",
          color: "#f8fafc",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textShadow: "0 0 60px rgba(99,102,241,0.5)",
          marginBottom: 30,
        }}
      >
        {headline}
      </div>

      {/* Subheadline */}
      <div
        style={{
          fontSize: 48,
          color: "#c7d2fe",
          opacity: subtitleOpacity,
          marginBottom: 60,
        }}
      >
        {subheadline}
      </div>

      {/* Date/Time */}
      <div
        style={{
          opacity: timeOpacity,
          transform: `scale(${timeScale})`,
          marginBottom: 80,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: "600",
            color: "#818cf8",
            marginBottom: 12,
          }}
        >
          {date}
        </div>
        <div
          style={{
            fontSize: 42,
            color: "#e0e7ff",
          }}
        >
          {time}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          padding: "24px 64px",
          borderRadius: 100,
          boxShadow: "0 20px 40px rgba(79,70,229,0.4)",
        }}
      >
        <div style={{ fontSize: 32, fontWeight: "600", color: "#fff" }}>
          Join the Call
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 24,
          color: "#94a3b8",
          opacity: interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        zoom.kingdomlife.site/call
      </div>
    </AbsoluteFill>
  );
};
