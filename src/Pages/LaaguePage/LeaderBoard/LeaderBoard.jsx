import React, { useMemo } from "react";

import styles from "./LeaderBoard.module.scss";

function LeaderBoard({ teams = [], playerPoints = [] }) {
  const parsedTeams = useMemo(() => {
    return teams.map((team) => {
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
    });
  }, [teams]);

  console.log(parsedTeams);

  return (
    <div className={`page-container ${styles.container}`}>
      <p className="heading">Leader Board</p>
    </div>
  );
}

export default LeaderBoard;
