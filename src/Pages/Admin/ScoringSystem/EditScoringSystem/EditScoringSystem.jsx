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
        acc[item] = "";
        return acc;
      }, {});

    newObject._id = getUniqueId();

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
              numericInput
              label="Four"
              value={boundary.four}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "boundaryPoints",
                  subField: "four",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Six"
              value={boundary.six}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "boundaryPoints",
                  subField: "six",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Min Rate"
              value={boundary.minRate}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "boundaryPoints",
                  subField: "minRate",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Max Rate"
              value={boundary.maxRate}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "boundaryPoints",
                  subField: "maxRate",
                  index,
                })
              }
            />
            <div className={styles.deleteIcon}>
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
        >
          {" "}
          + ADD
        </Button>{" "}
      </div>

      {/******************************************** Milestones **********************************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Milestones</h3>
        {battingData.runMilestoneBonus?.milestones?.map((milestone, index) => (
          <div key={milestone._id} className={styles.subSection_row}>
            <InputControl
              numericInput
              label="Runs Upto"
              value={milestone.runsUpto}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "milestones",
                  subField: "runsUpto",
                  index,
                  multipleFields: true,
                  secondField: "runMilestoneBonus",
                })
              }
            />
            <InputControl
              numericInput
              label="Points"
              value={milestone.points}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "milestones",
                  subField: "points",
                  index,
                  multipleFields: true,
                  secondField: "runMilestoneBonus",
                })
              }
            />
            <div className={styles.deleteIcon}>
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
        >
          {" "}
          + ADD
        </Button>{" "}
      </div>

      {/*************************************************** Strike Rate Bonus ***********************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>
          Strike Rate Bonus - Multiplier Ranges
        </h3>
        {battingData.strikeRateBonus?.multiplierRanges?.map((range, index) => (
          <div key={range._id + index} className={styles.subSection_row}>
            <InputControl
              numericInput
              label="Batting Positions"
              value={range.battingPositions.join(", ")}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "multiplierRanges",
                  subField: "battingPositions",
                  index,
                  multipleFields: true,
                  secondField: "strikeRateBonus",
                })
              }
            />
            <InputControl
              numericInput
              label="Minimum Balls"
              value={range.minBalls}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "multiplierRanges",
                  subField: "minBalls",
                  index,
                  multipleFields: true,

                  secondField: "strikeRateBonus",
                })
              }
            />
            <InputControl
              numericInput
              label="Maximum Balls"
              value={range.maxBalls}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "multiplierRanges",
                  subField: "maxBalls",
                  index,
                  multipleFields: true,
                  secondField: "strikeRateBonus",
                })
              }
            />
            <InputControl
              numericInput
              label="Multiplier"
              value={range.multiplier}
              onChange={(e) =>
                handleBattingChange({
                  val: e.target.value,
                  field: "multiplierRanges",
                  subField: "multiplier",
                  index,
                  multipleFields: true,
                  secondField: "strikeRateBonus",
                })
              }
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
              numericInput
              label="Min Batting Position"
              value={wicket.minBattingPosition}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketPoints",
                  subField: "minBattingPosition",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Max Batting Position"
              value={wicket.maxBattingPosition}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketPoints",
                  subField: "maxBattingPosition",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Points"
              value={wicket.points}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketPoints",
                  subField: "points",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Runs Cap For Incrementing"
              value={wicket.runsCapForIncrementingPoints}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketPoints",
                  subField: "runsCapForIncrementingPoints",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Incremented Points"
              value={wicket.incrementedPoints}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketPoints",
                  subField: "incrementedPoints",
                  index,
                })
              }
            />
            <div className={styles.deleteIcon}>
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
        >
          {" "}
          + ADD
        </Button>{" "}
      </div>

      {/************************************************** Dot Ball Points **************************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Dot Ball Points</h3>
        {bowlingData.dotBallPoints?.map((dotBall, index) => (
          <div key={dotBall._id + index} className={styles.subSection_row}>
            <InputControl
              numericInput
              label="Min Rate"
              value={dotBall.minRate}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "dotBallPoints",
                  subField: "minRate",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Max Rate"
              value={dotBall.maxRate}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "dotBallPoints",
                  subField: "maxRate",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Points"
              value={dotBall.points}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "dotBallPoints",
                  subField: "points",
                  index,
                })
              }
            />
            <div className={styles.deleteIcon}>
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
        >
          {" "}
          + ADD
        </Button>
      </div>

      {/************************** Wicket Milestones ******************************************/}

      <div className={styles.subSection}>
        <h3 className={styles.subHeading}>Wicket Milestones</h3>

        {bowlingData.wicketMilestoneBonus?.map((milestone, index) => (
          <div key={milestone._id} className={styles.subSection_row}>
            <InputControl
              numericInput
              label="Min Wickets"
              value={milestone.minWickets}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketMilestoneBonus",
                  subField: "minWickets",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Max Wickets"
              value={milestone.maxWickets}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketMilestoneBonus",
                  subField: "maxWickets",
                  index,
                })
              }
            />
            <InputControl
              numericInput
              label="Points"
              value={milestone.points}
              onChange={(e) =>
                handleBowlingChange({
                  val: e.target.value,
                  field: "wicketMilestoneBonus",
                  subField: "points",
                  index,
                })
              }
            />
            <div className={styles.deleteIcon}>
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
        >
          {" "}
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
            numericInput
            label="Catch Points"
            value={fieldingData.catchPoints}
            onChange={(e) =>
              setFieldingData((prev) => ({
                ...prev,
                catchPoints: e.target.value,
              }))
            }
          />
          <InputControl
            numericInput
            label="Stumping Points"
            value={fieldingData.stumpingPoints}
            onChange={(e) =>
              setFieldingData((prev) => ({
                ...prev,
                stumpingPoints: e.target.value,
              }))
            }
          />
          <InputControl
            numericInput
            label="Direct Hit Run Out Points"
            value={fieldingData.directHitRunOutPoints}
            onChange={(e) =>
              setFieldingData((prev) => ({
                ...prev,
                directHitRunOutPoints: e.target.value,
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
    <PageLoader />
  ) : (
    <div className={`page-container ${styles.container}`}>
      <div className="flex-col-xxs">
        <h2 className={`heading-big`}>Edit Scoring System</h2>
        <p className="shoulder">
          Edit Scoring System, define rules, and oversee the competition.
        </p>
      </div>

      {battingSection}
      {bowlingSection}
      {fieldingSection}

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
