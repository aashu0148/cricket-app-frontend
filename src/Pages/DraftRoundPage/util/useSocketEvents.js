import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useDraftRound } from "./DraftRoundContext";
import { socketEventsEnum } from "@/utils/enums";

function useSocketEvents() {
  const userDetails = useSelector((s) => s.user);
  const { leagueId } = useParams();

  const {
    socket,
    setRoom,
    setNotifications,
    setRoomStatuses,
    setChatUnreadCount,
  } = useDraftRound();

  function joinRoom() {
    if (!socket) return;

    socket.emit(socketEventsEnum.joinRoom, {
      userId: userDetails._id,
      leagueId,
    });
  }

  function removeSocketListeners() {
    if (!socket) return;

    socket.off(socketEventsEnum.connect);
    socket.off(socketEventsEnum.disconnect);
    socket.off(socketEventsEnum.joinedRoom);
    socket.off(socketEventsEnum.notification);
    socket.off(socketEventsEnum.usersChange);
    socket.off(socketEventsEnum.chat);
    socket.off(socketEventsEnum.turnUpdate);
    socket.off(socketEventsEnum.draftRoundCompleted);
    socket.off(socketEventsEnum.roundStatusUpdate);
  }

  function handleSocketEvents() {
    if (!socket) return;
    if (socket.connected) joinRoom();

    socket.on(socketEventsEnum.connect, () => {
      joinRoom();
    });

    socket.on(socketEventsEnum.disconnect, () => {
      setRoomStatuses((p) => ({ ...p, connected: false }));
    });

    socket.on(socketEventsEnum.joinedRoom, (room) => {
      setRoom(room);
      setRoomStatuses((p) => ({ ...p, connected: true }));
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
      setChatUnreadCount((prev) => prev + 1);
    });

    socket.on(socketEventsEnum.draftRoundCompleted, (data) => {
      setRoomStatuses((p) => ({ ...p, completed: true }));
      console.log(`📜 Event: ${socketEventsEnum.draftRoundCompleted}`, data);
    });

    socket.on(socketEventsEnum.turnUpdate, (data) => {
      setRoomStatuses((prev) => ({
        ...prev,
        turn: data?.userId,
      }));
    });

    socket.on(socketEventsEnum.roundStatusUpdate, (data) => {
      setRoomStatuses((prev) => ({
        ...prev,
        ...data,
        started: data.isStarted,
      }));
    });
  }

  useEffect(() => {
    handleSocketEvents();

    return () => {
      removeSocketListeners();
    };
  }, [socket]);

  return null;
}

export default useSocketEvents;
