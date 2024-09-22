import React from "react";
import styles from "./AllTournaments.module.scss";
import Button from "@/Components/Button/Button";

export default function AllTournaments() {
  return (
    <div className={`${styles.container} page-container`}>
      <h1 className={styles.main_heading}>All Tournaments</h1>
      <div className={styles.tournamentContainer}>
        <div className={styles.tournamentContainer_header}>
          <div>
            <h2 className={styles.tournament_header}>Tournaments name</h2>
            <p>Season</p>
          </div>
          <Button>Edit</Button>
        </div>
        <div className={styles.matchesDetails}>
          <h3>
            Matches <span>count</span>
          </h3>
          <div className={`${styles.matchesDetails_content} row`}>
            <div className={`${styles.singleMatchContainer} flex-col-xs`}>
              <div>Match Name</div>
              <a href="/">Match Link</a>
            </div>
            <div className={`${styles.singleMatchContainer} flex-col-xs`}>
              <div>Match Name</div>
              <a href="/">Match Link</a>
            </div>
            <div className={`${styles.singleMatchContainer} flex-col-xs`}>
              <div>Match Name</div>
              <a href="/">Match Link</a>
            </div>
            <div className={`${styles.singleMatchContainer} flex-col-xs`}>
              <div>Match Name</div>
              <a href="/">Match Link</a>
            </div>

          </div>
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
    </div>
  );
}
