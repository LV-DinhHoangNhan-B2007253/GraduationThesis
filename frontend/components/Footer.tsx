import {
  faFacebook,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="w-full ">
      <div className="border-y border-primary-border  p-12 ">
        <div className="   flex justify-between items-center my-4">
          <ul className="w-full flex justify-center items-center gap-5 ">
            <li className="t text-base font-bold">
              <Link href={"https://aikadev27.github.io/portfolio/"}>
                About Me
              </Link>
            </li>
            <li className="text-base font-bold">
              <Link href={"https://www.facebook.com/nhan.gas.5/"}>Contact</Link>
            </li>
          </ul>
        </div>
        <div className="flex justify-between items-center my-4">
          <ul className="w-full flex justify-center items-center gap-5">
            <li className="  text-base font-bold ">
              <Link href={"https://aikadev27.github.io/portfolio/"}>
                <FontAwesomeIcon icon={faFacebook} size="2x" className="p-1" />
              </Link>
            </li>
            <li className="  text-base font-bold ">
              <Link
                href={"https://www.linkedin.com/in/dinh-hoang-nhan-210931301/"}
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" className="p-1" />
              </Link>
            </li>
            <li className="  text-base font-bold ">
              <Link href={"https://github.com/Aikadev27"}>
                <FontAwesomeIcon icon={faGithub} size="2x" className="p-1" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* bottm */}
      <div className="pb-5 px-10 py-2   flex justify-between items-center bg-input">
        <p className="text-small text-input-text ">Graduation Thesis</p>
        <p className="text-small text-input-text ">
          Furniture Online Store + Chatbot
        </p>
      </div>
    </div>
  );
}

export default Footer;
