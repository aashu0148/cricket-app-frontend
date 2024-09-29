import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";

import { applicationRoutes } from "@/utils/constants";

import styles from "./DraftRoundPage.module.scss";

function DraftRoundCompleted() {
  const { tournamentId, leagueId } = useParams();

  const navigate = useNavigate();

  return (
    <Modal>
      <div className={styles.roundCompleted}>
        <h2 className="heading-big">Draft round is completed</h2>

        <p className={styles.desc}>
          Draft round is completed, please head over to league page to see your
          team and leader board
        </p>

        <Button
          withArrow
          onClick={() =>
            navigate(applicationRoutes.league(tournamentId, leagueId))
          }
        >
          League page
        </Button>
      </div>
    </Modal>
  );
}

export default DraftRoundCompleted;
