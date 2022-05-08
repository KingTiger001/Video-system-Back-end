import styled, { css } from "styled-components";

let variables = {
  t: 1,
  d: "0.08em",
  n: 3,
  e: "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
  front: "black",
  back: "lightblue",
};

const createCSS = () => {
  let styles = "";

  for (let i = 0; i < 3; i += 1) {
    styles += `
     &:nth-last-child(${i}n){ animation-delay: ${
      (-variables.t * i) / variables.n / 2
    }s;}
     `;
  }

  return css`
    ${styles}
  `;
};

export const Preset = styled.div`
  .popout {
    font-family: Futura, sans-serif;
    font-weight: 900;
    /* padding: 80px; */
    white-space: pre;

    @keyframes ani {
      0% {
        transform: translate3d(0, 0, 0);
        text-shadow: 0em 0em 0 ${variables.back};
      }
      30% {
        transform: translate3d(0, 0, 0);
        text-shadow: 0em 0em 0 ${variables.back};
      }
      70% {
        transform: translate3d($d, -$d, 0);
        text-shadow: -${variables.d} ${variables.d} ${variables.back};
      }
      100% {
        transform: translate3d(${variables.d}, -${variables.d}, 0);
        text-shadow: -${variables.d} ${variables.d} ${variables.back};
      }
    }
    span {
      position: relative;
      display: inline-block;
      animation: ani ${variables.t}s infinite alternate ${variables.e};

      ${createCSS()}
    }
  }
`;

const TextPreset1 = ({ value, color, fontSize }) => {
  return (
    <Preset>
      <p style={{ fontSize: `${fontSize}vmin`, color: color }} className="popout">
        <span dangerouslySetInnerHTML={{ __html: `${value.replace(/(\r\n|\n|\r)/gm, "<br>")}` }}></span>
      </p>
    </Preset>
  );
};

export default TextPreset1;
/*
Don't delete this code until you validate the solution with clieant
{[...value].map((letter) => (
          <span>{letter}</span>
        ))}
*/