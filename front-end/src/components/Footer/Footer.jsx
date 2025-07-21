import React from "react";
import "./Footer.css";
import lightIcon from "../../assets/light-git.svg";
import darkIcon from "../../assets/dark-git.svg";
import useTheme from "../../hooks/useTheme";

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className="footer">
      <div className="__links">
        <p>&copy; 2025 SightSee USA</p>
        <p>
          Map Tile Data: &nbsp;
          <a
            target="_blank"
            className="footer__link"
            href="https://www.maptiler.com/"
          >
            MapTiler
          </a>
        </p>
      </div>
      <a
        target="_blank"
        className="__maplink"
        href="https://github.com/donnyjb06/code-jam.git"
      >
        <img src={theme === "dark" ? lightIcon : darkIcon} />
      </a>
    </footer>
  );
};

export default Footer;
