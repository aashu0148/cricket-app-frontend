import React, { useEffect, useState } from "react";

import PageLoader from "@/Components/PageLoader/PageLoader";
import TournamentCard from "@/Components/TournamentCard/TournamentCard";

import { getOngoingUpcomingTournaments } from "@/apis/tournament";
import { getJoinedLeagues } from "@/apis/leagues";

import styles from "./HomePage.module.scss";

function HomePage() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTournaments() {
    const res = await getOngoingUpcomingTournaments();
    setLoading(false);
    if (!res) return;

    setAllTournaments(res?.data);
  }

  async function fetchJoinedLeagues() {
    const res = await getJoinedLeagues();
    if (!res) return;

    setJoinedLeagues(res?.data);
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
        <p className="heading">Available Tournaments</p>

        <div className={`cards`}>
          {allTournaments.map((tournament) => (
            <TournamentCard key={tournament._id} tournamentData={tournament} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
