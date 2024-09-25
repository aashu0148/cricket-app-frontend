import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import PageLoader from "@/Components/PageLoader/PageLoader";
import BreadCrumbs from "@/Components/Breadcrumbs/BreadCrumbs";
import Countdown from "@/Components/Countdown/Countdown";
import Participants from "./Participants/Participants";
import Wishlist from "./Wishlist/Wishlist";
import LeaderBoard from "./LeaderBoard/LeaderBoard";

import { getDateFormatted, handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";
import { getLeagueById } from "@/apis/leagues";
import { getTournamentById } from "@/apis/tournament";

import styles from "./LeaguePage.module.scss";

function LeaguePage() {
  const navigate = useNavigate();
  const params = useParams();
  const userDetails = useSelector((s) => s.user);
  const { leagueId } = params;

  const [loading, setLoading] = useState(true);
  const [leagueDetails, setLeagueDetails] = useState({});
  const [tournamentDetails, setTournamentDetails] = useState({});

  const currentUserTeam = leagueDetails.teams?.length
    ? leagueDetails.teams.find((e) => e.owner?._id === userDetails._id)
    : null;
  const isDraftRoundCompleted = leagueDetails.draftRound?.completed;

  const fetchLeagueDetails = async () => {
    const res = await getLeagueById(leagueId);
    setLoading(false);
    if (!res) return;

    setLeagueDetails(res.data);
  };

  const fetchTournamentDetails = async () => {
    const res = await getTournamentById(params.tournamentId);
    if (!res) return;

    setTournamentDetails(res.data);
  };

  useEffect(() => {
    fetchTournamentDetails();
    fetchLeagueDetails();
  }, []);

  console.log({ currentUserTeam, leagueDetails, tournamentDetails });

  return loading ? (
    <PageLoader fullPage />
  ) : (
    <div className={`page-container ${styles.container}`}>
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
            <p className="heading-big">{leagueDetails.name}</p>
            <p className="desc">{leagueDetails.description}</p>

            <div className={styles.information}>
              <label>Tournament:</label>
              <p>{tournamentDetails.longName}</p>
            </div>

            <div className={styles.information}>
              <label>League Owner:</label>
              <p>{leagueDetails.createdBy.name}</p>
            </div>

            {!isDraftRoundCompleted && (
              <div className={styles.information}>
                <label>Draft Round:</label>
                <Countdown targetDate={leagueDetails.draftRound.startDate} />
              </div>
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
