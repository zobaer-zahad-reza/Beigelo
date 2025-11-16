import React, { useEffect } from "react";
import ReactGA from "react-ga4";

const GoogleAnalytic = () => {
  useEffect(() => {
    ReactGA.initialize("G-0BMMC8ZH2T");
    ReactGA.send("pageview");
  }, []);

  return null;
};

export default GoogleAnalytic;
