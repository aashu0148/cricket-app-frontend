import React from "react";

import { getTimeFormatted } from "@/utils/util";

import styles from "./Notifications.module.scss";

function Notifications({ className = "", notifications = [] }) {
  return (
    <div className={`${className} ${styles.container}`}>
      {notifications.length ? (
        [...notifications].reverse().map((item, i) => (
          <div className={styles.activity} key={item.title + i}>
            <div className={styles.top}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.time}>
                {getTimeFormatted(item.timestamp, true)}
              </p>
            </div>
            <p className={styles.desc}>{item.description}</p>
          </div>
        ))
      ) : (
        <p className={styles.empty}>No activity for now!</p>
      )}
    </div>
  );
}

export default Notifications;
