import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useDraftRound } from "./DraftRoundContext";
import { socketEventsEnum } from "@/utils/enums";

function useSocketEvents() {
  const userDetails = useSelector((s) => s.user);
  const { leagueId } = useParams();

  const { socket, setRoom, setNotifications, setChatUnreadCount } =
    useDraftRound();

  function joinRoom() {
    if (!socket) return;

    socket.emit(socketEventsEnum.joinRoom, {
      userId: userDetails._id,
      leagueId,
    });
  }

  function handleSocketEvents() {
    if (!socket) return;
    if (socket.connected) joinRoom();

    socket.on(socketEventsEnum.connect, () => {
      joinRoom();
    });

    socket.on(socketEventsEnum.joinedRoom, (room) => {
      setRoom(room);
      console.log(`✅ Successfully joined the room`);
    });

    socket.on(socketEventsEnum.notification, (e) => {
      if (!e.title) return console.log("Invalid notification format", e);

      setNotifications((prev) => [...prev, { ...e, timestamp: Date.now() }]);
    });

    socket.on(socketEventsEnum.usersChange, (e) => {
      if (!Array.isArray(e?.users)) return;

      setRoom((p) => ({ ...p, users: e.users }));
    });

    socket.on(socketEventsEnum.chat, (data) => {
      if (!data?.user?._id) return; // invalid chat

      setRoom((prev) => ({ ...prev, chats: [...prev.chats, data] }));

      // setChatUnreadCount((prev) => prev + 1);
    });
  }

  useEffect(() => {
    handleSocketEvents();
  }, [socket]);

  return null;
}

export default useSocketEvents;
