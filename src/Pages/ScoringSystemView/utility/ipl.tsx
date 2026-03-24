import { FIELDS, TableStructure } from "./constants";

export const iplScoringSystemData: {
  name: string;
  runPoints: number;
  tables: Partial<Record<FIELDS, TableStructure>>;
} = {
  name: "IPL Scoring System",
  runPoints: 1,
  tables: {
    [FIELDS.AMSR]: {
      tableName: "Ranges",
      definition: "Average runs scored per ball in the match.",
      formula: "A.M.S.R = Total Runs in Match / Total Balls in Match",
      headers: ["A.M.S.R Range", "Match Total (Approx.)", "Name"],
      rows: [
        ["≤ 1.17 runs/ball", "< 140 runs", "Low Scoring"],
        ["1.18 – 1.33 runs/ball", "140 – 160 runs", "Medium Scoring"],
        ["1.34 – 1.67 runs/ball", "160 – 200 runs", "High Scoring"],
        ["1.68 – 1.83 runs/ball", "200 – 220 runs", "Very High Scoring"],
        ["≥ 1.84 runs/ball", "≥ 220 runs", "Very Very High Scoring"],
      ],
    },

    [FIELDS.BOUNDARY_POINTS]: {
      tableName: "Boundary Points",
      headers: ["A.M.S.R Ranges", "Four (4 runs)", "Six (6 runs)"],
      rows: [
        ["Low Scoring", 3, 6],
        ["Medium Scoring", 2.5, 5],
        ["High Scoring", 2, 4],
        ["Very High Scoring", 1.5, 3],
        ["Very Very High Scoring", 1, 2],
      ],
    },

    [FIELDS.RUN_MILESTONE_BONUS]: {
      tableName: "Run Milestone Bonus",
      headers: ["Runs Scored", "Positions 1–3", "Positions 4+"],
      rows: [
        ["Duck (0 runs)", "−10 points", "−5 points"],
        ["1–9 runs", "−5 points", "0 points"],
        ["10+ runs", "0 points", "0 points"],
      ],
    },

    [FIELDS.BATTING_STRIKE_RATE_MULTIPLIERS]: {
      tableName: "Multipliers",
      formula:
        "Strike Rate Bonus = Multiplier × (Runs Scored − (A.M.S.R × Balls Faced))",
      headers: ["Batting Position", "Balls Faced", "Multiplier"],
      rows: [
        ["1–3", "3–10", "1.5"],
        ["1–3", "11–15", "2.5"],
        ["1–3", "16+", "3.5"],
        ["4–5", "3–10", "2.0"],
        ["4–5", "11–15", "2.5"],
        ["4–5", "16+", "3.5"],
        ["6–11", "3–10", "3.0"],
        ["6–11", "11+", "3.5"],
      ],
      note: (
        <p className="text-sm">
          Note: Applies when the batter has faced{" "}
          <span className="font-semibold">3 or more balls.</span> No negative
          strike rate points if the batter is not out in a winning chase or for
          batters in positions <span className="font-semibold">8–11.</span>
        </p>
      ),
    },

    [FIELDS.WICKET_POINTS]: {
      tableName: "Wicket Points",
      headers: ["Batter Position", "Wicket Points"],
      rows: [
        ["1–5", "25"],
        ["6", "20"],
        ["7", "15"],
        ["8–11", "10"],
      ],
      note: "If a batter in positions 6–7 scores 20+ runs, their wicket is worth 25 points. If a batter in positions 8–11 scores 20+ runs, their wicket is worth 20 points.",
    },

    [FIELDS.DOT_BALL_POINTS]: {
      tableName: "Dot Ball Points",
      headers: ["A.M.S.R Range", "Dot Ball Points"],
      rows: [
        ["Low Scoring", "1"],
        ["Medium Scoring", "1.5"],
        ["High Scoring", "1.75"],
        ["Very High Scoring", "2"],
        ["Very Very High Scoring", "2.5"],
      ],
    },

    [FIELDS.BOWLING_ECONOMY_RATE_MULTIPLIERS]: {
      tableName: "Multipliers",
      formula:
        "Economy Rate Bonus = Multiplier × ((A.M.S.R × Balls Bowled) − Runs Conceded)",
      headers: ["Balls Bowled", "Multiplier"],
      rows: [
        ["6", "2.0"],
        ["7–12", "2.5"],
        ["13–18", "3.0"],
        ["19+", "3.5"],
      ],
      note: "Bonus applies only if the bowler bowls 6 or more balls.",
    },

    [FIELDS.FIELDING_POINTS]: {
      tableName: "Fielding Points",
      headers: ["Action", "Points"],
      rows: [
        ["Catch", "5"],
        ["Stumping", "5"],
        ["Direct Hit Run Out", "15"],
        ["Assisted Run Out", "5"],
      ],
    },
  },
};
