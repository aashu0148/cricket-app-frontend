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

        <div className={styles.card}>
          <h3>Average Scoring Rate (A.M.S.R)</h3>
          <p>
            Calculate the average scoring rate of the match: For example, if 300
            runs are scored in 40 overs in the match, then the average scoring
            rate is (300/240) which is 1.25. The average scoring rate should
            always be capped off at two decimal points. This is the baseline
            figure to calculate the Batting Strike Rate Bonus & the Bowling
            Economy Rate Bonus.
          </p>
        </div>

        <div className={styles.card}>
          <ul className={styles.bigList}>
            <div className="flex-col-xs">
              <li className={styles.title}>Run Points:</li>
              <p>
                1 run =<strong>{batting.runPoints} point</strong>
              </p>
            </div>

            <div className="flex-col-xs">
              <li className={styles.title}>Boundary Points:</li>
              <p>
                Batters earn extra points for hitting boundaries (fours and
                sixes). These points are determined based on the match's Average
                Match Scoring Rate (A.M.S.R):
              </p>

              <ul>
                {batting.boundaryPoints.map((boundary) => (
                  <li style={{ listStyle: "circle" }} key={boundary._id}>
                    If the average scoring rate of the match is between (
                    <strong>{boundary.minRate}</strong> and{" "}
                    <strong>{boundary.maxRate}</strong>) runs per ball then,
                    <br />
                    Every four hit: {boundary.four} points
                    <br />
                    Every six hit: {boundary.six} points
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-col-xs">
              <li className={styles.title}>Runs scored milestone bonus:</li>
              <p>
                Players earn milestone bonuses for reaching certain run
                thresholds during their innings. These bonuses are awarded based
                on the total runs they score:
              </p>
              <ul>
                {batting.runMilestoneBonus.milestones.map((milestone, i) => (
                  <li key={milestone._id}>
                    runs {/* {milestone.runsUpto == 0 ? "= " : "<= "} */}
                    <strong>
                      {i > 0
                        ? `${
                            batting.runMilestoneBonus.milestones[i - 1]
                              .runsUpto + 1
                          } - `
                        : ""}{" "}
                      {milestone.runsUpto}{" "}
                    </strong>
                    : <strong>{milestone.points} points</strong>
                  </li>
                ))}
              </ul>
              <p>
                There will be no negative runs scored milestone bonus for
                batters batting in positions{" "}
                <strong>
                  {batting.runMilestoneBonus.negativeRunsExemptPositions.join(
                    ", "
                  )}
                </strong>{" "}
                and for batters who have played less than 10 balls and are not
                out in their innings.
              </p>
            </div>

            <div className="flex-col-xs">
              <li className={styles.title}>Strike Rate Bonus:</li>
              <p>
                Batters are rewarded for maintaining a good strike rate. The
                bonus is determined by their batting position, number of balls
                faced, and the strike rate they maintain.
              </p>
              <p>
                Multiplier * (Runs Scored - (X * Balls))
                <br />
                Here X is the average scoring rate of the match.
                <br />
                The multiplier depends on the number of balls the batter faces
                in the match and their batting position.
              </p>

              <ul>
                {batting.strikeRateBonus.multiplierRanges
                  .map((e) => ({
                    ...e,
                    positions: e.battingPositions.join(", "),
                  }))
                  .reduce((acc, curr) => {
                    const index = acc.findIndex(
                      (e) => e.positions === curr.positions
                    );
                    if (index > -1) acc[index].data.push(curr);
                    else acc.push({ positions: curr.positions, data: [curr] });

                    return acc;
                  }, [])
                  .map((range) => (
                    <li key={range.positions}>
                      Batting Positions: <strong>{range.positions}</strong>
                      <ul>
                        {range.data.map((r, i) => (
                          <li key={i}>
                            For{" "}
                            <strong>
                              {" "}
                              {r.minBalls} - {r.maxBalls}{" "}
                            </strong>{" "}
                            balls faced, the multiplier is {r.multiplier}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
              </ul>
              <p>
                To qualify for strike rate bonuses, a minimum of{" "}
                <strong>{batting.strikeRateBonus.minBallsRequired}</strong>{" "}
                balls must be faced.
              </p>

              {/* <p>
                So, if a batter from the example match above scores 40 off 20
                balls.
                <br />
                Then he scores{" "}
                {
                  batting.strikeRateBonus.multiplierRanges.find(
                    (e) => e.maxBalls <= 20
                  )?.multiplier
                }
                *(40 - (1.25*20)) = 2.5*(40-25) = 37.5 points bonus for strike
                rate
              </p> */}
            </div>
          </ul>
        </div>
      </div>

      {/* Bowling Section */}
      <div className={styles.section}>
        <h2>Bowling</h2>

        <div className={styles.card}>
          <ul className={styles.bigList}>
            {/* Economy Rate Bonus */}
            <div className="flex-col-xs">
              <li className={styles.title}>Economy Rate Bonus:</li>
              <p>
                Bowlers are rewarded for maintaining a low economy rate. The
                bonus points are calculated based on the number of balls bowled
                and the economy rate they maintain.
              </p>
              <p>
                Multiplier * ((X * Balls) - Runs Conceded)
                <br />
                Here X is the average scoring rate of the match.
                <br />
                The multiplier is dependent on the number of balls bowled by the
                bowler in the match.
              </p>

              <ul>
                {bowling.economyRateBonus.multiplierRanges.map((range) => (
                  <li key={range._id}>
                    Between{" "}
                    <strong>
                      {range.minBallsBowled} - {range.maxBallsBowled}
                    </strong>{" "}
                    balls bowled, the multiplier is {range.multiplier}
                  </li>
                ))}
              </ul>

              <p>
                Minimum balls bowled to qualify for economy rate bonuses:{" "}
                <strong>
                  {bowling.economyRateBonus.minBowledBallsRequired}
                </strong>
                .
              </p>
            </div>

            {/* Wicket Points */}
            <div className="flex-col-xs">
              <li className={styles.title}>Wicket Points:</li>
              <p>
                Bowlers earn points for each wicket taken, and the points vary
                based on the dismissed batter's batting position. The following
                points apply:
              </p>
              <ul>
                {bowling.wicketPoints.map((wicket) => (
                  <li key={wicket._id}>
                    Batting Position:{" "}
                    <strong>
                      {wicket.minBattingPosition}-{wicket.maxBattingPosition}
                    </strong>
                    , <br />
                    Points: <strong>{wicket.points}</strong>, <br />
                    Runs Cap for extra points:{" "}
                    <strong>{wicket.runsCapForIncrementingPoints}</strong>,
                    Incremented Points:{" "}
                    <strong>{wicket.incrementedPoints}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dot Ball Points */}
            <div className="flex-col-xs">
              <li className={styles.title}>Dot Ball Points:</li>
              <p>
                Bowlers earn points for delivering dot balls (balls that result
                in no runs scored by the batting team). The points awarded
                depend on the A.M.S.R:
              </p>
              {bowling.dotBallPoints.map((dotBall) => (
                <p key={dotBall._id}>
                  If the average scoring rate of the match is between{" "}
                  <strong>
                    ( {dotBall.minRate} and {dotBall.maxRate})
                  </strong>{" "}
                  runs per ball then every dot ball ={" "}
                  <strong>{dotBall.points} point</strong>
                </p>
              ))}
            </div>

            {/* Wicket Milestone Bonus */}
            <div className="flex-col-xs">
              <li className={styles.title}>Wicket Milestone Bonus:</li>
              <p>
                Bowlers earn additional points for reaching wicket milestones.
                These bonuses are awarded based on the number of wickets taken:
              </p>
              <ul>
                {bowling.wicketMilestoneBonus.map((milestone) => (
                  <li key={milestone._id}>
                    <strong>
                      {milestone.minWickets === milestone.maxWickets
                        ? milestone.minWickets
                        : `${milestone.minWickets} - ${milestone.maxWickets}`}
                    </strong>{" "}
                    Wickets = <strong>{milestone.points}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </ul>
        </div>
      </div>

      {/* Fielding Section */}
      <div className={styles.section}>
        <h2>Fielding</h2>

        <div className={styles.card}>
          <p>
            Fielders earn points for their contributions in the field, including
            catches, stumpings, and direct-hit run-outs. The points awarded for
            fielding actions are as follows:
          </p>

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
