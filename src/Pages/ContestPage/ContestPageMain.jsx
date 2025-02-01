import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
import DraftPageInfoModal from "../DraftRoundPage/DraftPageInfoModal/DraftPageInfoModal";
import Info from "@/Components/Info/Info";
import { ScrollArea } from "@/Components/ui/scroll-area";
import ContestTabs from "./ContestTabs";
import ShareContest from "./ShareContest";

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
  leaveContest,
  updateContestTeamName,
} from "@/apis/contests";
import useContestStats from "@/utils/hooks/useContestStats";
import { useContest } from "./utils/context";
import { CONTEST_PAGE_TABS } from "./utils/constants";
import useConfettiAnimation from "@/utils/hooks/useConfettiAnimation";

import styles from "./ContestPage.module.scss";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal/ConfirmDeleteModal";

function ContestPageMain() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const { play } = useConfettiAnimation();
  const userDetails = useSelector((s) => s.user);
  const isMobileView = useSelector((s) => s.root.isMobileView);
  const { tournamentId, contestId } = params;

  const {
    contestDetails,
    tournamentDetails,
    completedTournamentMatches,
    playerPoints,
    isFetchingContest,
    isDraftRoundCompleted,
    isDraftRoundStarted,
    activeTab,
    showShareModal,
    setShowShareModal,
    setContestDetails,
    refetchContest,
  } = useContest();

  const [showEditContestModal, setShowEditContestModal] = useState(false);
  const [showJoinContestModal, setShowJoinContestModal] = useState(false);
  const [joiningContest, setJoiningContest] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState("");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const { participantWiseMatchWise, allPlayersWithPoints } = useContestStats({
    tournamentPlayers: tournamentDetails.players,
    completedMatches: completedTournamentMatches,
    teams: contestDetails.teams,
  });

  const currentUserTeam = contestDetails.teams?.length
    ? contestDetails.teams.find((e) => e.owner?._id === userDetails._id)
    : null;
  const isUserContestOwner =
    (typeof contestDetails.createdBy === "string"
      ? contestDetails.createdBy
      : contestDetails.createdBy?._id) === userDetails._id;

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
      leagueId: contestId,
      password: pass,
    });
    setJoiningContest(false);
    if (!res) return;

    toast.success("Contest joined successfully");
    setContestDetails(res.data);
    refetchContest();
  };

  async function handleLeaveContest() {
    setShowConfirmLeave(false);
    const res = await leaveContest(contestDetails._id);
    if (!res) return;

    toast.success("Contest left successfully");
    navigate(applicationRoutes.contests(tournamentDetails._id));
  }

  function checkForNew() {
    const isNew = searchParams.get("new") === "true";
    if (!isNew) return;

    setShowShareModal(true);
    play(); // play confetti animation
    setSearchParams(
      (prev) => {
        prev.delete("new");
        return prev;
      },
      { replace: true }
    );
  }

  useEffect(() => {
    if (isFetchingContest) return;

    checkForNew();
  }, [isFetchingContest]);

  useEffect(() => {
    if (!isFetchingContest) {
      if (contestDetails?.teams) {
        const userTeam = contestDetails.teams.find(
          (e) => e.owner?._id === userDetails._id
        );
        setTeamNameInput(userTeam?.name || "");
      }
    }
  }, [isFetchingContest]);

  return isFetchingContest ? (
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
      {showHowItWorks && (
        <DraftPageInfoModal onClose={() => setShowHowItWorks(false)} />
      )}
      {showShareModal && (
        <ShareContest onClose={() => setShowShareModal(false)} />
      )}
      {showConfirmLeave && (
        <ConfirmDeleteModal
          heading={`Leave the contest ?`}
          description={`Are you sure you want to leave this contest? Since you are the admin, the earliest joined member will become the new admin. If no one is there in this contest then the next person to join will become admin. This action cannot be undone, please be sure.`}
          buttonText="Leave"
          onClose={() => setShowConfirmLeave(false)}
          onDelete={handleLeaveContest}
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

              <div className="flex gap-md">
                <p
                  className="text-button"
                  onClick={() => setShowHowItWorks(true)}
                >
                  How it works
                </p>
              </div>
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

                {isDraftRoundStarted ? (
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
                      refetchContest();
                    }}
                    targetDate={contestDetails.draftRound?.startDate}
                  />
                )}
              </div>
            ) : !isDraftRoundStarted && !currentUserTeam ? (
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

            <div
              className="w-fit flex gap-1 items-center cursor-pointer"
              onClick={() => setShowShareModal(true)}
            >
              <p className="text-primary font-medium">Share with friends</p>

              <span className={"share"}>
                <Share2 />
              </span>
            </div>

            {!isDraftRoundStarted && isUserContestOwner ? (
              <p
                onClick={() => setShowConfirmLeave(true)}
                className="text-red-500 font-medium text-sm w-fit cursor-pointer hover:underline"
              >
                Leave contest ?
              </p>
            ) : (
              ""
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

          <ContestTabs />

          {activeTab === CONTEST_PAGE_TABS.PARTICIPANTS ? (
            <Participants
              participants={contestDetails.teams}
              playerPoints={playerPoints}
              completedMatches={completedTournamentMatches}
              allPlayersWithPoints={allPlayersWithPoints}
            />
          ) : activeTab === CONTEST_PAGE_TABS.MATCHES &&
            isDraftRoundCompleted ? (
            <Matches
              players={tournamentDetails.players}
              completedMatches={completedTournamentMatches}
            />
          ) : (
            ""
          )}
        </div>

        <div className={`sticky top-0 h-screen  ${styles.mainRight}`}>
          <ScrollArea>
            {isDraftRoundCompleted ? (
              <LeaderBoard
                participantWiseMatchWise={participantWiseMatchWise}
                completedMatches={completedTournamentMatches}
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
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default ContestPageMain;
