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
