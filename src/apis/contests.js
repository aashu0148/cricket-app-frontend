import { makeApiCall } from "@/utils/util";

// 1. Create a Contest
export const createContest = async (payload) => {
  const path = "/leagues";

  return await makeApiCall({
    functionName: "createContest",
    defaultErrorMessage: "Failed to create Contest",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

// 2. Get All Contests of a Tournament
export const getAllContestsOfTournament = async (tournamentId) => {
  const path = `/leagues/tournament/${tournamentId}`;

  return await makeApiCall({
    functionName: "getAllContestsOfTournament",
    defaultErrorMessage: "Failed to get Contests for the Tournament",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 3. Get a Specific Contest by ID
export const getContestById = async (contestId) => {
  const path = `/leagues/${contestId}`;

  return await makeApiCall({
    functionName: "getContestById",
    defaultErrorMessage: "Failed to get Contest details",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 4. Update a Contest
export const updateContest = async (contestId, payload) => {
  const path = `/leagues/${contestId}`;

  return await makeApiCall({
    functionName: "updateContest",
    defaultErrorMessage: "Failed to update Contest",
    fetchWrapperOptions: {
      path,
      requestType: "PATCH",
      payload,
    },
  });
};

// 5. Delete a Contest
export const deleteContest = async (contestId) => {
  const path = `/leagues/${contestId}`;

  return await makeApiCall({
    functionName: "deleteContest",
    defaultErrorMessage: "Failed to delete Contest",
    fetchWrapperOptions: {
      path,
      requestType: "DELETE",
    },
  });
};

// 6. Join a Contest
export const joinContest = async (contestId, payload) => {
  const path = `/leagues/${contestId}/join`;

  return await makeApiCall({
    functionName: "joinContest",
    defaultErrorMessage: "Failed to join Contest",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

// 7. Add Player to Wishlist
export const addPlayerToWishlist = async (payload) => {
  const path = "/leagues/wishlist";

  return await makeApiCall({
    functionName: "addPlayerToWishlist",
    defaultErrorMessage: "Failed to add player to wishlist",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

export const updateWishlistOrder = async (payload) => {
  const path = "/leagues/wishlist/order";

  return await makeApiCall({
    functionName: "updateWishlistOrder",
    defaultErrorMessage: "Failed to update wishlist order",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

// 8. Remove Player from Wishlist
export const removePlayerFromWishlist = async (payload) => {
  const path = "/leagues/wishlist";

  return await makeApiCall({
    functionName: "removePlayerFromWishlist",
    defaultErrorMessage: "Failed to remove player from wishlist",
    fetchWrapperOptions: {
      path,
      requestType: "DELETE",
      payload,
    },
  });
};

// 9. Get Joined Contests
export const getJoinedContests = async () => {
  const path = "/leagues/joined";

  return await makeApiCall({
    functionName: "getJoinedContests",
    defaultErrorMessage: "Failed to get Joined Contests",
    fetchWrapperOptions: {
      path,
    },
  });
};

//  Get Joined Contests of tournament
export const getJoinedContestsOfTournament = async (tournamentId) => {
  const path = `/leagues/tournament/${tournamentId}/joined`;

  return await makeApiCall({
    functionName: "getJoinedContestsOfTournament",
    defaultErrorMessage: "Failed to get Joined Contests",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 10. Get Joined Running Contests
export const getJoinedActiveContests = async () => {
  const path = "/leagues/joined/active";

  return await makeApiCall({
    functionName: "getJoinedActiveContests",
    defaultErrorMessage: "Failed to get Joined Contests",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 11. Get Joinable Contests of Tournament
export const getJoinableContestsOfTournament = async (tournamentId) => {
  const path = `/leagues/tournament/${tournamentId}/joinable`;

  return await makeApiCall({
    functionName: "getJoinableContestsOfTournament",
    defaultErrorMessage: "Failed to get Contests",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const updateContestTeamName = async (contestId, payload) => {
  const path = `/leagues/${contestId}/team`;

  return await makeApiCall({
    functionName: "updateContestTeamName",
    defaultErrorMessage: "Failed to update Contest",
    fetchWrapperOptions: {
      path,
      payload,
      requestType: "PATCH",
    },
  });
};

export const leaveContest = async (contestId) => {
  const path = `/leagues/leave`;

  return await makeApiCall({
    functionName: "leaveContest",
    defaultErrorMessage: "Failed to leave Contest",
    fetchWrapperOptions: {
      path,
      payload: {
        leagueId: contestId,
      },
    },
  });
};

export const makeUserActiveInDraftRound = async (contestId) => {
  const path = `/leagues/draft/active`;

  return await makeApiCall({
    functionName: "makeUserActiveInDraftRound",
    defaultErrorMessage: "Failed to make user active",
    fetchWrapperOptions: {
      path,
      payload: {
        leagueId: contestId,
      },
    },
  });
};
