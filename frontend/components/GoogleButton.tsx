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
      className="flex justify-start gap-2 items-center"
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
