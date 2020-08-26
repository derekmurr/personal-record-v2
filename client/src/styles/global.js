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
  
  /* font scale via utopia: */
  /* @link https://utopia.fyi/generator?c=320,20,1.2,1140,24,1.25,5,2, */
  
  :root {
    --font-condensed: 'Roboto Condensed', sans-serif;
    --font-italic: 'Roboto Condensed Italic', sans-serif;
    --font-heading: 'Roboto Slab', serif;

    --fluid-min-width: 320;
    --fluid-max-width: 1140;
    --fluid-min-size: 20;
    --fluid-max-size: 24;
    --fluid-min-ratio: 1.2;
    --fluid-max-ratio: 1.25;

    --fluid-screen: 100vw;
    --fluid-bp: calc(
      (var(--fluid-screen) - ((var(--fluid-min-width) / 16) * 1rem)) /
        ((var(--fluid-max-width) / 16) - (var(--fluid-min-width) / 16))
    );
  }

  @media screen and (min-width: 1140px) {
    :root {
      --fluid-screen: calc(var(--fluid-max-width) * 1px);
    }
  }

  :root {
    --fluid-max-negative: (1 / var(--fluid-max-ratio) / var(--fluid-max-ratio));
    --fluid-min-negative: (1 / var(--fluid-min-ratio) / var(--fluid-min-ratio));
    
    --fluid-min-scale--2: var(--fluid-min-scale--1) * var(--fluid-min-ratio) * var(--fluid-min-negative);
    --fluid-max-scale--2: var(--fluid-max-scale--1) * var(--fluid-max-ratio) * var(--fluid-max-negative);
    --fluid-min-size--2: (var(--fluid-min-size) * var(--fluid-min-scale--2)) / 16;
    --fluid-max-size--2: (var(--fluid-max-size) * var(--fluid-max-scale--2)) / 16;
    --step--2: calc(((var(--fluid-min-size--2) * 1rem) + (var(--fluid-max-size--2) - var(--fluid-min-size--2)) * var(--fluid-bp))); 
    
    --fluid-min-scale--1: var(--fluid-min-ratio) * var(--fluid-min-negative);
    --fluid-max-scale--1: var(--fluid-max-ratio) * var(--fluid-max-negative);
    --fluid-min-size--1: (var(--fluid-min-size) * var(--fluid-min-scale--1)) / 16;
    --fluid-max-size--1: (var(--fluid-max-size) * var(--fluid-max-scale--1)) / 16;
    --step--1: calc(((var(--fluid-min-size--1) * 1rem) + (var(--fluid-max-size--1) - var(--fluid-min-size--1)) * var(--fluid-bp)));
    
    --fluid-min-scale-0: var(--fluid-min-ratio);
    --fluid-max-scale-0: var(--fluid-max-ratio);
    --fluid-min-size-0: (var(--fluid-min-size)) / 16;
    --fluid-max-size-0: (var(--fluid-max-size)) / 16;
    --step-0: calc(((var(--fluid-min-size-0) * 1rem) + (var(--fluid-max-size-0) - var(--fluid-min-size-0)) * var(--fluid-bp)));
    
    --fluid-min-scale-1: var(--fluid-min-scale-0) * var(--fluid-min-ratio);
    --fluid-max-scale-1: var(--fluid-max-scale-0) * var(--fluid-max-ratio);
    --fluid-min-size-1: (var(--fluid-min-size) * var(--fluid-min-scale-0)) / 16;
    --fluid-max-size-1: (var(--fluid-max-size) * var(--fluid-max-scale-0)) / 16;
    --step-1: calc(((var(--fluid-min-size-1) * 1rem) + (var(--fluid-max-size-1) - var(--fluid-min-size-1)) * var(--fluid-bp)));

    --fluid-min-scale-2: var(--fluid-min-scale-1) * var(--fluid-min-ratio);
    --fluid-max-scale-2: var(--fluid-max-scale-1) * var(--fluid-max-ratio);
    --fluid-min-size-2: (var(--fluid-min-size) * var(--fluid-min-scale-1)) / 16;
    --fluid-max-size-2: (var(--fluid-max-size) * var(--fluid-max-scale-1)) / 16;
    --step-2: calc(((var(--fluid-min-size-2) * 1rem) + (var(--fluid-max-size-2) - var(--fluid-min-size-2)) * var(--fluid-bp)));

    --fluid-min-scale-3: var(--fluid-min-scale-2) * var(--fluid-min-ratio);
    --fluid-max-scale-3: var(--fluid-max-scale-2) * var(--fluid-max-ratio);
    --fluid-min-size-3: (var(--fluid-min-size) * var(--fluid-min-scale-2)) / 16;
    --fluid-max-size-3: (var(--fluid-max-size) * var(--fluid-max-scale-2)) / 16;
    --step-3: calc(((var(--fluid-min-size-3) * 1rem) + (var(--fluid-max-size-3) - var(--fluid-min-size-3)) * var(--fluid-bp)));

    --fluid-min-scale-4: var(--fluid-min-scale-3) * var(--fluid-min-ratio);
    --fluid-max-scale-4: var(--fluid-max-scale-3) * var(--fluid-max-ratio);
    --fluid-min-size-4: (var(--fluid-min-size) * var(--fluid-min-scale-3)) / 16;
    --fluid-max-size-4: (var(--fluid-max-size) * var(--fluid-max-scale-3)) / 16;
    --step-4: calc(((var(--fluid-min-size-4) * 1rem) + (var(--fluid-max-size-4) - var(--fluid-min-size-4)) * var(--fluid-bp)));

    --fluid-min-scale-5: var(--fluid-min-scale-4) * var(--fluid-min-ratio);
    --fluid-max-scale-5: var(--fluid-max-scale-4) * var(--fluid-max-ratio);
    --fluid-min-size-5: (var(--fluid-min-size) * var(--fluid-min-scale-4)) / 16;
    --fluid-max-size-5: (var(--fluid-max-size) * var(--fluid-max-scale-4)) / 16;
    --step-5: calc(((var(--fluid-min-size-5) * 1rem) + (var(--fluid-max-size-5) - var(--fluid-min-size-5)) * var(--fluid-bp)));
  }

  body {
    background-color: ${colors.background};
    color: ${colors.white};
    font-family: var(--font-condensed);
    font-size: var(--step-0);
    letter-spacing: -0.025rem;
  }

  a {
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: color 0.3s ease, text-decoration-color 0.3s ease;
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
