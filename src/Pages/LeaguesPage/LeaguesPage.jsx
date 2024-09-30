import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLoader from "@/Components/PageLoader/PageLoader";
import CreateLeagueForm from "./CreateLeagueForm/CreateLeagueForm";
import LeagueCard from "@/Components/LeagueCard/LeagueCard";

import {
  getJoinableLeaguesOfTournament,
  getJoinedLeaguesOfTournament,
} from "@/apis/leagues";
import { getTournamentById } from "@/apis/tournament";

import styles from "./LeaguesPage.module.scss";

const tabsEnum = {
  all: "all",
  joined: "joined",
  create: "create",
};
function LeaguesPage() {
  const params = useParams();
  const [loadingPage, setLoadingPage] = useState(true);
  const [activeTab, setActiveTab] = useState(tabsEnum.all);
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [allLeagues, setAllLeagues] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);

  const fetchTournamentDetails = async () => {
    const res = await getTournamentById(params.tournamentId);
    if (!res) return;

    setTournamentDetails(res.data);
  };

  const fetchLeagues = async () => {
    const res = await getJoinableLeaguesOfTournament(params.tournamentId);
    setLoadingPage(false);
    if (!res) return;

    setAllLeagues(res.data);
  };

  const fetchJoinedLeagues = async () => {
    const res = await getJoinedLeaguesOfTournament(params.tournamentId);
    if (!res) return;

    setJoinedLeagues(res.data);
  };

  useEffect(() => {
    fetchLeagues();
    fetchJoinedLeagues();
    fetchTournamentDetails();
  }, []);

  const allLeaguesTab = (
    <div className={`cards`}>
      {allLeagues.map((item) => (
        <LeagueCard
          className={styles.leagueCard}
          key={item._id}
          leagueData={item}
          onJoined={() => {
            fetchLeagues();
            fetchJoinedLeagues();
          }}
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
  );

  const joinedLeaguesTab = (
    <div className={`cards`}>
      {joinedLeagues.map((item) => (
        <LeagueCard
          className={styles.leagueCard}
          key={item._id}
          leagueData={item}
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
  );

  return loadingPage ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <p className="heading-big">{tournamentDetails.longName}</p>

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
          Create League
        </div>
      </div>

      {activeTab === tabsEnum.create ? (
        <CreateLeagueForm
          tournamentData={tournamentDetails}
          onSuccess={(l) => {
            setJoinedLeagues((p) => [...p, l]);
            setActiveTab(tabsEnum.joined);
            fetchJoinedLeagues();
          }}
        />
      ) : activeTab === tabsEnum.joined ? (
        joinedLeaguesTab
      ) : activeTab === tabsEnum.all ? (
        allLeaguesTab
      ) : (
        ""
      )}
    </div>
  );
}

export default LeaguesPage;
