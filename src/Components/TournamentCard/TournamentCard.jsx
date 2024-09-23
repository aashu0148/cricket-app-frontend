import React from "react";
import { useNavigate } from "react-router-dom";

import Img from "@/Components/Img/Img";
import Button from "../Button/Button";

import { getDateFormatted, handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";

import styles from "./TournamentCard.module.scss";

function TournamentCard({
  tournamentData = {},
  isAdmin = false,
  handleToggle,
}) {
  const navigate = useNavigate();
  const { allSquads, longName, season, startDate, endDate, allMatches } =
    tournamentData;

  const PlayerCard = ({ player }) => {
    return (
      <div className={styles.playerCard}>
        <div className={styles.imageContainer}>
          <img
            src={player.image}
            alt={player.name}
            className={styles.playerImage}
          />
        </div>
        <h3 className={styles.playerName}>{player.name}</h3>
        <p className={styles.playerCountry}>({player.country})</p>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      {tournamentData.ongoing && <p className={styles.tag}>Ongoing</p>}

      <div className={`flex-col-xxs ${styles.header}`}>
        <div className="spacious-head">
          <h2 className={styles.title}>{longName}</h2>
          <Button
            onClick={(e) => {
              isAdmin
                ? handleToggle(tournamentData?._id)
                : handleAppNavigation(
                    e,
                    navigate,
                    applicationRoutes.leagues(tournamentData._id)
                  );
            }}
          >
            {isAdmin ? "Edit" : "Explore Leagues"}
          </Button>
        </div>
        <p className={styles.season}>
          Season: <span>{season}</span>
        </p>
        <p className={styles.dates}>
          {getDateFormatted(startDate, true)} -{" "}
          {getDateFormatted(endDate, true)}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={`heading`}>Matches:</h3>

        <div
          className={`${styles.matchCards} ${
            allMatches.length < 10 ? styles.rowCards : ""
          }`}
        >
          {allMatches
            .sort((a, b) =>
              new Date(a.startDate) < new Date(b.startDate) ? 1 : -1
            )
            .map((match) => (
              <div key={match.matchId} className={styles.matchCard}>
                <p className={styles.date}>
                  {getDateFormatted(match.startDate)}
                </p>
                <div className={styles.matchTeams}>
                  <div className={styles.team}>
                    <Img
                      isEspnImage
                      usePlaceholderImageOnError
                      src={match.teams[0].image}
                      alt={match.teams[0].name}
                    />
                    <span className={styles.name}>{match.teams[0].name}</span>
                  </div>
                  <span className={styles.vs}>vs</span>
                  <div className={styles.team}>
                    <Img
                      isEspnImage
                      usePlaceholderImageOnError
                      src={match.teams[1].image}
                      alt={match.teams[1].name}
                    />
                    <span className={styles.name}>{match.teams[1].name}</span>
                  </div>
                </div>
                <p className={styles.matchStatus}>{match.statusText}</p>
              </div>
            ))}

          {new Array(4).fill(1).map((_, i) => (
            <div
              key={i}
              className={styles.matchCard}
              style={{ opacity: 0, padding: 0, pointerEvents: "none" }}
            />
          ))}
        </div>
      </div>

      {/* {isAdmin && (
        <div className={styles.section}>
          <h3>
            Players Count <span>{tournamentData.players.length}</span>
          </h3>
          <div
            className={styles.player_scrollBar}
            style={{
              height: tournamentData.players.length < 8 ? "fit-content" : "",
              flexDirection: tournamentData.players.length < 8 ? "row" : "",
            }}
          >
             {tournamentData.players.length
              ? tournamentData.players.map((item) => (
                  <div>
                    <PlayerCard player={item} />
                  </div>
                ))
              : "No Players Found"} 
          </div>
        </div>
      )} */}

      {allSquads.length ? (
        <>
          <div className={styles.section}>
            <h3 className={`heading`}>Squads:</h3>

            <div
              className={styles.squadCards}
              style={{
                height: allSquads.length < 8 ? "fit-content" : "",
                flexDirection: allSquads.length < 8 ? "row" : "",
              }}
            >
              {allSquads.map((squad) => (
                <div key={squad.objectId} className={styles.card}>
                  <div className={styles.image}>
                    <Img isEspnImage src={squad.teamImage} alt={squad.name} />
                  </div>
                  <p className={styles.name}>{squad.title}</p>
                </div>
              ))}
              {new Array(4).fill(1).map((_, i) => (
                <div
                  key={i}
                  className={styles.card}
                  style={{ opacity: 0, padding: 0, pointerEvents: "none" }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default TournamentCard;
