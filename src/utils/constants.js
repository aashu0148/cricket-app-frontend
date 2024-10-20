export const espnOrigin = "https://espncricinfo.com";

export const applicationRoutes = {
  home: "/",
  landing: "/",
  auth: "/auth",
  tournaments: "/tournaments",
  profile: "/profile",
  adminTournament: "/admin/tournaments",
  scoringSystem: "/admin/scoring-systems",
  players: "/admin/players",
  createScoringSystem: "/admin/scoring-systems/create",

  // function routes
  editScoringSystem: (scoringId = "") =>
    `/admin/scoring-systems/edit/${scoringId || ":scoringId"}`,
  contests: (tid = "") => `/tournaments/${tid || ":tournamentId"}/contests`,
  contest: (tournamentId = "", contestId = "") =>
    `/tournaments/${tournamentId || ":tournamentId"}/contests/${
      contestId || ":contestId"
    }`,
  draftRound: (tournamentId = "", contestId = "") =>
    `/tournaments/${tournamentId || ":tournamentId"}/contests/${
      contestId || ":contestId"
    }/draft-round`,
  viewScoringSystem: (systemId = "") => `/scoring-systems/${systemId || ":id"}`,
};

const commonColors = {
  red: "#fa3f35",
  green: "#33be2c",
  secondary: "#e2458b",
  primaryGradient: `linear-gradient(
  90deg,
  #e2458b 0%,
  #e2458b 0%,
  #ff914d 100%
)`,
  primary: "#11c9bb",
  primary2: "#7bc911",
  primary2_100: "#f6ffe9",
  primary2_200: "#f0ffdc",
  primary_100: "#effffe",
  primary_200: "#dafffd",
  primary_300: "#9afffa",
};

export const colors = {
  ...commonColors,
  black2: "#2d323a",
  gray: "#718096",
  bluishWhite: "#f1f8ff",
  white1: "#fafafa",
  white2: "#f0f0f3",
  lightPrimary: "#7088eb",

  heading: "#040406",
  title: "#040406",
  label: "#718096",
  desc: "#383b3e",
  button: "#fefefe",
  bg: "#fefefe",
  "bg-100": "#fafafa",
  "bg-200": "#f3f0f3",
  "bg-300": "#bcbcbc",
};
