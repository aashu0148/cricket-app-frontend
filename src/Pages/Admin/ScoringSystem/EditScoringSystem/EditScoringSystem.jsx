import React, { useCallback, useEffect, useState } from "react";
import { Trash2 } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";
import PageLoader from "@/Components/PageLoader/PageLoader";

import { getScoringSystemById } from "@/apis/scoringSystem";
import { applicationRoutes } from "@/utils/constants";
import { getUniqueId } from "@/utils/util";

import styles from "./EditScoringSystem.module.scss";

const infoTexts = {
  boundaryPoints: {
    four: "Points awarded for hitting a boundary (4 runs) based on the match's average scoring rate.",
    six: "Points awarded for hitting a maximum (6 runs) based on the match's average scoring rate.",
    minAMSR:
      "The minimum average match scoring rate (A.M.S.R) threshold for determining boundary points.",
    maxAMSR:
      "The maximum average match scoring rate (A.M.S.R) threshold for determining boundary points.",
  },
  milestones: {
    runsUpto:
      "The range of runs scored by a batter for which milestone points are awarded.",
    points:
      "The points awarded when a batter's runs fall within the corresponding 'Runs Upto' range.",
  },
  strikeRateBonusMultiplierRanges: {
    battingPositions:
      "The range of batting positions for which strike rate bonus multipliers are applied.",
    minimumBalls:
      "The minimum number of balls faced by a batter required to qualify for strike rate bonus points.",
    maximumBalls:
      "The maximum number of balls a batter can face to still qualify for a particular strike rate bonus multiplier.",
    multiplier:
      "The factor applied to calculate the strike rate bonus based on the number of balls faced and runs scored.",
  },
  wicketPoints: {
    minBattingPosition:
      "The minimum batting position of the batter whose wicket is taken, determining the base points for the wicket.",
    maxBattingPosition:
      "The maximum batting position of the batter whose wicket is taken, determining the base points for the wicket.",
    points:
      "The points awarded for taking the wicket of a batter within the defined batting positions.",
    runsCapForIncrementing:
      "The number of runs a batter must score for their wicket to be worth additional points.",
    incrementedPoints:
      "The additional points awarded if a batter surpasses the runs cap when they are dismissed.",
  },
  dotBallPoints: {
    minAMSR:
      "The minimum average match scoring rate (A.M.S.R) threshold for determining points awarded for dot balls (balls on which no runs are scored).",
    maxAMSR:
      "The maximum average match scoring rate (A.M.S.R) threshold for determining points awarded for dot balls.",
    points:
      "The points awarded for each dot ball delivered by a bowler, based on the average match scoring rate.",
  },
  wicketMilestones: {
    minWickets:
      "The minimum number of wickets taken by a bowler to qualify for a milestone bonus.",
    maxWickets:
      "The maximum number of wickets taken by a bowler to qualify for a higher milestone bonus.",
    points: "The points awarded when a bowler reaches the wicket milestone.",
  },
};

export default function EditScoringSystem() {
  const { scoringId } = useParams();
  const navigate = useNavigate();
  const [scoringData, setScoringData] = useState(null);
  const [battingData, setBattingData] = useState(scoringData?.batting || {});
  const [bowlingData, setBowlingData] = useState(scoringData?.bowling || {});
  const [fieldingData, setFieldingData] = useState(scoringData?.fielding || {});

  // ***************************** get scoring system by id ***************************

  const scoringSystem = async (id) => {
    if (!id) return;
    const res = await getScoringSystemById(id);
    if (!res) return;
    setScoringData(res.data);
    setBattingData(res.data.batting);
    setBowlingData(res.data.bowling);
    setFieldingData(res.data.fielding);
  };

  function handleBattingChange({
    val,
    field,
    index,
    subField,
    secondField,
    multipleFields = false,
  }) {
    let updatedField;

    if (multipleFields) {
      updatedField = {
        ...battingData[secondField],
        [field]: battingData[secondField][field].map((item, i) => {
          return i === index ? { ...item, [subField]: val } : item;
        }),
      };

      setBattingData((prev) => ({
        ...prev,
        [secondField]: updatedField,
      }));
    } else {
      updatedField = battingData[field].map((item, i) => {
        return i === index ? { ...item, [subField]: val } : item;
      });
    }

    setBattingData((prev) => ({ ...prev, [field]: updatedField }));
  }

  function handleBowlingChange({ val, field, subField, index }) {
    const updatedField = bowlingData[field].map((item, i) => {
      return i === index ? { ...item, [subField]: val } : item;
    });

    setBowlingData((prev) => ({ ...prev, [field]: updatedField }));
  }

  function handleAddition({ field, section, setFunction }) {
    const fieldsObj = section[field][0];

    const newObject = Object.keys(fieldsObj)
      .filter((item) => item !== "_id")
      .reduce((acc, item) => {
        acc[item] = undefined;
        return acc;
      }, {});

    const updatedField = [...section[field], newObject];

    setFunction((prev) => ({ ...prev, [field]: updatedField }));
  }

  // ********************************** Batting Section *******************************************

  const battingSection = (
    <div className={styles.section}>
      <h2 className={styles.mainHeading}>Batting</h2>
      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Boundary Points</h3>
        {/* ************************************ Boundary Points ****************************** */}
        {battingData.boundaryPoints?.map((boundary, index) => (
          <div key={index} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Four"
              value={boundary.four}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "boundaryPoints",
                  subField: "four",
                  index,
                })
              }
              labelInfo={infoTexts.boundaryPoints.four}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Six"
              value={boundary.six}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "boundaryPoints",
                  subField: "six",
                  index,
                })
              }
              labelInfo={infoTexts.boundaryPoints.six}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Min A.M.S.R"
              value={boundary.minRate}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "boundaryPoints",
                  subField: "minRate",
                  index,
                })
              }
              labelInfo={infoTexts.boundaryPoints.minAMSR}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Max A.M.S.R"
              value={boundary.maxRate}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "boundaryPoints",
                  subField: "maxRate",
                  index,
                })
              }
              labelInfo={infoTexts.boundaryPoints.maxAMSR}
            />
            <div className={`icon ${styles.deleteIcon}`}>
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            handleAddition({
              field: "boundaryPoints",
              section: battingData,
              setFunction: setBattingData,
            })
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>

      {/******************************************** Milestones **********************************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Milestones</h3>
        {battingData.runMilestoneBonus?.milestones?.map((milestone, index) => (
          <div key={milestone._id} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Runs Upto"
              value={milestone.runsUpto}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "milestones",
                  subField: "runsUpto",
                  index,
                  multipleFields: true,
                  secondField: "runMilestoneBonus",
                })
              }
              labelInfo={infoTexts.milestones.runsUpto}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Points"
              value={milestone.points}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "milestones",
                  subField: "points",
                  index,
                  multipleFields: true,
                  secondField: "runMilestoneBonus",
                })
              }
              labelInfo={infoTexts.milestones.points}
            />
            <div className={`icon ${styles.deleteIcon}`}>
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            handleAddition({
              field: "milestones",
              section: battingData.runMilestoneBonus,
              setFunction: setBattingData,
            })
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>

      {/*************************************************** Strike Rate Bonus ***********************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>
          Strike Rate Bonus - Multiplier Ranges
        </h3>
        {battingData.strikeRateBonus?.multiplierRanges?.map((range, index) => (
          <div key={range._id + index} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Batting Positions"
              value={range.battingPositions.join(", ")}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "multiplierRanges",
                  subField: "battingPositions",
                  index,
                  multipleFields: true,
                  secondField: "strikeRateBonus",
                })
              }
              labelInfo={
                infoTexts.strikeRateBonusMultiplierRanges.battingPositions
              }
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Minimum Balls"
              value={range.minBalls}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "multiplierRanges",
                  subField: "minBalls",
                  index,
                  multipleFields: true,

                  secondField: "strikeRateBonus",
                })
              }
              labelInfo={infoTexts.strikeRateBonusMultiplierRanges.minimumBalls}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Maximum Balls"
              value={range.maxBalls}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "multiplierRanges",
                  subField: "maxBalls",
                  index,
                  multipleFields: true,
                  secondField: "strikeRateBonus",
                })
              }
              labelInfo={infoTexts.strikeRateBonusMultiplierRanges.maximumBalls}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Multiplier"
              value={range.multiplier}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "multiplierRanges",
                  subField: "multiplier",
                  index,
                  multipleFields: true,
                  secondField: "strikeRateBonus",
                })
              }
              labelInfo={infoTexts.strikeRateBonusMultiplierRanges.multiplier}
            />
            <div className={`icon ${styles.deleteIcon}`}>
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button className={styles.link} outlineButton>
          + ADD
        </Button>{" "}
      </div>
    </div>
  );

  // ************************************* Bowling Section ******************************************

  const bowlingSection = (
    <div className={styles.section}>
      <h2 className={styles.mainHeading}>Bowling</h2>

      {/******************************************** Wicket Points ****************************/}
      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Wicket Points</h3>
        {bowlingData.wicketPoints?.map((wicket, index) => (
          <div key={wicket._id + index} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Min Batting Position"
              value={wicket.minBattingPosition}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPoints",
                  subField: "minBattingPosition",
                  index,
                })
              }
              labelInfo={infoTexts.wicketPoints.minBattingPosition}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Max Batting Position"
              value={wicket.maxBattingPosition}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPoints",
                  subField: "maxBattingPosition",
                  index,
                })
              }
              labelInfo={infoTexts.wicketPoints.maxBattingPosition}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Points"
              value={wicket.points}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPoints",
                  subField: "points",
                  index,
                })
              }
              labelInfo={infoTexts.wicketPoints.points}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Runs Cap For Incrementing"
              value={wicket.runsCapForIncrementingPoints}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPoints",
                  subField: "runsCapForIncrementingPoints",
                  index,
                })
              }
              labelInfo={infoTexts.wicketPoints.runsCapForIncrementing}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Incremented Points"
              value={wicket.incrementedPoints}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPoints",
                  subField: "incrementedPoints",
                  index,
                })
              }
              labelInfo={infoTexts.wicketPoints.incrementedPoints}
            />
            <div className={`icon ${styles.deleteIcon}`}>
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            handleAddition({
              field: "wicketPoints",
              section: bowlingData,
              setFunction: setBowlingData,
            })
          }
          outlineButton
        >
          + ADD
        </Button>{" "}
      </div>

      {/************************************************** Dot Ball Points **************************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Dot Ball Points</h3>
        {bowlingData.dotBallPoints?.map((dotBall, index) => (
          <div key={dotBall._id + index} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Min A.M.S.R"
              value={dotBall.minRate}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "dotBallPoints",
                  subField: "minRate",
                  index,
                })
              }
              labelInfo={infoTexts.dotBallPoints.minAMSR}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Max A.M.S.R"
              value={dotBall.maxRate}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "dotBallPoints",
                  subField: "maxRate",
                  index,
                })
              }
              labelInfo={infoTexts.dotBallPoints.maxAMSR}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Points"
              value={dotBall.points}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "dotBallPoints",
                  subField: "points",
                  index,
                })
              }
              labelInfo={infoTexts.dotBallPoints.points}
            />
            <div className={`icon ${styles.deleteIcon}`}>
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            handleAddition({
              field: "dotBallPoints",
              section: bowlingData,
              setFunction: setBowlingData,
            })
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>

      {/************************** Wicket Milestones ******************************************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Wicket Milestones</h3>

        {bowlingData.wicketMilestoneBonus?.map((milestone, index) => (
          <div key={milestone._id} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Min Wickets"
              value={milestone.minWickets}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketMilestoneBonus",
                  subField: "minWickets",
                  index,
                })
              }
              labelInfo={infoTexts.wicketMilestones.minWickets}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Max Wickets"
              value={milestone.maxWickets}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketMilestoneBonus",
                  subField: "maxWickets",
                  index,
                })
              }
              labelInfo={infoTexts.wicketMilestones.maxWickets}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Points"
              value={milestone.points}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketMilestoneBonus",
                  subField: "points",
                  index,
                })
              }
              labelInfo={infoTexts.wicketMilestones.points}
            />
            <div className={`icon ${styles.deleteIcon}`}>
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            handleAddition({
              field: "wicketMilestoneBonus",
              section: bowlingData,
              setFunction: setBowlingData,
            })
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>
    </div>
  );

  // ********************************** Fielding Section ******************************************

  const fieldingSection = (
    <div className={styles.section}>
      <h2 className={styles.mainHeading}>Fielding</h2>

      <div className={styles.subSection}>
        <div className={styles.subSection_row}>
          <InputControl
            placeholder="Type here"
            numericInput
            label="Catch Points"
            value={fieldingData.catchPoints}
            onChange={(e) =>
              setFieldingData((prev) => ({
                ...prev,
                catchPoints: e.target.valueAsNumber,
              }))
            }
          />
          <InputControl
            placeholder="Type here"
            numericInput
            label="Stumping Points"
            value={fieldingData.stumpingPoints}
            onChange={(e) =>
              setFieldingData((prev) => ({
                ...prev,
                stumpingPoints: e.target.valueAsNumber,
              }))
            }
          />
          <InputControl
            placeholder="Type here"
            numericInput
            label="Direct Hit Run Out Points"
            value={fieldingData.directHitRunOutPoints}
            onChange={(e) =>
              setFieldingData((prev) => ({
                ...prev,
                directHitRunOutPoints: e.target.valueAsNumber,
              }))
            }
          />
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (scoringId) {
      scoringSystem(scoringId);
    }
  }, [scoringId]);

  return !scoringData ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <div className="flex-col-xxs">
        <h2 className={`heading-big`}>Edit Scoring System</h2>
        <p className="shoulder">
          Edit Scoring System, define rules, and oversee the competition.
        </p>
      </div>

      <div className="flex-col-xs">
        <label className="label">Abbreviations</label>
        <div className="key-value">
          <label>A.M.S.R : </label>
          <p className="value">Average Match Scoring Rate</p>
        </div>
      </div>

      {battingSection}
      {bowlingSection}
      {fieldingSection}

      {/* Footer */}
      <div className="footer spacious-head">
        <Button
          cancelButton
          onClick={() => navigate(applicationRoutes.scoringSystem)}
        >
          Exit editing
        </Button>

        <Button>Save Edit</Button>
      </div>
    </div>
  );
}
