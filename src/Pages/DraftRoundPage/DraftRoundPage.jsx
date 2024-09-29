import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import PageLoader from "@/Components/PageLoader/PageLoader";
import BreadCrumbs from "@/Components/Breadcrumbs/BreadCrumbs";
import Participants from "@/Pages/LeaguePage/Participants/Participants";
import Wishlist from "@/Pages/LeaguePage/Wishlist/Wishlist";
import Button from "@/Components/Button/Button";
import Notifications from "./Notifications/Notifications";
import Chat from "./Chat/Chat";
import PlayersPool from "./PlayersPool/PlayersPool";

import { getLeagueById } from "@/apis/leagues";
import { getTournamentById } from "@/apis/tournament";
import { handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";
import { socketEventsEnum } from "@/utils/enums";
import useSocketEvents from "./util/useSocketEvents";
import { useDraftRound } from "./util/DraftRoundContext";

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
  const { socket, roomStatuses } = useDraftRound();

  const [activeTab, setActiveTab] = useState(tabsEnum.wishlist);
  const [loading, setLoading] = useState(true);
  const [leagueDetails, setLeagueDetails] = useState({});
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [playerPoints, setPlayerPoints] = useState([]);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);

  const { tournamentId, leagueId } = params;
  const currentUserTeam = leagueDetails.teams?.length
    ? leagueDetails.teams.find((e) => e.owner?._id === userDetails._id)
    : null;
  const isDraftRoundCompleted = leagueDetails.draftRound?.completed;
  const draftRoundStarted =
    new Date() > new Date(leagueDetails.draftRound?.startDate);

  const handlePauseDraftRound = () => {
    if (!socket) return;

    socket.emit(socketEventsEnum.pauseRound, {
      leagueId,
      userId: userDetails._id,
    });
  };

  const handleResumeDraftRound = () => {
    if (!socket) return;

    socket.emit(socketEventsEnum.resumeRound, {
      leagueId,
      userId: userDetails._id,
    });
  };

  const fetchLeagueDetails = async () => {
    const res = await getLeagueById(leagueId);
    setLoading(false);
    if (!res) return;

    setLeagueDetails(res.data);
  };

  const fetchTournamentDetails = async () => {
    const res = await getTournamentById(tournamentId);
    if (!res) return;

    // lets not fill whole tournament into state, its pretty big and we wont be using it whole
    const tournament = res.data;
    setPlayerPoints(tournament.playerPoints);
    setTournamentPlayers(tournament.players || []);
    setTournamentDetails({
      _id: tournament._id,
      name: tournament.name,
      longName: tournament.longName,
      active: tournament.active,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      season: tournament.season,
      scoringSystem: tournament.scoringSystem,
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
      setLeagueDetails((p) => ({
        ...p,
        draftRound: { ...p.draftRound, paused: data.paused || true },
      }));
    });

    socket.on(socketEventsEnum.resumed, (data) => {
      setLeagueDetails((p) => ({
        ...p,
        draftRound: { ...p.draftRound, paused: data.paused || false },
      }));
    });

    socket.on(socketEventsEnum.picked, (data = {}) => {
      const { pickedById, pickedPlayerId } = data;
      if (!pickedById)
        return toast.error("Something is wrong updating players pool");

      const player = tournamentPlayers.find((p) => p._id === pickedPlayerId);
      if (!player)
        return toast.error("Something is wrong updating players pool");

      setLeagueDetails((p) => ({
        ...p,
        teams: p.teams.map((team) =>
          team.owner._id === pickedById
            ? { ...team, players: [...team.players, player] }
            : team
        ),
      }));
    });
  }

  useEffect(() => {
    if (!roomStatuses.turn) return;

    if (leagueDetails.draftRound)
      setLeagueDetails((p) => ({
        ...p,
        draftRound: { ...p.draftRound, currentTurn: roomStatuses.turn },
      }));
  }, [roomStatuses.turn]);

  useEffect(() => {
    handleSocketEvents();

    return () => {
      removeSocketListeners();
    };
  }, [socket, tournamentPlayers]);

  useEffect(() => {
    if (!draftRoundStarted && leagueDetails.draftRound?.startDate) {
      toast.error("Draft round not started");
      navigate(applicationRoutes.league(tournamentId, leagueId));
    } else if (isDraftRoundCompleted) {
      toast.error("Draft round Ended");
      navigate(applicationRoutes.league(tournamentId, leagueId));
    }
  }, [draftRoundStarted, leagueDetails]);

  useEffect(() => {
    fetchTournamentDetails();
    fetchLeagueDetails();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`${styles.container}`}>
      <div className={styles.mainLeft}>
        <BreadCrumbs
          links={[
            {
              label:
                isMobileView || !tournamentDetails.longName
                  ? "Tournaments"
                  : tournamentDetails.longName,
              value: "tournaments",
            },
            {
              label: "Leagues",
              value: "leagues",
            },
            {
              label: isMobileView ? "League" : leagueDetails.name,
              value: "league",
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
              : val === "leagues"
              ? handleAppNavigation(
                  e,
                  navigate,
                  applicationRoutes.leagues(tournamentId)
                )
              : val === "league"
              ? handleAppNavigation(
                  e,
                  navigate,
                  applicationRoutes.league(tournamentId, leagueId)
                )
              : ""
          }
        />

        <div className="flex-col-xs">
          <div className="spacious-head">
            <p className="heading">Draft Round</p>

            {leagueDetails.createdBy?._id === userDetails._id ? (
              leagueDetails.draftRound.paused ? (
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
          {!roomStatuses.connected && (
            <div className={styles.information}>
              <p className={styles.blink}>
                Connection Disconnected, trying to re-connect{" "}
              </p>
            </div>
          )}

          <div className={styles.information}>
            <label>Status:</label>
            <p>{roomStatuses.status}</p>
          </div>

          <div className={styles.information}>
            <label>Tournament:</label>
            <p>{tournamentDetails.longName}</p>
          </div>

          <div className={styles.information}>
            <label>League:</label>
            <p>{leagueDetails.name}</p>
          </div>

          <div className={styles.information}>
            <label>League Owner:</label>
            <p>{leagueDetails.createdBy?.name}</p>
          </div>
        </div>

        <Participants
          playerPoints={playerPoints}
          participants={leagueDetails.teams}
          activeTurnUserId={
            roomStatuses.started ? leagueDetails.draftRound?.currentTurn : ""
          }
        />

        <PlayersPool
          players={tournamentPlayers}
          playerPoints={playerPoints}
          teams={leagueDetails.teams}
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
              {t.label}
            </div>
          ))}
        </div>

        {activeTab === tabsEnum.wishlist && currentUserTeam ? (
          <Wishlist
            className={styles.wishlist}
            currentPlayers={currentUserTeam.wishlist}
            leagueId={leagueDetails._id}
            allPlayers={tournamentPlayers}
            onPlayerAdded={(p) =>
              setLeagueDetails((league) => ({
                ...league,
                teams: league.teams.map((t) =>
                  t._id === currentUserTeam._id
                    ? { ...t, wishlist: [...t.wishlist, p] }
                    : t
                ),
              }))
            }
            onPlayerRemoved={(pid) =>
              setLeagueDetails((league) => ({
                ...league,
                teams: league.teams.map((t) =>
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
