import React, { useEffect, useState } from "react";

import PageLoader from "@/Components/PageLoader/PageLoader";
import TournamentCard from "@/Components/TournamentCard/TournamentCard";
import LeagueCard from "@/Components/LeagueCard/LeagueCard";

import { getOngoingUpcomingTournaments } from "@/apis/tournament";
import { getJoinedActiveLeagues } from "@/apis/leagues";

import styles from "./HomePage.module.scss";

function HomePage() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTournaments() {
    const res = await getOngoingUpcomingTournaments();
    setLoading(false);
    if (!res) return;

    const result = res?.data.map((t) => ({
      ...t,
      ongoing: new Date(t.startDate) < new Date(),
    }));
    result.sort((a, b) =>
      new Date(a.startDate) < new Date(b.startDate) ? -1 : 1
    );

    setAllTournaments(result.slice(0, 3));
  }

  async function fetchJoinedLeagues() {
    const res = await getJoinedActiveLeagues();
    if (!res) return;

    setJoinedLeagues(res.data);
  }

  useEffect(() => {
    fetchJoinedLeagues();
    fetchTournaments();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <section className={styles.section}>
        <p className="heading">Joined Leagues</p>

        <div className={`cards ${styles.cards}`}>
          {joinedLeagues.map((league) => (
            <LeagueCard
              key={league._id}
              className={styles.leagueCard}
              leagueData={league}
            />
          ))}

          {new Array(3).fill(1).map((_, i) => (
            <div
              key={i}
              className={styles.leagueCard}
              style={{ padding: 0, opacity: 0, pointerEvents: "none" }}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className="heading">Available Tournaments</p>

        <div className={`cards ${styles.cards}`}>
          {allTournaments.map((tournament) => (
            <TournamentCard key={tournament._id} tournamentData={tournament} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
