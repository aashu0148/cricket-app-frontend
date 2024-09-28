import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Edit2 } from "react-feather";

import PageLoader from "@/Components/PageLoader/PageLoader";
import BreadCrumbs from "@/Components/Breadcrumbs/BreadCrumbs";
import Countdown from "@/Components/Countdown/Countdown";
import Participants from "./Participants/Participants";
import Wishlist from "./Wishlist/Wishlist";
import EditLeagueModal from "./EditLeagueModal/EditLeagueModal";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import Button from "@/Components/Button/Button";
import JoinProtectedLeagueModal from "@/Components/LeagueCard/JoinProtectedLeagueModal";

import { handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";
import { leagueTypeEnum } from "@/utils/enums";
import { getLeagueById, joinLeague } from "@/apis/leagues";
import { getTournamentById } from "@/apis/tournament";

import styles from "./LeaguePage.module.scss";

function LeaguePage() {
  const navigate = useNavigate();
  const params = useParams();
  const userDetails = useSelector((s) => s.user);
  const { tournamentId, leagueId } = params;

  const [loading, setLoading] = useState(true);
  const [leagueDetails, setLeagueDetails] = useState({});
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [showEditLeagueModal, setShowEditLeagueModal] = useState(false);
  const [showJoinLeagueModal, setShowJoinLeagueModal] = useState(false);
  const [joiningLeague, setJoiningLeague] = useState(false);

  const currentUserTeam = leagueDetails.teams?.length
    ? leagueDetails.teams.find((e) => e.owner?._id === userDetails._id)
    : null;
  const isDraftRoundCompleted = leagueDetails.draftRound?.completed;
  const draftRoundStarted =
    new Date() > new Date(leagueDetails.draftRound?.startDate);

  const handleJoinLeague = async (pass = "") => {
    setJoiningLeague(true);
    const res = await joinLeague(leagueId, {
      leagueId,
      password: pass,
    });
    setJoiningLeague(false);
    if (!res) return;

    toast.success("League joined successfully");
    setLeagueDetails(res.data);
    fetchLeagueDetails();
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

    setTournamentDetails(res.data);
  };

  useEffect(() => {
    fetchTournamentDetails();
    fetchLeagueDetails();
  }, []);

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
      {showEditLeagueModal && (
        <EditLeagueModal
          leagueDetails={leagueDetails}
          tournamentName={tournamentDetails.longName}
          onClose={() => setShowEditLeagueModal(false)}
          onSuccess={(data) => {
            if (data) setLeagueDetails(data);

            setShowEditLeagueModal(false);
            fetchLeagueDetails();
          }}
        />
      )}
      {showJoinLeagueModal && (
        <JoinProtectedLeagueModal
          onClose={() => setShowJoinLeagueModal(false)}
          onJoin={handleJoinLeague}
        />
      )}

      <BreadCrumbs
        links={[
          {
            label: "Tournaments",
            value: "tournaments",
          },
          {
            label: "Leagues",
            value: "leagues",
          },
          {
            static: true,
            label: leagueDetails.name,
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
                applicationRoutes.leagues(leagueDetails.tournament._id)
              )
            : ""
        }
      />

      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <div className="flex-col-xs">
            <div className="flex">
              <p className="heading-big">{leagueDetails.name}</p>
              {leagueDetails.createdBy?._id === userDetails._id && (
                <div
                  className="icon"
                  onClick={() => setShowEditLeagueModal(true)}
                >
                  <Edit2 />
                </div>
              )}
            </div>
            <p className="desc">{leagueDetails.description}</p>

            <div className={styles.information}>
              <label>Tournament:</label>
              <p>{tournamentDetails.longName}</p>
            </div>

            <div className={styles.information}>
              <label>League Owner:</label>
              <p>{leagueDetails.createdBy?.name}</p>
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
                        applicationRoutes.draftRound(tournamentId, leagueId)
                      )
                    }
                  >
                    Join Draft Round
                  </Button>
                ) : (
                  <Countdown
                    onCountdownComplete={() => {
                      fetchLeagueDetails();
                    }}
                    targetDate={leagueDetails.draftRound?.startDate}
                  />
                )}
              </div>
            ) : !draftRoundStarted && !currentUserTeam ? (
              <Button
                disabled={joiningLeague}
                useSpinnerWhenDisabled
                onClick={() =>
                  leagueDetails.type === leagueTypeEnum.PRIVATE
                    ? setShowJoinLeagueModal(true)
                    : handleJoinLeague()
                }
              >
                Join this League
              </Button>
            ) : (
              ""
            )}
          </div>

          <Participants participants={leagueDetails.teams} />

          <LeaderBoard
            teams={leagueDetails.teams}
            playerPoints={tournamentDetails.playerPoints}
          />
        </div>

        {currentUserTeam && (
          <div className={styles.mainRight}>
            <p className={`heading`}>Wishlist</p>

            <Wishlist
              currentPlayers={currentUserTeam.wishlist}
              leagueId={leagueDetails._id}
              allPlayers={tournamentDetails.players}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaguePage;
