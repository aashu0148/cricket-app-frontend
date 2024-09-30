import React, { useState } from "react";
import { toast } from "react-hot-toast";

import InputControl from "@/Components/InputControl/InputControl";
import DatePicker from "@/Components/DatePicker/DatePicker";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import TextArea from "@/Components/Textarea/Textarea";
import Button from "@/Components/Button/Button";
import Modal from "@/Components/Modal/Modal";

import { leagueTypeEnum } from "@/utils/enums";
import { updateLeague } from "@/apis/leagues";

import styles from "./EditLeagueModal.module.scss";

const leagueTypeOptions = [
  {
    label: "Public",
    value: leagueTypeEnum.PUBLIC,
  },
  {
    label: "Private",
    value: leagueTypeEnum.PRIVATE,
  },
];
function EditLeagueModal({
  leagueDetails = {},
  onClose,
  tournamentName = "",
  onSuccess,
}) {
  const [values, setValues] = useState({
    name: leagueDetails.name || "",
    description: leagueDetails.description || "",
    type: leagueDetails.type
      ? leagueTypeOptions.find((e) => e.value === leagueDetails.type)
      : leagueTypeOptions[0],
    draftRoundStartDate: leagueDetails.draftRound.startDate || "",
    draftRoundStartTime: leagueDetails.draftRound.startDate
      ? new Date(leagueDetails.draftRound.startDate)
          .toLocaleTimeString("en-in", { hour12: false })
          .split(":")
          .slice(0, 2)
          .join(":")
      : "",
    password: leagueDetails.password || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!values.name) errors.name = "Enter league name";
    else if (values.name.length > 50) errors.name = "Too long league name";
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
      draftRoundStartDate: date,
      type: values.type.value,
      password: values.password,
    };

    setSubmitting(true);
    const res = await updateLeague(leagueDetails._id, body);
    setSubmitting(false);
    if (!res) return;

    if (onSuccess) onSuccess(res.data);
    toast.success("League updated successfully");
  };

  return (
    <Modal onClose={onClose}>
      <div className={`flex-col ${styles.container}`}>
        <p className="heading">Edit League</p>

        <div className={styles.form}>
          <div className="row align-start">
            <InputControl
              value={values.name}
              onChange={(e) =>
                setValues((p) => ({ ...p, name: e.target.value }))
              }
              label="League Name"
              placeholder={"Enter name"}
              error={errors.name}
            />

            <InputControl label="Tournament" disabled value={tournamentName} />
          </div>
          <div className="row">
            <InputSelect
              label="League Type"
              options={leagueTypeOptions}
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
              <label>Draft Round Date & Time</label>

              <div className={styles.dateTime}>
                <DatePicker
                  minDate={new Date()}
                  onChange={(e) =>
                    setValues((p) => ({ ...p, draftRoundStartDate: e }))
                  }
                  defaultDate={values.draftRoundStartDate}
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
          <Button cancelButton onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={submitting}
            useSpinnerWhenDisabled
            onClick={handleSubmission}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EditLeagueModal;
