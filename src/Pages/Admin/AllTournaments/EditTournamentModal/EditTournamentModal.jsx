import React, { useEffect, useState } from "react";
import Modal from "@/Components/Modal/Modal";
import styles from "./EditTournamentModal.module.scss";
import InputControl from "@/Components/InputControl/InputControl";
import { Trash2 } from "react-feather";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Button from "@/Components/Button/Button";
import Spinner from "@/Components/Spinner/Spinner";
import DatePicker from "@/Components/DatePicker/DatePicker";

import {
  addPlayerToTournament,
  deletePlayerFromTournament,
  getTournamentById,
} from "@/apis/tournament";
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
        <Trash2
          className={styles.icon}
          onClick={() => handlePlayerChange(player._id, "delete")}
        />
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

  //********************************* * Fetch scoring systems
  async function fetchScoringSystems() {
    const res = await getAllScoringSystems();
    if (!res) return;

    const result = res.data.map((item) => ({
      label: item.name,
      value: item._id,
    }));
    setAllScoringSystems(result);
  }

  //********************************* */ Get tournament details
  async function getTournamentDetails() {
    const res = await getTournamentById(tournamentId);
    setLoading(false);
    if (!res) return;

    setEditTournamentStates((prev) => ({
      ...prev,
      name: res.data?.name,
      longName: res.data?.longName,
      startDate: res.data?.startDate,
      endDate: res.data?.endDate,
      scoringSystem: { ...prev.scoringSystem, value: res.data?.scoringSystem },
    }));
    setTournament(res.data);
  }

  // ********************************** Search player by name ********************
  async function handleSearch() {
    if (!searchPlayer) return;
    const res = await searchPlayerByName(searchPlayer);

    if (!res) return;

    const result = res.data.map((item) => ({
      name: item?.name,
      id: item?._id,
    }));
    setPlayerResult(result);
  }

  async function handlePlayerChange(id, action) {
    if (!id) return;

    setLoading(true);
    const payload = { playerId: id };
    let api;

    if (action === "add") {
      api = addPlayerToTournament(tournamentId, payload);
    } else if (action === "delete") {
      api = deletePlayerFromTournament(tournamentId, payload);
    }

    try {
      const res = await api;
      if (!res) return;

      await getTournamentDetails();
    } catch (error) {
      console.error("Error handling player change:", error);
    } finally {
      setLoading(false);
    }
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

  // Return statement
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
                onChange={(e) =>
                  setEditTournamentStates((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <InputControl
                placeholder={"Enter long name"}
                label={"Long Name"}
                value={EditTournamentStates?.longName}
                onChange={(e) =>
                  setEditTournamentStates((prev) => ({
                    ...prev,
                    longName: e.target.value,
                  }))
                }
              />
              <div className="field">
                <label>Start Date</label>
                {/* <DatePicker
                  onChange={(e) =>
                    setEditTournamentStates((prev) => ({
                      ...prev,
                      startDate: e,
                    }))
                  }
                  defaultDate={EditTournamentStates?.startDate}
                /> */}
              </div>

              <div className="field">
                <label>End Date</label>
                {/* <DatePicker
                  onChange={(e) =>
                    setEditTournamentStates((prev) => ({
                      ...prev,
                      endDate: e,
                    }))
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
                  (item) =>
                    item.value === EditTournamentStates?.scoringSystem.value
                )}
                onChange={(e) =>
                  setEditTournamentStates((prev) => ({
                    ...prev,
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

            {/* Search field */}
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
                <Button onClick={handleSearch}>Search</Button>
              </div>
              <div className={styles.playerFound}>
                {playerResult.length
                  ? playerResult.map((item, index) => (
                      <p key={index} className={`flexBox`}>
                        {item.name}
                        <span
                          onClick={() => handlePlayerChange(item.id, "add")}
                        >
                          + Add
                        </span>
                      </p>
                    ))
                  : "No Result Found"}
              </div>
            </div>
          </>
        )}
        <div className="footer">
          <Button cancelButton onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={() => console.log("Edit action")}>Edit</Button>
        </div>
      </div>
    </Modal>
  );
}
