import React from "react";

import styles from "./PlayersPool.module.scss";

function PlayersPool({ players = [], playerPoints = [] }) {
  console.log(playerPoints, players);

  return <div className={styles.container}>PlayersPool</div>;
}

export default PlayersPool;
