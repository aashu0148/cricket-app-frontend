import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Edit2 } from "react-feather";

import Button from "../Button/Button";
import Toggle from "../Toggle/Toggle";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import MatchCard, { FillerMatchCard } from "../MatchCard/MatchCard";

import { getDateFormatted, handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";
import {
  deleteTournament,
  refreshTournament,
  updateTournament,
} from "@/apis/tournament";
import { getTooltipAttributes } from "@/utils/tooltip";

import styles from "./TournamentCard.module.scss";
import ContestCard, { FillerContestCard } from "../ContestCard/ContestCard";

function TournamentCard({
  tournamentData = {},
  isAdmin = false,
  showMatchSchedules = false,
  onEdit,
  onDeleted,
}) {
  const navigate = useNavigate();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isActive, setIsActive] = useState(tournamentData.active);
  const [hideRefreshButton, setHideRefreshButton] = useState(false);

  async function handleResultsRefresh() {
    setHideRefreshButton(true);
    toast.success(
      "Results will be refreshed in background, check after few minutes please"
    );

    await refreshTournament(tournamentData._id);
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await deleteTournament(tournamentData._id);
    setDeleting(false);
    if (!res) return;

    toast.success("Tournament deleted successfully");
    if (onDeleted) onDeleted();
  }

  async function handleStatusChange() {
    setIsActive((p) => !p);
    const res = await updateTournament(tournamentData._id, {
      active: !isActive,
    });
    if (!res) return;

    toast.success("Status updated successfully");
  }

  useEffect(() => {
    setIsActive(tournamentData.active);
  }, [tournamentData.active]);

  const { longName, startDate, endDate, allMatches } = tournamentData;

  const isCompleted = new Date(tournamentData.endDate) < new Date();
  const isUpcoming = new Date(tournamentData.startDate) > new Date();

  return (
    <div className={styles.card}>
      {showConfirmDeleteModal && (
        <ConfirmDeleteModal
          onClose={() => setShowConfirmDeleteModal(false)}
          onDelete={handleDelete}
          name={longName}
        />
      )}
      {isUpcoming ? (
        <p className={styles.tag}>Upcoming</p>
      ) : isCompleted ? (
        <p className={`${styles.gray} ${styles.tag}`}>Completed</p>
      ) : (
        ""
      )}

      <div className={`flex-col-xxs ${styles.header}`}>
        <div className="spacious-head">
          <h2 className={styles.title}>{longName}</h2>
          {isAdmin ? (
            <Button outlineButton onClick={() => onEdit(tournamentData?._id)}>
              <Edit2 /> Edit
            </Button>
          ) : (
            <Button
              outlineButton
              onClick={(e) =>
                handleAppNavigation(
                  e,
                  navigate,
                  applicationRoutes.contests(tournamentData._id)
                )
              }
            >
              Explore All Contests
            </Button>
          )}
        </div>
        {/* <p className={styles.season}>
          Season: <span>{season}</span>
        </p> */}
        <p className={styles.dates}>
          {getDateFormatted(startDate, true)} -{" "}
          {getDateFormatted(endDate, true)}
        </p>
      </div>

      {tournamentData.featuredLeagues?.length > 0 && (
        <div className={styles.section}>
          <h3 className={`heading`}>Featured Contests</h3>

          <div className={styles.contestCards}>
            {tournamentData.featuredLeagues?.map((contest) => (
              <ContestCard
                key={contest._id}
                contestData={contest}
                className={styles.contestCard}
              />
            ))}

            {new Array(3).fill(1).map((_, i) => (
              <FillerContestCard key={i} />
            ))}
          </div>
        </div>
      )}

      {showMatchSchedules && (
        <div className={styles.section}>
          <h3 className={`heading`}>Matches Schedule</h3>

          <div className={`${styles.matchCards}`}>
            {allMatches
              .sort((a, b) =>
                new Date(a.startDate) < new Date(b.startDate) ? -1 : 1
              )
              .map((match) => (
                <MatchCard key={match.matchId} matchData={match} />
              ))}

            {new Array(4).fill(1).map((_, i) => (
              <FillerMatchCard key={i} />
            ))}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="spacious-head">
          <div className={`flex gap-lg ${styles.section}`}>
            <h3 className="heading">Current Status</h3>
            <Toggle active={isActive} onChange={handleStatusChange} />
          </div>

          <div className={"flex"}>
            {!hideRefreshButton && (
              <Button
                {...getTooltipAttributes({
                  text: "Match results are already refreshed every day, you don't have to manually do that",
                })}
                onClick={handleResultsRefresh}
              >
                Refresh Tournament
              </Button>
            )}

            <Button
              redButton
              disabled={deleting}
              useSpinnerWhenDisabled
              onClick={() => setShowConfirmDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentCard;
