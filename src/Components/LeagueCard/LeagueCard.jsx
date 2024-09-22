import React, { useState } from "react";
import { Clock, Lock } from "react-feather";
import { useSelector } from "react-redux";

import Button from "@/Components/Button/Button";
import JoinLeagueModal from "@/Components/JoinLeagueModal/JoinLeagueModal";

import { getDateFormatted, getTimeFormatted } from "@/utils/util";
import { leagueTypeEnum } from "@/utils/enums";

import styles from "./LeagueCard.module.scss";

function LeagueCard({ className = "", leagueData }) {
  const userDetails = useSelector((s) => s.user);
  const [showJoinLeagueModal, setShowJoinLeagueModal] = useState(false);

  const isOwner = leagueData.createdBy?._id === userDetails._id;
  const isJoined =
    leagueData.createdBy?._id === userDetails._id ||
    leagueData.teams.some((t) => t.owner?._id === userDetails._id);

  return (
    <div className={`${className || ""} ${styles.container}`}>
      {showJoinLeagueModal && (
        <JoinLeagueModal onClose={() => setShowJoinLeagueModal(false)} />
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
          <Button outlineButton>View League</Button>
        ) : (
          <Button onClick={() => setShowJoinLeagueModal(true)}>
            Join League
          </Button>
        )}
      </div>
    </div>
  );
}

export default LeagueCard;
