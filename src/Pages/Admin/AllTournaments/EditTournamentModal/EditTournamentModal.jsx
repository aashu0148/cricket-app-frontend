import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Modal from "@/Components/Modal/Modal";
import InputControl from "@/Components/InputControl/InputControl";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Button from "@/Components/Button/Button";
import Spinner from "@/Components/Spinner/Spinner";
import DatePicker from "@/Components/DatePicker/DatePicker";
import PlayersPool from "./PlayersPool/PlayersPool";
import PlayerSmallCard, {
  FillerPlayerSmallCard,
} from "@/Components/PlayerSmallCard/PlayerSmallCard";
import AddPlayerModal from "./AddPlayerModal/AddPlayerModal";

import { getTournamentById, updateTournament } from "@/apis/tournament";
import { getAllScoringSystems } from "@/apis/scoringSystem";
import { searchPlayerByName } from "@/apis/players";
import { parsePlayersForSquadDetails } from "@/utils/util";

import styles from "./EditTournamentModal.module.scss";

export default function EditTournamentModal({
  tournamentId,
  handleClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(true);
  const [allScoringSystems, setAllScoringSystems] = useState([]);
  const [searchPlayer, setSearchPlayer] = useState("");
  const [searchingPlayer, setSearchingPlayer] = useState(false);
  const [playerResult, setPlayerResult] = useState([]);
  const [tournamentDetails, setTournamentDetails] = useState({
    name: "",
    longName: "",
    startDate: null,
    endDate: null,
    scoringSystem: "",
    players: [],
    allSquads: [],
  });
  const [errors, setErrors] = useState({
    name: "",
    longName: "",
    startDate: "",
    endDate: "",
    scoringSystem: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [addPlayerModal, setAddPlayerModal] = useState({
    showModal: false,
    player: {},
  });

  const handleChange = (label, val) => {
    setTournamentDetails((prev) => ({ ...prev, [label]: val }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  };

  const validateStates = () => {
    const errors = {};
    if (!tournamentDetails?.name) errors.name = "Name is a required field";
    if (!tournamentDetails?.longName)
      errors.longName = "Long name is a required field";
    if (!tournamentDetails.startDate)
      errors.startDate = "Start Date is a required field";
    if (!tournamentDetails.endDate)
      errors.endDate = "End Date is a required field";
    if (!tournamentDetails.scoringSystem)
      errors.scoringSystem = "Scoring System is a required field";

    setErrors(errors);
    if (Object.values(errors).length > 0) return false;
    return true;
  };

  const handleSubmit = async () => {
    const valid = validateStates();
    if (!valid) return;

    const body = {
      ...tournamentDetails,
      scoringSystemId: tournamentDetails.scoringSystem,
      players: tournamentDetails.players.map((e) => ({
        player: e.player._id,
        squadId: e.squadId,
      })),
    };
    delete body.allMatches;
    delete body.allSquads;

    setSubmitting(true);
    const res = await updateTournament(tournamentId, body);
    setSubmitting(false);
    if (!res) return;

    toast.success("Tournament updated successfully");
    handleClose();
    if (onSuccess) onSuccess();
  };

  async function fetchScoringSystems() {
    const res = await getAllScoringSystems();
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

    setTournamentDetails({
      ...res.data,
      players: parsePlayersForSquadDetails(
        res.data.players,
        res.data.allSquads
      ),
    });
  }

  async function handleSearch() {
    if (!searchPlayer) return;

    setPlayerResult([]);
    setSearchingPlayer(true);
    const res = await searchPlayerByName(searchPlayer);
    setSearchingPlayer(false);
    if (!res) return;

    setPlayerResult(
      res.data.map((p) => {
        delete p.stats;
        return p;
      })
    );
  }

  useEffect(() => {
    fetchScoringSystems();
    getTournamentDetails();
  }, []);

  return (
    <Modal>
      <div className={`modal-container ${styles.modalContainer}`}>
        {addPlayerModal.showModal && (
          <AddPlayerModal
            player={addPlayerModal.player}
            onClose={() => setAddPlayerModal({ showModal: false, player: {} })}
            squads={tournamentDetails.allSquads}
            onSelect={(data) => {
              setTournamentDetails((p) => ({
                ...p,
                players: [...p.players, data],
              }));
              setAddPlayerModal({ showModal: false });
            }}
          />
        )}

        <div className="flex-col-xxs">
          <h2 className={styles.heading}>Edit Tournament</h2>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className={styles.createForm} style={{ zIndex: "70" }}>
              <InputControl
                placeholder="Enter name"
                label="Name"
                value={tournamentDetails?.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
              />
              <InputControl
                placeholder={"Enter long name"}
                label={"Long Name"}
                value={tournamentDetails?.longName}
                onChange={(e) => handleChange("longName", e.target.value)}
                error={errors.longName}
              />
              <div className="field">
                <label>Start Date</label>
                <DatePicker
                  onChange={(e) => handleChange("startDate", e)}
                  defaultDate={tournamentDetails?.startDate}
                />
              </div>

              <div className="field">
                <label>End Date</label>
                <DatePicker
                  onChange={(e) => handleChange("endDate", e)}
                  defaultDate={tournamentDetails?.endDate}
                />
              </div>
              <InputSelect
                small
                label="Scoring System"
                options={allScoringSystems}
                placeholder="Select a Scoring System"
                value={allScoringSystems.find(
                  (item) => item.value === tournamentDetails?.scoringSystem
                )}
                onChange={(e) => handleChange("scoringSystem", e.value)}
                error={errors.scoringSystem}
              />
            </div>
            <div className={styles.section}>
              <h3 className="title">
                Players Count <span>{tournamentDetails?.players?.length}</span>
              </h3>

              <PlayersPool
                players={tournamentDetails.players}
                onPlayersUpdate={(newPlayers) =>
                  setTournamentDetails((p) => ({
                    ...p,
                    players: newPlayers,
                  }))
                }
              />
            </div>

            {/* Search field */}
            <div className={styles.searchSection}>
              <p>Search Player To Add</p>
              <div className="row">
                <InputControl
                  small
                  placeholder="Enter name"
                  value={searchPlayer}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  onChange={(e) => setSearchPlayer(e.target.value)}
                  icon={searchingPlayer ? <Spinner small /> : ""}
                />
                <Button
                  outlineButton
                  disabled={searchingPlayer}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
              <div className={styles.players}>
                {playerResult.map((item) => (
                  <PlayerSmallCard
                    key={item._id}
                    playerData={item}
                    showCountry
                    hideScore
                    showAddButton
                    bottomJSX={
                      tournamentDetails.players.some(
                        (e) => e.player._id === item._id
                      ) ? (
                        <Button disabled className={styles.smallButton} small>
                          Already exist
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            setAddPlayerModal({
                              showModal: true,
                              player: item,
                            })
                          }
                          className={styles.smallButton}
                          small
                        >
                          Add
                        </Button>
                      )
                    }
                  />
                ))}

                {new Array(5).fill(1).map((_, i) => (
                  <FillerPlayerSmallCard key={i} />
                ))}
              </div>
            </div>
          </>
        )}
        <div className="footer">
          <Button cancelButton onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={submitting}
            useSpinnerWhenDisabled
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
