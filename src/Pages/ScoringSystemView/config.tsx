export interface TableStructure {
  definition?: string;
  formula?: string;
  tableName: string;
  headers: string[];
  rows: (string | number)[][];
  exceptions?: string[];
  note?: JSX.Element | string;
}

export const amsrTable: TableStructure = {
  tableName: "Ranges",
  definition: "Average runs scored per ball in the match.",
  formula: "A.M.S.R = Total Runs in Match / Total Balls in Match",
  headers: ["A.M.S.R Range", "Match Total (Approx.)", "Name"],
  rows: [
    ["< 0.82 runs/ball", "< 250 runs", "Low scoring"],
    ["0.83 - 0.99 runs/ball", "250 - 299 runs", "Medium Scoring"],
    ["1.00 - 1.16 runs/ball", "300 - 350 runs", "High Scoring"],
    ["> 1.17 runs/ball", "> 350 runs", "Very high scoring"],
  ],
};

export const runPoints = 1;

export const boundaryPoints: TableStructure = {
  tableName: "Boundary Points",
  headers: ["A.M.S.R Ranges", "Four (4 runs)", "Six (6 runs)"],
  rows: [
    ["Low scoring", 3, 6],
    ["Medium scoring", 2.5, 5],
    ["High scoring", 2, 4],
    ["Very high scoring", 1.5, 3],
  ],
};

export const runsMilestoneBonus: TableStructure = {
  tableName: "Run Milestone Bonus",
  headers: ["Runs Scored", "Position 1-6", "Position 7", "Position 8-9"],
  rows: [
    ["Duck (0 runs)", "-20 points", "-10 points", "0 points"],
    ["1-9 runs", "-10 points", "-5 points", "0 points"],
    ["10-19 runs", "-5 points", "5 points", "5 points"],
    ["20-29 runs", "10 points", "10 points", "10 points"],
  ],
};

export const additionalRunsMilestone: TableStructure = {
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
    ["100-109 runs", "50 points"],
    ["110-124 runs", "60 points"],
    ["125-174 runs", "80 points"],
    ["175+ runs", "100 points"],
  ],
  note: (
    <p className="text-sm">
      Note: There are no negative points for batters in positions 8-11 or for
      those
      <span className="font-semibold"> not out </span> with less than 20 runs.
    </p>
  ),
};

export const battingStrikeRateMultipliers: TableStructure = {
  tableName: "Multipliers",
  formula:
    "Strike Rate Bonus=Multiplier × (Runs Scored − (A.M.S.R × Balls Faced))",
  headers: ["Batting Position", "Balls Faced", "Multiplier"],
  rows: [
    ["1-6", "10-30", "1.0"],
    ["1-6", "31+", "1.5"],
    ["7-11", "10-30", "2.0"],
    ["7-11", "31+", "1.5"],
  ],
  note: (
    <p className="text-sm">
      Note: Bonus applies only if the batter faces{" "}
      <span className="font-semibold"> 10+ balls. </span> No negative points if
      the batter is not out in a winning chase or for batters in positions{" "}
      <span className="font-semibold"> 8-11. </span>
    </p>
  ),
};

export const bowlingEconomyRateMultipliers: TableStructure = {
  tableName: "Bowling Economy Rate Bonus",
  formula:
    "Economy Rate Bonus=Multiplier × ((A.M.S.R × Balls Bowled) − Runs Conceded)",
  headers: ["Balls Bowled", "Multiplier"],
  rows: [
    ["12-30", "1.0"],
    ["31-60", "1.5"],
  ],
  note: "Bonus applies only if the bowler bowls 12+ balls.",
};

export const wicketPoints: TableStructure = {
  tableName: "Wicket Points",
  headers: ["Batter Position", "Wicket Points"],
  rows: [
    ["1-6", "30"],
    ["7", "20"],
    ["8-11", "10"],
  ],
  exceptions: [
    "If a batter in position 7 scores 30+ runs, their wicket is worth 30 points.",
    "If a batter in positions 8-11 scores 20+ runs, their wicket is worth 20 points.",
  ],
};

export const dotBallPoints: TableStructure = {
  tableName: "Dot Ball Points",
  headers: ["A.M.S.R Range", "Dot Ball Points"],
  rows: [
    ["Low scoring", "0.25 points"],
    ["Medium Scoring", "0.50 points"],
    ["High Scoring", "0.75 points"],
    ["Very high scoring", "1 point"],
  ],
};

export const wicketMilestoneBonus: TableStructure = {
  tableName: "Wickets Milestone Bonus",
  headers: ["Wickets taken", "Points"],
  rows: [
    ["2 wickets", "20"],
    ["3 wickets", "35"],
    ["4 wickets", "50"],
    ["5 wickets", "80"],
    ["6+ wickets", "100"],
  ],
};

export const fieldingPoints: TableStructure = {
  tableName: "Fielding Points",
  headers: ["Action", "Points"],
  rows: [
    ["Catch", "10"],
    ["Stumping", "10"],
    ["Direct Hit Run Out", "20"],
    ["Assisted Run Out", "10"],
  ],
};
