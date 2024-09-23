import React, { useState } from "react";

import InputControl from "@/Components/InputControl/InputControl";
import DatePicker from "@/Components/DatePicker/DatePicker";

function CreateLeagueForm({ leagueId }) {
  const [values, setValues] = useState({});

  return (
    <div className={`flex-col`}>
      <p className="heading">Create League</p>

      <div className="form">
        <div className="row">
          <InputControl label="Name" placeholder={"Enter name"} />
          <DatePicker
            minDate={new Date()}
            onChange={(e) => console.log("CHANGE", e)}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateLeagueForm;
