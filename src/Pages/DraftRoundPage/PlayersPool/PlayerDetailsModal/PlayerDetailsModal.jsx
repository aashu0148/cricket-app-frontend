import React, { useEffect, useState } from "react";

import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";
import Spinner from "@/Components/Spinner/Spinner";
import Img from "@/Components/Img/Img";
import { PlayerStatsTable } from "@/Pages/Admin/PlayersPage/PlayersPage";

import { getPlayerById } from "@/apis/players";

import styles from "./PlayerDetailsModal.module.scss";

function PlayerDetailsModal({ playerId = "", playerData = {}, onClose }) {
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState({});

  const fetchPlayerDetails = async () => {
    const res = await getPlayerById(playerId);
    setLoading(false);
    if (!res) return;

    setPlayer(res.data);
  };

  useEffect(() => {
    if (playerData?._id) {
      setLoading(false);
      setPlayer(playerData);
    } else fetchPlayerDetails();
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <p className="heading">Player Information</p>

        {loading ? (
          <Spinner />
        ) : player?._id ? (
          <>
            <div className={styles.information}>
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
                  <span>({player.slug?.split("-")?.join(" ")})</span>
                </h2>
                <p className={styles.playerCountry}>{player.country}</p>
                <p className={styles.playingRole}>{player.playingRole}</p>
              </div>
            </div>

            {player.stats?.map((stat) => (
              <div key={stat._id} className={styles.stats}>
                <p className={styles.title}>{stat.heading}</p>

                <PlayerStatsTable statData={stat.data} />
              </div>
            ))}
          </>
        ) : (
          <p>Failed to get player details {":("}</p>
        )}
        <div className={"footer"}>
          <Button cancelButton onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default PlayerDetailsModal;
