import { storage } from "../firebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { editProfile } from "./FirestoreAPI";

export const uploadImage = (
  file,
  id,
  setModalOpen,
  setProgress,
  setCurrentImage
) => {
  console.log(file);

  fetch(`https://storage.googleapis.com/meraki-photos/profile/${file.name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file
  }).then((response) => {
    if (response.ok) {
      console.log('File uploaded successfully');
      const publicUrl = `https://storage.googleapis.com/meraki-photos/profile/${file.name}`;
      editProfile(id, { imageLink: publicUrl });
      setModalOpen(false);
      setCurrentImage({});
      setProgress(0);
    } else {
      console.error('Error uploading file:', response.statusText);
    }
  });
};

export const uploadPostImage = (file, setPostImage, setProgress) => {
  const postPicsRef = ref(storage, `postImages/${file.name}`);
  const uploadTask = uploadBytesResumable(postPicsRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );

      setProgress(progress);
    },
    (error) => {
      console.error(err);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((response) => {
        setPostImage(response);
      });
    }
  );
};
