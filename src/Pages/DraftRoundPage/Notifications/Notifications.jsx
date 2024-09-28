import React from "react";

import { getTimeFormatted } from "@/utils/util";
import { useDraftRound } from "../util/DraftRoundContext";

import styles from "./Notifications.module.scss";
import Img from "@/Components/Img/Img";

function Notifications({ className = "" }) {
  const { room, notifications } = useDraftRound();

  const activeUsers = room.users;

  return (
    <div className={`${className} ${styles.container}`}>
      <div>
        <div className={styles.users}>
          {activeUsers.map((user) => (
            <div className={styles.user} key={user._id} title={user.name}>
              <div className={styles.image}>
                <Img
                  src={user.profileImage}
                  alt={user.name}
                  usePLaceholderUserImageOnError
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {notifications.length ? (
        [...notifications].reverse().map((item, i) => (
          <div className={styles.activity} key={item.title + i}>
            <p className={styles.title}>{item.title}</p>

            <p className={styles.desc}>
              {item.description}

              <span className={styles.time}>
                {getTimeFormatted(item.timestamp)}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p className={styles.empty}>No activity for now!</p>
      )}
    </div>
  );
}

export default Notifications;
