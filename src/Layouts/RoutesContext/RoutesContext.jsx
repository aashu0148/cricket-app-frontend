import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";

import { Home } from "react-feather";
import { applicationRoutes } from "@/utils/constants";
import { adminIcon, batsmanIcon, championCup, matchIcon, scoringIcon } from "@/utils/svgs";

const RoutesContext = createContext();

export const RoutesProvider = ({ useAdminRoutes = false, children }) => {
  const userDetails = useSelector((s) => s.user);

  const adminSections = [
    {
      icon: championCup,
      value: applicationRoutes.adminTournament,
      label: "All Tournaments",
      link: applicationRoutes.adminTournament,
    },
    {
      icon: scoringIcon,
      value: applicationRoutes.scoringSystem,
      label: "Scoring System",
      link: applicationRoutes.scoringSystem,
    },
    {
      icon: batsmanIcon,
      value: applicationRoutes.players,
      label: "Players",
      link: applicationRoutes.players,
    },
    {
      icon: matchIcon,
      value: applicationRoutes.tournamentMatches,
      label: "Matches",
      link: applicationRoutes.tournamentMatches,
    },
  ].filter((item) => item);

  const userSections = [
    {
      icon: <Home />,
      value: applicationRoutes.home,
      label: "Home",
      link: applicationRoutes.home,
      class: "route-dashboard",
    },
    {
      icon: championCup,
      value: applicationRoutes.tournaments,
      label: "Tournaments",
      link: applicationRoutes.tournaments,
    },
    userDetails.role === "ADMIN" && {
      icon: adminIcon,
      value: applicationRoutes.adminTournament,
      label: "Admin Panel",
      link: applicationRoutes.adminTournament,
    },
  ].filter((item) => item);

  const allRoutes = useAdminRoutes ? adminSections : userSections;

  return (
    <RoutesContext.Provider
      value={{
        routes: allRoutes,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

/**
 *
 * @returns {{
 * routes:[{value:string,link:string,label:string,class:string,icon:any}]
 * }}
 */
export const useRoutesContext = () => {
  const context = useContext(RoutesContext);

  if (!context) {
    throw new Error("useRoutesContext must be used within a RoutesProvider");
  }
  return context;
};
