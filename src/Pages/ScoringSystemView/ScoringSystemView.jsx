import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import RenderTable from "./RenderTable";
import Logo from "@/Components/Navbar/Logo";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Separator } from "@/Components/ui/separator";

import batsman from "@/assets/images/batsman.jpg";
import keeper from "@/assets/images/keeper.jpg";
import { t20ScoringSystemData } from "./utility/t20";
import { odiScoringSystemData } from "./utility/odi";
import { FIELDS } from "./utility/constants";
import { applicationRoutes } from "@/utils/constants";

import styles from "./ScoringSystemView.module.scss";

const TABS = ["t20", "odi"];
const ScoringSystemView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const tab =
    id.toLowerCase().trim() === "t20"
      ? "t20"
      : id.toLowerCase().trim() === "odi"
      ? "odi"
      : "t20";
  const scoringSystem =
    tab === "t20" ? t20ScoringSystemData : odiScoringSystemData;

  return (
    <div className={`gap-5 flex flex-col ${styles.scoringSystemContainer}`}>
      <Logo />

      <Tabs
        value={tab}
        onValueChange={(v) =>
          navigate(applicationRoutes.viewScoringSystem(v), { replace: true })
        }
        className="w-fit min-w-[200px] mx-auto"
      >
        <TabsList className="flex items-center h-11">
          {TABS.map((label) => (
            <TabsTrigger
              className={`flex-1 !shadow-none font-semibold p-2 uppercase ${
                tab === label ? "!bg-primary !text-white" : ""
              }`}
              key={label}
              value={label}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <h1 className={"lg:text-3xl text-2xl text-center font-medium "}>
        {scoringSystem.name}
      </h1>

      <div className={styles.main}>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg lg:text-xl font-medium">
            1. Average Match Scoring Rate (A.M.S.R)
          </h2>
          <RenderTable table={scoringSystem.tables[FIELDS.AMSR]} />
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-lg lg:text-xl font-medium">2. Batting Points</h2>

          <div className="flex flex-col gap-1 pl-4">
            <h3 className="font-medium text-lg">Run Points</h3>

            <p className="text-sm">1 run = {scoringSystem.runPoints} point</p>
          </div>

          <RenderTable table={scoringSystem.tables[FIELDS.BOUNDARY_POINTS]} />
          <RenderTable
            table={scoringSystem.tables[FIELDS.RUN_MILESTONE_BONUS]}
          />
          <RenderTable
            table={scoringSystem.tables[FIELDS.ADDITIONAL_RUNS_MILESTONE]}
          />

          <div className="flex flex-col gap-4">
            <h2 className="text-lg lg:text-xl font-medium pl-4">
              Batting Strike Rate Bonus
            </h2>

            <RenderTable
              table={
                scoringSystem.tables[FIELDS.BATTING_STRIKE_RATE_MULTIPLIERS]
              }
            />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-lg lg:text-xl font-medium">3. Bowling Points</h2>
          <RenderTable table={scoringSystem.tables[FIELDS.WICKET_POINTS]} />
          <RenderTable table={scoringSystem.tables[FIELDS.DOT_BALL_POINTS]} />
          <RenderTable
            table={scoringSystem.tables[FIELDS.WICKET_MILESTONE_BONUS]}
          />

          <div className="flex flex-col gap-1 ">
            <h2 className="text-lg lg:text-xl font-medium pl-4">
              Bowling Economy Rate Bonus
            </h2>
            <RenderTable
              table={
                scoringSystem.tables[FIELDS.BOWLING_ECONOMY_RATE_MULTIPLIERS]
              }
            />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-lg lg:text-xl font-medium">4. Fielding Points</h2>
          <RenderTable table={scoringSystem.tables[FIELDS.FIELDING_POINTS]} />
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">5. Total Player Score</h2>
          <p className="text-lg lg:text-sm pl-4">
            Total Score = Batting Points + Bowling Points + Fielding Points
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoringSystemView;
