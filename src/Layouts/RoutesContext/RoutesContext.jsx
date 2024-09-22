import React, { createContext, useContext } from "react";

import { Home } from "react-feather";
import { applicationRoutes } from "@/utils/constants";
import { tournament } from "@/utils/svgs";

const RoutesContext = createContext();

export const RoutesProvider = ({ useAdminRoutes = false, children }) => {
  const adminSections = [
    {
      icon: tournament,
      value: applicationRoutes.adminTournament,
      label: "All Tournaments",
      link: applicationRoutes.adminTournament,
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
      icon: tournament,
      value: applicationRoutes.tournaments,
      label: "Tournaments",
      link: applicationRoutes.tournaments,
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
