import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import PageLoader from "@/Components/PageLoader/PageLoader";
import BreadCrumbs from "@/Components/Breadcrumbs/BreadCrumbs";
import Participants from "@/Pages/ContestPage/Participants/Participants";
import Wishlist from "@/Pages/ContestPage/Wishlist/Wishlist";
import Button from "@/Components/Button/Button";
import Notifications from "./Notifications/Notifications";
import Chat from "./Chat/Chat";
import PlayersPool from "./PlayersPool/PlayersPool";
import DraftRoundCompleted from "./DraftRoundCompleted";
import InfoMessage from "./InfoMessage/InfoMessage";
import DraftPageInfoModal from "./DraftPageInfoModal/DraftPageInfoModal";

import { getContestById, makeUserActiveInDraftRound } from "@/apis/contests";
import { getTournamentById } from "@/apis/tournament";
import { handleAppNavigation, parsePlayersForSquadDetails } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";
import { socketEventsEnum } from "@/utils/enums";
import useSocketEvents from "./util/useSocketEvents";
import { useDraftRound } from "./util/DraftRoundContext";
import useContestStats from "@/utils/hooks/useContestStats";

import styles from "./DraftRoundPage.module.scss";

const tabsEnum = {
  wishlist: "wishlist",
  notification: "notification",
  chat: "chat",
};
const tabOptions = [
  {
    label: "Wishlist",
    value: tabsEnum.wishlist,
  },
  {
    label: "Notifications",
    value: tabsEnum.notification,
  },
  {
    label: "Chats",
    value: tabsEnum.chat,
  },
];
function DraftRoundPage() {
  const navigate = useNavigate();
  const params = useParams();
  const userDetails = useSelector((s) => s.user);
  const isMobileView = useSelector((s) => s.root.isMobileView);
  useSocketEvents();
  const {
    socket,
    notifications,
    roomStatuses,
    chatUnreadCount,
    setRoomStatuses,
  } = useDraftRound();

  const removeNotificationTimeout = useRef(null);
  const [activeTab, setActiveTab] = useState(tabsEnum.wishlist);
  const [loading, setLoading] = useState(true);
  const [showDraftRoundCompleted, setShowDraftRoundCompleted] = useState(false);
  const [contestDetails, setContestDetails] = useState({});
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [playerPoints, setPlayerPoints] = useState([]);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);
  const [notificationMsg, setNotificationMsg] = useState({
    show: false,
    message: "",
  });
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const { participantWiseMatchWise, allPlayersWithPoints } = useContestStats({
    tournamentPlayers: tournamentDetails.players,
    completedMatches: tournamentDetails.completedMatches,
    teams: contestDetails.teams,
  });

  const { tournamentId, contestId } = params;
  const currentUserTeam = contestDetails.teams?.length
    ? contestDetails.teams.find((e) => e.owner?._id === userDetails._id)
    : null;
  const isDraftRoundCompleted = contestDetails.draftRound?.completed;
  const draftRoundStarted =
    new Date() > new Date(contestDetails.draftRound?.startDate);
  const isUserInactive = roomStatuses.inactiveUsers?.includes(userDetails._id);

  const handlePauseDraftRound = () => {
    if (!socket) return;

    socket.emit(socketEventsEnum.pauseRound, {
      leagueId: contestId,
      userId: userDetails._id,
    });
  };

  const handleResumeDraftRound = () => {
    if (!socket) return;

    socket.emit(socketEventsEnum.resumeRound, {
      leagueId: contestId,
      userId: userDetails._id,
    });
  };

  const fetchContestDetails = async () => {
    const res = await getContestById(contestId);
    setLoading(false);
    if (!res) return;

    setContestDetails(res.data);
    setRoomStatuses((p) => ({
      ...p,
      inactiveUsers: res.data?.draftRound?.inactiveUsers || [],
    }));
  };

  const fetchTournamentDetails = async () => {
    const res = await getTournamentById(tournamentId);
    if (!res) return;

    // lets not fill whole tournament into state, its pretty big and we wont be using it whole
    const tournament = res.data;
    const players = parsePlayersForSquadDetails(
      tournament.players,
      tournament.allSquads
    );
    setPlayerPoints(tournament.playerPoints);
    setTournamentPlayers(players);
    setTournamentDetails({
      _id: tournament._id,
      name: tournament.name,
      longName: tournament.longName,
      active: tournament.active,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      season: tournament.season,
      scoringSystem: tournament.scoringSystem,
      completedMatches: tournament.completedMatches || [],
      players: parsePlayersForSquadDetails(
        tournament.players,
        tournament.allSquads
      ),
    });
  };

  function removeSocketListeners() {
    if (!socket) return;

    socket.off(socketEventsEnum.paused);
    socket.off(socketEventsEnum.resumed);
    socket.off(socketEventsEnum.picked);
  }

  function handleSocketEvents() {
    if (!socket) return;

    socket.on(socketEventsEnum.paused, (data) => {
      setContestDetails((p) => ({
        ...p,
        draftRound: {
          ...p.draftRound,
          paused: data.paused || true,
          turnTimestamp: null,
        },
      }));
      setRoomStatuses((p) => ({ ...p, turnTimestamp: null }));
    });

    socket.on(socketEventsEnum.resumed, (data) => {
      setContestDetails((p) => ({
        ...p,
        draftRound: { ...p.draftRound, paused: data.paused || false },
      }));
    });

    socket.on(socketEventsEnum.picked, (data = {}) => {
      const { pickedById, pickedPlayerId } = data;
      if (!pickedById)
        return toast.error("Something is wrong updating players pool");

      const player = tournamentPlayers.find(
        (p) => p.player._id === pickedPlayerId
      )?.player;
      if (!player)
        return toast.error("Something is wrong updating players pool");

      setContestDetails((p) => ({
        ...p,
        teams: p.teams.map((team) =>
          team.owner._id === pickedById
            ? { ...team, players: [...team.players, player] }
            : team
        ),
      }));
    });
  }

  async function handleMakeUserActive() {
    const res = await makeUserActiveInDraftRound(contestId);
    if (!res) return;

    setRoomStatuses((p) => ({
      ...p,
      inactiveUsers: p.inactiveUsers?.filter((e) => e !== userDetails._id),
    }));
    toast.success("You can now pick players");
  }

  useEffect(() => {
    if (roomStatuses.completed) setShowDraftRoundCompleted(true);
  }, [roomStatuses.completed]);

  useEffect(() => {
    if (!roomStatuses.turn) return;

    if (contestDetails.draftRound)
      setContestDetails((p) => ({
        ...p,
        draftRound: {
          ...p.draftRound,
          currentTurn: roomStatuses.turn,
          turnTimestamp: roomStatuses.turnTimestamp,
        },
      }));
  }, [roomStatuses.turn, roomStatuses.turnDir]);

  useEffect(() => {
    if (notifications.length) {
      const lastMsg = notifications[notifications.length - 1].title;

      if (lastMsg && !lastMsg.endsWith("turn!")) {
        clearTimeout(removeNotificationTimeout.current);

        setNotificationMsg({
          show: true,
          message: lastMsg,
        });

        removeNotificationTimeout.current = setTimeout(() => {
          setNotificationMsg({ show: false });
        }, 4000);
      }
    }
  }, [notifications]);

  useEffect(() => {
    handleSocketEvents();

    return () => {
      removeSocketListeners();
    };
  }, [socket, tournamentPlayers]);

  useEffect(() => {
    if (!draftRoundStarted && contestDetails.draftRound?.startDate) {
      toast.error("Draft round not started");
      navigate(applicationRoutes.contest(tournamentId, contestId));
    } else if (isDraftRoundCompleted) {
      toast.error("Draft round Ended");
      navigate(applicationRoutes.contest(tournamentId, contestId));
    }
  }, [draftRoundStarted, contestDetails]);

  useEffect(() => {
    fetchTournamentDetails();
    fetchContestDetails();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`${styles.container}`}>
      {showDraftRoundCompleted && <DraftRoundCompleted />}
      {showHowItWorks && (
        <DraftPageInfoModal onClose={() => setShowHowItWorks(false)} />
      )}

      <div className={styles.mainLeft}>
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
              label: isMobileView ? "Contest" : contestDetails.name,
              value: "contest",
            },
            {
              static: true,
              label: "Draft Round",
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
                  applicationRoutes.contests(tournamentId)
                )
              : val === "contest"
              ? handleAppNavigation(
                  e,
                  navigate,
                  applicationRoutes.contest(tournamentId, contestId)
                )
              : ""
          }
        />

        <div className="flex-col-xs">
          <div className="spacious-head">
            <p className="heading">Draft Round</p>

            <div className="flex gap-md">
              <p
                className="text-button"
                onClick={() => setShowHowItWorks(true)}
              >
                How it works
              </p>

              {contestDetails.createdBy?._id === userDetails._id ? (
                contestDetails.draftRound.paused ? (
                  <Button onClick={handleResumeDraftRound}>Resume round</Button>
                ) : (
                  <Button onClick={handlePauseDraftRound} outlineButton>
                    Pause round
                  </Button>
                )
              ) : (
                ""
              )}
            </div>
          </div>
          {!roomStatuses.connected && (
            <div className={styles.information}>
              <p className={styles.blink}>Connection Disconnected</p>
            </div>
          )}

          <div className={styles.information}>
            <label>Status:</label>
            <p style={{ textTransform: "capitalize" }}>{roomStatuses.status}</p>
          </div>

          <div className={styles.information}>
            <label>Tournament:</label>
            <p>{tournamentDetails.longName}</p>
          </div>

          <div className={styles.information}>
            <label>Contest:</label>
            <p>{contestDetails.name}</p>
          </div>

          <div className={styles.information}>
            <label>Contest Owner:</label>
            <p>{contestDetails.createdBy?.name}</p>
          </div>
        </div>

        {notificationMsg.show ? (
          <InfoMessage message={notificationMsg.message} />
        ) : (
          <div>
            <div style={{ height: "43px" }} />
          </div>
        )}

        {isUserInactive ? (
          <InfoMessage
            jsx={
              <div className="flex gap-2 items-center">
                <p className="text-red-500 font-semibold">
                  Auto pick is ON for you
                </p>
                <Button small outlineButton onClick={handleMakeUserActive}>
                  Turn OFF
                </Button>
              </div>
            }
          />
        ) : null}

        <Participants
          playerPoints={playerPoints}
          participants={contestDetails.teams}
          activeTurnUserId={
            roomStatuses.started ? contestDetails.draftRound?.currentTurn : ""
          }
          turnDir={roomStatuses.turnDir}
          lastTurnTimestamp={
            roomStatuses.turnTimestamp ||
            contestDetails.draftRound?.turnTimestamp
          }
          allPlayersWithPoints={allPlayersWithPoints}
        />

        <PlayersPool
          players={tournamentPlayers}
          playerPoints={playerPoints}
          teams={contestDetails.teams}
          currentTurnUserId={
            roomStatuses.started ? contestDetails.draftRound?.currentTurn : ""
          }
        />
      </div>

      <div className={styles.mainRight}>
        <div className={styles.tabs}>
          {tabOptions.map((t) => (
            <div
              className={`${t.value === activeTab ? styles.active : ""} ${
                styles.tab
              }`}
              onClick={() => setActiveTab(t.value)}
              key={t.value}
            >
              {t.value === tabsEnum.chat &&
              t.value !== activeTab &&
              chatUnreadCount > 0 ? (
                <p className={styles.count}>{chatUnreadCount}</p>
              ) : (
                ""
              )}
              {t.label}
            </div>
          ))}
        </div>

        {activeTab === tabsEnum.wishlist && currentUserTeam ? (
          <Wishlist
            className={styles.wishlist}
            currentPlayers={currentUserTeam.wishlist}
            contestId={contestDetails._id}
            allPlayers={tournamentPlayers}
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
        ) : activeTab === tabsEnum.notification ? (
          <Notifications className={styles.notifications} />
        ) : activeTab === tabsEnum.chat ? (
          <Chat className={styles.chat} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default DraftRoundPage;
