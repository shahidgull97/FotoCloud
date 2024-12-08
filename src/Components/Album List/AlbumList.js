import { React, useEffect } from "react";
import ImageList from "../Image List/ImageList";
import styles from "./AlbumList.module.css";
import { useState } from "react";
import AlbumForm from "../Album Form/AlbumForm";
import { db } from "../../config/firebaseCongfig";
import Spinner from "../React Spinner/spinner";

import { collection, onSnapshot } from "firebase/firestore";

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [albumForm, setAlbumForm] = useState(false);

  // Get Data from data Base to render all albums
  useEffect(() => {
    onSnapshot(collection(db, "albums"), (querySnapshot) => {
      const getExpenses = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      });
      console.log("Current data: ", getExpenses);
      // dispatch({ type: "ADDDATA", data: { getExpenses } });

      setAlbums(getExpenses);
    });
  }, []);

  // This function is to handle clicking of an album and store the value in a variabe to pass down to childern
  function handleAlbumClick(albumTitle, albumId) {
    setSelectedAlbum([albumTitle, albumId]);
  }

  // This function is for album form where to show it or not
  function handleAlbumForm() {
    // console.log(albumForm);

    setAlbumForm(!albumForm);
  }

  // This for go back button
  function goback() {
    setSelectedAlbum([]);
  }

  // This condition checks whether to go inside of album or not
  if (selectedAlbum.length > 0) {
    return <ImageList selectedAlbum={selectedAlbum} goback={goback} />;
  }
  // console.log(selectedAlbum);

  return (
    <>
      <AlbumForm albumForm={albumForm} />;
      {!albums.length > 0 ? <Spinner /> : ""}
      <div className={styles.albumListContainer}>
        <div className={styles.albumHead}>
          <h1 className={styles.albumListTitle}>Your albums</h1>
          <button
            className={albumForm ? styles.cancelButton : styles.addAlbumButton}
            onClick={handleAlbumForm}
          >
            {albumForm ? "Cancel" : "Add Album"}
          </button>
        </div>

        <div className={styles.albumGrid}>
          {albums.map((album) => (
            <div
              key={album.id}
              className={styles.albumItem}
              onClick={() => {
                handleAlbumClick(album.data.title, album.id);
              }}
            >
              <div className={styles.albumCover}>
                <img
                  src="https://mellow-seahorse-fc9268.netlify.app/assets/photos.png"
                  alt={album.data.title}
                />
              </div>
              <span className={styles.albumName}>{album.data.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AlbumList;
