import React, { useEffect, useState } from "react";

import PageLoader from "@/Components/PageLoader/PageLoader";
import TournamentCard from "@/Components/TournamentCard/TournamentCard";
import ContestCard from "@/Components/ContestCard/ContestCard";

import { getOngoingUpcomingTournaments } from "@/apis/tournament";
import { getJoinedActiveContests } from "@/apis/contests";

import styles from "./HomePage.module.scss";

function HomePage() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [joinedContests, setJoinedContests] = useState([]);
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

  async function fetchJoinedContests() {
    const res = await getJoinedActiveContests();
    if (!res) return;

    setJoinedContests(res.data);
  }

  useEffect(() => {
    fetchJoinedContests();
    fetchTournaments();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <section className={styles.section}>
        <p className="heading">Joined Contests</p>

        <div className={`cards ${styles.cards}`}>
          {joinedContests.map((contest) => (
            <ContestCard
              key={contest._id}
              className={styles.contestCard}
              contestData={contest}
            />
          ))}

          {new Array(3).fill(1).map((_, i) => (
            <div
              key={i}
              className={styles.contestCard}
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
