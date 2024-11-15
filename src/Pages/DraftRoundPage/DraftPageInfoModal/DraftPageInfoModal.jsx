import React from "react";

import Button from "@/Components/Button/Button";

import Modal from "@/Components/Modal/Modal";

const points = [
  `In the first round, users pick in a set order (e.g., 1, 2, 3, 4… up to the total number of teams in the league).`,
  `For the second round, the order reverses. If the first round order was 1, 2, 3, 4, then the second round order would be 4, 3, 2, 1. The order continues to alternate in this back-and-forth (or "snake") pattern throughout the draft.

This reversal ensures fairness so that no one has a consistent advantage by always picking first or last. For instance, if a team picks first in round one, they’ll pick last in round two, and so on.`,

  `Each user will get two minutes to pick their player. The owner of the league can choose to pause the clock located on the top right of the page in case more time is required due to any unforeseen circumstances.`,
  `The format:
Each user has to select 15 players from the list. A team’s score is determined by the points from its top 11 players.
`,
];

function DraftPageInfoModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="modal-container">
        <div className="flex-col-xs">
          <p className="heading">Snake Draft Process</p>
          <p className="shoulder">
            In a snake draft, the order in which users select players rotates
            each round to create a fair and balanced system.
            <br />
            Here’s how it works:
          </p>
        </div>

        <ul className="list">
          {points.map((p, i) => (
            <li key={i} style={{ whiteSpace: "pre-wrap" }}>
              {p}
            </li>
          ))}
        </ul>

        <div className="footer">
          <Button outlineButton onClick={onClose}>
            Okay
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DraftPageInfoModal;
