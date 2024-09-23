import React, { useEffect, useState } from "react";
import Modal from "@/Components/Modal/Modal";
import styles from "./EditTournamentModal.module.scss";
import InputControl from "@/Components/InputControl/InputControl";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import { getTournamentById } from "@/apis/tournament";
import { getDateFormatted } from "@/utils/util";
import { searchPlayerByName } from "@/apis/players";
import Button from "@/Components/Button/Button";
import Spinner from "@/Components/Spinner/Spinner";
import DatePicker from "@/Components/DatePicker/DatePicker";

export default function EditTournamentModal({
  tournamentId,
  handleClose,
  allScoringSystems,
}) {
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState({});
  const [searchPlayer, setSearchPlayer] = useState("");
  const [playerResult, setPlayerResult] = useState([]);

  const PlayerCard = ({ player }) => {
    return (
      <div className={styles.playerCard}>
        <div className={styles.imageContainer}>
          <img
            src={player.image}
            alt={player.name}
            className={styles.playerImage}
          />
        </div>
        <p className={styles.playerName}>{player.name}</p>
        <p className={styles.playerCountry}>({player.country})</p>
      </div>
    );
  };
  // ****************************** Integrations *************************

  async function getTournamentDetails() {
    const res = await getTournamentById(tournamentId);
    setLoading(false);
    if (!res) return;
    setTournament(res.data);
  }
  async function handleSearch() {
    const res = await searchPlayerByName(searchPlayer);

    if (!res) return;

    const result = res?.data?.map((item) => ({
      name: item?.name,
      id: item?._id,
    }));
    setPlayerResult(result);
    console.log("response", res);
  }

  useEffect(() => {
    getTournamentDetails();
  }, []);

  useEffect(() => {
    if (!searchPlayer) {
      setPlayerResult([]);
    }
  }, [searchPlayer]);

  //   ***************************************** Return statement ********************

  return (
    <Modal onClose={handleClose}>
      <div className={`modal-container ${styles.modalContainer}`}>
        <div className="flex-col-xxs">
          <h2 className={styles.heading}>Edit Tournament</h2>
          <p>Edit Matches, define rules, and oversee the competition</p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className={styles.createForm}>
              <InputControl
                placeholder="Enter name"
                label="Name"
                value={tournament?.name}
              />
              <InputControl
                placeholder={"Enter long name"}
                label={"Long Name"}
                value={tournament?.longName}
              />
              <div className="field">
                <label>Start Date</label>
                <DatePicker />
              </div>

              <div className="field">
                <label>End Date</label>
                <DatePicker />
              </div>
              <InputControl
                label={"Start Date"}
                value={getDateFormatted(tournament?.startDate)}
              />
              <InputControl
                label={"End Date"}
                value={getDateFormatted(tournament?.endDate)}
              />
              <InputSelect
                small
                label="Scoring System"
                options={allScoringSystems}
                placeholder="Select a Scoring System"
                value={allScoringSystems.find(
                  (item) => item.value === tournament?.scoringSystem
                )}
              />
            </div>
            <div className={styles.section}>
              <h3>
                Players Count <span>{tournament?.players?.length}</span>
              </h3>
              <div className={styles.player_scrollBar}>
                {" "}
                {tournament?.players?.length ? (
                  tournament?.players?.map((item) => (
                    <div>
                      <PlayerCard player={item} />
                    </div>
                  ))
                ) : (
                  <p>No Players Found</p>
                )}
              </div>
            </div>
            {/* ************************** search field ********************* */}
            <div className={styles.searchSection}>
              <p>Search Player To Add</p>
              <div className="row">
                <InputControl
                  small
                  value={searchPlayer}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  onChange={(e) => setSearchPlayer(e.target.value)}
                />
                <Button onClick={() => handleSearch()}>Search</Button>
              </div>
              <div className={styles.playerFound}>
                {playerResult.length
                  ? playerResult.map((item, index) => (
                      <p
                        key={index}
                        className={
                          {
                            /* Add your condition for the hovered class here, e.g., item.isSelected ? styles.hovered : '' */
                          }
                        }
                      >
                        {item.name}
                      </p>
                    ))
                  : "No Result Found"}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
