import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Clock, Lock } from "react-feather";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@/Components/Button/Button";
import Modal from "@/Components/Modal/Modal";
import InputControl from "@/Components/InputControl/InputControl";

import {
  getDateFormatted,
  getTimeFormatted,
  handleAppNavigation,
} from "@/utils/util";
import { joinLeague } from "@/apis/leagues";
import { leagueTypeEnum } from "@/utils/enums";
import { applicationRoutes } from "@/utils/constants";

import styles from "./LeagueCard.module.scss";

function JoinProtectedLeague({ onClose, onJoin }) {
  const [pass, setPass] = useState("");

  return (
    <Modal onClose>
      <div className="page-container form">
        <p className="heading">Join League</p>
        <InputControl
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          label="League Password"
          placeholder="Enter password"
        />

        <div className="footer">
          <Button cancelButton onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onJoin(pass);
              onClose();
            }}
          >
            Join
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function LeagueCard({ className = "", leagueData, onJoined }) {
  const navigate = useNavigate();

  const userDetails = useSelector((s) => s.user);
  const [showJoinLeagueModal, setShowJoinLeagueModal] = useState(false);
  const [joining, setJoining] = useState(false);

  const isOwner = leagueData.createdBy?._id === userDetails._id;
  const isJoined =
    leagueData.createdBy?._id === userDetails._id ||
    leagueData.teams.some((t) => t.owner?._id === userDetails._id);

  const handleJoinLeague = async (pass = "") => {
    setJoining(true);
    const res = await joinLeague(leagueData._id, {
      leagueId: leagueData._id,
      password: pass,
    });
    setJoining(false);
    if (!res) return;

    toast.success("League joined successfully");
    if (onJoined) onJoined(res.data);
  };

  return (
    <div className={`${className || ""} ${styles.container}`}>
      {showJoinLeagueModal && (
        <JoinProtectedLeague
          onClose={() => setShowJoinLeagueModal(false)}
          onJoin={handleJoinLeague}
        />
      )}

      <div className="flex-col-xs">
        <div className="flex">
          <h2 className={styles.title}>{leagueData.name}</h2>

          {leagueData.type === leagueTypeEnum.PRIVATE && (
            <div className={styles.privateTag}>
              <Lock />
              <p>{leagueData.type}</p>
            </div>
          )}
        </div>
        <p className={styles.tournament}>
          Tournament: <span>{leagueData.tournament.name}</span>
        </p>

        <p className={styles.desc}>{leagueData.description}</p>
      </div>

      <div className="flex-col-xs">
        <div className={styles.information}>
          <label>Owner: </label>
          <p>{leagueData.createdBy?.name}</p>
        </div>

        <div className={styles.information}>
          <label>Teams: </label>
          <p>{leagueData.teams.length}</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.date}>
          <Clock />
          <p>
            {getTimeFormatted(leagueData.draftRound.startDate)},{" "}
            {getDateFormatted(leagueData.draftRound.startDate, true)}
          </p>
        </div>

        {isJoined ? (
          <Button
            outlineButton
            onClick={(e) =>
              handleAppNavigation(
                e,
                navigate,
                applicationRoutes.league(
                  leagueData.tournament?._id,
                  leagueData._id
                )
              )
            }
          >
            View League
          </Button>
        ) : (
          <Button
            disabled={joining}
            useSpinnerWhenDisabled
            onClick={() =>
              leagueData.type === leagueTypeEnum.PRIVATE
                ? setShowJoinLeagueModal(true)
                : handleJoinLeague()
            }
          >
            Join League
          </Button>
        )}
      </div>
    </div>
  );
}

export default LeagueCard;
