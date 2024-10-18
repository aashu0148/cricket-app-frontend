import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useSocket from "@/utils/hooks/useSocket";
import { socketEventsEnum } from "@/utils/enums";

const DraftRoundContext = createContext();

export const DraftRoundProvider = ({ children }) => {
  const userDetails = useSelector((s) => s.user);
  const { contestId } = useParams();
  const heartbeatInterval = useRef(null);
  const { socket, connectToSocket } = useSocket(true, {
    name: socketEventsEnum.leaveRoom,
    payload: { userId: userDetails._id, leagueId: contestId },
  });

  const [roomStatuses, setRoomStatuses] = useState({
    connected: true,
    turn: "",
    status: "",
    started: false,
    completed: false,
  });
  const [notifications, setNotifications] = useState([]);
  const [room, setRoom] = useState({
    chats: [],
    users: [],
    name: "",
  });
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

  function handleHeartbeat() {
    if (heartbeatInterval.current) return;

    heartbeatInterval.current = setInterval(() => {
      socket.emit(socketEventsEnum.heartbeat, {
        userId: userDetails._id,
        leagueId: contestId,
      });
      console.log("💟");
    }, 60 * 1000);
  }

  useEffect(() => {
    if (socket) handleHeartbeat();
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
        notifications,
        roomStatuses,
        setRoomStatuses,
        setNotifications,
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
 * roomStatuses:{
 * connected:boolean,started:boolean,status:string,turn:string,completed:boolean
 * },
 *  room:{
 *   name: string,
 *   contestId: string,
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
 * notifications:Array<{title:string, desc:string,timestamp:Number}>,
 * setNotifications:Function,
 * setRoom:Function,
 * setChatUnreadCount:Function,
 * setRoomStatuses:Function,
 * }}
 */
export const useDraftRound = () => {
  const context = useContext(DraftRoundContext);

  if (!context) {
    throw new Error("useDraftRound must be used within a DraftRoundProvider");
  }
  return context;
};
