import { useMemo } from "react";
import {
  CompletedMatch,
  MatchBase,
  Participant,
  PlayerDetails,
  SquadBase,
  TournamentPlayer,
} from "../definitions";

interface PlayerSquadWithPoints extends PlayerDetails, SquadBase {
  points: number;
}

interface ParticipantWiseMatchWise {
  match: MatchBase;
  matchId: string;
  participantId: string;
  teamPoints: number;
}

export default function useContestStats({
  tournamentPlayers = [],
  completedMatches = [],
  teams = [],
}: {
  tournamentPlayers: TournamentPlayer[];
  completedMatches: CompletedMatch[];
  teams: Participant[];
}) {
  const allPlayersWithPoints = useMemo(() => {
    const players: PlayerSquadWithPoints[] = [];
    completedMatches.forEach((match) => {
      match.playerPoints.forEach((item) => {
        const existingPlayer = players.find((p) => p._id === item.player);
        if (existingPlayer) return (existingPlayer.points += item.points);

        const tPlayer = tournamentPlayers.find(
          (p) => p.player?._id === item.player
        );
        if (tPlayer)
          players.push({
            ...tPlayer.squad,
            ...tPlayer.player,
            points: item.points,
          });
      });
    });
    return players;
  }, [completedMatches, tournamentPlayers]);

  const participantWiseMatchWise: ParticipantWiseMatchWise[] = useMemo(() => {
    const output: ParticipantWiseMatchWise[] = [];
    teams.forEach((team) => {
      const playerIds = team.players.map((p) =>
        typeof p === "string" ? p : p._id
      );

      completedMatches.forEach((match) => {
        const teamPoints = match.playerPoints.reduce((acc, curr) => {
          if (playerIds.includes(curr.player)) return acc + curr.points;
          return acc;
        }, 0);

        output.push({
          matchId: match.matchId,
          participantId:
            typeof team.owner === "string" ? team.owner : team.owner?._id,
          teamPoints,
          match: {
            ...match,
          },
        });
      });
    });

    return output;
  }, [teams, completedMatches]);

  return {
    participantWiseMatchWise,
    allPlayersWithPoints,
  };
}
