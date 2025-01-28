import React, { useEffect, useMemo, useState } from "react";
import { X } from "react-feather";

import Img from "@/Components/Img/Img";
import Button from "@/Components/Button/Button";
import Countdown from "@/Components/Countdown/Countdown";
import PlayerSmallCard, {
  FillerPlayerSmallCard,
} from "@/Components/PlayerSmallCard/PlayerSmallCard";

import styles from "./Participants.module.scss";

function Participants({
  participants = [],
  playerPoints = [],
  activeTurnUserId = "",
  turnDir = "",
  lastTurnTimestamp = "",
  completedMatches = [],
  allPlayersWithPoints = [],
}) {
  const [targetDate, setTargetDate] = useState(new Date());
  const [selectedTeamOwnerId, setSelectedTeamOwnerId] = useState("");
  const [selectedPLayerIdForBreakdown, setSelectedPlayerIdForBreakdown] =
    useState("");

  const selectedTeam = useMemo(() => {
    const team = participants.find(
      (team) => team.owner._id === selectedTeamOwnerId
    );
    if (!team) return { owner: {}, players: [] };

    const mappedPlayers = team.players
      .map((p) => {
        const playerId = p?._id || p;
        const player = allPlayersWithPoints.find((e) => e._id === playerId);
        if (!player) return p;
        return player;
      })
      .sort((a, b) => (a.points > b.points ? -1 : 1));

    return {
      owner: team.owner,
      players: mappedPlayers,
      name: team.name,
    };
  }, [selectedTeamOwnerId, participants]);

  const selectedPlayerBreakdown = useMemo(() => {
    const matches = completedMatches.filter((m) =>
      m.playerPoints.some((p) => p.player === selectedPLayerIdForBreakdown)
    );

    const playerMatches = matches.map((m) => {
      const { _id, endDate, slug, startDate, statusText, teams } = m;
      const points = m.playerPoints.find(
        (p) => p.player === selectedPLayerIdForBreakdown
      ).points;

      let name = slug.split("-").join(" ").toLowerCase();
      name = name.replace("vs", "");
      name = name.replace(teams[0]?.name?.toLowerCase(), "");
      name = name.replace(teams[1]?.name?.toLowerCase(), "");

      return {
        _id,
        slug,
        title: name.trim(),
        startDate,
        endDate,
        statusText,
        teams,
        points,
      };
    });

    const player = selectedTeam.players.find(
      (e) => e._id === selectedPLayerIdForBreakdown
    );

    return {
      player,
      matches: playerMatches.sort((a, b) =>
        new Date(a.endDate) < new Date(b.endDate) ? -1 : 1
      ),
    };
  }, [selectedPLayerIdForBreakdown, participants, completedMatches]);

  useEffect(() => {
    const lastTurnOn = lastTurnTimestamp
      ? new Date(lastTurnTimestamp).getTime()
      : Date.now();

    setTargetDate(new Date(lastTurnOn + 119 * 1000)); // around 120 sec
  }, [activeTurnUserId, turnDir, lastTurnTimestamp]);

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
              <>
                <p className={styles.turnTag}>Turn</p>
                <p className={styles.timer}>
                  <Countdown
                    skipDays
                    skipHours
                    returnTextOnly
                    targetDate={targetDate}
                  />
                </p>
              </>
            )}
            <div className={`card ${styles.card}`}>
              <div className={styles.cardInner}>
                <div className={styles.image}>
                  <Img
                    usePLaceholderUserImageOnError
                    src={team.owner.profileImage}
                  />
                </div>
                <p className={styles.name} title={team.owner.name}>
                  {team.owner.name}
                </p>

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
        <>
          <div className={styles.section}>
            <div className="spacious-head">
              <p className={styles.title}>
                {selectedTeam.name || `${selectedTeam.owner?.name}'s team `}{" "}
                <span>{` (${selectedTeam.players?.length})`}</span>
              </p>

              <Button
                cancelButton
                small
                onClick={() => setSelectedTeamOwnerId("")}
              >
                <X /> hide
              </Button>
            </div>
            <div className={styles.playersOuter}>
              <div className={styles.players}>
                {selectedTeam.players
                  .map((e) => ({ ...e, points: e.points || 0 }))
                  .sort((a, b) => (a.points > b.points ? -1 : 1))
                  .map((player) => (
                    <PlayerSmallCard
                      key={player._id}
                      showCountry
                      playerData={player}
                      isPlayerBreakdownAllowed={completedMatches.length > 0}
                      isBreakdownVisible={
                        selectedPLayerIdForBreakdown === player._id
                      }
                      onShowBreakdown={() =>
                        setSelectedPlayerIdForBreakdown(player._id)
                      }
                      onHideBreakdown={() =>
                        setSelectedPlayerIdForBreakdown("")
                      }
                    />
                  ))}

                {new Array(6).fill(1).map((_, i) => (
                  <FillerPlayerSmallCard key={i} />
                ))}
              </div>
            </div>
          </div>

          {selectedPLayerIdForBreakdown && (
            <div className={styles.section}>
              <div className="spacious-head">
                <p className={styles.title}>
                  Points Breakdown:{" "}
                  <span>
                    {selectedPlayerBreakdown.player?.slug?.split("-").join(" ")}
                  </span>
                </p>

                <Button
                  cancelButton
                  small
                  onClick={() => setSelectedPlayerIdForBreakdown("")}
                >
                  <X /> hide
                </Button>
              </div>
              <div className={styles.matches}>
                {selectedPlayerBreakdown.matches.map((match) => (
                  <div key={match._id} className={styles.match}>
                    <p className={styles.title} title={match.title}>
                      {match.title}
                    </p>
                    <div className={styles.teams}>
                      <div className={styles.team}>
                        <Img
                          isEspnImage
                          usePlaceholderImageOnError
                          src={match.teams[0].image}
                          alt={match.teams[0].name}
                        />
                        <span className={styles.name}>
                          {match.teams[0].name}
                        </span>
                      </div>
                      <span className={styles.vs}>vs</span>
                      <div className={styles.team}>
                        <Img
                          isEspnImage
                          usePlaceholderImageOnError
                          src={match.teams[1].image}
                          alt={match.teams[1].name}
                        />
                        <span className={styles.name}>
                          {match.teams[1].name}
                        </span>
                      </div>
                    </div>

                    <p className={styles.text}>Scored: {match.points}</p>
                  </div>
                ))}

                {new Array(4).fill(1).map((_, i) => (
                  <div
                    key={i}
                    className={styles.match}
                    style={{
                      padding: "0",
                      opacity: "0",
                      pointerEvents: "none",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Participants;
