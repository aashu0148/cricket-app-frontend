import { makeApiCall } from "@/utils/util";

export const getAllTournaments = async () => {
  const path = "/tournaments";

  return await makeApiCall({
    functionName: "getAllTournaments",
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
