import React from "react";

import Button from "@/Components/Button/Button";

import Modal from "@/Components/Modal/Modal";

const points = [
  `Over the course of playing many fantasy tournaments, we realised that there is a tremendous amount of homogeneity in every user's team and that takes the joy away from playing. 

    No body wants to be part of a contest where seven of the eight users have captained Virat Kohli while having six-seven same players. 

Much like the real world, once you draft a player into your team here, that player is 'yours'. You are likely to be way more invested in that player's performance and we have found that it makes for a great experience while watching the tournament. There's absolutely no confilct of interest here.`,
  ,
  `A snake draft is a format commonly used in fantasy sports contests. In this type of draft, the pick order reverses after each round.

Here’s how it works:

In the first round, teams or participants select players in a set order (e.g., User 1 picks first, followed by User 2, User 3, and so on).
In the second round, the order is reversed. So, the team that picked last in the first round will pick first in the second round (e.g., User 3 picks first, then User 2, and finally User 1).
This alternating pattern continues for all rounds.

The advantage of a snake draft is that it balances the advantage of having the first pick, as the teams picking later in the first round get to pick earlier in the following round. It helps to level the playing field, ensuring no single participant gets an unfair advantage by consistently picking first in every round.`,
  ,
];

function DraftPageInfoModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="modal-container">
        <div className="flex-col-xs">
          <p className="heading">How it works?</p>
          <p className="shoulder">This is how draft round works:</p>
        </div>

        <ul className="list">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
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
