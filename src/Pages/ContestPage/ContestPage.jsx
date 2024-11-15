import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Edit2, Share2 } from "react-feather";
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
import InputControl from "@/Components/InputControl/InputControl";
import Matches from "./Matches/Matches";
import Info from "@/Components/Info/Info";

import {
  handleAppNavigation,
  parsePlayersForSquadDetails,
  shareContest,
} from "@/utils/util";
import { applicationRoutes, colors } from "@/utils/constants";
import { contestTypeEnum } from "@/utils/enums";
import {
  getContestById,
  joinContest,
  updateContestTeamName,
} from "@/apis/contests";
import { getTournamentById } from "@/apis/tournament";

import styles from "./ContestPage.module.scss";

function ContestPage() {
  const navigate = useNavigate();
  const params = useParams();
  const userDetails = useSelector((s) => s.user);
  const isMobileView = useSelector((s) => s.root.isMobileView);
  const { tournamentId, contestId } = params;

  const [loading, setLoading] = useState(true);
  const [contestDetails, setContestDetails] = useState({});
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [completedTournamentMatches, setCompletedTournamentMatches] = useState(
    []
  );
  const [showEditContestModal, setShowEditContestModal] = useState(false);
  const [showJoinContestModal, setShowJoinContestModal] = useState(false);
  const [joiningContest, setJoiningContest] = useState(false);
  const [playerPoints, setPlayerPoints] = useState([]);
  const [teamNameInput, setTeamNameInput] = useState("");

  const currentUserTeam = contestDetails.teams?.length
    ? contestDetails.teams.find((e) => e.owner?._id === userDetails._id)
    : null;
  const isDraftRoundCompleted = contestDetails.draftRound?.completed;
  const draftRoundStarted =
    new Date() > new Date(contestDetails.draftRound?.startDate);

  const handleTeamNameInputBlur = async () => {
    const currName =
      contestDetails.teams.find((t) => t.owner._id === userDetails._id)?.name ||
      "";

    if (!teamNameInput.trim() || currName === teamNameInput) return;

    const res = await updateContestTeamName(contestId, {
      name: teamNameInput,
    });
    if (!res) return;

    setContestDetails((p) => ({
      ...p,
      teams: p.teams.map((t) =>
        t.owner?._id === userDetails._id ? { ...t, name: teamNameInput } : t
      ),
    }));
    toast.success("Team name updated successfully");
  };

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

    if (res.data?.teams) {
      const userTeam = res.data.teams.find(
        (e) => e.owner?._id === userDetails._id
      );
      setTeamNameInput(userTeam?.name || "");
    }
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
      players: parsePlayersForSquadDetails(
        tournament.players,
        tournament.allSquads
      ),
    });
    setCompletedTournamentMatches(tournament.completedMatches || []);
  };

  const fetchInitial = async () => {
    await fetchTournamentDetails();
    fetchContestDetails();
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      {showEditContestModal && (
        <EditContestModal
          contestDetails={contestDetails}
          tournamentEndDate={tournamentDetails.endDate}
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
            label:
              isMobileView || !tournamentDetails.longName
                ? "Contests"
                : tournamentDetails.longName,
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
          <div className="flex-col-xs" style={{ paddingRight: "10px" }}>
            <div className="spacious-head">
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

              <span
                className={"share"}
                onClick={(e) => {
                  e.stopPropagation();
                  shareContest({
                    tid: tournamentDetails._id,
                    contestId: contestDetails._id,
                    ownerName: contestDetails.createdBy?.name,
                    password: contestDetails.password,
                  });
                }}
              >
                <Share2 />
              </span>
            </div>
            <p className="desc" style={{ whiteSpace: "pre-wrap" }}>
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
              <div className={styles.information}>
                <label>Scoring system:</label>
                <a
                  href={applicationRoutes.viewScoringSystem(
                    tournamentDetails.scoringSystem
                  )}
                  target="_blank"
                  className="link"
                >
                  view
                </a>
              </div>
            )}
          </div>

          {currentUserTeam && (
            <div className="flex">
              <InputControl
                small
                label="Your team name"
                placeholder="Enter your team name"
                maxLength={50}
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                onBlur={handleTeamNameInputBlur}
              />
            </div>
          )}

          <Participants
            participants={contestDetails.teams}
            playerPoints={playerPoints}
            completedMatches={completedTournamentMatches}
          />

          {isDraftRoundCompleted && (
            <Matches
              players={tournamentDetails.players}
              completedMatches={completedTournamentMatches}
            />
          )}
        </div>

        {
          <div className={styles.mainRight}>
            {isDraftRoundCompleted ? (
              <LeaderBoard
                teams={contestDetails.teams}
                playerPoints={playerPoints}
              />
            ) : currentUserTeam ? (
              <>
                <div className="flex">
                  <p className={`heading`}>Wishlist</p>
                  <Info infoTooltip="The wishlist is a prioritized list of players a user hopes to draft or acquire for their fantasy team. You can create this wishlist to keep track of your preferred players before or during the draft. If you get timed out during your turn, the system will try to auto pick the highest available player from your wishlist." />
                </div>
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
                />{" "}
              </>
            ) : (
              ""
            )}
          </div>
        }
      </div>
    </div>
  );
}

export default ContestPage;
