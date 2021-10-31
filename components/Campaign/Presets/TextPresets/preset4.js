import styled from "styled-components";

export const Preset = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

  .goo {
    line-height: 1.35;
    display: inline;
    box-decoration-break: clone;
    background: #fff;
    padding: 0.5rem 1rem;
    filter: url("#goo");
  }
`;

const TextPreset4 = ({ value, color, fontSize }) => {
  return (
    <Preset>
      <h1>
        <div style={{ color, fontSize: `${fontSize}px` }} className="goo">
          {value}
        </div>
      </h1>

      <svg
        style={{ visibility: "hidden", position: "absolute" }}
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </Preset>
  );
};

export default TextPreset4;
