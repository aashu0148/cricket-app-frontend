import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

import useSocket from "@/utils/hooks/useSocket";
import { socketEventsEnum } from "@/utils/enums";

const DraftRoundContext = createContext();

export const DraftRoundProvider = ({ children }) => {
  const heartbeatInterval = useRef(null);

  const { socket, connectToSocket } = useSocket(true);

  const [room, setRoom] = useState({
    chats: [],
    users: [],
    name: "",
  });
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

  function handleHeartbeat() {
    if (heartbeatInterval.current) return;

    heartbeatInterval.current = setInterval(() => {
      socket.emit(socketEventsEnum.heartbeat);
      console.log("💟");
    }, 60 * 1000);
  }

  useEffect(() => {
    if (socket?.connected) handleHeartbeat();
    else {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  }, [socket]);

  useEffect(() => {
    connectToSocket();
  }, []);

  return (
    <DraftRoundContext.Provider
      value={{
        socket,
        room,
        chatUnreadCount,
        setChatUnreadCount,
        setRoom,
      }}
    >
      {children}
    </DraftRoundContext.Provider>
  );
};

/**
 *
 * @returns {{
 * socket:object,
 *  room:{
 *   name: string,
 *   leagueId: string,
 *   users: Array<{
 *     _id: string,
 *     name: string
 *   }>,
 *   chats: Array<{
 *     user: {
 *       _id: string,
 *       name: string,
 *       profileImage: string
 *     },
 *     message: string,
 *     timestamp: number
 *   }>
 * },
 * chatUnreadCount:Number,
 * setRoom:Function,
 * setChatUnreadCount:Function,
 * }}
 */
export const useDraftRound = () => {
  const context = useContext(DraftRoundContext);

  if (!context) {
    throw new Error("useDraftRound must be used within a DraftRoundProvider");
  }
  return context;
};
