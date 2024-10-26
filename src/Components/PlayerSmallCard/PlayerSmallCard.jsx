import React from "react";
import { X } from "react-feather";

import Img from "@/Components/Img/Img";
import Spinner from "../Spinner/Spinner";

import { playerRoleEnum } from "@/utils/enums";
import { ballIcon, batBallIcon, batIcon } from "@/utils/svgs";
import { getTooltipAttributes } from "@/utils/tooltip";

import styles from "./PlayerSmallCard.module.scss";

function PlayerSmallCard({
  squadData = {},
  showDeleteIcon = false,
  isDeleting = false,
  onDeleteClick,
  hideScore = false,
  showCountry = false,
  playerData = {},
  isPlayerBreakdownAllowed = false,
  isBreakdownVisible = false,
  onHideBreakdown,
  onShowBreakdown,
  bottomJSX,
}) {
  return (
    <div className={styles.player} key={playerData._id}>
      <div
        className={styles.roleIcon}
        {...getTooltipAttributes({ text: playerData.playingRole })}
      >
        {playerData.role === playerRoleEnum.ALLROUNDER
          ? batBallIcon
          : playerData.role === playerRoleEnum.BATTER
          ? batIcon
          : playerData.role === playerRoleEnum.BOWLER
          ? ballIcon
          : ""}
      </div>
      {showDeleteIcon && (
        <div
          className={styles.delete}
          onClick={() => (isDeleting ? "" : onDeleteClick())}
        >
          {isDeleting ? <Spinner small /> : <X />}
        </div>
      )}

      <Img
        src={playerData.image}
        usePLaceholderUserImageOnError
        alt={playerData.slug}
      />

      <div>
        <p className={styles.name} title={playerData.fullName}>
          {playerData.slug?.split("-")?.join(" ")}
        </p>
        {showCountry && (
          <p className={styles.score}>
            <span>{playerData.country}</span>
          </p>
        )}

        {squadData?.teamName && (
          <p className={styles.score}>
            <span>({squadData.teamName})</span>
          </p>
        )}

        {!hideScore && (
          <p className={styles.score}>
            score: <span>{playerData.points || "_"}</span>
          </p>
        )}

        {isPlayerBreakdownAllowed && (
          <p
            className={styles.smallBtn}
            onClick={() =>
              isBreakdownVisible ? onHideBreakdown() : onShowBreakdown()
            }
            style={{
              color: isBreakdownVisible ? "var(--var-color-title)" : "",
            }}
          >
            {isBreakdownVisible ? "Hide " : ""}
            Breakdown
          </p>
        )}

        {bottomJSX}
      </div>
    </div>
  );
}

export function FillerPlayerSmallCard() {
  return (
    <div
      className={styles.player}
      style={{ padding: "0", opacity: "0", pointerEvents: "none" }}
    />
  );
}

export default PlayerSmallCard;
