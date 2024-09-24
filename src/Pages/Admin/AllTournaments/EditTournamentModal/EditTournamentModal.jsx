import React, { useEffect, useState } from "react";

import Modal from "@/Components/Modal/Modal";
import styles from "./EditTournamentModal.module.scss";
import InputControl from "@/Components/InputControl/InputControl";
import { Trash2 } from "react-feather";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Button from "@/Components/Button/Button";
import Spinner from "@/Components/Spinner/Spinner";
import DatePicker from "@/Components/DatePicker/DatePicker";

import { getTournamentById } from "@/apis/tournament";
import { searchPlayerByName } from "@/apis/players";
import { getAllScoringSystems } from "@/apis/scoringSystem";

export default function EditTournamentModal({ tournamentId, handleClose }) {
  const [loading, setLoading] = useState(true);
  const [allScoringSystems, setAllScoringSystems] = useState([]);
  const [tournament, setTournament] = useState({});
  const [searchPlayer, setSearchPlayer] = useState("");
  const [playerResult, setPlayerResult] = useState([]);
  const [EditTournamentStates, setEditTournamentStates] = useState({
    name: "",
    longName: "",
    startDate: null,
    endDate: null,
    scoringSystem: { name: "", value: null },
  });

  const PlayerCard = ({ player }) => {
    return (
      <div className={styles.playerCard}>
        <Trash2 className={styles.icon} />
        <div className={styles.imageContainer}>
          <img
            src={player.image}
            alt={player.name}
            className={styles.playerImage}
          />
        </div>
        <div>
          <p className={styles.playerName}>{player.name}</p>
          <p className={styles.playerCountry}>({player.country})</p>
        </div>
      </div>
    );
  };

  // ****************************** Integrations *************************

  async function fetchScoringSystems() {
    const res = await getAllScoringSystems();
    setLoading(false);
    if (!res) return;

    const result = res.data.map((item) => ({
      label: item.name,
      value: item._id,
    }));
    setAllScoringSystems(result);
  }

  async function getTournamentDetails() {
    const res = await getTournamentById(tournamentId);
    setLoading(false);
    if (!res) return;

    setEditTournamentStates((prev) => ({
      ...prev,
      name: res.data?.name,
      longName: res.data?.longName,
      startDate: res?.data?.startDate,
      endDate: res?.data?.endDate,
      scoringSystem: { ...prev.scoringSystem, value: res?.data?.scoringSystem },
    }));
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
    fetchScoringSystems();
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
                value={EditTournamentStates?.name}
                onChange={() =>
                  setEditTournamentStates((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
              />
              <InputControl
                placeholder={"Enter long name"}
                label={"Long Name"}
                value={EditTournamentStates?.longName}
                onChange={() =>
                  setEditTournamentStates((p) => ({
                    ...p,
                    longName: e.target.value,
                  }))
                }
              />
              <div className="field">
                <label>Start Date</label>
                {/* <DatePicker
                  onChange={(e) =>
                    setEditTournamentStates((p) => ({ ...p, startDate: e }))
                  }
                  defaultDate={EditTournamentStates?.startDate}
                /> */}
              </div>

              <div className="field">
                <label>End Date</label>
                {/* <DatePicker
                  onChange={(e) =>
                    setEditTournamentStates((p) => ({ ...p, endDate: e }))
                  }
                  defaultDate={EditTournamentStates?.endDate}
                /> */}
              </div>
              <InputSelect
                small
                label="Scoring System"
                options={allScoringSystems}
                placeholder="Select a Scoring System"
                value={allScoringSystems.find(
                  (item) => item.value === EditTournamentStates?.scoringSystem
                )}
                onChange={(e) =>
                  setEditTournamentStates((p) => ({
                    ...p,
                    scoringSystem: e,
                  }))
                }
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
                      <p key={index} className={`flexBox`}>
                        {item.name}
                        <span>+ Add</span>
                      </p>
                    ))
                  : "No Result Found"}
              </div>
            </div>
          </>
        )}
        <div className="footer">
          <Button cancelButton onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button>Edit</Button>
        </div>
      </div>
    </Modal>
  );
}
