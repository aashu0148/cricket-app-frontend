import { makeApiCall } from "@/utils/util";

// 1. Create a League
export const createLeague = async (payload) => {
  const path = "/leagues";

  return await makeApiCall({
    functionName: "createLeague",
    defaultErrorMessage: "Failed to create League",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

// 2. Get All Leagues of a Tournament
export const getAllLeaguesOfTournament = async (tournamentId) => {
  const path = `/leagues/tournament/${tournamentId}`;

  return await makeApiCall({
    functionName: "getAllLeaguesOfTournament",
    defaultErrorMessage: "Failed to get Leagues for the Tournament",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 3. Get a Specific League by ID
export const getLeagueById = async (leagueId) => {
  const path = `/leagues/${leagueId}`;

  return await makeApiCall({
    functionName: "getLeagueById",
    defaultErrorMessage: "Failed to get League details",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 4. Update a League
export const updateLeague = async (leagueId, payload) => {
  const path = `/leagues/${leagueId}`;

  return await makeApiCall({
    functionName: "updateLeague",
    defaultErrorMessage: "Failed to update League",
    fetchWrapperOptions: {
      path,
      requestType: "PATCH",
      payload,
    },
  });
};

// 5. Delete a League
export const deleteLeague = async (leagueId) => {
  const path = `/leagues/${leagueId}`;

  return await makeApiCall({
    functionName: "deleteLeague",
    defaultErrorMessage: "Failed to delete League",
    fetchWrapperOptions: {
      path,
      requestType: "DELETE",
    },
  });
};

// 6. Join a League
export const joinLeague = async (leagueId, payload) => {
  const path = `/leagues/${leagueId}/join`;

  return await makeApiCall({
    functionName: "joinLeague",
    defaultErrorMessage: "Failed to join League",
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

// 9. Get Joined Leagues
export const getJoinedLeagues = async () => {
  const path = "/leagues/joined";

  return await makeApiCall({
    functionName: "getJoinedLeagues",
    defaultErrorMessage: "Failed to get Joined Leagues",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 10. Get Joined Leagues
export const getJoinedActiveLeagues = async () => {
  const path = "/leagues/joined/active";

  return await makeApiCall({
    functionName: "getJoinedActiveLeagues",
    defaultErrorMessage: "Failed to get Joined Leagues",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 11. Get Joinable Leagues of Tournament
export const getJoinableLeaguesOfTournament = async (tournamentId) => {
  const path = `/leagues/tournament/${tournamentId}`;

  return await makeApiCall({
    functionName: "getJoinableLeaguesOfTournament",
    defaultErrorMessage: "Failed to get Leagues",
    fetchWrapperOptions: {
      path,
    },
  });
};
