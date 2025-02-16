import React, { useEffect, useState } from "react";
import { Info, Trash2 } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";
import PageLoader from "@/Components/PageLoader/PageLoader";
import SimpleArrayEdit from "./SimpleArrayEdit";

import {
  createScoringSystem,
  getScoringSystemById,
  updateScoringSystem,
} from "@/apis/scoringSystem";
import { applicationRoutes } from "@/utils/constants";
import { getTooltipAttributes } from "@/utils/tooltip";

import styles from "./EditScoringSystem.module.scss";

const infoTexts = {
  runPoints:
    "Points assigned based on the number of runs scored by the batter.",
  boundaryPoints: {
    four: "Bonus points for every boundary hit (four runs) by the batter.",
    six: "Bonus points for every six hit by the batter.",
    minAMSR:
      "The minimum average match scoring rate (A.M.S.R.) used to determine the bonus for boundaries.",
    maxAMSR:
      "The maximum average match scoring rate (A.M.S.R.) used to determine the bonus for boundaries.",
  },
  runMilestoneBonus: {
    runs: "Defines the upper limit of runs for the milestone where a bonus is applied.",
    points: "Bonus points awarded for reaching the first run milestone.",
    negativePointsExemptPositions:
      "Batters in these positions will not have negative points for scoring runs less than runs you mention in the next field. ",
  },
  strikeRateBonus: {
    minBallsRequired:
      "The minimum number of balls a batter must face to be eligible for a strike rate bonus.",
    battingPositions:
      "The batting positions that are considered when calculating the strike rate bonus.",
    minimumBalls:
      "The minimum number of balls faced by the batter used to calculate the strike rate bonus.",
    maximumBalls:
      "The maximum number of balls faced by the batter used to calculate the strike rate bonus.",
    multiplier:
      "The multiplier applied to the strike rate bonus calculation based on balls faced.",
  },
  wicketPoints: {
    minBattingPosition:
      "The minimum batting position of the dismissed batter for the wicket points calculation.",
    maxBattingPosition:
      "The maximum batting position of the dismissed batter for the wicket points calculation.",
    points:
      "Points awarded for taking a wicket based on the batter's position.",
    runsCapForIncrementing:
      "The run limit above which additional points are awarded for taking a wicket.",
    incrementedPoints:
      "Extra points awarded for dismissing a batter who has scored more than a specific number of runs.",
  },
  dotBallPoints: {
    minAMSR:
      "The minimum average match scoring rate (A.M.S.R.) used to calculate dot ball points.",
    maxAMSR:
      "The maximum average match scoring rate (A.M.S.R.) used to calculate dot ball points.",
    points:
      "Points awarded for delivering a dot ball, depending on the average match scoring rate.",
  },
  economyRateBonus: {
    minBallsRequired:
      "The minimum number of balls a bowler must bowl to qualify for the economy rate bonus.",
    minimumBalls:
      "The minimum number of balls bowled by the bowler used in the economy rate bonus calculation.",
    maximumBalls:
      "The maximum number of balls bowled by the bowler used in the economy rate bonus calculation.",
    multiplier:
      "The multiplier applied to the economy rate bonus calculation based on balls bowled.",
  },
  wicketMilestonesBonus: {
    minWickets:
      "The minimum number of wickets required to earn a milestone bonus.",
    maxWickets:
      "The maximum number of wickets considered for calculating the milestone bonus.",
    points: "Points awarded as a bonus for reaching the wicket milestone.",
  },
};

export default function EditScoringSystem({ createMode = false }) {
  const { scoringId } = useParams();
  const navigate = useNavigate();
  const [systemName, setSystemName] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [battingData, setBattingData] = useState({});
  const [bowlingData, setBowlingData] = useState({});
  const [fieldingData, setFieldingData] = useState({});
  const [errors, setErrors] = useState({
    batting: {},
    bowling: {},
    fielding: {},
  });
  const [submitting, setSubmitting] = useState(false);

  function validateForm() {
    const errs = {};
    const battingErrors = {};
    const bowlingErrors = {};
    const fieldingErrors = {};

    if (!systemName) errs.name = "Enter system name";

    // Batting validation
    if (battingData.run) {
      battingData.run.forEach((rule, index) => {
        if (isNaN(rule.minRate) || rule.minRate < 0) {
          battingErrors[`run_${index}_minRate`] =
            "Minimum rate must be 0 or higher.";
        }
        if (isNaN(rule.maxRate) || rule.maxRate < rule.minRate) {
          battingErrors[`run_${index}_maxRate`] =
            "Maximum rate must be greater than or equal to the minimum rate.";
        }
        if (isNaN(rule.points) || rule.points < 0) {
          battingErrors[`run_${index}_points`] =
            "Points must be a positive number.";
        }
      });
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
        if (isNaN(milestone.runs) || milestone.runs < 0) {
          battingErrors[`runMilestoneBonus_${index}_runs`] =
            "Milestone runs must be a positive number.";
        }
        if (
          !milestone.battingPositions.every(
            (pos) => !isNaN(pos) && pos >= 1 && pos <= 12
          ) ||
          !milestone.battingPositions.length
        ) {
          battingErrors[`runMilestoneBonus_${index}_battingPositions`] =
            "Batting positions must be integers between 1 and 12.";
        }
      });

      if (battingData.runMilestoneBonus.negativePointsExemptPositions) {
        const invalidPositions =
          battingData.runMilestoneBonus.negativePointsExemptPositions.filter(
            (pos) => isNaN(pos) || pos < 1 || pos > 12
          );
        if (invalidPositions.length > 0) {
          battingErrors.negativePointsExemptPositions =
            "Positions must be integers between 1 and 12.";
        }
      }

      if (
        isNaN(
          battingData.runMilestoneBonus.negativePointsExemptNotOutBatterWithRuns
        ) ||
        battingData.runMilestoneBonus.negativePointsExemptNotOutBatterWithRuns <
          0
      ) {
        battingErrors.negativePointsExemptNotOutBatterWithRuns =
          "Runs must be a integer";
      }
    }

    if (battingData.strikeRateBonus) {
      battingData.strikeRateBonus.multiplierRanges.forEach((range, index) => {
        if (
          !range.battingPositions.every(
            (pos) => !isNaN(pos) && pos >= 1 && pos <= 12
          ) ||
          !range.battingPositions.length
        ) {
          battingErrors[`strikeRateBonus_${index}_battingPositions`] =
            "Batting positions must be integers between 1 and 12.";
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

      if (battingData.strikeRateBonus.negativePointsExemptPositions) {
        const invalidPositions =
          battingData.strikeRateBonus.negativePointsExemptPositions.filter(
            (pos) => isNaN(pos) || pos < 1 || pos > 12
          );
        if (invalidPositions.length > 0) {
          battingErrors["strikeRateBonus_negativePointsExemptPositions"] =
            "Positions must be integers between 1 and 12.";
        }
      }
    }

    // Bowling validation
    if (bowlingData.wicketPoints) {
      bowlingData.wicketPoints.forEach((wicket, index) => {
        if (
          isNaN(wicket.minBattingPosition) ||
          wicket.minBattingPosition < 1 ||
          wicket.minBattingPosition > 12
        ) {
          bowlingErrors[`wicketPoints_${index}_minBattingPosition`] =
            "Minimum batting position must be between 1 and 12.";
        }
        if (
          isNaN(wicket.maxBattingPosition) ||
          wicket.maxBattingPosition < wicket.minBattingPosition ||
          wicket.maxBattingPosition > 12
        ) {
          bowlingErrors[`wicketPoints_${index}_maxBattingPosition`] =
            "Maximum batting position must be greater than or equal to minimum batting position, and no more than 12.";
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
    if (bowlingData.wicketPointsMultiplier) {
      bowlingData.wicketPointsMultiplier.forEach((rule, index) => {
        if (isNaN(rule.minRate) || rule.minRate < 0) {
          battingErrors[`wicketPointsMultiplier_${index}_minRate`] =
            "Minimum rate must be 0 or higher.";
        }
        if (isNaN(rule.maxRate) || rule.maxRate < rule.minRate) {
          battingErrors[`wicketPointsMultiplier_${index}_maxRate`] =
            "Maximum rate must be greater than or equal to the minimum rate.";
        }
        if (isNaN(rule.multiplier) || rule.multiplier < 0) {
          battingErrors[`wicketPointsMultiplier_${index}_multiplier`] =
            "Multiplier must be a positive number.";
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
    if (
      isNaN(fieldingData.assistedRunOutPoints) ||
      fieldingData.assistedRunOutPoints < 0
    ) {
      fieldingErrors.assistedRunOutPoints =
        "Assisted run-out points must be a positive number.";
    }

    const isNormalError = Object.keys(errs).length > 0;
    const isBattingError = Object.keys(battingErrors).length > 0;
    const isBowlingError = Object.keys(bowlingErrors).length > 0;
    const isFieldingError = Object.keys(fieldingErrors).length > 0;

    setErrors({
      ...errs,
      batting: battingErrors,
      bowling: bowlingErrors,
      fielding: fieldingErrors,
    });

    if (isNormalError || isBattingError || isBowlingError || isFieldingError)
      return false;
    return true;
  }

  const handleSubmission = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const res = createMode
      ? await createScoringSystem({
          name: systemName,
          batting: battingData,
          bowling: bowlingData,
          fielding: fieldingData,
        })
      : await updateScoringSystem(scoringId, {
          name: systemName,
          batting: battingData,
          bowling: bowlingData,
          fielding: fieldingData,
        });
    setSubmitting(false);
    if (!res) return;

    toast.success(`${createMode ? "Created" : "Edited"} successfully`);
    navigate(applicationRoutes.scoringSystem);
  };

  const fetchScoringSystem = async () => {
    const res = await getScoringSystemById(scoringId);
    setLoadingPage(false);
    if (!res) return;

    setSystemName(res.data?.name);
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

  const battingSection = (
    <div className={styles.section}>
      <h2 className={styles.mainHeading}>Batting</h2>

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Run Points</h3>
        {battingData.run?.map((run, index) => (
          <div key={index} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Points"
              value={run.points}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "run",
                  subField: "points",
                  index,
                })
              }
              error={errors.batting[`run_${index}_points`]}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Min A.M.S.R"
              value={run.minRate}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "run",
                  subField: "minRate",
                  index,
                })
              }
              error={errors.batting[`run_${index}_minRate`]}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Max A.M.S.R"
              value={run.maxRate}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.valueAsNumber,
                  field: "run",
                  subField: "maxRate",
                  index,
                })
              }
              error={errors.batting[`run_${index}_maxRate`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBattingData((p) => ({
                  ...p,
                  run: p.run.filter((_e, i) => i !== index),
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
              run: [...p.run, {}],
            }))
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>

      <div className={styles.subSection}>
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
            setBattingData((p) => ({
              ...p,
              boundaryPoints: [...p.boundaryPoints, {}],
            }))
          }
          outlineButton
        >
          + ADD
        </Button>
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Run Milestone Bonus</h3>
        {battingData.runMilestoneBonus?.milestones?.map((milestone, index) => (
          <div
            key={milestone._id}
            className="flex-col-xs"
            style={{ gap: "2px", marginBottom: "4px" }}
          >
            <div className="flex-col-xs">
              <label className="label flex align-center">
                Batting positions{" "}
                <span
                  className={`icon ${styles.info}`}
                  {...getTooltipAttributes({
                    text: infoTexts.strikeRateBonus?.battingPositions,
                  })}
                >
                  <Info />
                </span>
              </label>

              <SimpleArrayEdit
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                array={
                  battingData.runMilestoneBonus?.milestones[index]
                    ?.battingPositions
                }
                onChange={(arr) =>
                  setBattingData((p) => ({
                    ...p,
                    runMilestoneBonus: {
                      ...p.runMilestoneBonus,
                      milestones: p.runMilestoneBonus?.milestones.map((e, i) =>
                        i === index ? { ...e, battingPositions: arr } : e
                      ),
                    },
                  }))
                }
              />

              {errors.batting[
                `runMilestoneBonus_${index}_battingPositions`
              ] && (
                <p className="error-msg" style={{ textAlign: "start" }}>
                  {
                    errors.batting[
                      `runMilestoneBonus_${index}_battingPositions`
                    ]
                  }
                </p>
              )}
            </div>

            <div key={milestone._id} className={styles.subSection_row}>
              <InputControl
                placeholder="Type here"
                numericInput
                label="Runs Scored"
                value={milestone.runs}
                onChange={(e) =>
                  handleBattingChange({
                    val: e.target.valueAsNumber,
                    field: "milestones",
                    subField: "runs",
                    index,
                    multipleFields: true,
                    secondField: "runMilestoneBonus",
                  })
                }
                labelInfo={infoTexts.runMilestoneBonus?.runs}
                error={errors.batting[`runMilestoneBonus_${index}_runs`]}
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
                labelInfo={infoTexts.runMilestoneBonus?.points}
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

        <h3 className={styles.subHeading}>
          Negative points Exempt positions
          <span
            className={`icon ${styles.info}`}
            {...getTooltipAttributes({
              text: infoTexts.runMilestoneBonus?.negativePointsExemptPositions,
            })}
          >
            <Info />
          </span>
        </h3>
        <SimpleArrayEdit
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          array={battingData.runMilestoneBonus?.negativePointsExemptPositions}
          onChange={(arr) =>
            setBattingData((p) => ({
              ...p,
              runMilestoneBonus: {
                ...p.runMilestoneBonus,
                negativePointsExemptPositions: arr,
              },
            }))
          }
        />

        <InputControl
          placeholder="Type here"
          numericInput
          label="Negative points Exempt for non-out batter with runs"
          value={
            battingData.runMilestoneBonus
              ?.negativePointsExemptNotOutBatterWithRuns
          }
          error={errors.batting.negativePointsExemptNotOutBatterWithRuns}
          onChange={(e) =>
            setBattingData((prev) => ({
              ...prev,
              runMilestoneBonus: {
                ...prev.runMilestoneBonus,
                negativePointsExemptNotOutBatterWithRuns:
                  parseInt(e.target.value) || "",
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
                minBallsRequired: e.target.valueAsNumber,
              },
            }))
          }
          labelInfo={infoTexts.strikeRateBonus?.minBallsRequired}
        />
        <h3 className={styles.subHeading}>
          Negative Points Exempt positions for Strike Rate Bonus
          {/* <span
            className={`icon ${styles.info}`}
            {...getTooltipAttributes({
              text: infoTexts.strikeRateBonus?.negativePointsExemptPositions,
            })}
          >
            <Info />
          </span> */}
        </h3>
        <SimpleArrayEdit
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          array={battingData.strikeRateBonus?.negativePointsExemptPositions}
          onChange={(arr) =>
            setBattingData((p) => ({
              ...p,
              strikeRateBonus: {
                ...p.strikeRateBonus,
                negativePointsExemptPositions: arr,
              },
            }))
          }
        />
        {errors.batting["strikeRateBonus_negativePointsExemptPositions"] && (
          <p className="error-msg">
            {errors.batting["strikeRateBonus_negativePointsExemptPositions"]}
          </p>
        )}
        <h3 className={styles.subHeading}>Multiplier Ranges</h3>
        {battingData.strikeRateBonus?.multiplierRanges?.map((range, index) => (
          <div key={range._id + index} className="flex-col-xxs">
            <div className="flex-col-xs">
              <label className="label flex align-center">
                Batting positions{" "}
                <span
                  className={`icon ${styles.info}`}
                  {...getTooltipAttributes({
                    text: infoTexts.strikeRateBonus?.battingPositions,
                  })}
                >
                  <Info />
                </span>
              </label>

              <SimpleArrayEdit
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
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
                <p className="error-msg" style={{ textAlign: "start" }}>
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
                labelInfo={infoTexts.strikeRateBonus?.maximumBalls}
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
                labelInfo={infoTexts.strikeRateBonus?.maximumBalls}
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
                labelInfo={infoTexts.strikeRateBonus?.multiplier}
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
        <h3 className={styles.subHeading}>Wicket Points Multiplier</h3>
        {bowlingData.wicketPointsMultiplier?.map((rule, index) => (
          <div key={index} className={styles.subSection_row}>
            <InputControl
              placeholder="Type here"
              numericInput
              label="Multiplier"
              value={rule.multiplier}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPointsMultiplier",
                  subField: "multiplier",
                  index,
                })
              }
              error={
                errors.batting[`wicketPointsMultiplier_${index}_multiplier`]
              }
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Min A.M.S.R"
              value={rule.minRate}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPointsMultiplier",
                  subField: "minRate",
                  index,
                })
              }
              error={errors.batting[`wicketPointsMultiplier_${index}_minRate`]}
            />
            <InputControl
              placeholder="Type here"
              numericInput
              label="Max A.M.S.R"
              value={rule.maxRate}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.valueAsNumber,
                  field: "wicketPointsMultiplier",
                  subField: "maxRate",
                  index,
                })
              }
              error={errors.batting[`wicketPointsMultiplier_${index}_maxRate`]}
            />
            <div
              className={`icon ${styles.deleteIcon}`}
              onClick={() =>
                setBowlingData((p) => ({
                  ...p,
                  wicketPointsMultiplier: p.wicketPointsMultiplier.filter(
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
            setBowlingData((p) => ({
              ...p,
              wicketPointsMultiplier: [...p.wicketPointsMultiplier, {}],
            }))
          }
          outlineButton
        >
          + ADD
        </Button>
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
                minBowledBallsRequired: e.target.valueAsNumber,
              },
            }))
          }
          labelInfo={infoTexts.economyRateBonus?.minBallsRequired}
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
              labelInfo={infoTexts.economyRateBonus?.minimumBalls}
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
              labelInfo={infoTexts.economyRateBonus?.maximumBalls}
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
              labelInfo={infoTexts.economyRateBonus?.multiplier}
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
              labelInfo={infoTexts.wicketMilestonesBonus?.minWickets}
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
              labelInfo={infoTexts.wicketMilestonesBonus?.maxWickets}
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
              labelInfo={infoTexts.wicketMilestonesBonus?.points}
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
          <InputControl
            placeholder="Type here"
            numericInput
            label="Assisted Run Out Points"
            value={fieldingData.assistedRunOutPoints}
            onChange={(e) =>
              setFieldingData((prev) => ({
                ...prev,
                assistedRunOutPoints: e.target.valueAsNumber,
              }))
            }
            error={errors.fielding.assistedRunOutPoints}
          />
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (createMode) {
      setLoadingPage(false);
      setBattingData({
        boundaryPoints: [],
        runMilestoneBonus: {
          milestones: [],
        },
        strikeRateBonus: {
          multiplierRanges: [],
        },
      });
      setBowlingData({
        dotBallPoints: [],
        wicketPoints: [],
        wicketMilestoneBonus: [],
        economyRateBonus: {
          multiplierRanges: [],
        },
      });
      return;
    }

    fetchScoringSystem();
  }, []);

  return loadingPage ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <div className="flex-col-xxs">
        {createMode ? (
          <h2 className={`heading-big`}>
            {createMode ? "Create" : "Edit"} Scoring System
          </h2>
        ) : (
          <h2 className={`heading-big`}>Edit: {systemName}</h2>
        )}

        <p className="shoulder">
          {createMode ? "Create" : "Edit"} Scoring System, define rules, and
          oversee the competition.
        </p>
      </div>

      <div className="flex-col-xs">
        <label className="label">Abbreviations</label>
        <div className="key-value">
          <label>A.M.S.R : </label>
          <p className="value">Average Match Scoring Rate</p>
        </div>
      </div>

      <div className={`${styles.saveHeader}`}>
        <Button
          cancelButton
          onClick={() => navigate(applicationRoutes.scoringSystem)}
        >
          Exit {createMode ? "" : "editing"}
        </Button>

        <Button
          onClick={handleSubmission}
          disabled={submitting}
          useSpinnerWhenDisabled
        >
          {createMode ? "Create" : "Save"}
        </Button>
      </div>

      <InputControl
        placeholder="Enter system name"
        value={systemName}
        onChange={(e) => setSystemName(e.target.value)}
        label="Scoring System Name"
        error={errors.name}
      />

      {battingSection}
      {bowlingSection}
      {fieldingSection}
    </div>
  );
}
