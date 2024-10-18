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
    text: "",
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

  timeLeft.text = `${("0" + timeLeft.days).slice(-2)}:${(
    "0" + timeLeft.hours
  ).slice(-2)}:${("0" + timeLeft.minutes).slice(-2)}:${(
    "0" + timeLeft.seconds
  ).slice(-2)}`;

  return timeLeft;
};

const Countdown = ({
  small = false,
  skipDays = false,
  skipHours = false,
  returnTextOnly = false,
  targetDate,
  onCountdownComplete,
}) => {
  const countdownInterval = useRef(null);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  const getText = () => {
    let skipPlace = 0;
    if (skipDays) skipPlace++;
    if (skipHours) skipPlace++;

    const arr = timeLeft.text.split(":");

    return arr.slice(skipPlace).join(":");
  };

  useEffect(() => {
    if (timeLeft.timeOver) {
      if (countdownInterval.current) {
        // interval was running before
        if (onCountdownComplete) onCountdownComplete();
      }

      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  }, [timeLeft.timeOver]);

  useEffect(() => {
    countdownInterval.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(countdownInterval.current);
  }, [targetDate]);

  return returnTextOnly ? (
    getText()
  ) : (
    <div className={`${small ? styles.small : ""} ${styles.countdown}`}>
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
