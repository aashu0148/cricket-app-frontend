import React, { useEffect, useState } from "react";

import PageLoader from "@/Components/PageLoader/PageLoader";

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

  console.log({ allTournaments, joinedLeagues });

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>HomePage</div>
  );
}

export default HomePage;
