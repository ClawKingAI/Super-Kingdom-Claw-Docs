import { AbsoluteFill } from "remotion";

interface WeeklyReportVideoProps {
  sheets: any[];
  reportDate: string;
}

export const WeeklyReportVideo: React.FC<WeeklyReportVideoProps> = ({
  sheets = [],
  reportDate = "",
}) => {
  return (
    <AbsoluteFill style={{ background: "#0f172a" }}>
      <div style={{ color: "#fff", fontSize: 48 }}>Weekly Report Placeholder</div>
    </AbsoluteFill>
  );
};
