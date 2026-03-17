import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface TypewriterVideoProps {
  lines: string[];
  title?: string;
  backgroundColor?: string;
}

export const TypewriterVideo: React.FC<TypewriterVideoProps> = ({
  lines,
  title = "🦞 Kingdom Claw",
  backgroundColor = "#0a0a0f",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Calculate characters per frame for typewriter effect
  const charsPerFrame = 2.5;
  const lineDelay = 40; // frames between lines

  // Typewriter text renderer
  const renderTypewriterText = (text: string, lineIndex: number) => {
    const startFrame = 30 + lineIndex * lineDelay;
    const currentFrame = frame - startFrame;
    
    if (currentFrame < 0) return "";
    
    const charsToShow = Math.floor(currentFrame * charsPerFrame);
    return text.substring(0, Math.min(charsToShow, text.length));
  };

  // Cursor blink
  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });

  // Calculate when to show cursor on each line
  const getCursorForLine = (lineIndex: number, text: string) => {
    const startFrame = 30 + lineIndex * lineDelay;
    const endFrame = startFrame + text.length / charsPerFrame;
    const allDone = lines.reduce((sum, line, i) => {
      return sum + (i < lineIndex ? line.length / charsPerFrame + lineDelay : 0);
    }, 30);
    
    // Show cursor on current line being typed
    if (frame >= startFrame && frame < endFrame + 10) {
      return true;
    }
    // Show cursor on last line after all typing done
    if (lineIndex === lines.length - 1 && frame >= endFrame) {
      return true;
    }
    return false;
  };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, #1a1a2e 0%, ${backgroundColor} 70%)`,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 80,
      }}
    >
      {/* Scanline effect */}
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          opacity: 0.3,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 48, marginRight: 16 }}>🦞</span>
        <span style={{ fontSize: 32, fontWeight: "bold", color: "#4ade80" }}>
          Kingdom Claw
        </span>
      </div>

      {/* Terminal window */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(74, 222, 128, 0.3)",
          borderRadius: 12,
          padding: 40,
          width: "100%",
          maxWidth: 1600,
          boxShadow: "0 0 60px rgba(74, 222, 128, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Terminal header */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
        </div>

        {/* Terminal content */}
        <div style={{ lineHeight: 1.8 }}>
          {lines.map((line, i) => {
            const text = renderTypewriterText(line, i);
            const showCursor = getCursorForLine(i, line);
            const isBold = i === 0 || i === lines.length - 1;
            
            return (
              <div
                key={i}
                style={{
                  fontSize: isBold ? 36 : 28,
                  color: line.startsWith(">") ? "#4ade80" : "#e2e8f0",
                  fontWeight: isBold ? "bold" : "normal",
                  marginBottom: 8,
                  opacity: frame >= 30 + i * lineDelay ? 1 : 0,
                }}
              >
                <span style={{ color: "#4ade80" }}>{">"} </span>
                {text}
                {showCursor && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: "1em",
                      background: "#4ade80",
                      marginLeft: 2,
                      opacity: cursorOpacity,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          opacity: interpolate(frame, [durationInFrames - 60, durationInFrames - 30], [0, 1], { extrapolateRight: "clamp" }),
          textAlign: "right",
        }}
      >
        <div style={{ fontSize: 24, color: "#4ade80", fontWeight: "bold" }}>
          Powered by OpenClaw + Remotion + here.now
        </div>
        <div style={{ fontSize: 18, color: "#718096", marginTop: 8 }}>
          AI Video Generation • Instant Publishing
        </div>
      </div>
    </AbsoluteFill>
  );
};
