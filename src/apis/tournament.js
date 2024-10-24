import { makeApiCall } from "@/utils/util";

export const getAllTournaments = async (ids = []) => {
  const path = `/tournaments?tournamentIds=${ids.length ? ids.join(",") : ""}`;

  return await makeApiCall({
    functionName: "getAllTournaments",
    defaultErrorMessage: "Failed to get Tournaments",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const getOngoingUpcomingTournaments = async () => {
  const path = "/tournaments/ongoing-upcoming";

  return await makeApiCall({
    functionName: "getOngoingUpcomingTournaments",
    defaultErrorMessage: "Failed to get Tournaments",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const getTournamentById = async (id) => {
  const path = `/tournaments/${id}`;

  return await makeApiCall({
    functionName: "getTournamentById",
    defaultErrorMessage: "Failed to get Tournament",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const updateTournament = async (id, payload) => {
  const path = `/tournaments/${id}`;

  return await makeApiCall({
    functionName: "updateTournament",
    defaultErrorMessage: "Failed to update tournament",
    fetchWrapperOptions: {
      path,
      requestType: "PATCH",
      payload,
    },
  });
};

export const deleteTournament = async (id) => {
  const path = `/tournaments/${id}`;

  return await makeApiCall({
    functionName: "deleteTournament",
    defaultErrorMessage: "Failed to delete tournament",
    fetchWrapperOptions: {
      path,
      requestType: "DELETE",
    },
  });
};

export const createTournament = async (payload) => {
  const path = `/tournaments`;

  return await makeApiCall({
    functionName: "createTournament",
    defaultErrorMessage: "Failed to create tournament",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

export const refreshTournament = async (id) => {
  const path = `/tournaments/refresh/${id}`;

  return await makeApiCall({
    functionName: "refreshTournament",
    defaultErrorMessage: "Failed to refresh tournament",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const insertMatchResultsIfNeededToTournament = async (id) => {
  const path = `/tournaments/${id}/matches/results`;

  return await makeApiCall({
    functionName: "insertMatchResultsIfNeededToTournament",
    defaultErrorMessage: "Failed to insert match results to tournament",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const getTournamentsWithPlayers = async (ids = []) => {
  const path = `/tournaments/players?tournamentIds=${ids.join(",")}`;

  return await makeApiCall({
    functionName: "getTournamentsWithPlayers",
    defaultErrorMessage: "Failed to tournaments",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const deletePlayerFromTournament = async (id, payload) => {
  const path = `/tournaments/${id}/players`;

  return await makeApiCall({
    functionName: "addPlayerToTournament",
    defaultErrorMessage: "Failed to add Player to Tournament",
    fetchWrapperOptions: {
      path,
      payload,
      requestType: "DELETE",
    },
  });
};

export const addPlayerToTournament = async (id, payload) => {
  const path = `/tournaments/${id}/players`;

  return await makeApiCall({
    functionName: "addPlayerToTournament",
    defaultErrorMessage: "Failed to Add Player to Tournament",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};
