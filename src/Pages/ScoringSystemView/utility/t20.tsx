import { FIELDS, TableStructure } from "./constants";

export const t20ScoringSystemData: {
  name: string;
  runPoints: number;
  tables: Record<FIELDS, TableStructure>;
} = {
  name: "T20 Scoring System",
  runPoints: 1,
  tables: {
    [FIELDS.AMSR]: {
      tableName: "Ranges",
      definition: "Average runs scored per ball in the match.",
      formula: "A.M.S.R = Total Runs in Match / Total Balls in Match",
      headers: ["A.M.S.R Range", "Match Total (Approx.)", "Name"],
      rows: [
        ["<= 1.17 runs/ball", "< 140 runs", "Low scoring"],
        ["1.18 - 1.33 runs/ball", "140 - 160 runs", "Medium Scoring"],
        ["1.34 - 1.67 runs/ball", "160 - 200 runs", "High Scoring"],
        [">= 1.68 runs/ball", "> 200 runs", "Very high scoring"],
      ],
    },

    [FIELDS.BOUNDARY_POINTS]: {
      tableName: "Boundary Points",
      headers: ["A.M.S.R Ranges", "Four (4 runs)", "Six (6 runs)"],
      rows: [
        ["Low scoring", 3, 6],
        ["Medium scoring", 2.5, 5],
        ["High scoring", 2, 4],
        ["Very high scoring", 1.5, 3],
      ],
    },

    [FIELDS.RUN_MILESTONE_BONUS]: {
      tableName: "Run Milestone Bonus",
      headers: ["Runs Scored", "Position 1-3", "Position 4-7", "Position 8-11"],
      rows: [
        ["Duck (0 runs)", "-10 points", "-5 points", "0 points"],
        ["1-9 runs", "-5 points", "0 points", "0 points"],
        ["10-19 runs", "5 points", "5 points", "5 points"],
        ["20-29 runs", "10 points", "10 points", "10 points"],
      ],
    },

    [FIELDS.ADDITIONAL_RUNS_MILESTONE]: {
      tableName: "For all batting positions (30+ runs)",
      headers: ["Runs Scored", "Points (All positions)"],
      rows: [
        ["30-39 runs", "15 points"],
        ["40-49 runs", "20 points"],
        ["50-59 runs", "25 points"],
        ["60-69 runs", "30 points"],
        ["70-79 runs", "35 points"],
        ["80-89 runs", "40 points"],
        ["90-99 runs", "45 points"],
        ["100+ runs", "50 points"],
      ],
      note: (
        <p className="text-sm">
          Note: There are no negative points for batters in positions 8-11 or
          for those
          <span className="font-semibold"> not out </span> with less than 10
          runs.
        </p>
      ),
    },

    [FIELDS.BATTING_STRIKE_RATE_MULTIPLIERS]: {
      tableName: "Multipliers",
      formula:
        "Strike Rate Bonus=Multiplier × (Runs Scored − (A.M.S.R × Balls Faced))",
      headers: ["Batting Position", "Balls Faced", "Multiplier"],
      rows: [
        ["1-3", "5-10", "1.0"],
        ["1-3", "11-15", "2.0"],
        ["1-3", "16-20", "2.5"],
        ["1-3", "21+", "3.0"],
        ["4-5", "5-10", "1.5"],
        ["4-5", "11-15", "2.5"],
        ["4-5", "16+", "3.0"],
        ["6-11", "5-10", "2.5"],
        ["6-11", "11+", "3.0"],
      ],
      note: (
        <p className="text-sm">
          Note: Bonus applies only if the batter faces{" "}
          <span className="font-semibold"> 5+ balls. </span> No negative points
          if the batter is not out in a winning chase or for batters in
          positions <span className="font-semibold"> 8-11. </span>
        </p>
      ),
    },

    [FIELDS.BOWLING_ECONOMY_RATE_MULTIPLIERS]: {
      tableName: "Bowling Economy Rate Bonus",
      formula:
        "Economy Rate Bonus=Multiplier × ((A.M.S.R × Balls Bowled) − Runs Conceded)",
      headers: ["Balls Bowled", "Multiplier"],
      rows: [
        ["6", "1.5"],
        ["7-12", "2.0"],
        ["13-18", "2.5"],
        ["19-24", "3.0"],
      ],
      note: "Bonus applies only if the bowler bowls 6+ balls.",
    },

    [FIELDS.WICKET_POINTS]: {
      tableName: "Wicket Points",
      headers: ["Batter Position", "Wicket Points"],
      rows: [
        ["1-5", "25"],
        ["6", "20"],
        ["7", "15"],
        ["8-11", "10"],
      ],
      exceptions: [
        "If a batter in position 6 scores 20+ runs, their wicket is worth 25 points.",
        "If a batter in position 7 scores 20+ runs, their wicket is worth 25 points.",
        "If a batter in positions 8-11 scores 20+ runs, their wicket is worth 20 points.",
      ],
    },

    [FIELDS.DOT_BALL_POINTS]: {
      tableName: "Dot Ball Points",
      headers: ["A.M.S.R Range", "Dot Ball Points"],
      rows: [
        ["Low scoring", "1 points"],
        ["Medium Scoring", "1.5 points"],
        ["High Scoring", "1.75 points"],
        ["Very high scoring", "2 points"],
      ],
    },

    [FIELDS.WICKET_MILESTONE_BONUS]: {
      tableName: "Wickets Milestone Bonus",
      headers: ["Wickets taken", "Points"],
      rows: [
        ["2 wickets", "15"],
        ["3 wickets", "25"],
        ["4 wickets", "40"],
        ["5+ wickets", "60"],
      ],
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
