import React, { useMemo, useState } from "react";
import { X } from "react-feather";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import InputControl from "@/Components/InputControl/InputControl";
import Img from "@/Components/Img/Img";
import Button from "@/Components/Button/Button";
import Checkbox from "@/Components/Checkbox/Checkbox";

import { useDraftRound } from "../util/DraftRoundContext";
import { playerRoleEnum, socketEventsEnum } from "@/utils/enums";
import { sleep } from "@/utils/util";

import styles from "./PlayersPool.module.scss";

function PlayersPool({ teams = [], players = [], playerPoints = [] }) {
  const userDetails = useSelector((s) => s.user);
  const { contestId } = useParams();

  const { socket } = useDraftRound();
  const [searchInput, setSearchInput] = useState("");
  const [picking, setPicking] = useState(false);
  const [selectedRoleType, setSelectedRoleType] = useState([]);

  const parsedPlayers = useMemo(() => {
    const allPlayers = [...players]
      .map((item) => {
        const p = playerPoints.find((e) => e.player === item._id);
        if (p?.points) item.points = p.points;
        else item.points = NaN;

        const pickedBy = teams.find((e) =>
          e.players.some((p) => p._id === item._id)
        );
        item.pickedBy = pickedBy?.owner;

        return item;
      })
      .filter((e) => new RegExp(`${searchInput}`, "gi").test(e.fullName))
      .filter((p) =>
        selectedRoleType.length ? selectedRoleType.includes(p.role) : true
      );

    const available = allPlayers
      .filter((e) => !e.pickedBy)
      .sort((a, b) => ((a.points || 0) > (b.points || 0) ? -1 : 1));
    const picked = allPlayers
      .filter((e) => e.pickedBy)
      .sort((a, b) => ((a.points || 0) > (b.points || 0) ? -1 : 1));

    return [...available, ...picked];
  }, [teams, players, searchInput, selectedRoleType]);

  const handlePickClick = async (player) => {
    setPicking(player._id);
    socket.emit(socketEventsEnum.pickPlayer, {
      userId: userDetails._id,
      leagueId: contestId,
      pickedPlayerId: player._id,
    });

    await sleep(2000);
    setPicking("");
  };

  return (
    <div className={styles.container}>
      <p className="heading">Tournament Players</p>

      <div className={styles.search}>
        <InputControl
          placeholder="Search name"
          label="Filter by name"
          icon={
            <div
              className={`icon ${styles.icon}`}
              onClick={() => {
                console.log("click");
                setSearchInput("");
              }}
            >
              <X />
            </div>
          }
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="flex gap-md">
        <Checkbox
          label="Batter"
          checked={selectedRoleType.includes(playerRoleEnum.BATTER)}
          onChange={(e) =>
            setSelectedRoleType((prev) =>
              e
                ? [...prev, playerRoleEnum.BATTER]
                : prev.filter((r) => r !== playerRoleEnum.BATTER)
            )
          }
        />
        <Checkbox
          label="Bowler"
          checked={selectedRoleType.includes(playerRoleEnum.BOWLER)}
          onChange={(e) =>
            setSelectedRoleType((prev) =>
              e
                ? [...prev, playerRoleEnum.BOWLER]
                : prev.filter((r) => r !== playerRoleEnum.BOWLER)
            )
          }
        />
        <Checkbox
          label="All Rounder"
          checked={selectedRoleType.includes(playerRoleEnum.ALLROUNDER)}
          onChange={(e) =>
            setSelectedRoleType((prev) =>
              e
                ? [...prev, playerRoleEnum.ALLROUNDER]
                : prev.filter((r) => r !== playerRoleEnum.ALLROUNDER)
            )
          }
        />
      </div>

      <div className={styles.playersOuter}>
        <div className={styles.players}>
          {parsedPlayers.map((player) => (
            <div
              className={`${player.pickedBy?._id ? styles.picked : ""} ${
                styles.player
              }`}
              key={player._id}
            >
              {player.pickedBy?._id && (
                <div className={styles.pickedImage}>
                  <Img
                    title={player.pickedBy?.name}
                    src={player.pickedBy.profileImage}
                    usePLaceholderUserImageOnError
                    alt={player.pickedBy?.name}
                  />
                </div>
              )}

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
                  {player.role.toLowerCase() || "_"}
                </p>
                <p className={styles.score}>
                  score: <span>{player.points || "_"}</span>
                </p>
              </div>

              {player.pickedBy?._id ? (
                <Button small disabled>
                  Picked
                </Button>
              ) : (
                <Button
                  disabled={picking}
                  useSpinnerWhenDisabled={player._id === picking}
                  small
                  onClick={() => handlePickClick(player)}
                >
                  Pick
                </Button>
              )}
            </div>
          ))}

          {new Array(5).fill(1).map((_, i) => (
            <div
              className={styles.player}
              key={i}
              style={{ padding: "0", opacity: "0", pointerEvents: "none" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayersPool;
