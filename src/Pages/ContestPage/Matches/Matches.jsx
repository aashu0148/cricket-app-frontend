import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "react-feather";

import Img from "@/Components/Img/Img";

import { playerRoleEnum } from "@/utils/enums";
import { capitalizeText } from "@/utils/util";
import { ballIcon, batBallIcon, batIcon } from "@/utils/svgs";

import styles from "./Matches.module.scss";

function Matches({ completedMatches = [], players = [] }) {
  const [selectedMatches, setSelectedMatches] = useState([]);

  const parsedMatches = useMemo(() => {
    return completedMatches
      .map((e) => {
        const newPlayerPoints = e.playerPoints.map((p) => {
          const matchingPlayer =
            players.find((item) => item.player._id === p.player) || {};

          return {
            ...matchingPlayer.player,
            ...p,
            ...(matchingPlayer.squad || {}),
          };
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
        const remaining = newPlayerPoints
          .filter((e) => !Object.values(playerRoleEnum).includes(e.role))
          .sort((a, b) => (a.slug < b.slug ? -1 : 1));

        const allPoints = [
          ...batters,
          ...allRounders,
          ...bowlers,
          ...remaining,
        ].map((player) => {
          let battingPoints = 0;
          let bowlingPoints = 0;
          let fieldingPoints = 0;

          player.breakdown.forEach((stat) => {
            if (
              [
                "Run points",
                "Fours",
                "Sixes",
                "Run milestone",
                "Strike rate bonus",
              ].some((e) => e.toLowerCase() === stat.label.toLowerCase())
            ) {
              battingPoints += stat.points;
            }
            if (
              [
                "Dot ball",
                "Economy rate bonus",
                "Wicket",
                "Wicket milestone",
              ].some((e) => e.toLowerCase() === stat.label.toLowerCase())
            ) {
              bowlingPoints += stat.points;
            }
            if (
              ["Catch", "Stumping", "Runout"].some(
                (e) => e.toLowerCase() === stat.label.toLowerCase()
              )
            ) {
              fieldingPoints += stat.points;
            }
          });

          return {
            ...player,
            battingPoints,
            bowlingPoints,
            fieldingPoints,
          };
        });

        const allBreakdownLabels = allPoints
          .reduce(
            (acc, curr) => [
              ...acc,
              ...(curr?.breakdown?.length
                ? curr.breakdown.map((e) => e.label)
                : []),
            ],
            []
          )
          .filter((e, i, self) => self.indexOf(e) === i);

        const order = [
          "Run points",
          "Run milestone",
          "Fours",
          "Sixes",
          "Strike rate bonus",
          "Wicket",
          "Wicket milestone",
          "Economy rate bonus",
          "Dot ball",
          "Catch",
          "Run out",
          "Stumping",
        ];
        const remainingLabels = allBreakdownLabels.filter(
          (e) => !order.some((item) => item.toLowerCase() === e.toLowerCase())
        );

        return {
          ...e,
          playerPoints: allPoints,
          breakdownLabels: [...order, ...remainingLabels],
        };
      })
      .sort((a, b) => (new Date(a.startDate) < new Date(b.startDate) ? -1 : 1));
  }, [players, completedMatches]);

  const getPlayerNameCell = (player, i) => {
    return (
      <td
        className={`sticky left-0 ${
          i % 2 === 0 ? "bg-primary-200" : "bg-100"
        } ${styles.name}`}
      >
        {player.role === playerRoleEnum.BATTER
          ? batIcon
          : player.role === playerRoleEnum.ALLROUNDER
          ? batBallIcon
          : player.role === playerRoleEnum.BOWLER
          ? ballIcon
          : ""}
        {player.slug?.split("-")?.join(" ")} <span>[{player.teamName}]</span>
      </td>
    );
  };

  return (
    <div className={styles.container}>
      {/* <p className="heading">Matches</p> */}

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
                  {capitalizeText(match.slug.split("-").join(" ")).replace(
                    "Vs",
                    "vs"
                  )}
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
              <>
                <div
                  className="flex-col-xs"
                  style={{ padding: "0 var(--var-spacing-sm)" }}
                >
                  <p>Average Match Scoring Rate: {match.amsr}</p>
                  <div className={styles.teams}>
                    <div className={styles.team}>
                      <Img
                        isEspnImage
                        usePlaceholderImageOnError
                        src={match.teams[0].image}
                        alt={match.teams[0].name}
                      />
                      <span className={styles.name}>{match.teams[0].name}</span>
                    </div>
                    <span className={styles.vs}>vs</span>
                    <div className={styles.team}>
                      <Img
                        isEspnImage
                        usePlaceholderImageOnError
                        src={match.teams[1].image}
                        alt={match.teams[1].name}
                      />
                      <span className={styles.name}>{match.teams[1].name}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.tableOuter}>
                  <div className={styles.overlayTable}></div>
                  <table className={`${styles.table}`}>
                    <thead>
                      <tr>
                        <th className="sticky left-0 bg-primary-200">Name</th>
                        <th>Total</th>
                        <th>Batting</th>
                        <th>Bowling</th>
                        {match.breakdownLabels.map((label) => (
                          <th key={label}>{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {match.playerPoints
                        .sort((a, b) => b.points - a.points)
                        .map((player, i) => (
                          <tr key={player._id}>
                            {getPlayerNameCell(player, i)}
                            <td>{player.points}</td>
                            <td>{player.battingPoints}</td>
                            <td>{player.bowlingPoints}</td>
                            {match.breakdownLabels?.map((label) => (
                              <td key={label}>
                                {
                                  player.breakdown.find(
                                    (e) => e.label === label
                                  )?.points
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;
