import styled from "styled-components";

export const Preset = styled.div`
  font-family: "Source Code Pro", sans-serif;
  .underlined {
    flex: 1;
    line-height: 1.2;
    text-decoration: none;
    background-image: linear-gradient(to right, yellow 0, yellow 100%);
    background-position: 0 1.2em;
    background-size: 0 100%;
    background-repeat: no-repeat;
    transition: background 0.5s;
    &:hover {
      background-size: 100% 100%;
    }
    &--thin {
      background-image: linear-gradient(to right, black 0, black 100%);
    }
  }
`;

const TextPreset3 = ({ value, color, fontSize }) => {
  return (
    <Preset>
      <p style={{ fontSize: `${fontSize}px`, color: `${color}` }}>
        <span href="#" class="underlined underlined--thin">
          {value}
        </span>
      </p>
    </Preset>
  );
};

export default TextPreset3;
