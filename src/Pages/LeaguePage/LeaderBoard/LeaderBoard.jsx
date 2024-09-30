import React, { useMemo } from "react";

import Img from "@/Components/Img/Img";

import styles from "./LeaderBoard.module.scss";

function LeaderBoard({ teams = [], playerPoints = [] }) {
  const parsedTeams = useMemo(() => {
    return teams
      .map((team) => {
        const players = team.players.map((item) => {
          const p = playerPoints.find((e) => e.player === item._id);
          if (p?.points) item.points = p.points;
          else item.points = NaN;

          return item;
        });

        const teamPoints = players.reduce(
          (acc, curr) => acc + (curr.points || 0),
          0
        );

        return {
          ...team,
          players,
          teamPoints,
        };
      })
      .sort((a, b) => (a.teamPoints < b.teamPoints ? 1 : -1));
  }, [teams, playerPoints]);

  return (
    <div className={`page-container ${styles.container}`}>
      <p className="heading">Leader Board</p>

      <div className={styles.teams}>
        <div
          className={styles.team}
          style={{ border: "none", padding: "0 var(--var-spacing-sm)" }}
        >
          <div className={`${styles.left} flex`}></div>

          <div className={styles.right}>
            <p className={styles.label}>Score</p>
            <p className={styles.label}>Rank</p>
          </div>
        </div>

        {parsedTeams.map((team, i) => (
          <div className={styles.team} key={team._id}>
            <div className={`${styles.left} flex`}>
              <div className={styles.image}>
                <Img
                  src={team.owner?.profileImage}
                  usePLaceholderUserImageOnError
                />
              </div>
              <p className={styles.name}>{team.owner?.name}</p>
            </div>

            <div className={styles.right}>
              <p className={styles.score}>{team.teamPoints} </p>
              <p className={styles.rank}>{i + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderBoard;
