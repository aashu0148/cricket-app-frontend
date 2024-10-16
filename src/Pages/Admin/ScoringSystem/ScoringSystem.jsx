import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/Components/Button/Button";
import PageLoader from "@/Components/PageLoader/PageLoader";

import {
  createScoringSystem,
  getAllScoringSystems,
} from "@/apis/scoringSystem";
import { getDateFormatted } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";

import styles from "./ScoringSystem.module.scss";

export default function ScoringSystem() {
  const navigate = useNavigate();
  const [allScoringSystems, setAllScoringSystems] = useState([]);
  const [processingSystem, setProcessingSystem] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);

  // **************************** Integrations ********************

  async function fetchScoringSystems() {
    const res = await getAllScoringSystems();
    setLoadingPage(false);
    if (!res) return;

    const result = res.data
      .map((item) => ({
        ...item,
        id: item._id,
      }))
      .sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1));

    setAllScoringSystems(result);
  }

  async function handleCopySystem({ _id, name, batting, bowling, fielding }) {
    setProcessingSystem(_id);
    const res = await createScoringSystem({
      batting,
      bowling,
      fielding,
      name: name + " Copy",
    });
    setProcessingSystem("");
    if (!res) return;

    setAllScoringSystems((p) => [res.data, ...p]);
  }

  useEffect(() => {
    fetchScoringSystems();
  }, []);

  return loadingPage ? (
    <PageLoader fullPage />
  ) : (
    <div className={`${styles.container} page-container`}>
      <section className={styles.section}>
        <div className="flexBox">
          <p className="heading">All Scoring Systems</p>
          <Button>Create Scoring System</Button>
        </div>
      </section>

      <section className={styles.card_Container}>
        {allScoringSystems.map((item) => (
          <div className={styles.card} key={item._id}>
            <h2 className={styles.card_heading}>{item.name}</h2>
            <div className={`${styles.card_content} flex-col-xs`}>
              <p className="row">
                Created on : <span>{getDateFormatted(item.createdAt)}</span>
              </p>
            </div>
            <div className={`footer ${styles.buttonContainer}`}>
              <Button
                onClick={() => handleCopySystem(item)}
                disabled={item._id === processingSystem}
                useSpinnerWhenDisabled
                outlineButton
              >
                Copy
              </Button>
              <Button
                onClick={() =>
                  navigate(applicationRoutes.editScoringSystem(item._id))
                }
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
