import styled, { css } from "styled-components";

const variables = {
   bg: "#f3f8fa",
   white: "#fff",
   black: "#282936",
};

const transition = ({
   property = "all",
   duration = 0.45,
   ease = "cubic-bezier(0.65,0,.076,1)",
}) => css`
   transition: ${property} ${duration}s ${ease};
`;

// ($property: all, $duration: 0.45s, $ease: cubic-bezier(0.65,0,.076,1)) {

export const Preset = styled.div`
   button {
      position: relative;
      display: inline-block;
      cursor: pointer;
      outline: none;
      border: 0;
      vertical-align: middle;
      text-decoration: none;
      background: transparent;
      padding: 0;
      font-size: inherit;
      font-family: inherit;
      &.learn-more {
         width: 12rem;
         height: auto;
         .circle {
            ${transition("all", 0.45, "cubic-bezier(0.65,0,.076,1)")}
            position: relative;
            display: block;
            margin: 0;
            width: 3rem;
            height: 3rem;
            background: ${variables.black};
            .icon {
               ${transition("all", 0.45, "cubic-bezier(0.65,0,.076,1)")}
               position: absolute;
               top: 0;
               bottom: 0;
               margin: auto;
               background: white;
               &.arrow {
                  ${transition("all", 0.45, "cubic-bezier(0.65,0,.076,1)")}
                  left: 0.625rem;
                  width: 1.125rem;
                  height: 0.125rem;
                  background: none;
                  &::before {
                     position: absolute;
                     content: "";
                     top: -0.25rem;
                     right: 0.0625rem;
                     width: 0.625rem;
                     height: 0.625rem;
                     border-top: 0.125rem solid #fff;
                     border-right: 0.125rem solid #fff;
                     transform: rotate(45deg);
                  }
               }
            }
         }
         .button-text {
            ${transition("all", 0.45, "cubic-bezier(0.65,0,.076,1)")}
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 0.75rem 0;
            margin: 0 0 0 1.85rem;
            color: ${variables.black};
            font-weight: 700;
            line-height: 1.6;
            text-align: center;
            text-transform: uppercase;
         }
      }
      &:hover {
         .circle {
            width: 100%;
            .icon {
               &.arrow {
                  background: white;
                  transform: translate(1rem, 0);
               }
            }
         }
         .button-text {
            color: white;
         }
      }
   }
`;

const LinkPreset2 = ({ value, fontSize, color }) => {
   return (
      <Preset>
         <button
            style={{ transform: `scale(${fontSize / 50})`, color }}
            class="learn-more"
         >
            <span class="circle" aria-hidden="true">
               <span class="icon arrow"></span>
            </span>
            <span class="button-text">{value}</span>
         </button>
      </Preset>
   );
};

export default LinkPreset2;
