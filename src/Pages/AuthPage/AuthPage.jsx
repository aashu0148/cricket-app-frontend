import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "@/Components/Button/Button";

import { applicationRoutes } from "@/utils/constants";
import { backendApiUrl, googleClientId } from "@/utils/configs";
import { setAppToken } from "@/utils/util";

import styles from "./AuthPage.module.scss";

function AuthPage() {
  const googleSignInButtonRef = useRef();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user);
  const isMobileView = useSelector((state) => state.root.isMobileView);
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);

  const initializeGsi = (fallback = "") => {
    if (!window.google) return;

    const href = window.location.href;
    const queryParams = href.split("?")[1] || "";

    const googleRedirectUrl = `${backendApiUrl}/user/google-login?origin=${window.location.origin}&fallback=${fallback}&query=${queryParams}`;

    setTimeout(() => setLoading(false), 1200);

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      ux_mode: "redirect",
      login_uri: googleRedirectUrl,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("g_id_signin"),
      { theme: "outline", size: "large", width: 390 }
    );
  };

  useEffect(() => {
    const query = searchParams.get("query") || "";
    const fallback = searchParams.get("fallback");
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      setAppToken(accessToken);

      if (fallback && fallback !== "null") window.location.replace(fallback);
      else window.location.replace(query ? `/?${query}` : "/");
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => initializeGsi(fallback);
    script.async = true;
    script.id = "google-client-script";
    document.body.appendChild(script);

    return () => {
      if (window.google) window.google.accounts.id.cancel();

      document.getElementById("google-client-script")?.remove();
    };
  }, []);

  useEffect(() => {
    if (userDetails._id) navigate(applicationRoutes.dashboard);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <p className={styles.title}>Hello there!</p>

        <p className={styles.desc}>Lets get started with Cric Maestro</p>

        <Button
          onClick={() =>
            googleSignInButtonRef.current
              ? googleSignInButtonRef.current.click()
              : ""
          }
          disabled={loading}
          useSpinnerWhenDisabled
        >
          <div
            className={styles.actualGoogleButton}
            ref={googleSignInButtonRef}
            id="g_id_signin"
            data-width={isMobileView ? 350 : 410}
          />
          Google login
        </Button>
      </div>
    </div>
  );
}

export default AuthPage;
