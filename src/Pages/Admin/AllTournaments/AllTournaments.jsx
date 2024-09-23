import React, { useEffect, useState } from "react";
import { getAllTournaments } from "@/apis/tournament";

import styles from "./AllTournaments.module.scss";

import PageLoader from "@/Components/PageLoader/PageLoader";

import TournamentCard from "@/Components/TournamentCard/TournamentCard";

export default function AllTournaments() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ******************************* Functions ****************************

  async function fetchTournaments() {
    const res = await getAllTournaments();

    setLoading(false);

    if (!res) return;
    const result = res?.data.map((t) => ({
      ...t,
      ongoing: new Date(t.startDate) < new Date(),
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
    <div className={`${styles.container} page-container`}>
      <section className={styles.section}>
        <h1 className={"gradient-text"}>All Tournaments</h1>

        <div className={`cards ${styles.cards}`}>
          {allTournaments.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              tournamentData={tournament}
              isAdmin
            />
          ))}
        </div>
      </section>
    </div>
  );
}
