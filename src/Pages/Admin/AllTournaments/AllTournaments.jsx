import React, { useEffect, useState } from "react";

import Button from "@/Components/Button/Button";

import { getAllTournaments } from "@/apis/tournament";

import styles from "./AllTournaments.module.scss";

import PageLoader from "@/Components/PageLoader/PageLoader";
import { CheckCircle } from "react-feather";
import { getMatchScoreCardUrl } from "@/utils/util";

export default function AllTournaments() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const Card = ({ data, tournament }) => {
    const completed = tournament.completedMatches.filter(
      (item) => item.objectId === data.objectId
    );

    const matchName = toCapitilizeString(data?.slug);
    const matchLink = getMatchScoreCardUrl({
      tournamentSlug: tournament.slug,
      tournamentObjectId: tournament.objectId,
      matchSlug: data.slug,
      matchObjectId: data.objectId,
    });

    return (
      <div className={styles.card}>
        <div className={styles.card_header}>
          <h2>{matchName}</h2>
          {completed.length ? (
            <span>
              <CheckCircle size={"18px"} color="green" />
            </span>
          ) : (
            ""
          )}
        </div>
        <div className={styles.card_content}>
          <a href={matchLink}>Click Here</a>
          {completed.length ? (
            <div className={styles.card_status}>
              <p>Status</p>
              <h4>{data.statusText}</h4>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  const PlayerCard = ({ player }) => {
    return (
      <div className={styles.playerCard}>
        <div className={styles.imageContainer}>
          <img
            src={player.image}
            alt={player.name}
            className={styles.playerImage}
          />
        </div>
        <h3 className={styles.playerName}>{player.name}</h3>
        <p className={styles.playerCountry}>({player.country})</p>
      </div>
    );
  };

  // ******************************* Functions ****************************

  async function fetchTournaments() {
    const res = await getAllTournaments();

    setLoading(false);

    if (!res) return;

    setAllTournaments(res?.data);
  }

  function toCapitilizeString(str) {
    if (!str) return;

    const newString = str.split("-").join(" ");
    return newString
      .split(" ")
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(" ");
  }

  useEffect(() => {
    fetchTournaments();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`${styles.container} page-container`}>
      <h1 className={"gradient-text"}>All Tournaments</h1>

      {allTournaments?.length &&
        allTournaments?.map((tournament) => (
          <div className={styles.tournamentContainer} key={tournament._id}>
            <div className={styles.tournamentContainer_header}>
              <div>
                <h2 className={styles.tournament_header}>{tournament?.name}</h2>
                <p>{tournament?.season}</p>
              </div>
              <Button>Edit</Button>
            </div>

            {/************************************ Match Details ************************/}
            <div className={styles.matchesDetails}>
              <h3>
                Match Count <span>{tournament.allMatches.length}</span>
              </h3>
              <div className={styles.matchesDetails_content_scroll}>
                {tournament.allMatches.map((item) => (
                  <div>
                    <Card data={item} tournament={tournament} />
                  </div>
                ))}
              </div>
            </div>

            {/************************************ Player Details ************************/}
            <div className={styles.matchesDetails}>
              <h3>
                Players Count <span>{tournament.players.length}</span>
              </h3>
              <div className={styles.player_scrollBar}>
                {tournament.players.map((item) => (
                  <div>
                    <PlayerCard player={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
