import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import PrivateRoute from "@/Components/PrivateRoute/PrivateRoute";
import AppLayout from "./Layouts/AppLayout/AppLayout";
import LandingPage from "./Pages/LandingPage/LandingPage";
import AuthPage from "./Pages/AuthPage/AuthPage";

// Utils
import { getCurrentUser } from "./apis/user";
import actionTypes from "./store/actionTypes";
import { applicationRoutes } from "./utils/constants";
import PageLoader from "./Components/PageLoader/PageLoader";

function App() {
  const userDetails = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isMobileView, setIsMobileView] = useState("");
  const [appLoaded, setAppLoaded] = useState(false);

  const handleUserDetection = async () => {
    const token = localStorage.getItem("cric-token");
    if (!token) {
      setAppLoaded(true);
      return;
    }

    let res = await getCurrentUser();
    setAppLoaded(true);
    if (!res) {
      return;
    }

    const user = res?.data;

    if (user)
      dispatch({
        type: actionTypes.USER_LOGIN,
        user,
      });
  };

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 768) setIsMobileView(true);
    else setIsMobileView(false);
  };

  useEffect(() => {
    if (typeof isMobileView !== "boolean") {
      setIsMobileView(window.innerWidth < 768);
      dispatch({
        type: actionTypes.SET_MOBILE_VIEW,
        isMobileView: window.innerWidth < 768,
      });
    } else
      dispatch({
        type: actionTypes.SET_MOBILE_VIEW,
        isMobileView,
      });
  }, [isMobileView]);

  useEffect(() => {
    handleUserDetection();
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return appLoaded ? (
    <div className="main-app">
      <Toaster
        position={isMobileView ? "top-right" : "bottom-right"}
        toastOptions={{
          duration: 2500,
        }}
      />
      <Router>
        <Routes>
          <Route path={applicationRoutes.auth} element={<AuthPage />} />

          {userDetails._id ? "" : <Route path="/" element={<LandingPage />} />}

          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          ></Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  ) : (
    <PageLoader fullPage />
  );
}

export default App;
