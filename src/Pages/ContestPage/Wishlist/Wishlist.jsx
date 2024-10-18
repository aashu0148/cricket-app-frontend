import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "react-feather";

import Spinner from "@/Components/Spinner/Spinner";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Img from "@/Components/Img/Img";

import { addPlayerToWishlist, removePlayerFromWishlist } from "@/apis/contests";

import styles from "./Wishlist.module.scss";

function Wishlist({
  className = "",
  contestId,
  allPlayers = [],
  currentPlayers = [],
  onPlayerAdded,
  onPlayerRemoved,
}) {
  const [removing, setRemoving] = useState([]);

  const handleAddNewPlayer = async (playerId) => {
    const player = allPlayers.find((e) => e._id === playerId);
    if (!player) return;

    const res = await addPlayerToWishlist({
      leagueId: contestId,
      playerId,
    });
    if (!res) return;

    toast.success(`${player.slug.split("-").join(" ")} added successfully`);
    onPlayerAdded(player);
  };

  const handleRemovePlayerFromWishlist = async (pid) => {
    if (removing.includes(pid)) return;

    setRemoving((p) => [...p, pid]);
    const res = await removePlayerFromWishlist({
      leagueId: contestId,
      playerId: pid,
    });
    setRemoving((p) => p.filter((item) => item !== pid));
    if (!res) return;

    onPlayerRemoved(pid);
  };

  return (
    <div className={`${className || ""} ${styles.container}`}>
      <InputSelect
        options={allPlayers
          .filter((p) => !currentPlayers.some((e) => e._id === p._id))
          .map((p) => ({ label: p.fullName, value: p._id }))}
        label="Add new Player to wishlist"
        placeholder="Search player"
        value=""
        onChange={(e) => handleAddNewPlayer(e.value)}
      />

      <div className={styles.players}>
        {currentPlayers.length ? (
          currentPlayers.map((player) => (
            <div className={styles.player} key={player._id}>
              <div className={`flex ${styles.left}`}>
                <div className={styles.image}>
                  <Img src={player.image} usePLaceholderUserImageOnError />
                </div>

                <p className={styles.name}>
                  {player.slug ? player.slug.split("-").join(" ") : player.name}
                </p>
              </div>
              <div className={styles.actions}>
                <div
                  title={"Remove from wishlist"}
                  className="delete-icon"
                  onClick={() => handleRemovePlayerFromWishlist(player._id)}
                >
                  {removing.includes(player._id) ? (
                    <Spinner small />
                  ) : (
                    <Trash2 />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>No players added to wishlist</p>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
