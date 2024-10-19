import React, { useMemo, useState } from "react";

import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";
import ScrapePlayer from "./ScrapePlayer/ScrapePlayer";

import { searchPlayerByName } from "@/apis/players";

import styles from "./PlayersPage.module.scss";
import Img from "@/Components/Img/Img";

function StatsTable({ statData = [] }) {
  const allKeys = useMemo(() => {
    return statData
      .map((e) => Object.keys(e))
      .reduce((acc, curr) => [...acc, ...curr], [])
      .filter((e, i, self) => self.indexOf(e) === i)
      .filter((k) => k !== "_id");
  }, [statData]);

  return (
    <table className={styles.statsTable}>
      <thead>
        <tr>
          {allKeys.map((k) => (
            <th>{k}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {statData.map((stat, index) => (
          <tr key={index}>
            {allKeys.map((k) => (
              <td>{stat[k] || "_"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PlayersPage() {
  const [showScrapePlayerModal, setScrapePlayerModal] = useState(false);
  const [inputStr, setInputStr] = useState("");
  const [players, setPlayers] = useState([]);
  const [searching, setSearching] = useState(false);

  const fetchPlayers = async () => {
    setSearching(true);
    setPlayers([]);
    const res = await searchPlayerByName(inputStr);
    setSearching(false);
    if (!res) return;

    setPlayers(res.data);
  };

  return (
    <div className={`page-container`}>
      {showScrapePlayerModal && (
        <ScrapePlayer onClose={() => setScrapePlayerModal(false)} />
      )}
      <div className="spacious-head">
        <p className="heading-big">All Players</p>

        <Button outlineButton onClick={() => setScrapePlayerModal(true)}>
          Insert Player
        </Button>
      </div>
      <div className="flex align-end">
        <InputControl
          label={"Search Players"}
          placeholder="Enter player name"
          small
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          disabled={searching}
          onKeyDown={(e) => (e.key === "Enter" ? fetchPlayers() : "")}
        />

        <Button
          disabled={searching}
          useSpinnerWhenDisabled
          onClick={fetchPlayers}
        >
          Search
        </Button>
      </div>

      <div className={styles.playersContainer}>
        {players.map((player) => (
          <div key={player._id} className={styles.playerCard}>
            <div className={styles.playerHeader}>
              <Img
                title={player.slug}
                usePLaceholderUserImageOnError
                src={player.image}
                alt={player.name}
                className={styles.playerImage}
              />

              <div className={styles.playerInfo}>
                <h2 className={styles.playerName}>
                  {player.fullName}{" "}
                  <span>({player.slug.split("-").join(" ")})</span>
                </h2>
                <p className={styles.playerCountry}>{player.country}</p>
                <p className={styles.playingRole}>{player.playingRole}</p>
              </div>
            </div>

            {player.stats.map((stat) => (
              <div key={stat._id} className={styles.playerStats}>
                <p className={styles.title}>{stat.heading}</p>

                <StatsTable statData={stat.data} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayersPage;
