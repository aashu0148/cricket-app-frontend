import React, { useState, useEffect, useRef } from "react";

import styles from "./Countdown.module.scss";

const calculateTimeLeft = (date = "") => {
  const difference = new Date(date) - new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    timeOver: false,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      timeOver: false,
    };
  } else timeLeft.timeOver = true;

  return timeLeft;
};

const Countdown = ({ targetDate }) => {
  const countdownInterval = useRef();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft.timeOver) clearInterval(countdownInterval.current);
  }, [timeLeft.timeOver]);

  useEffect(() => {
    countdownInterval.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(countdownInterval.current);
  }, [targetDate]);

  return (
    <div className={styles.countdown}>
      <div className={styles.timeBlock}>
        <div className={styles.timeValue}>
          {timeLeft.days < 10 ? "0" + timeLeft.days : timeLeft.days}
        </div>
        <div className={styles.timeLabel}>days</div>
      </div>
      <div className={styles.timeBlock}>
        <div className={styles.timeValue}>
          {timeLeft.hours < 10 ? "0" + timeLeft.hours : timeLeft.hours}
        </div>
        <div className={styles.timeLabel}>hours</div>
      </div>
      <div className={styles.timeBlock}>
        <div className={styles.timeValue}>
          {timeLeft.minutes < 10 ? "0" + timeLeft.minutes : timeLeft.minutes}
        </div>
        <div className={styles.timeLabel}>mins</div>
      </div>
      <div className={styles.timeBlock}>
        <div className={styles.timeValue}>
          {timeLeft.seconds < 10 ? "0" + timeLeft.seconds : timeLeft.seconds}
        </div>
        <div className={styles.timeLabel}>secs</div>
      </div>
    </div>
  );
};

export default Countdown;
