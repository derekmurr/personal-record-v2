import React from "react";

import { WiDaySunny, WiHot, WiCloudyGusts, WiSnow, WiRain } from "react-icons/wi";

const RunWeather = ({ weatherCondition }) => {
  switch (weatherCondition) {
    case "SUNNY":
      return <WiDaySunny />;
    case "HUMID":
      return <WiHot />;
    case "WIND":
      return <WiCloudyGusts />;
    case "SNOW":
      return <WiSnow />;
    case "RAIN":
      return <WiRain />;
    default:
      return null;
  }
}

export default RunWeather;
