import React, { useMemo } from "react";

import Img from "@/Components/Img/Img";
import Info from "@/Components/Info/Info";

import { parseTeamsForScorePoints } from "@/utils/util";

import styles from "./LeaderBoard.module.scss";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import MatchCard from "@/Components/MatchCard/MatchCard";

function LeaderBoard({
  participantWiseMatchWise = [],
  teams = [],
  playerPoints = [],
}) {
  const parsedTeams = useMemo(
    () => parseTeamsForScorePoints(teams, playerPoints),
    [teams, playerPoints]
  );
  const teamWiseData = useMemo(() => {
    if (!parsedTeams.length) return [];
    const data = [];
    participantWiseMatchWise.forEach((item) => {
      const team = parsedTeams.find((e) => e.owner?._id === item.participantId);
      if (!team) return;

      const teamData = data.find((e) => e.team?._id === team._id);
      if (teamData) {
        teamData.matches.push({
          match: item.match,
          teamPoints: item.teamPoints,
        });
      } else {
        data.push({
          team,
          matches: [
            {
              match: item.match,
              teamPoints: item.teamPoints,
            },
          ],
        });
      }
    });

    return data
      .map((e) => ({
        ...e,
        matches: e.matches.sort((a, b) =>
          new Date(a.teamPoints) < new Date(b.teamPoints) ? 1 : -1
        ),
      }))
      .sort((a, b) => b.team?.teamPoints - a.team?.teamPoints);
  }, [parsedTeams]);

  return (
    <div className={`page-container ${styles.container}`}>
      <div className="flex">
        <p className="heading sticky top-0">Leader Board</p>
        <Info
          infoTooltip={` A team’s score is determined by the points from its top 11 players.`}
        />
      </div>

      <Accordion type="multiple">
        <div className="flex flex-col gap-2">
          {teamWiseData.map((item, i) => (
            <AccordionItem
              key={item.team._id}
              className="w-full"
              value={item.team?.owner?.name + i}
            >
              <AccordionTrigger className="w-full hover:no-underline">
                <div className="flex gap-2 w-full items-center justify-between ">
                  <div className="flex gap-2 items-center">
                    <h1 className="text-xl font-medium text-center w-8">
                      {i + 1}
                    </h1>

                    <Img
                      className="size-8 rounded-full"
                      src={item.team?.owner?.profileImage}
                      usePLaceholderUserImageOnError
                    />
                    <p className={`font-medium`}>
                      {item.team?.name || item.team?.owner?.name}
                    </p>
                  </div>

                  <p className="font-medium text-sm">
                    {item.team?.teamPoints}{" "}
                    <span className="text-xs text-gray-500 font-medium">
                      points
                    </span>
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {item.matches.map((matchData) => (
                  <div
                    key={matchData.match?.matchId}
                    className="flex justify-between gap-2 items-start p-1 odd:bg-100"
                  >
                    <p className="text-sm text-ellipsis capitalize">
                      {matchData.match?.slug?.split("-")?.join(" ")}
                    </p>

                    <span className="font-medium text-sm flex gap-1">
                      {matchData.teamPoints}{" "}
                      <span className="text-xs text-gray-500 font-medium">
                        points
                      </span>
                    </span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </Accordion>
    </div>
  );
}

export default LeaderBoard;
