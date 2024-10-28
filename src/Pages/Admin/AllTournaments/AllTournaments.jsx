import React, { useEffect, useState } from "react";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
} from "@/apis/tournament";

import styles from "./AllTournaments.module.scss";

import PageLoader from "@/Components/PageLoader/PageLoader";
import TournamentCard from "@/Components/TournamentCard/TournamentCard";
import Button from "@/Components/Button/Button";
import CreateTournamentModal from "./CreateTournamentModal/CreateTournamentModal";
import EditTournamentModal from "./EditTournamentModal/EditTournamentModal";

export default function AllTournaments() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showEditTournament, setShowEditTournament] = useState(false);
  const [tournamentToEdit, setTournamentToEdit] = useState(null);

  const handleEditTournament = (id) => {
    setTournamentToEdit(id);
    setShowEditTournament(true);
  };

  // ******************************************************************** Integrations Functions ****************************************************************

  async function fetchTournaments() {
    const res = await getAllTournaments();
    setLoading(false);

    if (!res) return;
    const result = res?.data.map((t) => ({
      ...t,
      ongoing: new Date(t.startDate) < new Date(),
      upcoming: new Date(t.startDate) > new Date(),
    }));
    result.sort((a, b) =>
      new Date(a.startDate) > new Date(b.startDate) ? -1 : 1
    );
    setAllTournaments(result);
  }
  const handleDeleteTournament = async (id) => {
    setLoading(true);
    const res = await deleteTournament(id);
    setLoading(false);
    if (!res) return;
    if (res) {
      // const response = refreshTournament(id);
      await fetchTournaments();
    }
  };

  const handleCreateTournament = async (payload) => {
    setLoading(true);
    const res = await createTournament(payload);
    if (!res) return;
    if (res) {
      await fetchTournaments();
    }
  };

  useEffect(() => {
    fetchTournaments();
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
            handleCreateTournament={handleCreateTournament}
          />
        ) : (
          ""
        )}

        {showEditTournament ? (
          <EditTournamentModal
            onSuccess={fetchTournaments}
            handleClose={() => setShowEditTournament(false)}
            setLoading={setLoading}
            tournamentId={tournamentToEdit}
          />
        ) : (
          ""
        )}

        <div className={`cards ${styles.cards}`}>
          {allTournaments.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              tournamentData={tournament}
              onEdit={handleEditTournament}
              onDeleted={fetchTournaments}
              isAdmin
            />
          ))}
        </div>
      </section>
    </div>
  );
}
