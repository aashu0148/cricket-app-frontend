import React, { useEffect, useState } from "react";
import { Edit2, LogOut } from "react-feather";
import { useDispatch, useSelector } from "react-redux";

import EditProfileModal from "./EditProfileModal/EditProfileModal";
import Button from "@/Components/Button/Button";
import PageLoader from "@/Components/PageLoader/PageLoader";
import PlayedContestCard, {
  FillerPlayedContestCard,
} from "@/Components/PlayedContestCard/PlayedContestCard";

import userProfileIcon from "@/assets/profile-icon.png";
import { updateUserDetails } from "@/apis/user";
import { getJoinedContests } from "@/apis/contests";
import { getTournamentsWithPlayers } from "@/apis/tournament";
import {
  handleLogout,
  parseTeamsForScorePoints,
  refreshUserDetailsFromBackend,
} from "@/utils/util";
import { uploadFile } from "@/utils/firebase";
import actionTypes from "@/store/actionTypes";
import useImagePicker from "@/utils/hooks/useImagePicker";

import styles from "./ProfilePage.module.scss";

function ProfilePage() {
  const dispatch = useDispatch();
  const userDetails = useSelector((s) => s.user);

  const { openImagePicker } = useImagePicker();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [imageUploadDetails, setImageUploadDetails] = useState({
    error: "",
    uploading: false,
    progress: 0,
  });
  const [joinedContests, setJoinedContests] = useState([]);
  const [loadingContests, setLoadingContests] = useState(true);

  const fetchJoinedContests = async () => {
    const res = await getJoinedContests();
    if (!res) return setLoadingContests(false);

    const tournamentIds = res.data.map((e) => e.tournament?._id);
    const res2 = await getTournamentsWithPlayers(tournamentIds);
    setLoadingContests(false);
    if (!res2) return;

    const finalContests = res.data
      .map((c) => {
        const tournamentData = res2.data.find(
          (t) => t._id === c.tournament?._id
        );
        if (!tournamentData?.completed) return null;

        const fullPlayers = tournamentData.players;
        const teams = c.teams.map((e) => ({
          ...e,
          players: e.players
            .map((p) => fullPlayers.find((item) => item._id === p))
            .filter((e) => e),
        }));

        const parsedTeams = parseTeamsForScorePoints(
          teams,
          tournamentData?.playerPoints
        );

        return {
          ...c,
          teams: parsedTeams,
        };
      })
      .filter((e) => e);

    setJoinedContests(finalContests);
  };

  const handleImageUploaded = async (url) => {
    const res = await updateUserDetails({ profileImage: url });
    setImageUploadDetails((p) => ({ ...p, uploading: false }));
    if (!res) return;

    dispatch({ type: actionTypes.USER_UPDATE, user: { profileImage: url } });
  };

  /**
   *
   * @param {Object} file
   * @param {Number} maxFileSizeAllowed
   * @returns {{success:Boolean,message:String}}
   */
  const validateImage = (file, maxFileSizeAllowed = 3) => {
    const { type, size } = file;

    if (!type.includes("image"))
      return {
        success: false,
        message: "Not a image file",
      };
    if (size / 1024 / 1024 > maxFileSizeAllowed)
      return {
        success: false,
        message: `Image should be smaller than ${maxFileSizeAllowed}MB, found: ${parseFloat(
          size / 1024 / 1024
        ).toFixed(2)}MB`,
      };

    return {
      success: true,
      message: "Valid file",
    };
  };

  const onEditImageClick = async () => {
    if (imageUploadDetails.uploading) return;

    const files = await openImagePicker();
    if (!files || !files.length) return;

    const file = files[0];
    const validateRes = validateImage(file, 5);

    setImageUploadDetails({ error: "" });
    if (!validateRes.success)
      return setImageUploadDetails((p) => ({
        ...p,
        error: validateRes.message,
      }));

    const ext = file.name.split(".").pop();
    setImageUploadDetails((p) => ({ ...p, uploading: true }));
    uploadFile(
      { file, name: userDetails._id ? userDetails._id + "." + ext : "" },
      (progress) => {
        setImageUploadDetails((p) => ({ ...p, progress }));
      },
      handleImageUploaded,
      (err) =>
        setImageUploadDetails({ uploading: false, error: err, progress: 0 })
    );
  };

  useEffect(() => {
    fetchJoinedContests();
  }, []);

  return (
    <div className={`page-container ${styles.container}`}>
      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          onSuccess={() => {
            setShowEditProfile(false);
            refreshUserDetailsFromBackend();
          }}
        />
      )}

      <div className={styles.personalDetails}>
        <div className={`text-box ${styles.details}`}>
          <p className={styles.name}>{userDetails.name}</p>
          <p className={`${styles.text}`}>{userDetails.email}</p>
          <p className={`${styles.text}`}>{userDetails.phone}</p>

          <Button onClick={() => setShowEditProfile(true)} small outlineButton>
            <Edit2 /> Edit profile
          </Button>

          <div className={styles.logout} onClick={handleLogout}>
            Logout{" "}
            <div className={styles.icon}>
              <LogOut />
            </div>
          </div>
        </div>

        <div className={styles.image}>
          <div className={styles.editImage} onClick={onEditImageClick}>
            <Edit2 />
          </div>
          <img
            src={userDetails.profileImage || ""}
            alt={userDetails.name}
            onError={(e) => (e.target.src = userProfileIcon)}
          />

          {imageUploadDetails.uploading ? (
            <div className={styles.progress}>
              <div
                className={styles.bar}
                style={{ width: `${imageUploadDetails.progress}%` }}
              />
            </div>
          ) : (
            <p className={`error-msg ${styles.error}`}>
              {imageUploadDetails.error}
            </p>
          )}
        </div>
      </div>

      <span className={styles.separator} />

      <section className={styles.section}>
        <p className={`${styles.heading}`}>Your Contests</p>

        {loadingContests ? (
          <PageLoader />
        ) : joinedContests.length ? (
          <div className={styles.contests}>
            {joinedContests.map((contest) => (
              <PlayedContestCard key={contest._id} contestData={contest} />
            ))}

            {new Array(4).fill(1).map((_, i) => (
              <FillerPlayedContestCard key={i} />
            ))}
          </div>
        ) : (
          <p>No contest present for now</p>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
