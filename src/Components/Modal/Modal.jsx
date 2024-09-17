import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import styles from "./Modal.module.scss";

function Modal({
  className,
  title,
  onClose,
  doNotAnimate,
  noTopPadding,
  styleToInner,
  ...props
}) {
  const containerRef = useRef();
  const isMobileView = window.innerWidth < 768;

  useEffect(() => {
    if (isMobileView) {
      document.body.style.overflowY = "hidden";
    }

    const isHidden = document.body.style.overflowY === "hidden";
    if (!isHidden) document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  const modal = isMobileView ? (
    <div
      ref={containerRef}
      className={`${styles.mobileContainer} ${
        title || noTopPadding ? styles.modalWithTitle : ""
      } ${className || ""}`}
      onClick={(event) =>
        event.target == containerRef.current && onClose ? onClose() : ""
      }
      style={{ zIndex: +props.zIndex || "" }}
    >
      <div className={`${styles.inner} custom-scroll`} style={styleToInner}>
        {title && (
          <div className={styles.modalTitle}>
            <div className={styles.heading}>{title}</div>
            {onClose && <X onClick={onClose} />}
          </div>
        )}
        {props.children}
      </div>
    </div>
  ) : (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ""}`}
      onClick={(event) =>
        event.target == containerRef.current && onClose ? onClose() : ""
      }
    >
      <div
        className={`${styles.inner} ${
          doNotAnimate ? styles.preventAnimation : ""
        }`}
        style={styleToInner}
      >
        {props.children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}

export default Modal;
