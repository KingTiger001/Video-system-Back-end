import styles from "@/styles/components/Campaign/Tools.module.sass";
import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";

const ToolItemBackground = () => {
   const dispatch = useDispatch();
   const colorpickerRef = useRef(null);
   const [showContent, setShowContent] = useState(false);
   const endScreen = useSelector((state) => state.campaign.endScreen);
   const contents = useSelector((state) => state.campaign.contents);
   const selectedContent = useSelector(
      (state) => state.campaign.selectedContent
   );

   useEffect(() => {
      function handleClickOutside(event) {
         if (
            colorpickerRef.current &&
            !colorpickerRef.current.contains(event.target)
         )
            setShowContent(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [colorpickerRef]);

   const handleChangeColor = (color) => {
      const obj = { ...selectedContent };
      obj.screen.background.color = color.hex;

      const indexArr = contents.findIndex(
         (content) => content._id === selectedContent._id
      );
      let array = contents.slice();
      array[indexArr] = obj;

      dispatch({
         type: "SET_VIDEO",
         data: array,
      });
   };

   return (
      <div className={`${styles.toolItem} ${styles.background}`}>
         <div
            className={styles.styleColor}
            style={{
               background: selectedContent.screen
                  ? selectedContent.screen.background.color
                  : "white",
            }}
            onClick={() => setShowContent(!showContent)}
         ></div>

         {/* need to enable */}
         {showContent && (
            <div className={styles.toolItemContent} ref={colorpickerRef}>
               <ChromePicker
                  className={styles.colorPicker}
                  disableAlpha={true}
                  color={selectedContent.screen.background.color}
                  onChange={(color) => handleChangeColor(color)}
               />
            </div>
         )}

         {/*  */}
      </div>
   );
};

export default ToolItemBackground;
