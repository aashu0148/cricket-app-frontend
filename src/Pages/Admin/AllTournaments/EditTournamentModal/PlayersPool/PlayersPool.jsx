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
    return players.filter((e) =>
      new RegExp(`${inputStr}`, "gi").test(e.fullName)
    );
  }, [inputStr, players]);

  return (
    <div className={styles.playersPool}>
      <div className={styles.tools}>
        <InputControl
          small
          placeholder="Enter name"
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

      {availablePlayersPool.map((player) => (
        <PlayerSmallCard
          key={player._id}
          hideScore
          showCountry
          playerData={player}
          showDeleteIcon
          onDeleteClick={() =>
            onPlayersUpdate(players.filter((e) => e._id !== player._id))
          }
        />
      ))}
      {new Array(6).fill(1).map((_, i) => (
        <FillerPlayerSmallCard key={i} />
      ))}
    </div>
  );
}

export default PlayersPool;
