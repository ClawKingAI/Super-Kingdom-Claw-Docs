import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// Rain effect overlay
const RainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.15, pointerEvents: "none" }}>
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 17) % 100}%`,
            top: `${((frame * 3 + i * 50) % 120) - 20}%`,
            width: 1,
            height: 30 + (i % 20),
            background: "linear-gradient(to bottom, transparent, rgba(150,180,255,0.6), transparent)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Scene 1: Opening Hook - Rainy city
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const flash = Math.sin(frame * 0.5) > 0.8 ? 1 : 0;
  
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <RainOverlay />
      {/* City silhouette */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, #1a1a2e 0%, #0a0a0a 100%)" }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${i * 8 + 2}%`,
              width: `${3 + (i % 4)}%`,
              height: `${30 + (i * 5) % 40}%`,
              background: "#0f0f1a",
            }}
          />
        ))}
      </div>
      {/* Police lights */}
      <div style={{ position: "absolute", top: "30%", left: "20%", width: 60, height: 60, background: flash ? "#ef4444" : "#3b82f6", borderRadius: "50%", filter: "blur(30px)", opacity: 0.8 }} />
      <div style={{ position: "absolute", top: "35%", right: "25%", width: 50, height: 50, background: flash ? "#3b82f6" : "#ef4444", borderRadius: "50%", filter: "blur(25px)", opacity: 0.6 }} />
      {/* Text */}
      <div style={{ position: "absolute", top: "40%", left: 0, right: 0, textAlign: "center", opacity }}>
        <span style={{ fontSize: 120, fontWeight: "bold", color: "#fff", textShadow: "0 0 40px rgba(255,255,255,0.3)" }}>ONE CITY</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Too Many Secrets
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const flicker = Math.sin(frame * 0.8) > 0 ? 1 : 0.7;
  
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <RainOverlay />
      {/* Dark hallway with detective silhouette */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #050505 70%)" }} />
      {/* Detective silhouette */}
      <div style={{ position: "absolute", bottom: "20%", left: "50%", transform: "translateX(-50%)", width: 120, height: 300, background: "#000", opacity: 0.9 }} />
      {/* Flashlight beam */}
      <div style={{ position: "absolute", top: "30%", left: "45%", width: 200, height: 400, background: "linear-gradient(to bottom, rgba(255,255,200,0.1), transparent)", transform: "rotate(15deg)", opacity: flicker }} />
      {/* Text */}
      <div style={{ position: "absolute", top: "35%", left: 0, right: 0, textAlign: "center", opacity }}>
        <span style={{ fontSize: 90, fontWeight: "bold", color: "#fff", letterSpacing: 8 }}>TOO MANY SECRETS</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Evidence Board
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{ background: "#1a1612" }}>
      {/* Cork board background */}
      <div style={{ position: "absolute", top: "5%", left: "10%", right: "10%", bottom: "15%", background: "#2a2420", border: "8px solid #3a3020" }}>
        {/* Photos */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${10 + (i % 3) * 30}%`,
              left: `${5 + (i % 2) * 45}%`,
              width: 200,
              height: 140,
              background: i % 2 === 0 ? "#222" : "#1a1a1a",
              border: "3px solid #fff",
              transform: `rotate(${(i - 3) * 5}deg)`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          />
        ))}
        {/* Red string connections */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <line x1="25%" y1="20%" x2="70%" y2="50%" stroke="#ef4444" strokeWidth="2" />
          <line x1="70%" y1="20%" x2="30%" y2="60%" stroke="#ef4444" strokeWidth="2" />
          <line x1="50%" y1="80%" x2="50%" y2="30%" stroke="#ef4444" strokeWidth="2" />
        </svg>
      </div>
      {/* Text overlay */}
      <div style={{ position: "absolute", top: "45%", left: 0, right: 0, textAlign: "center", opacity }}>
        <span style={{ fontSize: 80, fontWeight: "bold", color: "#fff", textShadow: "0 0 20px rgba(0,0,0,0.8)" }}>EVERY CLUE</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Phone Call
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const glow = Math.sin(frame * 0.3) * 0.3 + 0.7;
  
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Phone screen */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, height: 700, background: "#111", borderRadius: 40, border: "4px solid #333", overflow: "hidden" }}>
        {/* Phone content */}
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 24, color: "#666", marginBottom: 20 }}>INCOMING CALL</div>
          <div style={{ fontSize: 36, color: "#fff", fontWeight: "bold" }}>UNKNOWN</div>
          <div style={{ marginTop: 80, width: 100, height: 100, background: "#22c55e", borderRadius: "50%", margin: "80px auto", boxShadow: `0 0 40px rgba(34,197,94,${glow})` }} />
        </div>
      </div>
      {/* Text */}
      <div style={{ position: "absolute", bottom: "15%", left: 0, right: 0, textAlign: "center", opacity }}>
        <span style={{ fontSize: 70, fontWeight: "bold", color: "#fff" }}>LEADS DEEPER</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Surveillance
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const scanline = (frame * 2) % 100;
  
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* Surveillance camera effect */}
      <div style={{ position: "absolute", top: "10%", left: "10%", right: "10%", bottom: "10%", border: "4px solid #333", background: "#111" }}>
        {/* Timestamp */}
        <div style={{ position: "absolute", top: 20, left: 20, fontSize: 28, color: "#22c55e", fontFamily: "monospace" }}>REC 2024-03-15 23:47:02</div>
        {/* Suspect silhouette */}
        <div style={{ position: "absolute", bottom: "20%", left: "50%", transform: "translateX(-50%)", width: 150, height: 250, background: "#222" }} />
        {/* Scanline effect */}
        <div style={{ position: "absolute", top: `${scanline}%`, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.1)" }} />
      </div>
      {/* Corner brackets */}
      <div style={{ position: "absolute", top: "8%", left: "8%", width: 60, height: 60, borderLeft: "4px solid #22c55e", borderTop: "4px solid #22c55e" }} />
      <div style={{ position: "absolute", top: "8%", right: "8%", width: 60, height: 60, borderRight: "4px solid #22c55e", borderTop: "4px solid #22c55e" }} />
      {/* Text */}
      <div style={{ position: "absolute", bottom: "25%", left: 0, right: 0, textAlign: "center", opacity }}>
        <span style={{ fontSize: 80, fontWeight: "bold", color: "#22c55e" }}>THE PATTERN</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Realization
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame * 0.2) * 0.2 + 0.8;
  
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <RainOverlay />
      {/* Split screen effect */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "linear-gradient(to right, #1a1a2e, #0a0a0a)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 200, color: "#fff", opacity: 0.1 }}>?</div>
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "linear-gradient(to left, #1a1a2e, #0a0a0a)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 200, color: "#fff", opacity: 0.1 }}>!</div>
      </div>
      {/* Center line */}
      <div style={{ position: "absolute", top: 0, left: "50%", width: 2, height: "100%", background: "#fff", opacity: 0.5 }} />
      {/* Text */}
      <div style={{ position: "absolute", top: "40%", left: 0, right: 0, textAlign: "center", opacity }}>
        <span style={{ fontSize: 100, fontWeight: "bold", color: "#fff", textShadow: `0 0 60px rgba(255,255,255,${pulse})` }}>IS REAL</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Interrogation
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const flicker = frame % 30 < 2 ? 0.5 : 1;
  
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* Table lamp glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(255,200,100,0.3) 0%, transparent 70%)" }} />
      {/* Table silhouette */}
      <div style={{ position: "absolute", bottom: "20%", left: "30%", right: "30%", height: 10, background: "#1a1a1a" }} />
      {/* Two figures */}
      <div style={{ position: "absolute", bottom: "25%", left: "25%", width: 100, height: 200, background: "#000", opacity: 0.9 }} />
      <div style={{ position: "absolute", bottom: "25%", right: "25%", width: 100, height: 200, background: "#111", opacity: 0.9 }} />
      {/* Text */}
      <div style={{ position: "absolute", top: "35%", left: 0, right: 0, textAlign: "center", opacity: opacity * flicker }}>
        <span style={{ fontSize: 90, fontWeight: "bold", color: "#fff" }}>WHO IS NEXT?</span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 8: Title Card
const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({ frame, fps: 30, config: { damping: 100, stiffness: 200 } });
  
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%" }}>
      <RainOverlay />
      {/* City silhouette bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
      {/* Title */}
      <div style={{ position: "absolute", top: "35%", left: 0, right: 0, textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <div style={{ fontSize: 140, fontWeight: "bold", color: "#fff", letterSpacing: 4, textShadow: "0 0 60px rgba(255,255,255,0.3)" }}>
          CITY OF CLUES
        </div>
        <div style={{ fontSize: 40, color: "#888", marginTop: 30, letterSpacing: 6 }}>
          EVERY CRIME TELLS A STORY
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const CrimeDrama: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Scene 1: 0-3s */}
      {frame < 90 && <Scene1 />}
      {/* Scene 2: 3-6s */}
      {frame >= 90 && frame < 180 && <Scene2 />}
      {/* Scene 3: 6-9s */}
      {frame >= 180 && frame < 270 && <Scene3 />}
      {/* Scene 4: 9-12s */}
      {frame >= 270 && frame < 360 && <Scene4 />}
      {/* Scene 5: 12-15s */}
      {frame >= 360 && frame < 450 && <Scene5 />}
      {/* Scene 6: 15-19s */}
      {frame >= 450 && frame < 570 && <Scene6 />}
      {/* Scene 7: 19-23s */}
      {frame >= 570 && frame < 690 && <Scene7 />}
      {/* Scene 8: 23-30s */}
      {frame >= 690 && <Scene8 />}
      
      {/* Film grain overlay */}
      <AbsoluteFill style={{ opacity: 0.03, background: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\"/%3E%3C/svg%3E')", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
