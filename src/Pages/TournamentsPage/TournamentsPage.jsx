import React, { useEffect, useState } from "react";

import PageLoader from "@/Components/PageLoader/PageLoader";
import TournamentCard from "@/Components/TournamentCard/TournamentCard";

import { getOngoingUpcomingTournaments } from "@/apis/tournament";

function TournamentsPage() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTournaments() {
    const res = await getOngoingUpcomingTournaments();
    setLoading(false);
    if (!res) return;

    const result = res?.data.map((t) => ({
      ...t,
      ongoing: new Date(t.startDate) < new Date(),
      upcoming: new Date(t.startDate) > new Date(),
    }));
    result.sort((a, b) =>
      new Date(a.startDate) < new Date(b.startDate) ? -1 : 1
    );

    setAllTournaments(result);
  }

  useEffect(() => {
    fetchTournaments();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container`}>
      <p className="heading">All Tournaments</p>

      <div className={`cards gap-2xl`}>
        {allTournaments.map((tournament) => (
          <TournamentCard key={tournament._id} tournamentData={tournament} />
        ))}
      </div>
    </div>
  );
}

export default TournamentsPage;
