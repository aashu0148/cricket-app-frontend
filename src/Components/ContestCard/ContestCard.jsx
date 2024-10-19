import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Clock, Lock } from "react-feather";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@/Components/Button/Button";
import JoinProtectedContestModal from "./JoinProtectedContestModal";
import Countdown from "../Countdown/Countdown";

import {
  getDateFormatted,
  getTimeFormatted,
  handleAppNavigation,
} from "@/utils/util";
import { joinContest } from "@/apis/contests";
import { contestTypeEnum } from "@/utils/enums";
import { applicationRoutes } from "@/utils/constants";

import styles from "./ContestCard.module.scss";

function ContestCard({ className = "", contestData, onJoined }) {
  const navigate = useNavigate();

  const userDetails = useSelector((s) => s.user);
  const [showJoinContestModal, setShowJoinContestModal] = useState(false);
  const [joining, setJoining] = useState(false);

  const isOwner = contestData.createdBy?._id === userDetails._id;
  const isJoined =
    contestData.createdBy?._id === userDetails._id ||
    contestData.teams.some((t) => t.owner?._id === userDetails._id);
  const isDraftRoundStarted =
    new Date(contestData.draftRound?.startDate) < new Date();

  const handleJoinContest = async (pass = "") => {
    setJoining(true);
    const res = await joinContest(contestData._id, {
      leagueId: contestData._id,
      password: pass,
    });
    setJoining(false);
    if (!res) return;

    toast.success("Contest joined successfully");
    if (onJoined) onJoined(res.data);
  };

  return (
    <div className={`${className || ""} ${styles.container}`}>
      {showJoinContestModal && (
        <JoinProtectedContestModal
          onClose={() => setShowJoinContestModal(false)}
          onJoin={handleJoinContest}
        />
      )}

      <div className="flex-col-xs">
        <div className="flex">
          <h2 className={styles.title}>{contestData.name}</h2>

          {contestData.type === contestTypeEnum.PRIVATE && (
            <div className={styles.privateTag}>
              <Lock />
              <p>{contestData.type.toLowerCase()}</p>
            </div>
          )}
        </div>
        <p className={styles.tournament}>
          Tournament: <span>{contestData.tournament.name}</span>
        </p>

        <p className={styles.desc}>{contestData.description}</p>
      </div>

      <div className="flex-col-xs">
        <div className={styles.information}>
          <label>Owner: </label>
          <p>{contestData.createdBy?.name}</p>
        </div>

        <div className={styles.information}>
          <label>Teams: </label>
          <p>{contestData.teams.length}</p>
        </div>

        {isDraftRoundStarted ? (
          <div className={styles.information}>
            <label>Draft time: </label>

            <p>
              {getTimeFormatted(contestData.draftRound.startDate)},{" "}
              {getDateFormatted(contestData.draftRound.startDate, true)}
            </p>
          </div>
        ) : (
          <div
            className={styles.information}
            style={{ alignItems: "flex-start" }}
          >
            <label>Draft Round in: </label>

            <Countdown small targetDate={contestData.draftRound.startDate} />
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <div />
        {/* <div className={styles.date}>
          <Clock />
          <p>
            {getTimeFormatted(contestData.draftRound.startDate)},{" "}
            {getDateFormatted(contestData.draftRound.startDate, true)}
          </p>
        </div> */}

        {isJoined ? (
          <Button
            outlineButton
            onClick={(e) =>
              handleAppNavigation(
                e,
                navigate,
                applicationRoutes.contest(
                  contestData.tournament?._id,
                  contestData._id
                )
              )
            }
          >
            View Contest
          </Button>
        ) : (
          <Button
            disabled={joining}
            useSpinnerWhenDisabled
            onClick={() =>
              contestData.type === contestTypeEnum.PRIVATE
                ? setShowJoinContestModal(true)
                : handleJoinContest()
            }
          >
            Join Contest
          </Button>
        )}
      </div>
    </div>
  );
}

export default ContestCard;
