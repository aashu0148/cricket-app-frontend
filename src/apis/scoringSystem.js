import { makeApiCall } from "@/utils/util";

// 1. Get All Scoring Systems (Admin only)
export const getAllScoringSystems = async () => {
  const path = "/scoring-systems";

  return await makeApiCall({
    functionName: "getAllScoringSystems",
    defaultErrorMessage: "Failed to fetch scoring systems",
    fetchWrapperOptions: {
      path,
    },
  });
};

// 2. Create a New Scoring System (Admin only)
export const createScoringSystem = async (payload) => {
  const path = "/scoring-systems";

  return await makeApiCall({
    functionName: "createScoringSystem",
    defaultErrorMessage: "Failed to create scoring system",
    fetchWrapperOptions: {
      path,
      payload,
    },
  });
};

// 3. Get Scoring System by ID
export const getScoringSystemById = async (id) => {
  const path = `/scoring-systems/${id}`;

  return await makeApiCall({
    functionName: "getScoringSystemById",
    defaultErrorMessage: "Failed to fetch scoring system",
    fetchWrapperOptions: {
      path,
      isPublic: true,
    },
  });
};

// 4. Update Scoring System (Admin only)
export const updateScoringSystem = async (id, payload) => {
  const path = `/scoring-systems/${id}`;

  return await makeApiCall({
    functionName: "updateScoringSystem",
    defaultErrorMessage: "Failed to update scoring system",
    fetchWrapperOptions: {
      path,
      payload,
      requestType: "PATCH",
    },
  });
};

// 5. Delete Scoring System (Admin only)
export const deleteScoringSystem = async (id) => {
  const path = `/scoring-systems/${id}`;

  return await makeApiCall({
    functionName: "deleteScoringSystem",
    defaultErrorMessage: "Failed to delete scoring system",
    fetchWrapperOptions: {
      path,
      requestType: "DELETE",
    },
  });
};
