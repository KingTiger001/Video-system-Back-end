import styled, { css } from "styled-components";

const variables = {
  thick: "3px",
  pad: "0.7em",
  // $extra : calc(#{$pad} * 1.2);
  color: "#f26522",
};

export const Preset = styled.div`
  a {
    color: white;
    padding: ${variables.pad} calc(${variables.pad} * 1.2);
    display: inline-block;
    border: ${variables.thick} solid transparent;
    position: relative;
    cursor: pointer;
    letter-spacing: 0.07em;

    .text {
      padding: 0 0.3rem;
      font-family: proxima-nova, monospace;
      transform: translate3d(0, ${variables.pad}, 0);
      display: block;
      transition: transform 0.4s cubic-bezier(0.2, 0, 0, 1) 0.4s;
    }

    &:after {
      position: absolute;
      content: "";
      bottom: -${variables.thick};
      left: calc(${variables.pad} * 1.2);
      right: calc(${variables.pad} * 1.2);
      height: ${variables.thick};
      background: ${variables.color};
      // z-index: -1;
      transition: transform 0.8s cubic-bezier(1, 0, 0.37, 1) 0.2s,
        right 0.2s cubic-bezier(0.04, 0.48, 0, 1) 0.6s,
        left 0.4s cubic-bezier(0.04, 0.48, 0, 1) 0.6s;
      transform-origin: left;
    }
  }

  .line {
    position: absolute;
    background: ${variables.color};

    &.-right,
    &.-left {
      width: ${variables.thick};
      bottom: -${variables.thick};
      top: -${variables.thick};
      transform: scale3d(1, 0, 1);
    }

    &.-top,
    &.-bottom {
      height: ${variables.thick};
      left: -${variables.thick};
      right: -${variables.thick};
      transform: scale3d(0, 1, 1);
    }

    &.-right {
      right: -${variables.thick};
      transition: transform 0.1s cubic-bezier(1, 0, 0.65, 1.01) 0.23s;
      transform-origin: top;
    }

    &.-top {
      top: -${variables.thick};
      transition: transform 0.08s linear 0.43s;
      transform-origin: left;
    }

    &.-left {
      left: -${variables.thick};
      transition: transform 0.08s linear 0.51s;
      transform-origin: bottom;
    }

    &.-bottom {
      bottom: -${variables.thick};
      transition: transform 0.3s cubic-bezier(1, 0, 0.65, 1.01);
      transform-origin: right;
    }
  }

  a:hover,
  a:active {
    .text {
      transform: translate3d(0, 0, 0);
      transition: transform 0.6s cubic-bezier(0.2, 0, 0, 1) 0.4s;
    }

    &:after {
      transform: scale3d(0, 1, 1);
      right: -${variables.thick};
      left: -${variables.thick};
      transform-origin: right;
      transition: transform 0.2s cubic-bezier(1, 0, 0.65, 1.01) 0.17s,
        right 0.2s cubic-bezier(1, 0, 0.65, 1.01), left 0s 0.3s;
    }

    .line {
      transform: scale3d(1, 1, 1);

      &.-right {
        transition: transform 0.1s cubic-bezier(1, 0, 0.65, 1.01) 0.2s;
        transform-origin: bottom;
      }

      &.-top {
        transition: transform 0.08s linear 0.4s;
        transform-origin: right;
      }

      &.-left {
        transition: transform 0.08s linear 0.48s;
        transform-origin: top;
      }

      &.-bottom {
        transition: transform 0.5s cubic-bezier(0, 0.53, 0.29, 1) 0.56s;
        transform-origin: left;
      }
    }
  }
`;

const LinkPreset3 = ({ value, color, fontSize }) => {
  return (
    <Preset>
      <a style={{ fontSize: `${fontSize}rem` }}>
        <span class="text">{value}</span>
        <span class="line -right"></span>
        <span class="line -top"></span>
        <span class="line -left"></span>
        <span class="line -bottom"></span>
      </a>
    </Preset>
  );
};

export default LinkPreset3;
