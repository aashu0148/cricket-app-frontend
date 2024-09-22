import { makeApiCall } from "@/utils/util";

// 1. Scrape and Store Player Data from ESPN
export const scrapeAndStorePlayerData = async (payload) => {
  const path = "/players/scrape";

  return await makeApiCall({
    functionName: "scrapeAndStorePlayerData",
    defaultErrorMessage: "Failed to scrape and store player data",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

// 2. Search Player by Name
export const searchPlayerByName = async (name) => {
  const path = `/players/search?name=${name}`;

  return await makeApiCall({
    functionName: "searchPlayerByName",
    defaultErrorMessage: "Failed to search for player",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 3. Get Player by ID
export const getPlayerById = async (playerId) => {
  const path = `/players/${playerId}`;

  return await makeApiCall({
    functionName: "getPlayerById",
    defaultErrorMessage: "Failed to get player details",
    fetchWrapperOptions: {
      path,
    },
  });
};
