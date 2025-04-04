interface UserBase {
  createdAt: string;
  email: string;
  name: string;
  profileImage: string;
  _id: string;
}

export interface Match {
  slug: string;
  startDate: string;
  endDate: string;
  startTime: string;
  matchId: string;
  objectId: string;
  isCancelled: boolean;
  format: string;
  statusText: string;
  teams: Team[];
  _id: string;
}

export interface PlayerPointBreakdown {
  label: string;
  points: number;
}

export interface PlayerPoints {
  player: string;
  points: number;
  breakdown: PlayerPointBreakdown[];
  _id: string;
}

export interface Team {
  name: string;
  longName?: string;
  slug: string;
  objectId: string;
  image: string;
  country: string;
  _id: string;
}

export interface Participant {
  joinedAt: string;
  name: string;
  owner: UserBase | string;
  players: Array<string | PlayerDetails>;
}

export interface MatchBase {
  tournament: string;
  slug: string;
  objectId: string;
  matchId: string;
  status: string;
  statusText: string;
  startTime: string;
  amsr: number;
  startDate: string;
  endDate: string;
}

export interface CompletedMatch extends MatchBase {
  _id: string;
  teams: Team[];
  playerPoints: PlayerPoints[];
  createdAt: string;
  updatedAt: string;
}

export interface Squad {
  squadId: string;
  objectId: string;
  slug: string;
  teamSlug: string;
  teamName: string;
  teamImage: string;
  title: string;
  _id: string;
}

export interface PlayerDetails {
  _id: string;
  name: string;
  fullName?: string;
  playerId: number;
  slug: string;
  country: string;
  objectId: number;
  espnUrl: string;
  image: string;
  playingRole?: string;
  role?: string;
  updatedAt: string;
}

export interface SquadBase {
  teamImage: string;
  teamName: string;
  teamSlug: string;
}

export interface TournamentPlayer {
  player: PlayerDetails;
  squad: SquadBase;
  squadId: string;
  _id: string;
}

export interface PlayerSquad {
  player: PlayerDetails;
  squadId: string;
  squad?: SquadBase;
  _id: string;
}

export interface Tournament {
  _id: string;
  active: boolean;
  allMatches: MatchBase[];
  allSquads: SquadBase[];
  completed: boolean;
  createdAt: string;
  endDate: string;
  longName: string;
  name: string;
  ojectId: string;
  playerPoints: PlayerPoints[];
  players: { player: string | PlayerDetails; squadId: string }[];
  slug: string;
  scoringSystem: string;
  season: string;
  startDate: string;
  updatedAt: string;
}

export interface Contest {
  _id: string;
  createdBy: string | UserBase;
  password?: string;
  createdAt: string;
  description: string;
  draftRound: {
    completed: boolean;
    currentTurn: string;
    paused: boolean;
    startDate: string;
    turnDir: string;
    turnTimestamp: number;
  };
  name: string;
  teams: {
    joinedAt: string;
    owner: string | UserBase;
    players: (string | PlayerDetails)[];
    wishlist: string[];
    _id: string;
  }[];
  tournament: string | Tournament;
  type: string;
  updatedAt: string;
}

export interface ScoringSystem {
  name: string;

  // Batting Points
  batting: {
    run: Array<{
      points: number;
      minRate: number;
      maxRate: number;
    }>;

    boundaryPoints: Array<{
      minRate: number;
      maxRate: number;
      four: number;
      six: number;
    }>;

    runMilestoneBonus: {
      milestones: Array<{
        battingPositions: number[];
        runs: number;
        points: number;
      }>;
      negativePointsExemptPositions: number[];
      negativePointsExemptNotOutBatterWithRuns: number;
    };

    strikeRateBonus: {
      multiplierRanges: Array<{
        battingPositions: number[];
        minBalls: number;
        maxBalls: number;
        multiplier: number;
      }>;
      negativePointsExemptPositions: number[];
      minBallsRequired: number;
    };
  };

  // Bowling Points
  bowling: {
    wicketPoints: Array<{
      minBattingPosition: number;
      maxBattingPosition: number;
      points: number;
      runsCapForIncrementingPoints?: number;
      incrementedPoints?: number;
    }>;

    wicketPointsMultiplier: Array<{
      minRate: number;
      maxRate: number;
      multiplier: number;
    }>;

    dotBallPoints: Array<{
      minRate: number;
      maxRate: number;
      points: number;
    }>;

    wicketMilestoneBonus: Array<{
      minWickets: number;
      maxWickets: number;
      points: number;
    }>;

    economyRateBonus: {
      multiplierRanges: Array<{
        minBallsBowled: number;
        maxBallsBowled: number;
        multiplier: number;
      }>;
      minBowledBallsRequired: number;
    };
  };

  // Fielding Points
  fielding: {
    catchPoints: number;
    stumpingPoints: number;
    directHitRunOutPoints: number;
    assistedRunOutPoints: number;
  };

  // Timestamps from mongoose
  createdAt?: Date;
  updatedAt?: Date;
}
