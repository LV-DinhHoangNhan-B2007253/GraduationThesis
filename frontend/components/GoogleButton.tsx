"use client";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function GoogleButton() {
  const handleGoogleButton = () => {
    window.location.href = "http://localhost:3001/api/auth/google/login";
  };

  return (
    <button
      onClick={handleGoogleButton}
      className="flex justify-center gap-2 items-center hover:text-dark-primary-text bg-light-btn-bg-second hover:bg-light-btn-hover dark:hover:text-light-primary-text dark:hover:bg-dark-bg-btn-hover transition-all p-2 hover:rounded-md dark:bg-dark-bg-btn sm:w-full min-w-fit
      "
    >
      <FontAwesomeIcon
        icon={faGoogle}
        size="1x"
        className="block"
        color="#f9c74f"
      />
      <p className="block"> Continue With Google</p>
    </button>
  );
}

export default GoogleButton;
