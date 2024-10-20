import React from "react";

import Img from "@/Components/Img/Img";

import { playerRoleEnum } from "@/utils/enums";
import { ballIcon, batBallIcon, batIcon } from "@/utils/svgs";
import { getTooltipAttributes } from "@/utils/tooltip";

import styles from "./PlayerSmallCard.module.scss";

function PlayerSmallCard({
  playerData = {},
  isPlayerBreakdownAllowed = false,
  isBreakdownVisible = false,
  onHideBreakdown,
  onShowBreakdown,
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

      <Img
        src={playerData.image}
        usePLaceholderUserImageOnError
        alt={playerData.slug}
      />

      <div>
        <p className={styles.name} title={playerData.fullName}>
          {playerData.slug?.split("-")?.join(" ")}
        </p>

        <p className={styles.score}>
          score: <span>{playerData.points || "_"}</span>
        </p>

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
