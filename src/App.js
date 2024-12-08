import AlbumList from "./Components/Album List/AlbumList";
import Navbar from "./Components/Navbar/Navbar";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right" // Default position for notifications
        autoClose={2000} // Automatically close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <AlbumList />
    </>
  );
}

export default App;
