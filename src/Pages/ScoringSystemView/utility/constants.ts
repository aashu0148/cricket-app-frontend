export interface TableStructure {
  definition?: string;
  formula?: string;
  tableName: string;
  headers: string[];
  rows: (string | number)[][];
  exceptions?: string[];
  note?: JSX.Element | string;
}

export enum FIELDS {
  AMSR = "amsr",
  BOUNDARY_POINTS = "boundaryPoints",
  RUN_MILESTONE_BONUS = "runMilestoneBonus",
  ADDITIONAL_RUNS_MILESTONE = "additionalRunsMilestone",
  BATTING_STRIKE_RATE_MULTIPLIERS = "battingStrikeRateMultipliers",
  BOWLING_ECONOMY_RATE_MULTIPLIERS = "bowlingEconomyRateMultipliers",
  WICKET_POINTS = "wicketPoints",
  DOT_BALL_POINTS = "dotBallPoints",
  WICKET_MILESTONE_BONUS = "wicketMilestoneBonus",
  FIELDING_POINTS = "fieldingPoints",
}
