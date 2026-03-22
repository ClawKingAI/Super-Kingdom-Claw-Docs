import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";

interface AriseDemoProps {
  headline?: string;
  subheadline?: string;
}

export const AriseDemo: React.FC<AriseDemoProps> = ({
  headline = "Arise Case Manager",
  subheadline = "Complete Case Management for Counseling Services",
}) => {
  const frame = useCurrentFrame();

  // Animations
  const logoOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = spring({ frame, fps: 30, config: { damping: 15, stiffness: 100 } });

  const headlineOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [30, 60], [50, 0], { extrapolateRight: "clamp" });

  const subheadlineOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });

  // Feature cards - staggered entrance
  const features = [
    { icon: "📋", title: "Client Intake", desc: "Complete demographics & court info" },
    { icon: "📅", title: "Attendance", desc: "Track sessions & compliance" },
    { icon: "💰", title: "Payments", desc: "Receipts & balance tracking" },
    { icon: "📄", title: "Documents", desc: "Upload & organize files" },
    { icon: "✉️", title: "Letters", desc: "Auto-generate completions" },
    { icon: "🔒", title: "PO Portal", desc: "Secure officer access" },
  ];

  const cardStartFrame = 90;
  const cardsPerRow = 3;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 100,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)",
          }}
        >
          🏠
        </div>
      </div>

      {/* Header text */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 100,
          right: 100,
        }}
      >
        <h1
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: "#f8fafc",
            margin: 0,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          {headline}
        </h1>
        <p
          style={{
            fontSize: 36,
            color: "#94a3b8",
            marginTop: 20,
            opacity: subheadlineOpacity,
          }}
        >
          {subheadline}
        </p>
      </div>

      {/* Feature cards */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 100,
          right: 100,
          display: "flex",
          flexWrap: "wrap",
          gap: 30,
          justifyContent: "center",
        }}
      >
        {features.map((feature, i) => {
          const cardFrame = cardStartFrame + (i * 15);
          const cardOpacity = interpolate(frame, [cardFrame, cardFrame + 20], [0, 1], { extrapolateRight: "clamp" });
          const cardY = interpolate(frame, [cardFrame, cardFrame + 20], [30, 0], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                width: 340,
                padding: "30px",
                background: "rgba(30, 58, 95, 0.6)",
                borderRadius: 16,
                border: "1px solid rgba(59, 130, 246, 0.2)",
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 15 }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  margin: "0 0 10px 0",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 18,
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                {feature.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom branding */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          opacity: interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <p
          style={{
            fontSize: 18,
            color: "#64748b",
            margin: 0,
          }}
        >
          FVIP • DUI • Substance Abuse • Anger Management • IOP • Counseling
        </p>
      </div>
    </AbsoluteFill>
  );
};
