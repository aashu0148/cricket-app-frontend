import { makeApiCall } from "@/utils/util";

export const getCurrentUser = async () => {
  const path = `/user/me`;

  return await makeApiCall({
    functionName: "getCurrentUser",
    defaultErrorMessage: "Failed to get user",
    fetchWrapperOptions: {
      path,
    },
  });
};

export const signupUser = async (payload) => {
  const path = `/user/signup`;

  return await makeApiCall({
    functionName: "signupUser",
    defaultErrorMessage: "Failed to create user",
    fetchWrapperOptions: {
      path,
      payload,
      isPublic: true,
    },
  });
};

export const loginUser = async (payload) => {
  const path = `/user/google-login`;

  return await makeApiCall({
    functionName: "loginUser",
    defaultErrorMessage: "Failed to login user",
    fetchWrapperOptions: {
      path,
      payload,
      isPublic: true,
    },
  });
};

export const updateUserDetails = async (payload) => {
  const path = `/user`;

  return await makeApiCall({
    functionName: "updateUserDetails",
    defaultErrorMessage: "Failed to update user",
    fetchWrapperOptions: {
      path,
      payload,
      requestType: "PATCH",
    },
  });
};

export const checkIfUserAdmin = async () => {
  const path = `/user/is-admin`;

  return await makeApiCall({
    functionName: "checkIfUserAdmin",
    defaultErrorMessage: "Failed to check for admin",
    preventToast: true,
    fetchWrapperOptions: {
      path,
    },
  });
};
