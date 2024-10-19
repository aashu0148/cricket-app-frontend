import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Tooltip } from "react-tooltip";

// Components
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import PrivateRoute from "@/Components/PrivateRoute/PrivateRoute";
import AppLayout from "./Layouts/AppLayout/AppLayout";
import LandingPage from "./Pages/LandingPage/LandingPage";
import AuthPage from "./Pages/AuthPage/AuthPage";
import PageLoader from "./Components/PageLoader/PageLoader";
import HomePage from "./Pages/HomePage/HomePage";
import AllTournaments from "./Pages/Admin/AllTournaments/AllTournaments";
import TournamentsPage from "./Pages/TournamentsPage/TournamentsPage";
import ContestsPage from "./Pages/ContestsPage/ContestsPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import ContestPage from "./Pages/ContestPage/ContestPage";
import DraftRoundPage from "./Pages/DraftRoundPage/DraftRoundPage";
import { DraftRoundProvider } from "./Pages/DraftRoundPage/util/DraftRoundContext";
import ScoringSystem from "./Pages/Admin/ScoringSystem/ScoringSystem";
import EditScoringSystem from "./Pages/Admin/ScoringSystem/EditScoringSystem/EditScoringSystem";
import PlayersPage from "./Pages/Admin/PlayersPage/PlayersPage";

// Utils
import { getCurrentUser } from "./apis/user";
import actionTypes from "./store/actionTypes";
import { applicationRoutes } from "./utils/constants";
import { getAppToken } from "./utils/util";

function App() {
  const userDetails = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isMobileView, setIsMobileView] = useState("");
  const [appLoaded, setAppLoaded] = useState(false);

  const handleUserDetection = async () => {
    const token = getAppToken();
    if (!token) {
      setAppLoaded(true);
      return;
    }

    let res = await getCurrentUser();
    setAppLoaded(true);
    if (!res) {
      // removeAppToken();
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
      {ReactDOM.createPortal(
        <>
          <Toaster
            position={isMobileView ? "top-right" : "bottom-right"}
            toastOptions={{
              duration: 2500,
              style: {
                zIndex: 9999999,
              },
            }}
          />

          <Tooltip
            id="global-tooltip"
            style={{
              zIndex: 9999999,
              borderRadius: "8px",
              background: "#000",
            }}
            delayShow={950}
          />
        </>,
        document.body
      )}

      <Router>
        <Routes>
          <Route path={applicationRoutes.auth} element={<AuthPage />} />
          <Route path="/landing" element={<LandingPage />} />
          {userDetails._id ? "" : <Route path="/" element={<LandingPage />} />}

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AppLayout adminLayout />
              </PrivateRoute>
            }
          >
            <Route
              path={applicationRoutes.adminTournament}
              element={<AllTournaments />}
            />
            <Route
              path={applicationRoutes.scoringSystem}
              element={<ScoringSystem />}
            />
            <Route
              path={applicationRoutes.editScoringSystem()}
              element={<EditScoringSystem />}
            />
            <Route
              path={applicationRoutes.createScoringSystem}
              element={<EditScoringSystem createMode />}
            />
            <Route path={applicationRoutes.players} element={<PlayersPage />} />
          </Route>

          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            {/* all routes of normal users will be defined here */}
            <Route path={applicationRoutes.home} element={<HomePage />} />
            <Route path={applicationRoutes.profile} element={<ProfilePage />} />
            <Route
              path={applicationRoutes.tournaments}
              element={<TournamentsPage />}
            />
            <Route
              path={applicationRoutes.contests()}
              element={<ContestsPage />}
            />
            <Route
              path={applicationRoutes.contest()}
              element={<ContestPage />}
            />
            <Route
              path={applicationRoutes.draftRound()}
              element={
                <DraftRoundProvider>
                  <DraftRoundPage />
                </DraftRoundProvider>
              }
            />
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  ) : (
    <PageLoader fullPage />
  );
}

export default App;
