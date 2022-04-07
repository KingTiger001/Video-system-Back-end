import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/Button";
import Draggable from "react-draggable";
import styles from "@/styles/components/Campaign/EndScreen.module.sass";
import { useDispatch, useSelector } from "react-redux";

const EndScreen = ({ contact, data = {} }) => {
   const dispatch = useDispatch();

   // const ref = useRef();

   const [ref, setRef] = useState();

   const contents = useSelector((state) => state.campaign.contents);

   //test
   const [time, setTime] = useState(0);
   //

   const [titleResponsiveFontSize, setTitleResponsiveFontSize] = useState(0);
   const [subtitleResponsiveFontSize, setSubtitleResponsiveFontSize] =
      useState(0);
   const [emailResponsiveFontSize, setEmailResponsiveFontSize] = useState(0);
   const [phoneResponsiveFontSize, setPhoneResponsiveFontSize] = useState(0);

   // useEffect(() => {
   //   const handleResize = () => {
   //     if (ref.current) {
   //       setTitleResponsiveFontSize(
   //         ref.current.offsetWidth * (data.title.fontSize / 1000)
   //       );
   //       setSubtitleResponsiveFontSize(
   //         ref.current.offsetWidth * (data.subtitle.fontSize / 1000)
   //       );
   //       setEmailResponsiveFontSize(
   //         ref.current.offsetWidth * (data.email.fontSize / 1000)
   //       );
   //       setPhoneResponsiveFontSize(
   //         ref.current.offsetWidth * (data.phone.fontSize / 1000)
   //       );
   //     }
   //   };
   //   if (ref.current) {
   //     setTimeout(() => {
   //       handleResize();
   //       window.addEventListener("resize", handleResize);
   //     }, 0);
   //   }
   //   return () => {
   //     if (ref.current) {
   //       window.removeEventListener("resize", handleResize);
   //     }
   //   };
   // }, [ref, data]);

   const replaceVariables = (text) => {
      if (!contact) {
         return text;
      }
      const matches = text.match(/(?:\{\{)(.*?)(?:\}\})/gi);
      if (!matches || matches.length <= 0) {
         return text;
      }
      matches.map((match) => {
         text = text.replace(match, contact[match.replace(/{|}/g, "")] || "");
      });
      return text;
   };

   const getPositionPercent = (x, y) => {
      return {
         x: (x / ref.offsetWidth) * 100,
         y: (y / ref.offsetHeight) * 100,
      };
   };

   const convertPercentToPx = ({ x, y }) => {
      if (!ref) {
         return;
      } else {
         return {
            x: (x * ref.offsetWidth) / 100,
            y: (y * ref.offsetHeight) / 100,
         };
      }
   };

   const handleStop = (_, info, id, type) => {
      const obj = { ...data };

      const index =
         type === "text"
            ? obj.texts.findIndex((text) => text._id === id)
            : obj.links.findIndex((link) => link._id === id);
      if (index < 0) return;
      const { x, y } = getPositionPercent(info.x, info.y);
      // const { x, y } = { x: info.x, y: info.y };
      if (type === "text") {
         obj.texts[index].position = { x, y };
      } else {
         obj.links[index].position = { x, y };
      }

      const indexArr = contents.findIndex(
         (content) => content._id === data._id
      );
      let array = contents.slice();
      array[indexArr] = obj;
      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
   };

   const renderText = (text) => {
      if (ref !== undefined)
         return (
            <Draggable
               key={text._id}
               bounds={"parent"}
               defaultPosition={convertPercentToPx(text.position)}
               // position={text.position}
               position={null}
               grid={[25, 25]}
               scale={1}
               onStop={(event, info) =>
                  handleStop(event, info, text._id, "text")
               }
            >
               <p
                  style={{
                     fontSize: `${text.fontSize ? text.fontSize : 1}rem`,
                     color: `${text.color ? text.color : "#fff"}`,
                  }}
                  className={styles.textDraggable}
               >
                  {text.value}
               </p>
            </Draggable>
         );
   };

   const renderLink = (link) => {
      if (ref !== undefined)
         return (
            <Draggable
               key={link._id}
               bounds={"parent"}
               defaultPosition={convertPercentToPx(link.position)}
               // position={link.position}
               position={null}
               grid={[25, 25]}
               scale={1}
               onStop={(event, info) =>
                  handleStop(event, info, link._id, "link")
               }
            >
               <p className={styles.linkDraggable}>{link.value}</p>
            </Draggable>
         );
   };

   return (
      Object.keys(data).length > 1 && (
         <div
            className={styles.endScreen}
            // ref={ref}
            ref={(newRef) => setRef(newRef)}
            style={{ background: data.screen.background.color }}
         >
            <div className={styles.textSection}>
               {/* {data.texts.map(renderText)}
          {data.links.map(renderLink)} */}
            </div>

            {/* { data.title.value &&
        <p
          style={{
            color: data.title.color,
            fontSize: titleResponsiveFontSize,

            textAlign: data.title.textAlign,
            ...(data.title.letterSpacing > 0 && { paddingLeft: data.title.letterSpacing }),
          }}
        >
          {replaceVariables(data.title.value)}
        </p>
      }
      { data.subtitle.value &&
        <p
          style={{
            color: data.subtitle.color,
            fontSize: subtitleResponsiveFontSize,
            fontWeight: data.subtitle.fontWeight,
            letterSpacing: data.subtitle.letterSpacing,
            // lineHeight: data.subtitle.lineHeight,
            textAlign: data.subtitle.textAlign,
            ...(data.subtitle.letterSpacing > 0 && { paddingLeft: data.subtitle.letterSpacing }),
          }}
        >
          {replaceVariables(data.subtitle.value)}
        </p>
      } */}
            {/* {data.button && data.button.value && (
          <Button
            target="blank"
            type="link"
            href={
              data.button.href
                ? `https://${data.button.href.replace("https://", "")}`
                : ""
            }
            color="white"
          >
            {data.button.value}
          </Button>
        )} */}
            <div className={styles.endScreenFooter}>
               {/* {data.email.value && (
            <a
              href={`mailto:${data.email.value}`}
              style={{
                color: data.email.color,
                fontSize: emailResponsiveFontSize,
                fontWeight: data.email.fontWeight,
              }}
            >
              {data.email.value}
            </a>
          )}
          {data.phone.value && (
            <p
              style={{
                color: data.phone.color,
                fontSize: phoneResponsiveFontSize,
                fontWeight: data.phone.fontWeight,
              }}
            >
              {data.phone.value}
            </p>
          )} */}
               {data.networks && data.networks.length > 0 && (
                  <div className={styles.networks}>
                     {data.networks.map((network) => (
                        <Link href={network.link} key={network.id}>
                           <a className={styles.network} target="blank">
                              {network.site}
                           </a>
                        </Link>
                     ))}
                  </div>
               )}
            </div>
         </div>
      )
   );
};

export default EndScreen;
