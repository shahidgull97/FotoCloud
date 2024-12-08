import styles from "./ImageForm.module.css";
import { db } from "../../config/firebaseCongfig";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
function ImageForm({ ImageForm, albumId, albumTitle, autofill }) {
  const titleRef = useRef();
  const urlRef = useRef();

  // This useEfferct is to autofill details upon clicking edit button
  useEffect(() => {
    if (autofill && Object.keys(autofill).length > 0) {
      urlRef.current.value = autofill.url || "";
      titleRef.current.value = autofill.title || "";
    }
  }, [autofill]);

  // Function to add an image to an album where images is a subcollection
  const addImageToAlbum = async (e) => {
    e.preventDefault();
    const imagesRef = collection(db, "albums", albumId, "images");
    await addDoc(imagesRef, {
      url: urlRef.current.value,
      title: titleRef.current.value,
      createdAt: serverTimestamp(),
    });
    toast.success("Image Created Sucessfully", {
      position: "top-right",
    });
    clearInput(e);
  };
  const clearInput = (e) => {
    e.preventDefault();
    urlRef.current.value = "";
    titleRef.current.value = "";
  };

  // Function to update an image document
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (autofill.id) {
      try {
        const imageRef = doc(db, "albums", albumId, "images", autofill.id);
        await updateDoc(imageRef, {
          url: urlRef.current.value,
          title: titleRef.current.value,
        });
        console.log(`Image with ID ${autofill.id} updated successfully.`);
      } catch (error) {
        console.error("Error updating image: ", error);
      }
    }
  };

  if (!ImageForm) {
    return;
  }

  return (
    <div className={styles.albumContainer}>
      <h1 className={styles.albumHeading}>Add Image to {albumTitle}</h1>
      <form className={styles.form}>
        <input
          placeholder="Title"
          required
          className={styles.albumInput}
          ref={titleRef}
        />
        <input
          placeholder="Image URL"
          required
          className={styles.albumInput}
          ref={urlRef}
        />
        <button className={styles.clearButton} onClick={clearInput}>
          Clear
        </button>
        <button
          className={styles.createButton}
          onClick={
            autofill && Object.keys(autofill).length > 0
              ? handleUpdate
              : addImageToAlbum
          }
        >
          {autofill && Object.keys(autofill).length > 0 ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default ImageForm;
