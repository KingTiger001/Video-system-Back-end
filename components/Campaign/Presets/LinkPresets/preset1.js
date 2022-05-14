import styled, { css } from "styled-components";

const variables = {
  color: "#5533ff",
  color2: "#38e2ee",
  deeper: "#401aff",
};

export const Preset = styled.div`
  font-family: sans-serif;
  button {
    cursor: grab;
    border: none;
    text-decoration: none;
    color: rgba(white, 0.95);
  }

  .psuedo-text {
    color: ${variables.color};
    position: relative;
    top: 0;
    height: 100%;
    width: 100%;
    display: inline;
    height: auto;
    font-size: 700;
    transition: 0.25s ease-in;
    transition-delay: 0.1s;
  }

  .button {
    padding: 1em 3em;
    background: white;
    text-align: center;
    display: inline-block;
    font-weight: 700;
    position: relative;
    will-change: transform;
  }

  .button-mat {
    color: ${variables.color};
    border: 0px transparent;
    border-radius: 0.3rem;
    transition: 0.3s ease-in-out;
    transition-delay: 0.35s;
    overflow: hidden;

    &:before {
      content: "";
      display: block;
      background: ${variables.deeper};
      position: absolute;
      width: 200%;
      height: 500%;
      border-radius: 100%;
      transition: 0.36s cubic-bezier(0.4, 0, 1, 1);
    }
    &:hover .psuedo-text {
      color: white;
    }

    &:hover {
      color: transparent;
    }
  }

  .btn--5 {
    // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

    &:before {
      transform: translate(-120%, -50%) translateZ(0);
    }

    &:hover:before {
      transform: translate(-45%, -34%) translateZ(0);
    }
  }
`;

const LinkPreset1 = ({ value, color, fontSize }) => {
  return (
    <Preset>
      <button
        style={{ fontSize: `${fontSize}em`, color }}
        className={"button button-mat btn--5"}
      >
        <div className="psuedo-text" style={{ color }}>
          {value}
        </div>
      </button>
    </Preset>
  );
};

export default LinkPreset1;
