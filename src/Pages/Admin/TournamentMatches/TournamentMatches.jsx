import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import styles from "./TournamentMatches.module.scss";

import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import PageLoader from "@/Components/PageLoader/PageLoader";
import MatchCard, { FillerMatchCard } from "@/Components/MatchCard/MatchCard";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal/ConfirmDeleteModal";

import {
  deleteMatch,
  getAllMatchesForTournament,
  getAllTournamentInfo,
} from "@/apis/tournament";

import { capitalizeText } from "@/utils/util";

export default function TournamentMatches() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [allMatches, setAllMatches] = useState([]);
  const [deletingMatch, setDeletingMatch] = useState(null);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    show: false,
    matchId: null,
    name: "",
  });

  // ******************************************** Integration **********************************************************

  const getAllTournamentsInfo = async () => {
    const res = await getAllTournamentInfo();
    if (!res) return;
    if (res.success) setAllTournaments(res.data);
  };

  const getMatchesForTournament = async (tournamentId) => {
    setIsLoading(true);
    const res = await getAllMatchesForTournament(tournamentId);
    setIsLoading(false);
    if (!res) return;
    if (res.success) setAllMatches(res.data);
  };

  const handleDeleteMatch = async (matchId) => {
    setDeletingMatch(matchId);
    const res = await deleteMatch(matchId);
    setDeletingMatch(null);
    if (!res) return;

    toast.success("Match Deleted Successfully!");
    setAllMatches((prev) => prev.filter((item) => item._id !== matchId));
  };

  useEffect(() => {
    getAllTournamentsInfo();
  }, []);

  return (
    <div className={`page-container`}>
      <div className="spacious-head">
        <p className="heading-big">
          {selectedTournament.label || "All Tournaments"}
        </p>
        <div style={{ width: "300px" }}>
          <InputSelect
            placeholder="Select any Tournament"
            options={allTournaments.map((item) => ({
              label: item.longName,
              value: item._id,
            }))}
            onChange={(e) => {
              setSelectedTournament(e);
              getMatchesForTournament(e.value);
            }}
            value={selectedTournament.value ? selectedTournament : null}
          />
        </div>
      </div>
      {isLoading ? (
        <PageLoader fullPage />
      ) : (
        <div className={styles.matchSection}>
          {confirmDeleteDialog.show ? (
            <ConfirmDeleteModal
              onClose={() => setConfirmDeleteDialog({ show: false })}
              name={capitalizeText(confirmDeleteDialog.name)}
              onDelete={() => {
                handleDeleteMatch(confirmDeleteDialog.matchId);
                setConfirmDeleteDialog({ show: false });
              }}
            />
          ) : (
            ""
          )}

          <h2 className={styles.title}>Matches</h2>
          <div className={styles.allMatches}>
            {allMatches
              .sort((a, b) =>
                new Date(a.startDate) < new Date(b.startDate) ? -1 : 1
              )
              .map((match) => (
                <MatchCard
                  key={match.matchId}
                  matchData={match}
                  handleDelete={() =>
                    setConfirmDeleteDialog((prev) => ({
                      ...prev,
                      show: true,
                      matchId: match._id,
                      name: match.slug.replaceAll("-", " "),
                    }))
                  }
                  isDeleting={deletingMatch === match._id}
                  showDeleteIcon
                />
              ))}

            {new Array(4).fill(1).map((_, i) => (
              <FillerMatchCard key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
