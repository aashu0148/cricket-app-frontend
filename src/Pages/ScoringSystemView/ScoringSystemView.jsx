import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLoader from "@/Components/PageLoader/PageLoader";
import PageNotFound from "@/Components/PageNotFound/PageNotFound";
import RenderTable from "./RenderTable";
import Logo from "@/Components/Navbar/Logo";

import { getScoringSystemById } from "@/apis/scoringSystem";
import batsman from "@/assets/images/batsman.jpg";
import keeper from "@/assets/images/keeper.jpg";
import {
  additionalRunsMilestone,
  amsrTable,
  battingStrikeRateMultipliers,
  boundaryPoints,
  dotBallPoints,
  fieldingPoints,
  runPoints,
  runsMilestoneBonus,
  wicketMilestoneBonus,
  wicketPoints,
} from "./config";

import styles from "./ScoringSystemView.module.scss";
import { Separator } from "@/Components/ui/separator";

const ScoringSystemView = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [scoringSystem, setScoringSystem] = useState({});

  const fetchScoringSystem = async () => {
    const res = await getScoringSystemById(id);
    setLoading(false);
    if (!res) return;

    setScoringSystem(res.data);
  };

  useEffect(() => {
    fetchScoringSystem();
  }, []);

  const { batting, bowling, fielding, name } = scoringSystem;

  return loading ? (
    <PageLoader fullPage />
  ) : !scoringSystem._id ? (
    <PageNotFound title="Data not found" desc="Invalid Scoring System ID" />
  ) : (
    <div className={styles.scoringSystemContainer}>
      <Logo />
      <h1 className={styles.title}>{name} Scoring System</h1>

      <div className={styles.main}>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">
            1. Average Match Scoring Rate (A.M.S.R)
          </h2>
          <RenderTable table={amsrTable} />
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">2. Batting Points</h2>

          <div className="flex flex-col gap-1 pl-4">
            <h3 className="font-medium text-lg">Run Points</h3>

            <p className="text-sm">1 run = {runPoints} point</p>
          </div>

          <RenderTable table={boundaryPoints} />
          <RenderTable table={runsMilestoneBonus} />
          <RenderTable table={additionalRunsMilestone} />

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium pl-4">
              Batting Strike Rate Bonus
            </h2>

            <RenderTable table={battingStrikeRateMultipliers} />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">3. Bowling Points</h2>
          <RenderTable table={wicketPoints} />
          <RenderTable table={dotBallPoints} />
          <RenderTable table={wicketMilestoneBonus} />
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">4. Fielding Points</h2>
          <RenderTable table={fieldingPoints} />
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">5. Total Player Score</h2>
          <p className="text-sm pl-4">
            Total Score = Batting Points + Bowling Points + Fielding Points
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoringSystemView;
