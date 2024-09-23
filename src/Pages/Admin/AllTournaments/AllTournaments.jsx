import React, { useEffect, useState } from "react";
import { getAllTournaments } from "@/apis/tournament";

import styles from "./AllTournaments.module.scss";

import PageLoader from "@/Components/PageLoader/PageLoader";
import TournamentCard from "@/Components/TournamentCard/TournamentCard";
import Button from "@/Components/Button/Button";
import { getAllScoringSystems } from "@/apis/scoringSystem";
import CreateTournamentModal from "./CreateTournamentModal/CreateTournamentModal";
import EditTournamentModal from "./EditTournamentModal/EditTournamentModal";

export default function AllTournaments() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [allScoringSystems, setAllScoringSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showEditTournament, setShowEditTournament] = useState(false);
  const [tournamentToEdit, setTournamentToEdit] = useState(null);

  const handleToggle = (id) => {
    setTournamentToEdit(id);
    setShowEditTournament((prev) => !prev);
  };

  // ******************************************************************** Integrations Functions ****************************************************************

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

  async function fetchScoringSystems() {
    const res = await getAllScoringSystems();
    setLoading(false);
    if (!res) return;

    const result = res.data.map((item) => ({
      label: item.name,
      value: item._id,
    }));
    setAllScoringSystems(result);
  }

  useEffect(() => {
    fetchTournaments();
    fetchScoringSystems();
  }, []);

  // ********************************************************************* Return Statement ***********************************************************
  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`${styles.container} page-container`}>
      <section className={styles.section}>
        <div className="flexBox">
          <p className="heading">All Tournaments</p>
          <Button onClick={() => setShowCreateTournament(true)}>
            Create Tournament
          </Button>
        </div>

        {/* ****************************************** Create And Edit Tournament Modal ********************************************** */}

        {showCreateTournament ? (
          <CreateTournamentModal
            handleClose={() => setShowCreateTournament(false)}
            setLoading={setLoading}
            allScoringSystems={allScoringSystems}
          />
        ) : (
          ""
        )}

        {showEditTournament ? (
          <EditTournamentModal
            handleClose={() => handleToggle()}
            setLoading={setLoading}
            allScoringSystems={allScoringSystems}
            tournamentId = {tournamentToEdit}
          />
        ) : (
          ""
        )}

        <div className={`cards ${styles.cards}`}>
          {allTournaments.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              tournamentData={tournament}
              handleToggle={handleToggle}
              isAdmin
            />
          ))}
        </div>
      </section>
    </div>
  );
}
