import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

import { backendApiUrl } from "../configs";

function useSocket() {
  const socket = useRef(null);

  const userDetails = useSelector((s) => s.root.user);

  const handleSocketEvents = () => {
    socket.current.on("connect", () => {
      socket.current.emit("join", { userId: userDetails._id });
      console.log("🔵 Socket connected");
    });

    socket.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    socket.current.on("joined", () => {
      console.log("✅ Successfully joined the room.");
    });

    socket.current.on("error", (msg) => {
      console.log("⚠️ Socket Error", msg);
      toast.error(msg);
    });
  };

  useEffect(() => {
    socket.current = io(backendApiUrl);
    handleSocketEvents();

    return () => {
      if (socket?.current?.disconnect && socket.current.connected) {
        socket.current.disconnect();
      }
    };
  }, []);

  return [socket.current];
}

export default useSocket;
