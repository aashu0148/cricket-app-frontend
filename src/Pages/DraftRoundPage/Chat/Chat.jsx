import React, { useEffect, useRef, useState } from "react";
import { Send } from "react-feather";
import { useSelector } from "react-redux";

import Img from "@/Components/Img/Img";
import Button from "@/Components/Button/Button";

import { getTimeFormatted, isEmojiPresentInString } from "@/utils/util";
import { useDraftRound } from "../util/DraftRoundContext";
import { socketEventsEnum } from "@/utils/enums";

import styles from "./Chat.module.scss";

function Message({ chat = {}, isOnRightSide = false, isConcurrent = false }) {
  const message = chat.message || "";
  const biggerMessage = message.length < 9 && isEmojiPresentInString(message);

  return (
    <div
      className={`${styles.message} ${
        isOnRightSide ? styles.rightMessage : ""
      } ${isConcurrent ? styles.concurrent : ""}`}
      style={{ marginTop: isConcurrent ? "" : "10px" }}
    >
      {!isConcurrent ? (
        <div className={styles.image}>
          <Img
            usePLaceholderUserImageOnError
            src={chat.user?.profileImage}
            alt={chat.user?.name}
            rel="no-referrer"
          />
        </div>
      ) : (
        <div className={styles.image}>
          <div className={styles.imagePlaceholder} />
        </div>
      )}

      <div className={`${styles.inner}`}>
        {!isConcurrent && <p className={styles.name}>{chat.user?.name}</p>}
        <p className={`${styles.text} ${biggerMessage ? styles.bigText : ""}`}>
          {message}
        </p>
        <p className={styles.timestamp}>{getTimeFormatted(chat.timestamp)}</p>
      </div>
    </div>
  );
}

function Chat({ className = "" }) {
  const userDetails = useSelector((s) => s.user);
  const { socket, room, setChatUnreadCount } = useDraftRound();

  const messagesOuterRef = useRef();
  const chatInputRef = useRef();

  const [inputMessage, setInputMessage] = useState("");

  const handleChatSubmission = () => {
    if (!inputMessage || !inputMessage.trim()) return;

    const msg = inputMessage;
    setInputMessage("");
    chatInputRef.current.focus();

    console.log(`🟡Emitted: ${socketEventsEnum.chat}`);
    socket.emit(socketEventsEnum.chat, {
      leagueId: room.leagueId,
      userId: userDetails._id,
      message: msg,
    });
  };

  useEffect(() => {
    if (messagesOuterRef.current) {
      messagesOuterRef.current.scrollTo({
        top: messagesOuterRef.current.scrollHeight,
      });
      setChatUnreadCount(0);
    }
  }, []);

  return (
    <div className={`${className || ""} ${styles.chatBox}`}>
      <div className={styles.messagesOuter} ref={messagesOuterRef}>
        <div className={styles.messages}>
          {Array.isArray(room.chats) && room.chats.length ? (
            room.chats.map((item, index) => (
              <Message
                key={item.user._id + index}
                chat={item}
                isConcurrent={
                  index > 0 && room.chats[index - 1].user._id == item.user._id
                }
                isOnRightSide={item.user._id == userDetails._id}
              />
            ))
          ) : (
            <p className={styles.empty}>No chats present for now!</p>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <input
          ref={chatInputRef}
          type="text"
          autoFocus
          placeholder="Type something..."
          value={inputMessage}
          onChange={(event) => setInputMessage(event.target.value)}
          onKeyUp={(event) =>
            event.key == "Enter" && !event.shiftKey
              ? handleChatSubmission()
              : ""
          }
        />
        <Button onClick={handleChatSubmission}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default Chat;
