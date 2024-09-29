const leagueTypeEnum = {
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
};

export { leagueTypeEnum, socketEventsEnum };
