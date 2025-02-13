import toast from "react-hot-toast";

import { backendApiUrl } from "./configs";
import { getCurrentUser } from "@/apis/user";
import store from "@/store";
import actionTypes from "@/store/actionTypes";
import { espnOrigin } from "./constants";

export const handleNumericInputKeyDown = (event) => {
  let key = event.key;

  if (
    key === "Backspace" ||
    key === "Tab" ||
    key === "-" ||
    key === "Delete" ||
    key.toLowerCase() === "arrowleft" ||
    key.toLowerCase() === "arrowright" ||
    key.toLowerCase() === "arrowup" ||
    key.toLowerCase() === "arrowdown" ||
    (event.ctrlKey && (key == "v" || key == "V")) ||
    (event.metaKey && (key == "v" || key == "V"))
  )
    return false;

  if (!/[0-9.]/.test(key)) {
    event.returnValue = false;

    if (event.preventDefault) event.preventDefault();
  }
};

export function autoAdjustTextareaHeight(event = {}) {
  const textarea = event?.target;
  if (!textarea) return;

  textarea.style.height = "auto"; // Reset the height to auto to recalculate the scroll height

  // Set the height to the scroll height of the content
  textarea.style.height = textarea.scrollHeight + "px";
}

export const getRandomNumberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const copyToClipboard = (text, hideToast = false) => {
  if (!text) return;
  if (!hideToast) toast.success("Copied");
  navigator.clipboard.writeText(text);
};

export const getDebounceFunc = () => {
  let timeout;

  return (func, time = 200) => {
    clearTimeout(timeout);

    timeout = setTimeout(func, time);
  };
};

export const getThrottlingFunc = () => {
  let isThrottling = false;

  return (func, time = 200) => {
    if (isThrottling) return;
    isThrottling = true;
    func();

    setTimeout(() => {
      isThrottling = false;
    }, time);
  };
};

export const getUniqueId = (idLength = 15) => {
  let timeDigitsToKeep = Math.floor(idLength / 2);

  return (
    Date.now()
      .toString(16)
      .slice(-1 * timeDigitsToKeep) +
    parseInt(Math.random() * 9999999999).toString(16)
  ).slice(0, idLength);
};

export const errorToastLogger = (
  functionName,
  message,
  error,
  preventToast = false,
  neutralToast = false
) => {
  if (message) {
    if (typeof message !== "object" && !preventToast) {
      if (neutralToast) toast("" + message);
      else toast.error("" + message);
    }
    console.error(`Error at ${functionName} : ${error ? error : message}`);
    return;
  }

  console.error(`Error at ${functionName} : ${error ? error : ""}`);
};

export function formatSecondsToHrMinSec(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = parseInt(seconds % 60);

  return `${hours}hr ${minutes}min ${remainingSeconds}s`;
}

export const getAppToken = () => {
  return localStorage.getItem("cric-token");
};

export const setAppToken = (token) => {
  localStorage.setItem("cric-token", token);
  return true;
};

export const removeAppToken = () => {
  localStorage.removeItem("cric-token");
  return true;
};

export const handleLogout = async () => {
  removeAppToken();

  if (!window.location.href.includes("auth")) window.location.replace("/auth");
};

export const fetchWrapper = async ({
  path = "",
  payload = "",
  headers = {},
  requestType = "",
  isPublic = false,
  usePathAsUrl = false,
}) => {
  const url = usePathAsUrl ? path : backendApiUrl + path;
  const fetchOptions = {
    method: requestType || (payload ? "POST" : "GET"),
    headers: {
      ...headers,
    },
  };

  if (!isPublic) {
    const token = getAppToken();
    if (!token) {
      handleLogout();
      toast.error("Not logged in!");
      return;
    }

    fetchOptions.headers["Authorization"] = token;
  }

  if (payload && typeof payload === "object") {
    fetchOptions.body = JSON.stringify(payload);
    fetchOptions.headers["Content-Type"] = "application/json";
  }

  return fetch(url, fetchOptions);
};

export const makeApiCall = async ({
  functionName = "",
  defaultErrorMessage = "",
  fetchWrapperOptions = {
    path: "",
    payload: "",
    headers: {},
    requestType: "",
    isPublic: false,
    sendPayloadAsItIs: false,
    usePathAsUrl: false,
  },
  preventToast = false,
  neutralToast = false,
  returnRawResponse = false,
}) => {
  try {
    const response = await fetchWrapper({
      ...fetchWrapperOptions,
    });
    const data = await response?.json();

    if (returnRawResponse) return data;

    if (!data?.success) {
      errorToastLogger(
        functionName,
        data?.error?.message || data?.message || defaultErrorMessage,
        data?.error,
        preventToast,
        neutralToast
      );
      return false;
    }
    return data;
  } catch (err) {
    errorToastLogger(functionName, defaultErrorMessage, err);
    return false;
  }
};

export function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const validateEmail = (email) => {
  if (!email) return false;
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const validatePassword = (pass) => {
  if (!pass) return false;
  return /^(?=.*[0-9])(?=.*[!@#$%^&+*])[a-zA-Z0-9!@#$%^&+*]{6,18}$/.test(pass);
};

export const validateUrl = (str) => {
  if (!str) return;
  const res = str.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res ? true : false;
};

export const getFileHashSha256 = async (blob) => {
  if (!blob) return;

  const uint8Array = new Uint8Array(await blob.arrayBuffer());
  const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((h) => h.toString(16).padStart(2, "0")).join("");
};

export function formatSecondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = parseInt(seconds % 60);

  return `${minutes}:${
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
  }`;
}

export const getDateFormatted = (val, short = false, excludeYear = false) => {
  if (!val) return "";
  const date = new Date(val);
  var day = date.toLocaleString("en-in", { day: "numeric" });
  var month = date.toLocaleString("en-in", {
    month: short ? "short" : "long",
  });
  var year = date.toLocaleString("en-in", { year: "numeric" });

  if (excludeYear) return `${day} ${month}`;
  else return `${day} ${month}, ${year}`;
};

export function getTimeFormatted(value, includeSeconds = false) {
  if (!value) return;

  const date = new Date(value);
  let hours = date?.getHours();
  let minutes = date?.getMinutes();
  let seconds = date?.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime =
    hours + ":" + minutes + (includeSeconds ? `:${seconds} ` : " ") + ampm;

  return strTime;
}

export function shuffleArray(arr = []) {
  if (!Array.isArray(arr) || !arr.length) return;

  const array = [...arr];
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const getTimeDurationFromSeconds = (totalSeconds = 0) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let duration = "";

  if (hours > 0) {
    duration += hours + "hr ";
  }

  if (minutes > 0) {
    duration += minutes + "min ";
  }

  // if (seconds > 0) {
  //   duration += seconds + "sec";
  // }

  return duration.trim();
};

export const handleAppNavigation = (event, navigateObj, path) => {
  if (!event || !navigateObj || !path) return;

  const isCtrlKey = event.ctrlKey || event.metaKey;

  if (isCtrlKey) window.open(path, "_blank");
  else navigateObj(path);
};

export const refreshUserDetailsFromBackend = async () => {
  let res = await getCurrentUser();
  if (!res.data) return;

  const user = res.data;
  const subscription = user.subscription || {};

  if (!subscription.expiry || new Date() > new Date(subscription.expiry))
    subscription.isActive = false;
  else subscription.isActive = true;

  store.dispatch({
    type: actionTypes.USER_LOGIN,
    user: { ...user, subscription },
  });
};

export const getMatchScoreCardUrl = ({
  tournamentSlug,
  tournamentObjectId,
  matchSlug,
  matchObjectId,
}) => {
  return `${espnOrigin}/series/${tournamentSlug}-${tournamentObjectId}/${matchSlug}-${matchObjectId}/full-scorecard`;
};

export function sleep(time = 1000) {
  return new Promise((r) => setTimeout(r, time));
}

export const isEmojiPresentInString = (str) => /\p{Emoji}/u.test(str);

export function capitalizeText(text) {
  return text
    .split(" ") // Split the text into an array of words
    .map((word) => {
      // Capitalize the first letter and concatenate with the rest of the word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 *
 * @param {Array} teams
 * @param {Array<{player:string,points:number}>} playerPoints
 * @returns {Array}
 */
export const parseTeamsForScorePoints = (teams = [], playerPoints = []) => {
  if (!teams.length || !playerPoints.length) {
    console.error("INVALID INPUT FOR parseTeams", { teams, playerPoints });
    return teams;
  }

  const numberOfTopPlayersToInclude = 11;

  return teams
    .map((team) => {
      const players = team.players.map((item) => {
        const p = playerPoints.find((e) => e.player === item._id);
        if (p?.points) item.points = p.points;
        else item.points = NaN;

        return item;
      });

      const pointsArr = players
        .map((e) => e.points || 0)
        .sort((a, b) => (a > b ? -1 : 1));

      const teamPoints = pointsArr
        .slice(0, numberOfTopPlayersToInclude)
        .reduce((acc, curr) => acc + curr, 0);

      return {
        ...team,
        players,
        teamPoints,
      };
    })
    .sort((a, b) => (a.teamPoints < b.teamPoints ? 1 : -1));
};

export function parsePlayersForSquadDetails(players = [], allSquads = []) {
  return players.map((player) => {
    const { teamName, teamImage, teamSlug } =
      allSquads.find((item) => item.squadId === player.squadId) || {};

    return {
      ...player,
      squad: {
        teamImage,
        teamName,
        teamSlug,
      },
    };
  });
}

export const shareContest = async (
  { tid, contestId, ownerName = "", password = "" },
  copyUrlToClipboard = true
) => {
  const url = `${window.location.origin}/tournaments/${tid}/contests/${contestId}`;
  const shareObj = {
    title: `Checkout this contest from ${ownerName}`,
    text: `Join in to play the contest. ${
      password ? ` Password: ${password}` : ""
    }`,
    url,
  };

  const fullText = `${shareObj.title}\n\n${shareObj.text}\n\n${shareObj.url}`;
  const mobileView = window.innerWidth < 700;

  if (window.navigator.share && mobileView)
    await window.navigator.share(shareObj);

  if (copyUrlToClipboard) copyToClipboard(mobileView ? url : fullText);
};
