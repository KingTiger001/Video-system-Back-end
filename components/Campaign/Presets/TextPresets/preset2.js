import styled from "styled-components";

export const Preset = styled.div`
  span {
    position: relative;
    font-family: "Avenir Next", sans-serif;
    font-weight: 900;
    font-size: 64px;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: 0.05em;
    display: inline-block;
  }

  /* We create a pseudo element and blur it using the SVG filter. We’ll grab the content from the custom HTML attribute. */

  span:before {
    position: absolute;
    left: 0;
    top: 0;
    content: attr(filter-content);

    filter: url(#motion-blur-filter);
  }

  /* We hide the SVG filter element from the DOM as it would take up some space */

  svg {
    display: none;
  }
`;

const TextPreset2 = ({ value, color, fontSize }) => {
  return (
    <Preset>
      <>
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="motion-blur-filter" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="50 0"></feGaussianBlur>
          </filter>
        </svg>

        <span style={{ color, fontSize: `${fontSize}px` }} filter-content="5" dangerouslySetInnerHTML={{ __html: `${value.replace(/(\r\n|\n|\r)/gm, "<br>")}` }}>
        </span>
      </>
    </Preset>
  );
};

export default TextPreset2;
