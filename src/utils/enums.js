const contestTypeEnum = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
};

const socketEventsEnum = {
  connect: "connect",
  disconnect: "disconnect",
  error: "error",
  notification: "notification",
  joinedRoom: "joined-room",
  leftRoom: "left-room",
  leaveRoom: "leave-room",
  joinRoom: "join-room",
  heartbeat: "heartbeat",
  chat: "chat",
  usersChange: "users-change",
  draftRoundCompleted: "draft-round-completed",
  pickPlayer: "pick-player",
  turnUpdate: "turn-update",
  roundStatusUpdate: "round-status-update",
  picked: "picked",
  pauseRound: "pause-round",
  paused: "paused",
  resumeRound: "resume-round",
  resumed: "resumed",
};

const playerRoleEnum = {
  BATTER: "BATTER",
  BOWLER: "BOWLER",
  ALLROUNDER: "ALLROUNDER",
};

export { contestTypeEnum, socketEventsEnum, playerRoleEnum };
