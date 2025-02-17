import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import InputControl from "@/Components/InputControl/InputControl";
import DatePicker from "@/Components/DatePicker/DatePicker";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import TextArea from "@/Components/Textarea/Textarea";
import Button from "@/Components/Button/Button";

import { contestTypeEnum } from "@/utils/enums";
import { createContest } from "@/apis/contests";

import styles from "./CreateContestForm.module.scss";
import { applicationRoutes } from "@/utils/constants";

function CreateContestForm({ tournamentData = {}, onSuccess }) {
  const navigate = useNavigate();

  const isMobileView = useSelector((state) => state.root.isMobileView);
  const [values, setValues] = useState({
    name: "",
    description: "",
    type: { label: "Public", value: contestTypeEnum.PUBLIC },
    draftRoundStartDate: "",
    draftRoundStartTime: "",
    tournament: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!values.name) errors.name = "Enter contest name";
    else if (values.name.length > 50) errors.name = "Too long contest name";
    if (!values.description) errors.description = "Enter contest description";
    if (!values.type?.value) errors.type = "Select contest type";
    if (!values.draftRoundStartDate || !values.draftRoundStartTime)
      errors.date = "Select date";
    else {
      const date = new Date(values.draftRoundStartDate);
      const [hrs, min] = values.draftRoundStartTime.split(":");
      date.setHours(hrs);
      date.setMinutes(min);

      if (date < new Date()) errors.date = "Date can not be a past date";
    }

    setErrors(errors);
    if (Object.keys(errors).length) return false;
    else return true;
  };

  const handleSubmission = async () => {
    if (!validateForm()) return;

    const date = new Date(values.draftRoundStartDate);
    const [hrs, min] = values.draftRoundStartTime.split(":");
    date.setHours(hrs);
    date.setMinutes(min);

    const body = {
      name: values.name,
      description: values.description,
      tournamentId: tournamentData._id,
      draftRoundStartDate: date,
      type: values.type.value,
      password: values.password,
    };

    setSubmitting(true);
    const res = await createContest(body);
    setSubmitting(false);
    if (!res) return;

    navigate(
      `${applicationRoutes.contest(tournamentData._id, res.data?._id)}?new=true`
    );
    if (onSuccess) onSuccess(res.data);
    toast.success("Contest created successfully");
  };

  return (
    <div className={`flex-col ${styles.container}`}>
      {/* <p className="heading">Create Contest</p> */}

      <div className={styles.form}>
        <div className="row align-start">
          <InputControl
            value={values.name}
            onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
            label="Contest Name"
            placeholder={"Enter name"}
            error={errors.name}
          />

          <InputControl
            label="Tournament"
            disabled
            value={tournamentData.longName}
          />
        </div>
        <div className="row">
          <InputSelect
            label="Contest Type"
            options={[
              {
                label: "Public",
                value: contestTypeEnum.PUBLIC,
              },
              {
                label: "Private",
                value: contestTypeEnum.PRIVATE,
              },
            ]}
            value={values.type || undefined}
            onChange={(e) => setValues((p) => ({ ...p, type: e }))}
            error={errors.type}
          />

          {values.type?.value === contestTypeEnum.PRIVATE && (
            <InputControl
              label={"Contest Password"}
              placeholder="Enter password"
              value={values.password}
              onChange={(e) =>
                setValues((p) => ({ ...p, password: e.target.value }))
              }
            />
          )}
        </div>

        <div className="row align-start">
          <TextArea
            value={values.description}
            onChange={(e) =>
              setValues((p) => ({ ...p, description: e.target.value }))
            }
            label="Contest Description"
            placeholder={"Enter description"}
            error={errors.description}
          />

          <div className={styles.field}>
            <label>Draft Round Date & Time</label>

            <div className={styles.dateTime}>
              <DatePicker
                maxDate={tournamentData.endDate}
                minDate={new Date()}
                onChange={(e) =>
                  setValues((p) => ({ ...p, draftRoundStartDate: e }))
                }
                startFromRight={!isMobileView}
              />
              <InputControl
                value={values.draftRoundStartTime}
                onChange={(e) =>
                  setValues((p) => ({
                    ...p,
                    draftRoundStartTime: e.target.value,
                  }))
                }
                type="time"
                error={errors.date}
              />
            </div>
          </div>
        </div>
      </div>
      <p className="desc" style={{ textAlign: "center" }}>
        Only a maximum number of 6 teams can play in one contest
      </p>

      <div className="footer">
        <Button
          disabled={submitting}
          useSpinnerWhenDisabled
          onClick={handleSubmission}
        >
          Create Contest
        </Button>
      </div>
    </div>
  );
}

export default CreateContestForm;
