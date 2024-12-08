import React, { useRef, useState, useEffect } from "react";
import styles from "./ImageList.module.css";
import ImageForm from "../Image Form/ImageForm";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebaseCongfig";
import Spinner from "../React Spinner/spinner";

const ImageList = ({ selectedAlbum, goback }) => {
  const [albumTitle, albumId] = selectedAlbum;
  const [images, setImages] = useState([]);

  const [imageForm, setImageForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [autofill, setAutofill] = useState([]);
  const inputRef = useRef();
  const [loading, setLoading] = useState(true); // State to control spinner visibility
  const [message, setMessage] = useState("");

  const [results, setResults] = useState([]);

  // This useEffect is for the spinner duration and message which shows
  useEffect(() => {
    // Set a timer to stop showing the spinner after a few seconds
    const timer = setTimeout(() => {
      setMessage("No images in this album");
      setLoading(false); // Hide spinner after 3 seconds
    }, 1000); // Adjust the duration (in milliseconds) as needed

    // Clear the timer if the component unmounts before timeout
    return () => clearTimeout(timer);
  }, []);

  // This function is to fetch images from the album
  useEffect(() => {
    const fetchImagesFromAlbum = () => {
      const imagesRef = collection(db, "albums", albumId, "images");

      const unsubscribe = onSnapshot(imagesRef, (querySnapshot) => {
        const imagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(imagesData);
        setImages(imagesData); // Update the images in real-time
      });

      // Cleanup listener on unmount
      return unsubscribe;
    };

    if (albumId) {
      fetchImagesFromAlbum();
    }
  }, [albumId]);

  // console.log(albumTitle, albumId);
  // console.log(images);
  // Real time searching of images
  useEffect(() => {
    console.log(searchText);

    if (searchText.trim()) {
      const filterdImages = results.filter((photo) =>
        photo.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setImages(filterdImages);

      console.log(filterdImages);
    } else {
      setImages(results);
    }
  }, [searchText, results]);

  // Deleting an image from database
  const deleteImageFromAlbum = async (imageId) => {
    try {
      const imageRef = doc(db, "albums", albumId, "images", imageId);
      await deleteDoc(imageRef);
      console.log(`Image with ID ${imageId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  // Handle Edit Image, this is to set States accordingly
  const handleEdit = (image) => {
    setImageForm(true);
    setAutofill(image);
  };

  // This for search toggling, whether to show search input or not
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    setSearchText(""); // Clear the input field when closing
    if (!isSearchActive) {
      setTimeout(() => inputRef.current.focus(), 0);
    }
  };

  // Open the carousel and set the clicked image index
  const openCarousel = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // Close the carousel
  const closeCarousel = () => {
    setIsOpen(false);
  };

  // Go to the previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // This is to set varaible if we are adding an image or not
  const handleAddImage = () => {
    setImageForm(!imageForm);
  };

  return (
    <>
      <ImageForm
        ImageForm={imageForm}
        albumId={albumId}
        albumTitle={albumTitle}
        autofill={autofill}
      />
      {/* This is to load spinner and data */}
      {loading && images.length === 0 ? <Spinner /> : ""}
      <div className={styles.imageListContainer}>
        <div className={styles.searchContainer}>
          <div className={styles.backIconContainer}>
            <span className={styles.backIcon} onClick={goback}>
              <img src="/back.png" alt="Back" />
            </span>
            <h1>{images.length === 0 ? message : `Images in ${albumTitle}`}</h1>
          </div>
          {/* This is search bar input and its buttons */}
          <div className={styles.searchBar}>
            {isSearchActive ? (
              <>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                  className="search-input"
                  ref={inputRef}
                />

                <img src="/x-mark.png" onClick={toggleSearch} alt="close" />
              </>
            ) : (
              <img src="/search.png" onClick={toggleSearch} alt="search" />
            )}
            <button
              className={
                imageForm ? styles.cancelButton : styles.addImageButton
              }
              onClick={handleAddImage}
            >
              {imageForm ? "Cancel" : "Add image"}
            </button>
          </div>
        </div>
        {/* This is to render images on the page */}
        <div className={styles.imageList}>
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.imageItem}
              onClick={() => openCarousel(index)}
            >
              <img
                src={image.url}
                alt={image.name}
                className={styles.imageThumbnail}
              />
              <span className={styles.imageName}>{image.title}</span>
              <div className={styles.edit}>
                <img
                  src="./images/edit.png"
                  height="30px"
                  alt="Edit"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleEdit(image);
                  }}
                />
                <img
                  src="./images/trash-bin.png"
                  height="30px"
                  alt="Delete"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteImageFromAlbum(image.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Image Carousel Overlay */}
        {isOpen && (
          <div className={styles.carouselOverlay}>
            <button className={styles.closeButton} onClick={closeCarousel}>
              ×
            </button>
            <button className={styles.prevButton} onClick={prevImage}>
              ‹
            </button>
            <div className={styles.carouselImageContainer}>
              <img
                src={images[currentIndex].url}
                alt={`Image-${currentIndex + 1}`}
              />
            </div>
            <button className={styles.nextButton} onClick={nextImage}>
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageList;
