import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLoader from "@/Components/PageLoader/PageLoader";
import CreateContestForm from "./CreateContestForm/CreateContestForm";
import ContestCard from "@/Components/ContestCard/ContestCard";

import {
  getJoinableContestsOfTournament,
  getJoinedContestsOfTournament,
} from "@/apis/contests";
import { getTournamentById } from "@/apis/tournament";
import { parsePlayersForSquadDetails } from "@/utils/util";

import styles from "./ContestsPage.module.scss";

const tabsEnum = {
  all: "all",
  joined: "joined",
  create: "create",
};
function ContestsPage() {
  const params = useParams();
  const [loadingPage, setLoadingPage] = useState(true);
  const [activeTab, setActiveTab] = useState(tabsEnum.all);
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [allContests, setAllContests] = useState([]);
  const [joinedContests, setJoinedContests] = useState([]);

  const fetchTournamentDetails = async () => {
    const res = await getTournamentById(params.tournamentId);
    if (!res) return;

    setTournamentDetails({
      ...res.data,
      players: parsePlayersForSquadDetails(
        res.data.players,
        res.data.allSquads
      ),
    });
  };

  const fetchContests = async () => {
    const res = await getJoinableContestsOfTournament(params.tournamentId);
    if (!res) return;

    setAllContests(res.data);
  };

  const fetchJoinedContests = async () => {
    const res = await getJoinedContestsOfTournament(params.tournamentId);
    if (!res) return;

    setJoinedContests(res.data);
  };

  const fetchInitialData = async () => {
    await fetchContests();
    await fetchJoinedContests();
    await fetchTournamentDetails();
    setLoadingPage(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const allContestsTab = allContests.length ? (
    <div className={`cards`}>
      {allContests.map((item) => (
        <ContestCard
          className={styles.contestCard}
          key={item._id}
          contestData={item}
          onJoined={() => {
            fetchContests();
            fetchJoinedContests();
          }}
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
  ) : (
    <p className="title">No Context present!</p>
  );

  const joinedContestsTab = (
    <div className={`cards`}>
      {joinedContests.map((item) => (
        <ContestCard
          className={styles.contestCard}
          key={item._id}
          contestData={item}
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
          All Contests
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === tabsEnum.joined ? styles.active : ""
          }`}
          onClick={() => setActiveTab(tabsEnum.joined)}
        >
          Joined Contests
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === tabsEnum.create ? styles.active : ""
          }`}
          onClick={() => setActiveTab(tabsEnum.create)}
        >
          Create Contest
        </div>
      </div>

      {activeTab === tabsEnum.create ? (
        <CreateContestForm
          tournamentData={tournamentDetails}
          onSuccess={(l) => {
            setJoinedContests((p) => [...p, l]);
            setActiveTab(tabsEnum.joined);
            fetchJoinedContests();
          }}
        />
      ) : activeTab === tabsEnum.joined ? (
        joinedContestsTab
      ) : activeTab === tabsEnum.all ? (
        allContestsTab
      ) : (
        ""
      )}
    </div>
  );
}

export default ContestsPage;
