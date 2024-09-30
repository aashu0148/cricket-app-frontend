import React, { useEffect, useState } from "react";
import styles from "./ScoringSystem.module.scss";
import Button from "@/Components/Button/Button";
import { getAllScoringSystems } from "@/apis/scoringSystem";
import { getDateFormatted } from "@/utils/util";
import ScoringSystemModal from "./EditScoringSystem/EditScoringSytem";

export default function ScoringSystem() {
  const [allScoringSystems, setAllScoringSystems] = useState([]);
  const [showScoringSystemModal, setShowScoringSystemModal] = useState(false);

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
          <div className={styles.card}>
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
              <Button>Copy</Button>
              <Button onClick={() => setShowScoringSystemModal(true)}>
                Edit
              </Button>
            </div>
            {/* ************************** scoring system modal ************************ */}
    
            {showScoringSystemModal ? (
              <ScoringSystemModal
                handleClose={() => setShowScoringSystemModal(false)}
                id={item.id}
              />
            ) : (
              ""
            )}

            
          </div>
        ))}
      </section>
    </div>
  );
}
