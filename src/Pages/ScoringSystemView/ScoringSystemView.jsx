import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLoader from "@/Components/PageLoader/PageLoader";
import PageNotFound from "@/Components/PageNotFound/PageNotFound";
import Logo from "@/Components/Navbar/Logo";

import { getScoringSystemById } from "@/apis/scoringSystem";

import styles from "./ScoringSystemView.module.scss";

const ScoringSystemView = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [scoringSystem, setScoringSystem] = useState({});

  const fetchScoringSystem = async () => {
    const res = await getScoringSystemById(id);
    setLoading(false);
    if (!res) return;

    setScoringSystem(res.data);
  };

  useEffect(() => {
    fetchScoringSystem();
  }, []);

  const { batting, bowling, fielding, name } = scoringSystem;

  return loading ? (
    <PageLoader fullPage />
  ) : !scoringSystem._id ? (
    <PageNotFound title="Data not found" desc="Invalid Scoring System ID" />
  ) : (
    <div className={styles.scoringSystemContainer}>
      <Logo />
      <h1 className={styles.title}>{name} Scoring System</h1>

      {/* Batting Section */}
      <div className={styles.section}>
        <h2>Batting</h2>
        <p>
          Batters earn points based on their runs scored, boundary hits,
          milestones reached, and strike rate during a match.
        </p>

        {/* Run Points */}
        <div className={styles.card}>
          <h3>Run Points</h3>
          <p>
            For every run scored, the batter earns:{" "}
            <strong>{batting.runPoints} point</strong> per run.
          </p>
        </div>

        {/* Boundary Points */}
        <div className={styles.card}>
          <h3>Boundary Points</h3>
          <p>
            Batters earn extra points for hitting boundaries (fours and sixes).
            These points are determined based on the match's Average Match
            Scoring Rate (A.M.S.R):
          </p>
          {batting.boundaryPoints.map((boundary) => (
            <div key={boundary._id}>
              <p>
                For an A.M.S.R between {boundary.minRate} and {boundary.maxRate}
                :
              </p>
              <ul>
                <li>
                  <strong>{boundary.four} points</strong> for hitting a four
                </li>
                <li>
                  <strong>{boundary.six} points</strong> for hitting a six
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Run Milestone Bonus */}
        <div className={styles.card}>
          <h3>Run Milestone Bonus</h3>
          <p>
            Players earn milestone bonuses for reaching certain run thresholds
            during their innings. These bonuses are awarded based on the total
            runs they score:
          </p>
          <ul>
            {batting.runMilestoneBonus.milestones.map((milestone) => (
              <li key={milestone._id}>
                When the batter scores up to{" "}
                <strong>{milestone.runsUpto} runs</strong>: they earn an
                additional <strong>{milestone.points} points</strong>
              </li>
            ))}
          </ul>
          <p>
            Please note that negative deductions for low run rates do not apply
            to the following batting positions:{" "}
            <strong>
              {batting.runMilestoneBonus.negativeRunsExemptPositions.join(", ")}
            </strong>
            .
          </p>
        </div>

        {/* Strike Rate Bonus */}
        <div className={styles.card}>
          <h3>Strike Rate Bonus</h3>
          <p>
            Batters are rewarded for maintaining a good strike rate. The bonus
            is determined by their batting position, number of balls faced, and
            the strike rate they maintain. The following bonuses apply:
          </p>
          <ul>
            {batting.strikeRateBonus.multiplierRanges.map((range) => (
              <li key={range._id}>
                Batting Positions:{" "}
                <strong>{range.battingPositions.join(", ")}</strong>, Balls
                Faced:{" "}
                <strong>
                  {range.minBalls}-{range.maxBalls}
                </strong>
                , Bonus Multiplier: <strong>{range.multiplier}x</strong>
              </li>
            ))}
          </ul>
          <p>
            To qualify for strike rate bonuses, a minimum of{" "}
            <strong>{batting.strikeRateBonus.minBallsRequired}</strong> balls
            must be faced.
          </p>
        </div>
      </div>

      {/* Bowling Section */}
      <div className={styles.section}>
        <h2>Bowling</h2>
        <p>
          Bowlers are rewarded for their economy rate, wickets taken, dot balls,
          and milestone achievements in a match.
        </p>

        {/* Economy Rate Bonus */}
        <div className={styles.card}>
          <h3>Economy Rate Bonus</h3>
          <p>
            Bowlers are rewarded for maintaining a low economy rate. The bonus
            points are calculated based on the number of balls bowled and the
            economy rate they maintain:
          </p>
          <ul>
            {bowling.economyRateBonus.multiplierRanges.map((range) => (
              <li key={range._id}>
                Balls Bowled:{" "}
                <strong>
                  {range.minBallsBowled}-{range.maxBallsBowled}
                </strong>
                , Bonus Multiplier: <strong>{range.multiplier}x</strong>
              </li>
            ))}
          </ul>
          <p>
            Minimum balls bowled to qualify for economy rate bonuses:{" "}
            <strong>{bowling.economyRateBonus.minBowledBallsRequired}</strong>.
          </p>
        </div>

        {/* Wicket Points */}
        <div className={styles.card}>
          <h3>Wicket Points</h3>
          <p>
            Bowlers earn points for each wicket taken, and the points vary based
            on the dismissed batter's batting position. The following points
            apply:
          </p>
          <ul>
            {bowling.wicketPoints.map((wicket) => (
              <li key={wicket._id}>
                Batting Position:{" "}
                <strong>
                  {wicket.minBattingPosition}-{wicket.maxBattingPosition}
                </strong>
                , Points: <strong>{wicket.points}</strong>, Runs Cap for extra
                points: <strong>{wicket.runsCapForIncrementingPoints}</strong>,
                Incremented Points: <strong>{wicket.incrementedPoints}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Dot Ball Points */}
        <div className={styles.card}>
          <h3>Dot Ball Points</h3>
          <p>
            Bowlers earn points for delivering dot balls (balls that result in
            no runs scored by the batting team). The points awarded depend on
            the A.M.S.R:
          </p>
          {bowling.dotBallPoints.map((dotBall) => (
            <p key={dotBall._id}>
              For A.M.S.R between{" "}
              <strong>
                {dotBall.minRate} and {dotBall.maxRate}
              </strong>
              : <strong>{dotBall.points} point</strong> per dot ball.
            </p>
          ))}
        </div>

        {/* Wicket Milestone Bonus */}
        <div className={styles.card}>
          <h3>Wicket Milestone Bonus</h3>
          <p>
            Bowlers earn additional points for reaching wicket milestones. These
            bonuses are awarded based on the number of wickets taken:
          </p>
          <ul>
            {bowling.wicketMilestoneBonus.map((milestone) => (
              <li key={milestone._id}>
                Wickets Taken:{" "}
                <strong>
                  {milestone.minWickets}-{milestone.maxWickets}
                </strong>
                , Bonus Points: <strong>{milestone.points}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fielding Section */}
      <div className={styles.section}>
        <h2>Fielding</h2>
        <p>
          Fielders earn points for their contributions in the field, including
          catches, stumpings, and direct-hit run-outs. The points awarded for
          fielding actions are as follows:
        </p>
        <div className={styles.card}>
          <p>
            <strong>Catches:</strong> {fielding.catchPoints} points per catch
          </p>
          <p>
            <strong>Stumpings:</strong> {fielding.stumpingPoints} points per
            stumping
          </p>
          <p>
            <strong>Direct-hit Run Outs:</strong>{" "}
            {fielding.directHitRunOutPoints} points per direct-hit run-out
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoringSystemView;
