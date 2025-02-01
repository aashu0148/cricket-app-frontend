import { useEffect, useState } from "react";

import { getTournamentById } from "@/apis/tournament";
import { parsePlayersForSquadDetails } from "@/utils/util";
import { getContestById } from "@/apis/contests";
import { Contest, Tournament } from "@/utils/definitions";

interface Props {
  tournamentId: string;
  contestId: string;
}

export default function useFetchContest({ tournamentId, contestId }: Props) {
  const [playerPoints, setPlayerPoints] = useState([]);
  const [tournamentDetails, setTournamentDetails] = useState<
    Partial<Tournament>
  >({});
  const [completedTournamentMatches, setCompletedTournamentMatches] = useState(
    []
  );
  const [contestDetails, setContestDetails] = useState<Contest | null>(null);
  const [fetching, setFetching] = useState(true);

  const fetchContestDetails = async () => {
    const res = await getContestById(contestId);
    setFetching(false);
    if (!res) return;

    setContestDetails(res.data);
  };

  const fetchTournamentDetails = async () => {
    const res = await getTournamentById(tournamentId);
    if (!res) return setFetching(false);

    // lets not fill whole tournament into state, its pretty big and we wont be using it whole
    const tournament = res.data;
    setPlayerPoints(tournament.playerPoints);
    setTournamentDetails({
      _id: tournament._id,
      name: tournament.name,
      longName: tournament.longName,
      active: tournament.active,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      season: tournament.season,
      scoringSystem: tournament.scoringSystem,
      // TODO: change the type of players in the definition of tournament accordingly or store these players separately
      players: parsePlayersForSquadDetails(
        tournament.players,
        tournament.allSquads
      ),
    });
    setCompletedTournamentMatches(tournament.completedMatches || []);
  };

  const fetchInitial = async () => {
    await fetchTournamentDetails();
    fetchContestDetails();
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  function refetchContest() {
    fetchContestDetails();
  }

  return {
    isFetching: fetching,
    playerPoints,
    tournamentDetails,
    completedTournamentMatches,
    contestDetails,
    setContestDetails,
    refetchContest,
  };
}
