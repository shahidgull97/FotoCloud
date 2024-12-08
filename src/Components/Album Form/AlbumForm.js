import styles from "./AlbumForm.module.css";
import { db } from "../../config/firebaseCongfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

import { useRef } from "react";

function AlbumForm({ albumForm }) {
  const albumRefValue = useRef();

  if (!albumForm) {
    return;
  }

  const clearInput = (e) => {
    e.preventDefault();
    albumRefValue.current.value = "";
  };

  // console.log(albumRefValue.current);

  // Creating of an album in fireStore database
  const createAlbum = async (e) => {
    e.preventDefault();
    console.log(albumRefValue.current.value);
    const albumRef = await addDoc(collection(db, "albums"), {
      title: albumRefValue.current.value,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", albumRef.id);

    clearInput(e);
    toast.success("Album Created Sucessfully", {
      position: "top-right",
    });
    return albumRef.id;
  };

  return (
    <div className={styles.albumContainer}>
      <h1 className={styles.albumHeading}>Create an Album</h1>
      <form>
        <input
          placeholder="Album Name"
          required
          className={styles.albumInput}
          ref={albumRefValue}
        />
        <button className={styles.clearButton} onClick={clearInput}>
          Clear
        </button>
        <button className={styles.createButton} onClick={createAlbum}>
          Create
        </button>
      </form>
    </div>
  );
}

export default AlbumForm;
