import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";
import { getScoringSystemById } from "@/apis/scoringSystem";

import styles from "./EditScoringSystem.module.scss";
import { applicationRoutes } from "@/utils/constants";
import { Trash2 } from "react-feather";
import PageLoader from "@/Components/PageLoader/PageLoader";

export default function EditScoringSystem() {
  const { scoringId } = useParams();
  const navigate = useNavigate();
  const [scoringData, setScoringData] = useState(null);

  // ********************************** Batting Section *******************************************

  function BattingSection({ data }) {
    const battingData = data?.batting;

    return (
      <div className={styles.section}>
        <h2 className={styles.mainHeading}>Batting</h2>
        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>Boundary Points</h3>
          {/* ************************************ Boundary Points ****************************** */}
          {battingData.boundaryPoints.map((boundary, index) => (
            <div key={index} className={styles.subSection_row}>
              <InputControl numericInput label="Four" value={boundary.four} />
              <InputControl numericInput label="Six" value={boundary.six} />
              <InputControl
                numericInput
                label="Min Rate"
                value={boundary.minRate}
              />
              <InputControl
                numericInput
                label="Max Rate"
                value={boundary.maxRate}
              />
              <div className={styles.deleteIcon}>
                <Trash2 color="red" />
              </div>
            </div>
          ))}
          <Button className={styles.link}> + ADD</Button>{" "}
        </div>

        {/******************************************** Milestones **********************************/}

        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>Milestones</h3>
          {battingData.runMilestoneBonus.milestones.map((milestone, index) => (
            <div key={milestone._id} className={styles.subSection_row}>
              <InputControl
                numericInput
                label="Runs Upto"
                value={milestone.runsUpto}
              />
              <InputControl
                numericInput
                label="Points"
                value={milestone.points}
              />
              <div className={styles.deleteIcon}>
                <Trash2 color="red" />
              </div>
            </div>
          ))}
          <Button className={styles.link}> + ADD</Button>{" "}
        </div>

        {/*************************************************** Strike Rate Bonus ***********************/}

        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>
            Strike Rate Bonus - Multiplier Ranges
          </h3>
          {battingData.strikeRateBonus.multiplierRanges.map((range, index) => (
            <div key={range._id} className={styles.subSection_row}>
              <InputControl
                numericInput
                label="Batting Positions"
                value={range.battingPositions.join(", ")}
              />
              <InputControl
                numericInput
                label="Minimum Balls"
                value={range.minBalls}
              />
              <InputControl
                numericInput
                label="Maximum Balls"
                value={range.maxBalls}
              />
              <InputControl
                numericInput
                label="Multiplier"
                value={range.multiplier}
              />
              <div className={styles.deleteIcon}>
                <Trash2 color="red" />
              </div>
            </div>
          ))}
          <Button className={styles.link}> + ADD</Button>{" "}
        </div>
      </div>
    );
  }

  // ************************************* Bowling Section ******************************************

  function BowlingSection({ data }) {
    const bowlingData = data?.bowling;

    return (
      <div className={styles.section}>
        <h2 className={styles.mainHeading}>Bowling</h2>

        {/******************************************** Wicket Points ****************************/}
        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>Wicket Points</h3>
          {bowlingData.wicketPoints.map((wicket, index) => (
            <div key={wicket._id} className={styles.subSection_row}>
              <InputControl
                numericInput
                label="Min Batting Position"
                value={wicket.minBattingPosition}
              />
              <InputControl
                numericInput
                label="Max Batting Position"
                value={wicket.maxBattingPosition}
              />
              <InputControl numericInput label="Points" value={wicket.points} />
              <InputControl
                numericInput
                label="Runs Cap For Incrementing"
                value={wicket.runsCapForIncrementingPoints}
              />
              <InputControl
                numericInput
                label="Incremented Points"
                value={wicket.incrementedPoints}
              />
              <div className={styles.deleteIcon}>
                <Trash2 color="red" />
              </div>
            </div>
          ))}
          <Button className={styles.link}> + ADD</Button>{" "}
        </div>

        {/************************************************** Dot Ball Points **************************/}

        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>Dot Ball Points</h3>
          {bowlingData.dotBallPoints.map((dotBall, index) => (
            <div key={dotBall._id} className={styles.subSection_row}>
              <InputControl
                numericInput
                label="Min Rate"
                value={dotBall.minRate}
              />
              <InputControl
                numericInput
                label="Max Rate"
                value={dotBall.maxRate}
              />
              <InputControl
                numericInput
                label="Points"
                value={dotBall.points}
              />
              <div className={styles.deleteIcon}>
                <Trash2 color="red" />
              </div>
            </div>
          ))}
          <Button className={styles.link}> + ADD</Button>
        </div>

        {/************************** Wicket Milestones ******************************************/}

        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>Wicket Milestones</h3>

          {bowlingData.wicketMilestoneBonus.map((milestone, index) => (
            <div key={milestone._id} className={styles.subSection_row}>
              <InputControl
                numericInput
                label="Min Wickets"
                value={milestone.minWickets}
              />
              <InputControl
                numericInput
                label="Max Wickets"
                value={milestone.maxWickets}
              />
              <InputControl
                numericInput
                label="Points"
                value={milestone.points}
              />
              <div className={styles.deleteIcon}>
                <Trash2 color="red" />
              </div>
            </div>
          ))}
          <Button className={styles.link}> + ADD</Button>
        </div>
      </div>
    );
  }

  // ********************************** Fielding Section ******************************************

  function FieldingSection({ data }) {
    const fieldingData = data?.fielding;

    return (
      <div className={styles.section}>
        <h2 className={styles.mainHeading}>Fielding</h2>

        <div className={styles.subSection}>
          <div className={styles.subSection_row}>
            <InputControl
              numericInput
              label="Catch Points"
              value={fieldingData.catchPoints}
            />
            <InputControl
              numericInput
              label="Stumping Points"
              value={fieldingData.stumpingPoints}
            />
            <InputControl
              numericInput
              label="Direct Hit Run Out Points"
              value={fieldingData.directHitRunOutPoints}
            />
          </div>
        </div>
      </div>
    );
  }

  // ***************************** get scoring system by id ***************************

  const scoringSystem = async (id) => {
    if (!id) return;
    const res = await getScoringSystemById(id);
    if (!res) return;
    console.log("edit scoring system", res);
    setScoringData(res.data); // Set data to state
  };

  // **************************************** Normal Functions ************************************

  useEffect(() => {
    if (scoringId) {
      scoringSystem(scoringId);
    }
  }, [scoringId]);

  return !scoringData ? (
    <PageLoader />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <div className="flex-col-xxs">
        <h2 className={styles.heading}>Edit Scoring System</h2>
        <p>Edit Scoring System, define rules, and oversee the competition.</p>
      </div>

      {/* Batting Section */}
      <BattingSection data={scoringData} />

      {/* Bowling Section */}
      <BowlingSection data={scoringData} />

      {/* Fielding Section */}
      <FieldingSection data={scoringData} />

      {/* Footer */}
      <div className="footer">
        <Button
          cancelButton
          onClick={() => navigate(applicationRoutes.scoringSystem)}
        >
          Exit
        </Button>
        <Button>Edit</Button>
      </div>
    </div>
  );
}
