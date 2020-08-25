import React from "react";

import { WiDaySunny, WiHot, WiCloudyGusts, WiSnow, WiRain } from "react-icons/wi";

const RunWeather = ({ weatherCondition }) => {
  switch (weatherCondition) {
    case "Sunny":
      return <WiDaySunny />;
    case "Humid":
      return <WiHot />;
    case "Wind":
      return <WiCloudyGusts />;
    case "Snow":
      return <WiSnow />;
    case "Rain":
      return <WiRain />;
    default:
      return null;
  }
}

export default RunWeather;
