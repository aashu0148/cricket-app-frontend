import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "react-feather";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Spinner from "@/Components/Spinner/Spinner";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Img from "@/Components/Img/Img";
import Checkbox from "@/Components/Checkbox/Checkbox";

import {
  addPlayerToWishlist,
  removePlayerFromWishlist,
  updateWishlistOrder,
} from "@/apis/contests";
import { playerRoleEnum } from "@/utils/enums";
import { dragIcon } from "@/utils/svgs";
import { capitalizeText } from "@/utils/util";

import styles from "./Wishlist.module.scss";

function SortablePlayer({ player, handleRemovePlayerFromWishlist, removing }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.player}>
      <div className={`flex ${styles.left}`}>
        <div className={styles.dragHandle} {...listeners} {...attributes}>
          {dragIcon}
        </div>

        <div className={styles.image}>
          <Img src={player.image} usePLaceholderUserImageOnError />
        </div>

        <div>
          <p className={styles.name}>
            {player.slug ? player.slug.split("-").join(" ") : player.name}
          </p>
          <label className={styles.role}>{player.playingRole || "_"}</label>
        </div>
      </div>
      <div className={styles.actions}>
        <div
          title={"Remove from wishlist"}
          className="delete-icon"
          onClick={() => handleRemovePlayerFromWishlist(player._id)}
        >
          {removing.includes(player._id) ? <Spinner small /> : <Trash2 />}
        </div>
      </div>
    </div>
  );
}

function Wishlist({
  className = "",
  contestId,
  allPlayers = [],
  currentPlayers = [],
  onPlayerAdded,
  onPlayerRemoved,
}) {
  const [removing, setRemoving] = useState([]);
  const [selectedRoleType, setSelectedRoleType] = useState([]);
  const [playersOrder, setPlayersOrder] = useState(
    currentPlayers.map((p) => p.player._id)
  );

  const parsedPlayers = useMemo(() => {
    return allPlayers
      .filter((p) =>
        selectedRoleType.length
          ? selectedRoleType.includes(p.player.role)
          : true
      )
      .map((p) => ({ ...p.player, ...(p.squad || {}) }));
  }, [allPlayers, selectedRoleType]);

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

  const handleWishlistReOrder = async (newOrder) => {
    const res = await updateWishlistOrder({
      leagueId: contestId,
      playersOrder: newOrder,
    });
    if (!res) return;

    toast.success("Players re-ordered");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPlayersOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        handleWishlistReOrder(newOrder);

        return newOrder;
      });
    }
  };

  useEffect(() => {
    setPlayersOrder(currentPlayers.map((p) => p.player._id));
  }, [currentPlayers]);

  return (
    <div className={`${className || ""} ${styles.container}`}>
      <div className="flex-col-xs">
        <label className="label">Add to Wishlist</label>

        <div className={styles.filter}>
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

        <InputSelect
          options={parsedPlayers
            .filter((p) => !currentPlayers.some((e) => e.player._id === p._id))
            .map((p) => ({
              label: capitalizeText(
                `${p.slug.split("-").join(" ")} [_tn]`
              ).replace("_tn", p.teamName),
              value: p._id,
            }))
            .sort((a, b) => (a.label < b.label ? -1 : 1))}
          placeholder="Search player"
          value=""
          onChange={(e) => handleAddNewPlayer(e.value)}
        />
      </div>

      <div className={styles.players}>
        {currentPlayers.length ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={playersOrder}
              strategy={verticalListSortingStrategy}
            >
              {playersOrder.map((playerId) => {
                const player = currentPlayers.find(
                  (p) => p.player._id === playerId
                );
                if (!player) return null; // happens when we remove a player and its updated in currentPlayers but not in playersOrder for one particular render cycle

                return (
                  <SortablePlayer
                    key={player._id}
                    player={player}
                    handleRemovePlayerFromWishlist={
                      handleRemovePlayerFromWishlist
                    }
                    removing={removing}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        ) : (
          <p className={styles.empty}>No players added to wishlist</p>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
