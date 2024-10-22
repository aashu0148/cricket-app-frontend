import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "react-feather";

import PlayerSmallCard, {
  FillerPlayerSmallCard,
} from "@/Components/PlayerSmallCard/PlayerSmallCard";

import { playerRoleEnum } from "@/utils/enums";

import styles from "./Matches.module.scss";

function Matches({ completedMatches = [], players = [] }) {
  const [selectedMatches, setSelectedMatches] = useState([]);

  const parsedMatches = useMemo(() => {
    return completedMatches.map((e) => {
      const newPlayerPoints = e.playerPoints.map((p) => {
        const matchingPlayer =
          players.find((item) => item.player._id === p.player) || {};

        return { ...matchingPlayer.player, ...p };
      });

      const batters = newPlayerPoints
        .filter((e) => e.role === playerRoleEnum.BATTER)
        .sort((a, b) => (a.slug < b.slug ? -1 : 1));
      const bowlers = newPlayerPoints
        .filter((e) => e.role === playerRoleEnum.BOWLER)
        .sort((a, b) => (a.slug < b.slug ? -1 : 1));
      const allRounders = newPlayerPoints
        .filter((e) => e.role === playerRoleEnum.ALLROUNDER)
        .sort((a, b) => (a.slug < b.slug ? -1 : 1));

      return {
        ...e,
        playerPoints: [...batters, ...allRounders, ...bowlers],
      };
    });
  }, [players, completedMatches]);

  console.log(parsedMatches);

  return (
    <div className={styles.container}>
      <p className="heading">Matches</p>

      <div className={styles.matches}>
        {parsedMatches.map((match) => (
          <div
            key={match._id}
            className={`${
              selectedMatches.includes(match._id) ? styles.selected : ""
            } ${styles.match}`}
          >
            <div
              className={styles.top}
              onClick={() =>
                setSelectedMatches((prev) =>
                  prev.includes(match._id)
                    ? prev.filter((e) => e !== match._id)
                    : [...prev, match._id]
                )
              }
            >
              <div className={styles.left}>
                <p className={styles.title}>
                  {match.slug.split("-").join(" ")}
                </p>
              </div>

              <div className={styles.icon}>
                {selectedMatches.includes(match._id) ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </div>
            </div>

            {selectedMatches.includes(match._id) && (
              <div className={styles.players}>
                {match.playerPoints.map((player) => (
                  <PlayerSmallCard key={player._id} playerData={player} />
                ))}

                {new Array(5).fill(1).map((_, i) => (
                  <FillerPlayerSmallCard key={i} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;
