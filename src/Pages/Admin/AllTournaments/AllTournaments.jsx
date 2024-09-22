import React, { useEffect, useState } from "react";

import Button from "@/Components/Button/Button";

import { getAllTournaments } from "@/apis/tournament";

import styles from "./AllTournaments.module.scss";
import { espnOrigin } from "@/utils/constants";
import { getMatchScoreCardUrl } from "@/utils/util";
import PageLoader from "@/Components/PageLoader/PageLoader";

export default function AllTournaments() {
  const [allTournaments, setAllTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTournaments() {
    const res = await getAllTournaments();

    setLoading(false);

    if (!res) return;

    setAllTournaments(res?.data);
  }

  const toCapitilizeString = (str) => {
    if (!str) return;

    const newString = str.split("-").join(" ");
    return newString
      .split(" ")
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(" ");
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return loading ? (
    <PageLoader fullPage/>
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
            <div className={styles.matchesDetails}>
              <h3>
                Matches <span>count</span>
              </h3>
              {tournament?.allMatches?.map((item) => (
                <div className={`${styles.matchesDetails_content} row`}>
                  <div className={`${styles.singleMatchContainer} flex-col-xs`}>
                    <div>{toCapitilizeString(item?.slug)}</div>
                    <a
                      href={getMatchScoreCardUrl({
                        tournamentSlug: tournament.slug,
                        tournamentObjectId: tournament.objectId,
                        matchSlug: item.slug,
                        matchObjectId: item.objectId,
                      })}
                      target="_blank"
                    >
                      Click Here
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.playerDetails}>
              <h3>
                Players <span>count</span>
              </h3>
              <div className={styles.playerDetails_content}>
                <div className={`${styles.singlePlayerContainer} flex-col-xs`}>
                  <img alt="imga"></img>
                  <p>Player Name</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
