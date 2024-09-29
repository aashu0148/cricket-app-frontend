import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

import { backendApiUrl } from "../configs";
import { socketEventsEnum } from "../enums";
import { sleep } from "../util";

function useSocket(
  manualConnect = false,
  eventToFireOnBeforeDisconnect = { name: "", payload: {} }
) {
  const socket = useRef(null);

  const [_, setCounter] = useState(0);

  const handleSocketEvents = () => {
    socket.current.on(socketEventsEnum.connect, () => {
      console.log("⚡ Socket connected");
    });

    socket.current.on(socketEventsEnum.disconnect, () => {
      console.log("⚡🔴 Socket disconnected");
    });

    socket.current.on(socketEventsEnum.error, (msg) => {
      console.log("⚡⚠️ Socket Error:", msg);
      toast.error(msg);
    });
  };

  function initSocket() {
    if (socket.current) return;

    socket.current = io(backendApiUrl);
    handleSocketEvents();
    setCounter((p) => p + 1);
  }

  function connectSocket() {
    if (!socket.current) initSocket();
  }

  useEffect(() => {
    if (!manualConnect) initSocket();

    return async () => {
      if (socket.current?.disconnect && socket.current.connected) {
        if (eventToFireOnBeforeDisconnect.name) {
          socket.current.emit(
            eventToFireOnBeforeDisconnect.name,
            eventToFireOnBeforeDisconnect.payload
          );
          await sleep(1000); // wait before disconnecting otherwise socket will be disconnected before this event gets fired
        }

        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  return {
    socket: socket.current,
    connectToSocket: manualConnect
      ? connectSocket
      : () => console.log("Manual connect not passed as true"),
  };
}

export default useSocket;
