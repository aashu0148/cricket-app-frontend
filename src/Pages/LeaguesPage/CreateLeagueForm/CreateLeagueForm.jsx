import React, { useState } from "react";
import { toast } from "react-hot-toast";

import InputControl from "@/Components/InputControl/InputControl";
import DatePicker from "@/Components/DatePicker/DatePicker";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import TextArea from "@/Components/Textarea/Textarea";
import Button from "@/Components/Button/Button";

import { leagueTypeEnum } from "@/utils/enums";
import { createLeague } from "@/apis/leagues";

import styles from "./CreateLeagueForm.module.scss";

function CreateLeagueForm({ tournamentData = {}, onSuccess }) {
  const [values, setValues] = useState({
    name: "",
    description: "",
    type: { label: "Public", value: leagueTypeEnum.PUBLIC },
    draftRoundStartDate: "",
    draftRoundStartTime: "",
    tournament: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!values.name) errors.name = "Enter league name";
    if (!values.description) errors.description = "Enter league description";
    if (!values.type?.value) errors.type = "Select league type";
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
    const res = await createLeague(body);
    setSubmitting(false);
    if (!res) return;

    if (onSuccess) onSuccess(res.data);
    toast.success("League created successfully");
  };

  return (
    <div className={`flex-col ${styles.container}`}>
      <p className="heading">Create League</p>

      <div className={styles.form}>
        <div className="row align-start">
          <InputControl
            value={values.name}
            onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
            label="League Name"
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
            label="League Type"
            options={[
              {
                label: "Public",
                value: leagueTypeEnum.PUBLIC,
              },
              {
                label: "Private",
                value: leagueTypeEnum.PRIVATE,
              },
            ]}
            value={values.type || undefined}
            onChange={(e) => setValues((p) => ({ ...p, type: e }))}
            error={errors.type}
          />

          {values.type?.value === leagueTypeEnum.PRIVATE && (
            <InputControl
              label={"League Password"}
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
            label="League Description"
            placeholder={"Enter description"}
            error={errors.description}
          />

          <div className={styles.field}>
            <label>Select Date & Time</label>

            <div className={styles.dateTime}>
              <DatePicker
                label="Draft Round Date"
                minDate={new Date()}
                onChange={(e) =>
                  setValues((p) => ({ ...p, draftRoundStartDate: e }))
                }
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

      <div className="footer">
        <Button
          disabled={submitting}
          useSpinnerWhenDisabled
          onClick={handleSubmission}
        >
          Create League
        </Button>
      </div>
    </div>
  );
}

export default CreateLeagueForm;
