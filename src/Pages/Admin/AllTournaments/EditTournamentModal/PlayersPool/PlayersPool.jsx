import React, { useMemo, useState } from "react";
import { X } from "react-feather";

import PlayerSmallCard, {
  FillerPlayerSmallCard,
} from "@/Components/PlayerSmallCard/PlayerSmallCard";
import InputControl from "@/Components/InputControl/InputControl";

import styles from "./PlayersPool.module.scss";

function PlayersPool({ players = [], onPlayersUpdate }) {
  const [inputStr, setInputStr] = useState("");

  const availablePlayersPool = useMemo(() => {
    const searchRegex = new RegExp(`${inputStr}`, "gi");
    return players.filter(
      (e) =>
        searchRegex.test(e.player?.fullName) ||
        searchRegex.test(e.player?.country) ||
        searchRegex.test(e.player?.teamName) ||
        searchRegex.test(e.squad?.teamName)
    );
  }, [inputStr, players]);

  return (
    <div className={styles.playersPool}>
      <div className={styles.tools}>
        <InputControl
          small
          placeholder="Search by player name"
          label="Find player"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          icon={
            <div className="icon" onClick={() => setInputStr("")}>
              {" "}
              <X />{" "}
            </div>
          }
        />
      </div>

      {availablePlayersPool.map((item) => (
        <PlayerSmallCard
          key={item._id}
          squadData={item.squad}
          hideScore
          showCountry
          playerData={item.player}
          showDeleteIcon
          onDeleteClick={() =>
            onPlayersUpdate(players.filter((e) => e._id !== item._id))
          }
        />
      ))}
      {new Array(9).fill(1).map((_, i) => (
        <FillerPlayerSmallCard key={i} />
      ))}
    </div>
  );
}

export default PlayersPool;
