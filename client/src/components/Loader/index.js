import { ImSpinner6 } from "react-icons/im";
import React from "react";

import StyledLoader from "./styles";

const Loader = ({ center, color }) => (
  <StyledLoader center={center}>
    <ImSpinner6 />
  </StyledLoader>
);

Loader.defaultProps = {
  center: false,
  color: "rgba(255, 255, 255, 0.8)",
};

export default Loader;
