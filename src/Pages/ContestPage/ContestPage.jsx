import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Edit2 } from "react-feather";
import Linkify from "react-linkify";

import PageLoader from "@/Components/PageLoader/PageLoader";
import BreadCrumbs from "@/Components/Breadcrumbs/BreadCrumbs";
import Countdown from "@/Components/Countdown/Countdown";
import Participants from "./Participants/Participants";
import Wishlist from "./Wishlist/Wishlist";
import EditContestModal from "./EditContestModal/EditContestModal";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import Button from "@/Components/Button/Button";
import JoinProtectedContestModal from "@/Components/ContestCard/JoinProtectedContestModal";

import { handleAppNavigation } from "@/utils/util";
import { applicationRoutes, colors } from "@/utils/constants";
import { contestTypeEnum } from "@/utils/enums";
import { getContestById, joinContest } from "@/apis/contests";
import { getTournamentById } from "@/apis/tournament";

import styles from "./ContestPage.module.scss";

function ContestPage() {
  const navigate = useNavigate();
  const params = useParams();
  const userDetails = useSelector((s) => s.user);
  const { tournamentId, contestId } = params;

  const [loading, setLoading] = useState(true);
  const [contestDetails, setContestDetails] = useState({});
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [showEditContestModal, setShowEditContestModal] = useState(false);
  const [showJoinContestModal, setShowJoinContestModal] = useState(false);
  const [joiningContest, setJoiningContest] = useState(false);
  const [playerPoints, setPlayerPoints] = useState([]);

  const currentUserTeam = contestDetails.teams?.length
    ? contestDetails.teams.find((e) => e.owner?._id === userDetails._id)
    : null;
  const isDraftRoundCompleted = contestDetails.draftRound?.completed;
  const draftRoundStarted =
    new Date() > new Date(contestDetails.draftRound?.startDate);

  const handleJoinContest = async (pass = "") => {
    setJoiningContest(true);
    const res = await joinContest(contestId, {
      contestId,
      password: pass,
    });
    setJoiningContest(false);
    if (!res) return;

    toast.success("Contest joined successfully");
    setContestDetails(res.data);
    fetchContestDetails();
  };
  const fetchContestDetails = async () => {
    const res = await getContestById(contestId);
    setLoading(false);
    if (!res) return;

    setContestDetails(res.data);
  };

  const fetchTournamentDetails = async () => {
    const res = await getTournamentById(tournamentId);
    if (!res) return;

    // lets not fill whole tournament into state, its pretty big and we wont be using it whole
    const tournament = res.data;
    setPlayerPoints(tournament.playerPoints);
    setTournamentDetails({
      _id: tournament._id,
      name: tournament.name,
      longName: tournament.longName,
      active: tournament.active,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      season: tournament.season,
      scoringSystem: tournament.scoringSystem,
      players: tournament.players,
    });
  };

  useEffect(() => {
    fetchTournamentDetails();
    fetchContestDetails();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      {showEditContestModal && (
        <EditContestModal
          contestDetails={contestDetails}
          tournamentName={tournamentDetails.longName}
          onClose={() => setShowEditContestModal(false)}
          onSuccess={() => {
            setShowEditContestModal(false);
            fetchContestDetails();
          }}
        />
      )}
      {showJoinContestModal && (
        <JoinProtectedContestModal
          onClose={() => setShowJoinContestModal(false)}
          onJoin={handleJoinContest}
        />
      )}

      <BreadCrumbs
        links={[
          {
            label: "Tournaments",
            value: "tournaments",
          },
          {
            label: "Contests",
            value: "contests",
          },
          {
            static: true,
            label: contestDetails.name,
            value: "name",
          },
        ]}
        onClick={(e, val) =>
          val === "tournaments"
            ? handleAppNavigation(e, navigate, applicationRoutes.tournaments)
            : val === "contests"
            ? handleAppNavigation(
                e,
                navigate,
                applicationRoutes.contests(contestDetails.tournament._id)
              )
            : ""
        }
      />

      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <div className="flex-col-xs">
            <div className="flex">
              <p className="heading-big">{contestDetails.name}</p>
              {contestDetails.createdBy?._id === userDetails._id && (
                <div
                  className="icon"
                  onClick={() => setShowEditContestModal(true)}
                >
                  <Edit2 />
                </div>
              )}
            </div>
            <p className="desc" style={{ whiteSpace: "pre" }}>
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, k) => (
                  <a
                    target="_blank"
                    href={decoratedHref}
                    rel="noreferrer"
                    key={k}
                    style={{
                      color: colors.primary2,
                      textDecoration: "underline",
                    }}
                  >
                    {decoratedText}
                  </a>
                )}
              >
                {contestDetails.description}
              </Linkify>
            </p>

            <div className={styles.information}>
              <label>Tournament:</label>
              <p>{tournamentDetails.longName}</p>
            </div>

            <div className={styles.information}>
              <label>Contest Owner:</label>
              <p>{contestDetails.createdBy?.name}</p>
            </div>

            {!isDraftRoundCompleted && currentUserTeam ? (
              <div className={styles.information}>
                <label>Draft Round:</label>

                {draftRoundStarted ? (
                  <Button
                    onClick={(e) =>
                      handleAppNavigation(
                        e,
                        navigate,
                        applicationRoutes.draftRound(tournamentId, contestId)
                      )
                    }
                  >
                    Join Draft Round
                  </Button>
                ) : (
                  <Countdown
                    onCountdownComplete={() => {
                      fetchContestDetails();
                    }}
                    targetDate={contestDetails.draftRound?.startDate}
                  />
                )}
              </div>
            ) : !draftRoundStarted && !currentUserTeam ? (
              <Button
                disabled={joiningContest}
                useSpinnerWhenDisabled
                onClick={() =>
                  contestDetails.type === contestTypeEnum.PRIVATE
                    ? setShowJoinContestModal(true)
                    : handleJoinContest()
                }
              >
                Join this Contest
              </Button>
            ) : (
              ""
            )}
          </div>

          <Participants
            participants={contestDetails.teams}
            playerPoints={playerPoints}
          />

          {draftRoundStarted && (
            <LeaderBoard
              teams={contestDetails.teams}
              playerPoints={playerPoints}
            />
          )}
        </div>

        {currentUserTeam && (
          <div className={styles.mainRight}>
            <p className={`heading`}>Wishlist</p>

            <Wishlist
              currentPlayers={currentUserTeam.wishlist}
              contestId={contestDetails._id}
              allPlayers={tournamentDetails.players}
              onPlayerAdded={(p) =>
                setContestDetails((contest) => ({
                  ...contest,
                  teams: contest.teams.map((t) =>
                    t._id === currentUserTeam._id
                      ? { ...t, wishlist: [...t.wishlist, p] }
                      : t
                  ),
                }))
              }
              onPlayerRemoved={(pid) =>
                setContestDetails((contest) => ({
                  ...contest,
                  teams: contest.teams.map((t) =>
                    t._id === currentUserTeam._id
                      ? {
                          ...t,
                          wishlist: t.wishlist.filter((e) => e._id !== pid),
                        }
                      : t
                  ),
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestPage;
