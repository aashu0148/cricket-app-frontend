import React, { useCallback, useEffect, useState } from "react";
import { Trash, Trash2, X } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";
import PageLoader from "@/Components/PageLoader/PageLoader";
import SimpleArrayEdit from "./SimpleArrayEdit";

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
  const [errors, setErrors] = useState({
    batting: {},
    bowling: {},
    fielding: {},
  });

  // ***************************** get scoring system by id ***************************

  function validateForm() {
    const battingErrors = {};
    const bowlingErrors = {};
    const fieldingErrors = {};

    // Batting validation
    if (isNaN(battingData.runPoints) || battingData.runPoints < 0) {
      battingErrors.runPoints = "Run points must be a positive number.";
    }

    if (battingData.boundaryPoints) {
      battingData.boundaryPoints.forEach((boundary, index) => {
        if (isNaN(boundary.minRate) || boundary.minRate < 0) {
          battingErrors[`boundaryPoints_${index}_minRate`] =
            "Minimum rate must be 0 or higher.";
        }
        if (isNaN(boundary.maxRate) || boundary.maxRate < boundary.minRate) {
          battingErrors[`boundaryPoints_${index}_maxRate`] =
            "Maximum rate must be greater than or equal to the minimum rate.";
        }
        if (isNaN(boundary.four) || boundary.four < 0) {
          battingErrors[`boundaryPoints_${index}_four`] =
            "Points for hitting a four must be a positive number.";
        }
        if (isNaN(boundary.six) || boundary.six < 0) {
          battingErrors[`boundaryPoints_${index}_six`] =
            "Points for hitting a six must be a positive number.";
        }
      });
    }

    if (battingData.runMilestoneBonus) {
      battingData.runMilestoneBonus.milestones.forEach((milestone, index) => {
        if (isNaN(milestone.runsUpto) || milestone.runsUpto < 0) {
          battingErrors[`runMilestoneBonus_${index}_runsUpto`] =
            "Milestone runs must be a positive number.";
        }
        if (isNaN(milestone.points) || milestone.points < 0) {
          battingErrors[`runMilestoneBonus_${index}_points`] =
            "Milestone points must be a positive number.";
        }
      });

      if (battingData.runMilestoneBonus.negativeRunsExemptPositions) {
        const invalidPositions =
          battingData.runMilestoneBonus.negativeRunsExemptPositions.filter(
            (pos) => isNaN(pos) || pos < 1 || pos > 11
          );
        if (invalidPositions.length > 0) {
          battingErrors.negativeRunsExemptPositions =
            "Positions must be integers between 1 and 11.";
        }
      }
    }

    if (battingData.strikeRateBonus) {
      battingData.strikeRateBonus.multiplierRanges.forEach((range, index) => {
        if (
          !range.battingPositions.every(
            (pos) => !isNaN(pos) && pos >= 1 && pos <= 11
          )
        ) {
          battingErrors[`strikeRateBonus_${index}_battingPositions`] =
            "Batting positions must be integers between 1 and 11.";
        }
        if (isNaN(range.minBalls) || range.minBalls < 1) {
          battingErrors[`strikeRateBonus_${index}_minBalls`] =
            "Minimum balls must be at least 1.";
        }
        if (isNaN(range.maxBalls) || range.maxBalls < range.minBalls) {
          battingErrors[`strikeRateBonus_${index}_maxBalls`] =
            "Maximum balls must be greater than or equal to minimum balls.";
        }
        if (isNaN(range.multiplier) || range.multiplier < 0) {
          battingErrors[`strikeRateBonus_${index}_multiplier`] =
            "Multiplier must be a positive number.";
        }
      });
    }

    // Bowling validation
    if (bowlingData.wicketPoints) {
      bowlingData.wicketPoints.forEach((wicket, index) => {
        if (
          isNaN(wicket.minBattingPosition) ||
          wicket.minBattingPosition < 1 ||
          wicket.minBattingPosition > 11
        ) {
          bowlingErrors[`wicketPoints_${index}_minBattingPosition`] =
            "Minimum batting position must be between 1 and 11.";
        }
        if (
          isNaN(wicket.maxBattingPosition) ||
          wicket.maxBattingPosition < wicket.minBattingPosition ||
          wicket.maxBattingPosition > 11
        ) {
          bowlingErrors[`wicketPoints_${index}_maxBattingPosition`] =
            "Maximum batting position must be greater than or equal to minimum batting position, and no more than 11.";
        }
        if (isNaN(wicket.points) || wicket.points < 0) {
          bowlingErrors[`wicketPoints_${index}_points`] =
            "Wicket points must be a positive number.";
        }
        if (
          wicket.runsCapForIncrementingPoints !== undefined &&
          (isNaN(wicket.runsCapForIncrementingPoints) ||
            wicket.runsCapForIncrementingPoints < 0)
        ) {
          bowlingErrors[`wicketPoints_${index}_runsCapForIncrementingPoints`] =
            "Runs cap for incrementing points must be a positive number.";
        }
        if (
          wicket.incrementedPoints !== undefined &&
          (isNaN(wicket.incrementedPoints) || wicket.incrementedPoints < 0)
        ) {
          bowlingErrors[`wicketPoints_${index}_incrementedPoints`] =
            "Incremented points must be a positive number.";
        }
      });
    }

    if (bowlingData.dotBallPoints) {
      bowlingData.dotBallPoints.forEach((dotBall, index) => {
        if (isNaN(dotBall.minRate) || dotBall.minRate < 0) {
          bowlingErrors[`dotBallPoints_${index}_minRate`] =
            "Minimum rate must be 0 or higher.";
        }
        if (isNaN(dotBall.maxRate) || dotBall.maxRate < dotBall.minRate) {
          bowlingErrors[`dotBallPoints_${index}_maxRate`] =
            "Maximum rate must be greater than or equal to the minimum rate.";
        }
        if (isNaN(dotBall.points) || dotBall.points < 0) {
          bowlingErrors[`dotBallPoints_${index}_points`] =
            "Points for dot balls must be a positive number.";
        }
      });
    }

    if (bowlingData.wicketMilestoneBonus) {
      bowlingData.wicketMilestoneBonus.forEach((milestone, index) => {
        if (isNaN(milestone.minWickets) || milestone.minWickets < 0) {
          bowlingErrors[`wicketMilestoneBonus_${index}_minWickets`] =
            "Minimum wickets must be a positive number.";
        }
        if (
          isNaN(milestone.maxWickets) ||
          milestone.maxWickets < milestone.minWickets
        ) {
          bowlingErrors[`wicketMilestoneBonus_${index}_maxWickets`] =
            "Maximum wickets must be greater than or equal to minimum wickets.";
        }
        if (isNaN(milestone.points) || milestone.points < 0) {
          bowlingErrors[`wicketMilestoneBonus_${index}_points`] =
            "Milestone points must be a positive number.";
        }
      });
    }

    if (
      bowlingData.economyRateBonus &&
      bowlingData.economyRateBonus.multiplierRanges
    ) {
      bowlingData.economyRateBonus.multiplierRanges.forEach((range, index) => {
        if (isNaN(range.minBallsBowled) || range.minBallsBowled < 1) {
          bowlingErrors[`economyRateBonus_${index}_minBallsBowled`] =
            "Minimum balls bowled must be at least 1.";
        }
        if (
          isNaN(range.maxBallsBowled) ||
          range.maxBallsBowled < range.minBallsBowled
        ) {
          bowlingErrors[`economyRateBonus_${index}_maxBallsBowled`] =
            "Maximum balls bowled must be greater than or equal to minimum balls bowled.";
        }
        if (isNaN(range.multiplier) || range.multiplier < 0) {
          bowlingErrors[`economyRateBonus_${index}_multiplier`] =
            "Multiplier for economy rate bonus must be a positive number.";
        }
      });
    }

    // Fielding validation
    if (isNaN(fieldingData.catchPoints) || fieldingData.catchPoints < 0) {
      fieldingErrors.catchPoints = "Catch points must be a positive number.";
    }

    if (isNaN(fieldingData.stumpingPoints) || fieldingData.stumpingPoints < 0) {
      fieldingErrors.stumpingPoints =
        "Stumping points must be a positive number.";
    }

    if (
      isNaN(fieldingData.directHitRunOutPoints) ||
      fieldingData.directHitRunOutPoints < 0
    ) {
      fieldingErrors.directHitRunOutPoints =
        "Direct hit run-out points must be a positive number.";
    }

    const isBattingError = Object.keys(battingErrors).length > 0;
    const isBowlingError = Object.keys(bowlingErrors).length > 0;
    const isFieldingError = Object.keys(fieldingErrors).length > 0;

    setErrors({
      batting: battingErrors,
      bowling: bowlingErrors,
      fielding: fieldingErrors,
    });

    if (isBattingError || isBowlingError || isFieldingError) return false;
    return true;
  }

  const handleSubmission = async () => {
    if (!validateForm()) return;

    console.log("Validation successful");
  };

  const fetchScoringSystem = async () => {
    const res = await getScoringSystemById(scoringId);
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

  const battingSection = (
    <div className={styles.section}>
      <h2 className={styles.mainHeading}>Batting</h2>
      <div className={styles.subSection}>
        <InputControl
          placeholder="Type here"
          numericInput
          label="Run points"
          value={battingData.runPoints}
          onChange={(e) =>
            setBattingData((prev) => ({
              ...prev,
              runPoints: e.target.valueAsNumber,
            }))
          }
          // labelInfo={infoTexts}
          error={errors.batting.runPoints}
        />

        <h3 className={styles.subHeading}>Boundary Points</h3>
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
              error={errors.batting[`boundaryPoints_${index}_four`]}
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
              error={errors.batting[`boundaryPoints_${index}_six`]}
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
              error={errors.batting[`boundaryPoints_${index}_minRate`]}
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
              error={errors.batting[`boundaryPoints_${index}_maxRate`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBattingData((p) => ({
                  ...p,
                  boundaryPoints: p.boundaryPoints.filter(
                    (_e, i) => i !== index
                  ),
                }))
              }
            >
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

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Run Milestone Bonus</h3>
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
              error={errors.batting[`runMilestoneBonus_${index}_runsUpto`]}
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
              error={errors.batting[`runMilestoneBonus_${index}_points`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBattingData((p) => ({
                  ...p,
                  runMilestoneBonus: {
                    ...p.runMilestoneBonus,
                    milestones: p.runMilestoneBonus.milestones.filter(
                      (_, i) => i !== index
                    ),
                  },
                }))
              }
            >
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            setBattingData((p) => ({
              ...p,
              runMilestoneBonus: {
                ...p.runMilestoneBonus,
                milestones: [...p.runMilestoneBonus.milestones, {}],
              },
            }))
          }
          outlineButton
        >
          + ADD
        </Button>

        <h3 className={styles.subHeading}>Negative Runs Exempt positions</h3>
        <SimpleArrayEdit
          array={battingData.runMilestoneBonus?.negativeRunsExemptPositions}
          onChange={(arr) =>
            setBattingData((p) => ({
              ...p,
              runMilestoneBonus: {
                ...p.runMilestoneBonus,
                negativeRunsExemptPositions: arr,
              },
            }))
          }
        />
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Strike Rate Bonus</h3>
        <InputControl
          placeholder="Type here"
          numericInput
          label="Min balls required"
          value={battingData.strikeRateBonus?.minBallsRequired}
          onChange={(e) =>
            setBattingData((prev) => ({
              ...prev,
              strikeRateBonus: {
                ...prev.strikeRateBonus,
                minBallsRequired: e.target.valuesAsNumber,
              },
            }))
          }
          // labelInfo={infoTexts}
        />
        <h3 className={styles.subHeading}>Multiplier Ranges</h3>
        {battingData.strikeRateBonus?.multiplierRanges?.map((range, index) => (
          <div key={range._id + index} className="flex-col-xxs">
            <div className="flex-col-xs">
              <label className="label">Batting positions</label>

              <SimpleArrayEdit
                array={
                  battingData.strikeRateBonus?.multiplierRanges[index]
                    ?.battingPositions
                }
                onChange={(arr) =>
                  setBattingData((p) => ({
                    ...p,
                    strikeRateBonus: {
                      ...p.strikeRateBonus,
                      multiplierRanges: p.strikeRateBonus?.multiplierRanges.map(
                        (e, i) =>
                          i === index ? { ...e, battingPositions: arr } : e
                      ),
                    },
                  }))
                }
              />

              {errors.batting[`strikeRateBonus_${index}_battingPositions`] && (
                <p className="error-msg">
                  {errors.batting[`strikeRateBonus_${index}_battingPositions`]}
                </p>
              )}
            </div>

            <div className={styles.subSection_row}>
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
                labelInfo={
                  infoTexts.strikeRateBonusMultiplierRanges.minimumBalls
                }
                error={errors.batting[`strikeRateBonus_${index}_minBalls`]}
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
                labelInfo={
                  infoTexts.strikeRateBonusMultiplierRanges.maximumBalls
                }
                error={errors.batting[`strikeRateBonus_${index}_maxBalls`]}
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
                error={errors.batting[`strikeRateBonus_${index}_multiplier`]}
              />
              <div
                className={`icon ${styles.deleteIcon}`}
                onClick={() =>
                  setBattingData((p) => ({
                    ...p,
                    strikeRateBonus: {
                      ...p.strikeRateBonus,
                      multiplierRanges:
                        p.strikeRateBonus.multiplierRanges.filter(
                          (_, i) => i !== index
                        ),
                    },
                  }))
                }
              >
                <Trash2 color="red" />
              </div>
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          outlineButton
          onClick={() =>
            setBattingData((p) => ({
              ...p,
              strikeRateBonus: {
                ...p.strikeRateBonus,
                multiplierRanges: [...p.strikeRateBonus.multiplierRanges, {}],
              },
            }))
          }
        >
          + ADD
        </Button>{" "}
      </div>
    </div>
  );

  console.log(bowlingData, errors);
  const bowlingSection = (
    <div className={styles.section}>
      <h2 className={styles.mainHeading}>Bowling</h2>

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
              error={errors.bowling[`wicketPoints_${index}_minBattingPosition`]}
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
              error={errors.bowling[`wicketPoints_${index}_maxBattingPosition`]}
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
              error={errors.bowling[`wicketPoints_${index}_points`]}
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
              error={
                errors.bowling[
                  `wicketPoints_${index}_runsCapForIncrementingPoints`
                ]
              }
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
              error={errors.bowling[`wicketPoints_${index}_incrementedPoints`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBowlingData((p) => ({
                  ...p,
                  wicketPoints: p.wicketPoints.filter((_, i) => i !== index),
                }))
              }
            >
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            setBowlingData((p) => ({
              ...p,
              wicketPoints: [...p.wicketPoints, {}],
            }))
          }
          outlineButton
        >
          + ADD
        </Button>{" "}
      </div>

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
              error={errors.bowling[`dotBallPoints_${index}_minRate`]}
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
              error={errors.bowling[`dotBallPoints_${index}_maxRate`]}
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
              error={errors.bowling[`dotBallPoints_${index}_points`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBowlingData((p) => ({
                  ...p,
                  dotBallPoints: p.dotBallPoints.filter((_, i) => i !== index),
                }))
              }
            >
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            setBowlingData((p) => ({
              ...p,
              dotBallPoints: [...p.dotBallPoints, {}],
            }))
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Economy Rate Bonus</h3>
        <InputControl
          placeholder="Type here"
          numericInput
          label="Min balls bowled"
          value={bowlingData.economyRateBonus?.minBowledBallsRequired}
          onChange={(e) =>
            setBowlingData((prev) => ({
              ...prev,
              economyRateBonus: {
                ...prev.economyRateBonus,
                minBowledBallsRequired: e.target.valuesAsNumber,
              },
            }))
          }
          // labelInfo={infoTexts}
        />
        <h3 className={styles.subHeading}>Multiplier Ranges</h3>
        {bowlingData.economyRateBonus?.multiplierRanges?.map((range, index) => (
          <div key={range._id + index} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Minimum Balls"
              value={range.minBallsBowled}
              onChange={(event) =>
                setBowlingData((prev) => ({
                  ...prev,
                  economyRateBonus: {
                    ...prev.economyRateBonus,
                    multiplierRanges:
                      prev.economyRateBonus.multiplierRanges.map((e, i) =>
                        i === index
                          ? { ...e, minBallsBowled: event.target.valueAsNumber }
                          : e
                      ),
                  },
                }))
              }
              // labelInfo={
              //   infoTexts.economyRateBonusMultiplierRanges.minimumBalls
              // }
              error={errors.bowling[`economyRateBonus_${index}_minBallsBowled`]}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Maximum Balls"
              value={range.maxBallsBowled}
              onChange={(event) =>
                setBowlingData((prev) => ({
                  ...prev,
                  economyRateBonus: {
                    ...prev.economyRateBonus,
                    multiplierRanges:
                      prev.economyRateBonus.multiplierRanges.map((e, i) =>
                        i === index
                          ? { ...e, maxBallsBowled: event.target.valueAsNumber }
                          : e
                      ),
                  },
                }))
              }
              // labelInfo={
              //   infoTexts.economyRateBonusMultiplierRanges.maximumBalls
              // }
              error={errors.bowling[`economyRateBonus_${index}_maxBallsBowled`]}
            />
            <InputControl
              placeholder="Type here"
              label="Multiplier"
              numericInput
              value={range.multiplier}
              onChange={(event) =>
                setBowlingData((prev) => ({
                  ...prev,
                  economyRateBonus: {
                    ...prev.economyRateBonus,
                    multiplierRanges:
                      prev.economyRateBonus.multiplierRanges.map((e, i) =>
                        i === index
                          ? {
                              ...e,
                              multiplier: event.target.valueAsNumber,
                            }
                          : e
                      ),
                  },
                }))
              }
              // labelInfo={infoTexts.economyRateBonusMultiplierRanges.multiplier}
              error={errors.bowling[`economyRateBonus_${index}_multiplier`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBowlingData((p) => ({
                  ...p,
                  economyRateBonus: {
                    ...p.economyRateBonus,
                    multiplierRanges:
                      p.economyRateBonus.multiplierRanges.filter(
                        (_, i) => i !== index
                      ),
                  },
                }))
              }
            >
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          outlineButton
          onClick={() =>
            setBowlingData((p) => ({
              ...p,
              economyRateBonus: {
                ...p.economyRateBonus,
                multiplierRanges: [...p.economyRateBonus.multiplierRanges, {}],
              },
            }))
          }
        >
          + ADD
        </Button>{" "}
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Wicket Milestones Bonus</h3>

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
              error={errors.bowling[`wicketMilestoneBonus_${index}_minWickets`]}
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
              error={errors.bowling[`wicketMilestoneBonus_${index}_maxWickets`]}
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
              error={errors.bowling[`wicketMilestoneBonus_${index}_points`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBowlingData((p) => ({
                  ...p,
                  wicketMilestoneBonus: p.wicketMilestoneBonus.filter(
                    (_, i) => i !== index
                  ),
                }))
              }
            >
              <Trash2 color="red" />
            </div>
          </div>
        ))}
        <Button
          className={styles.link}
          onClick={() =>
            setBowlingData((p) => ({
              ...p,
              wicketMilestoneBonus: [...p.wicketMilestoneBonus, {}],
            }))
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>
    </div>
  );

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
            error={errors.fielding.catchPoints}
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
            error={errors.fielding.stumpingPoints}
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
            error={errors.fielding.directHitRunOutPoints}
          />
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    fetchScoringSystem();
  }, []);

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

        <Button onClick={handleSubmission}>Save Edit</Button>
      </div>
    </div>
  );
}
