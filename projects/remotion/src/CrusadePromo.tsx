import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface CrusadePromoProps {
  eventName?: string;
  soulsGoal?: number;
  currentSouls?: number;
}

export const CrusadePromo: React.FC<CrusadePromoProps> = ({
  eventName = "Gospel Crusade",
  soulsGoal = 100000,
  currentSouls = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animations
  const logoOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });

  // Scripture animation - typewriter effect
  const scriptureText = "\"All authority in heaven and on earth has been given to me. Therefore go and make disciples of all nations...\" — Matthew 28:18-20";
  const scriptureChars = Math.min(Math.floor((frame - 60) * 2), scriptureText.length);
  const displayedScripture = frame >= 60 ? scriptureText.substring(0, scriptureChars) : "";

  // Soul counter animation
  const soulStartFrame = 180;
  const soulProgress = Math.min((frame - soulStartFrame) / 60, 1);
  const displayedSouls = frame >= soulStartFrame ? Math.floor(soulProgress * soulsGoal) : 0;

  // Globe rotation (simulated with opacity shifts on location markers)
  const globeOpacity = interpolate(frame, [240, 280], [0, 1], { extrapolateRight: "clamp" });

  // Final CTA
  const ctaOpacity = interpolate(frame, [360, 400], [0, 1], { extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 360, fps, config: { damping: 50, stiffness: 100 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0c1445 0%, #1a0a2e 50%, #2d1b4e 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Animated light rays */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,215,0,0.1) 0%, transparent 50%)",
          opacity: Math.sin(frame * 0.05) * 0.3 + 0.7,
        }}
      />

      {/* Stars/particles background */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#fff",
            left: `${(i * 37) % 100}%`,
            top: `${(i * 23) % 100}%`,
            opacity: Math.sin(frame * 0.1 + i) * 0.5 + 0.5,
          }}
        />
      ))}

      {/* Ministry Logo/Name */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 10 }}>✝️</div>
        <div style={{ fontSize: 32, fontWeight: "bold", color: "#ffd700" }}>
          Francis Myles International
        </div>
      </div>

      {/* Main Title */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 0 40px rgba(255,215,0,0.5)",
            marginBottom: 20,
          }}
        >
          Taking the Saving and Healing Power
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#ffd700",
            textShadow: "0 0 40px rgba(255,215,0,0.8)",
          }}
        >
          of Jesus to the Nations
        </div>
      </div>

      {/* Scripture */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 100,
          right: 100,
          textAlign: "center",
          opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#e2e8f0",
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          {displayedScripture}
          {frame >= 60 && scriptureChars < scriptureText.length && (
            <span style={{ borderLeft: "2px solid #ffd700", marginLeft: 2 }} />
          )}
        </div>
      </div>

      {/* Soul Counter */}
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [soulStartFrame, soulStartFrame + 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontSize: 120, fontWeight: "bold", color: "#ffd700" }}>
          {displayedSouls.toLocaleString()}
        </div>
        <div style={{ fontSize: 32, color: "#e2e8f0", marginTop: 10 }}>
          SOULS GOAL
        </div>
      </div>

      {/* Globe/Locations visualization */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 40,
          opacity: globeOpacity,
        }}
      >
        {["🌍 Africa", "🌎 Americas", "🌏 Asia", "🌍 Europe"].map((continent, i) => (
          <div
            key={i}
            style={{
              fontSize: 36,
              opacity: Math.sin(frame * 0.05 + i) * 0.3 + 0.7,
            }}
          >
            {continent}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
        }}
      >
        <div style={{ fontSize: 48, fontWeight: "bold", color: "#fff", marginBottom: 20 }}>
          Join the Next Crusade
        </div>
        <div style={{ fontSize: 28, color: "#ffd700" }}>
          francismyles.com
        </div>
      </div>

      {/* Golden glow effect at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 300,
          background: "linear-gradient(to top, rgba(255,215,0,0.2) 0%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
