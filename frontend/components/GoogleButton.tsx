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
      className="flex justify-center gap-2 items-center transition-all p-2 hover:rounded-md sm:w-full min-w-fit bg-secondary-400 hover:bg-secondary-600
      "
    >
      <FontAwesomeIcon
        icon={faGoogle}
        size="1x"
        className="block"
        color="#f9c74f"
      />
      <p className="block"> Tiếp tục bằng tài khoản Google</p>
    </button>
  );
}

export default GoogleButton;
