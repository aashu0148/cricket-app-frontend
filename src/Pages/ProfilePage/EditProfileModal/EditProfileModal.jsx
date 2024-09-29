import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";

import { updateUserDetails } from "@/apis/user";
import { handleNumericInputKeyDown } from "@/utils/util";

function EditProfileModal({ onClose, onSuccess }) {
  const userDetails = useSelector((s) => s.user);

  const [values, setValues] = useState({
    name: userDetails.name || "",
    phone: userDetails.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!values.name) errors.name = "Enter name";
    if (!values.phone) errors.phone = "Enter phone";

    setErrors(errors);
    if (Object.keys(errors).length) return false;
    else return true;
  };

  const handleSubmission = async () => {
    if (!validateForm()) return;

    const body = {
      ...values,
    };

    setSubmitting(true);
    const res = await updateUserDetails(body);
    setSubmitting(false);
    if (!res) return;

    if (onSuccess) onSuccess(res.data);
    toast.success("User updated successfully");
  };

  return (
    <Modal onClose={onClose}>
      <div className={`page-container`}>
        <p className="heading">Edit Profile</p>

        <div className="form">
          <div className="row">
            <InputControl
              value={values.name}
              onChange={(e) =>
                setValues((p) => ({ ...p, name: e.target.value }))
              }
              label="Name"
              placeholder={"Enter name"}
              error={errors.name}
            />

            <InputControl
              value={values.phone}
              onChange={(e) =>
                setValues((p) => ({ ...p, phone: e.target.value }))
              }
              label="Phone Number"
              maxLength={10}
              placeholder={"Enter phone"}
              error={errors.phone}
              onKeyDown={handleNumericInputKeyDown}
            />
          </div>
        </div>

        <div className="footer">
          <Button onClick={onClose} cancelButton>
            Close
          </Button>
          <Button
            onClick={handleSubmission}
            disabled={submitting}
            useSpinnerWhenDisabled
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EditProfileModal;
