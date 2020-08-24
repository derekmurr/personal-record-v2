import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import colors from "./colors";

export default createGlobalStyle`
  ${reset}

  html {
    box-sizing: border-box;
    font-size: 62.5%; // 1rem = 10px, 3.5rem = 35px;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  :root {
    --font-condensed: 'Roboto Condensed', sans-serif;
    --font-italic: 'Roboto Condensed Italic', sans-serif;
    --font-heading: 'Roboto Slab', serif;
  }

  body {
    background-color: ${colors.background};
    color: ${colors.white};
    font-family: var(--font-condensed);
    font-size: 1.6rem;
    letter-spacing: -0.025rem;
  }

  a {
    color: ${colors.linkPrimary};
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: color 0.3s ease, text-decoration-color 0.3s ease;
  }
  a:hover,
  a:focus {
    color: ${colors.primary};
    text-decoration-color: ${colors.primary};
  }

  img {
    display: block;
    height: auto;
    max-width: 100%;
  }

  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  h1, h2, h3, h4, h5 {
    font-family: var(--font-heading);
  }

  p, label, input, h6 {
  font-family: var(--font-condensed);
}
`;
