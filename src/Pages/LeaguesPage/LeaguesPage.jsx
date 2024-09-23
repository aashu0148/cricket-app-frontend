import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLoader from "@/Components/PageLoader/PageLoader";
import CreateLeagueForm from "./CreateLeagueForm/CreateLeagueForm";

import { getJoinableLeaguesOfTournament } from "@/apis/leagues";

import styles from "./LeaguesPage.module.scss";

const tabsEnum = {
  all: "all",
  joined: "joined",
  create: "create",
};
function LeaguesPage() {
  const params = useParams();
  const [loadingPage, setLoadingPage] = useState(true);
  const [activeTab, setActiveTab] = useState();

  const fetchLeagues = async () => {
    const res = await getJoinableLeaguesOfTournament(params.tournamentId);
    setLoadingPage(false);
    if (!res) return;

    console.log(res);
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  return loadingPage ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${
            activeTab === tabsEnum.all ? styles.active : ""
          }`}
          onClick={() => setActiveTab(tabsEnum.all)}
        >
          All Leagues
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === tabsEnum.joined ? styles.active : ""
          }`}
          onClick={() => setActiveTab(tabsEnum.joined)}
        >
          Joined Leagues
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === tabsEnum.create ? styles.active : ""
          }`}
          onClick={() => setActiveTab(tabsEnum.create)}
        >
          Create New
        </div>
      </div>

      {activeTab === tabsEnum.create ? <CreateLeagueForm /> : ""}
    </div>
  );
}

export default LeaguesPage;
