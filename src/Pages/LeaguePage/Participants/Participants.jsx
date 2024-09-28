import React, { useState } from "react";

import Img from "@/Components/Img/Img";
import Button from "@/Components/Button/Button";

import styles from "./Participants.module.scss";
import { X } from "react-feather";

function Participants({
  participants = [],
  playerPoints = [],
  activeTurnUserId = "",
}) {
  const [selectedTeam, setSelectedTeam] = useState({
    owner: {},
    players: [],
  });

  const onTeamSelection = (team) => {
    const mappedPlayers = team.players
      .map((p) => ({
        ...p,
        points: playerPoints.find((e) => e.player === p._id)?.points,
      }))
      .sort((a, b) => (a.points > b.points ? -1 : 1));

    setSelectedTeam({
      owner: team.owner,
      players: mappedPlayers,
    });
  };

  return (
    <div className={`flex-col-xs ${styles.container}`}>
      <p className="heading">Participants</p>

      <div className={`cards ${styles.cards}`}>
        {participants.map((team) => (
          <div key={team._id} className={`card ${styles.card}`}>
            <div className={styles.image}>
              <Img
                usePLaceholderUserImageOnError
                src={team.owner.profileImage}
              />
            </div>
            <p className={styles.name}>{team.owner.name}</p>

            {team.players?.length > 0 ? (
              selectedTeam.owner._id === team.owner._id ? (
                <Button
                  small
                  cancelButton
                  onClick={() => setSelectedTeam({ owner: {}, players: [] })}
                >
                  Hide Team
                </Button>
              ) : (
                <Button
                  small
                  outlineButton
                  onClick={() => onTeamSelection(team)}
                >
                  View Team
                </Button>
              )
            ) : (
              ""
            )}
          </div>
        ))}
      </div>

      {selectedTeam.owner?._id && (
        <div className={styles.team}>
          <div className="spacious-head">
            <p className={styles.title}>
              {selectedTeam.owner?.name}
              {"'s"} team
            </p>

            <Button
              cancelButton
              small
              onClick={() => setSelectedTeam({ owner: {}, players: [] })}
            >
              <X /> hide
            </Button>
          </div>
          <div className={styles.playersOuter}>
            <div className={styles.players}>
              {selectedTeam.players.map((player) => (
                <div className={styles.player} key={player._id}>
                  <Img
                    src={player.image}
                    usePLaceholderUserImageOnError
                    alt={player.slug}
                  />

                  <div>
                    <p className={styles.name} title={player.fullName}>
                      {player.slug.split("-").join(" ")}
                    </p>

                    <p className={styles.score}>
                      score: <span>{player.points || "_"}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Participants;
