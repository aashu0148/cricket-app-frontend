import React, { useEffect, useState } from "react";
import styles from "./ScoringSystem.module.scss";
import Button from "@/Components/Button/Button";
import { getAllScoringSystems } from "@/apis/scoringSystem";
import { getDateFormatted } from "@/utils/util";
import { useNavigate } from "react-router-dom";
import { applicationRoutes } from "@/utils/constants";

export default function ScoringSystem() {
  const navigate = useNavigate();
  const [allScoringSystems, setAllScoringSystems] = useState([]);

  // **************************** Integrations ********************

  async function fetchScoringSystems() {
    const res = await getAllScoringSystems();
    if (!res) return;

    const result = res.data.map((item) => ({
      name: item.name,
      id: item._id,
      lastUpdated: getDateFormatted(item.updatedAt),
      createdAt: getDateFormatted(item.createdAt),
    }));

    setAllScoringSystems(result);
  }

  useEffect(() => {
    fetchScoringSystems();
  }, []);

  return (
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
                Last Updated : <span>{item.lastUpdated}</span>
              </p>
              <p className="row">
                Created By : <span>{item.createdAt}</span>
              </p>
            </div>
            <div className={`footer ${styles.buttonContainer}`}>
              <Button outlineButton>Copy</Button>
              <Button
                onClick={() =>
                  navigate(applicationRoutes.editScoringSystem(item.id))
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
