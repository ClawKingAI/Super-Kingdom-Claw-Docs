import { Composition } from "remotion";
import { WeeklyReportVideo } from "./WeeklyReportVideo";
import { TextVideo } from "./TextVideo";
import { TypewriterVideo } from "./TypewriterVideo";
import { CrusadePromo } from "./CrusadePromo";
import { ProphecyCall } from "./ProphecyCall";
import { CrimeDrama } from "./CrimeDrama";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WeeklyReport"
        component={WeeklyReportVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          sheets: [],
          reportDate: "",
        }}
      />
      <Composition
        id="TextVideo"
        component={TextVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Title Here",
          subtitle: "Subtitle",
        }}
      />
      <Composition
        id="TypewriterVideo"
        component={TypewriterVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          lines: ["Text here"],
        }}
      />
      <Composition
        id="CrusadePromo"
        component={CrusadePromo}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          soulsGoal: 100000,
        }}
      />
      <Composition
        id="ProphecyCall"
        component={ProphecyCall}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headline: "Understanding the Times",
          subheadline: "A Call to Discernment",
        }}
      />
      <Composition
        id="CrimeDrama"
        component={CrimeDrama}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
