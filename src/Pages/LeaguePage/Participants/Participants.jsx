import React, { useMemo, useState } from "react";
import { X } from "react-feather";

import Img from "@/Components/Img/Img";
import Button from "@/Components/Button/Button";

import styles from "./Participants.module.scss";

function Participants({
  participants = [],
  playerPoints = [],
  activeTurnUserId = "",
}) {
  const [selectedTeamOwnerId, setSelectedTeamOwnerId] = useState("");

  const selectedTeam = useMemo(() => {
    const team = participants.find(
      (team) => team.owner._id === selectedTeamOwnerId
    );
    if (!team) return { owner: {}, players: [] };

    const mappedPlayers = team.players
      .map((p) => ({
        ...p,
        points: playerPoints.find((e) => e.player === p._id)?.points,
      }))
      .sort((a, b) => (a.points > b.points ? -1 : 1));

    return {
      owner: team.owner,
      players: mappedPlayers,
    };
  }, [selectedTeamOwnerId, participants]);

  return (
    <div className={`flex-col-xs ${styles.container}`}>
      <p className="heading">Participants</p>

      <div className={`cards ${styles.cards}`}>
        {participants.map((team) => (
          <div
            key={team._id}
            className={`${
              activeTurnUserId === team.owner?._id ? styles.active : ""
            } ${styles.cardOuter}`}
          >
            {activeTurnUserId === team.owner?._id && (
              <p className={styles.turnTag}>Turn</p>
            )}
            <div className={`card ${styles.card}`}>
              <div className={styles.cardInner}>
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
                      onClick={() => setSelectedTeamOwnerId("")}
                    >
                      Hide Team
                    </Button>
                  ) : (
                    <Button
                      small
                      outlineButton
                      onClick={() => setSelectedTeamOwnerId(team.owner._id)}
                    >
                      View Team
                    </Button>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTeam.owner?._id && (
        <div className={styles.team}>
          <div className="spacious-head">
            <p className={styles.title}>
              {selectedTeam.owner?.name}
              {"'s"} team <span>{`(${selectedTeam.players?.length})`}</span>
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
