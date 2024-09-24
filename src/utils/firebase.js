import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfDC2wEoNpfDxtp6gBB5EBU0eWddk8kng",
  authDomain: "cric-maestro-firebase.firebaseapp.com",
  projectId: "cric-maestro-firebase",
  storageBucket: "cric-maestro-firebase.appspot.com",
  messagingSenderId: "471959592868",
  appId: "1:471959592868:web:097712bc01618c8387eb31",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const uploadFile = (
  { file, name = "" },
  progressCallback,
  urlCallback,
  errorCallback
) => {
  if (!file) {
    errorCallback("File not found");
    return;
  }

  const storageRef = ref(storage, `profile_pictures/${name || file.name}`);

  const task = uploadBytesResumable(storageRef, file);

  task.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressCallback(progress);
    },
    (error) => {
      errorCallback(error.message);
    },
    () => {
      getDownloadURL(storageRef).then((url) => {
        urlCallback(url);
      });
    }
  );

  const cancelUpload = () => task.cancel();

  return cancelUpload;
};

export { app as default, uploadFile };
