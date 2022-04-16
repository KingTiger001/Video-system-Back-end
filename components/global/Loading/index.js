import styles from "./style.module.css";

const Loading = (props) => {
   const { white } = props;
   return (
      <div
         className={`${styles.ldsRipple} ${
            white ? styles.white : styles.orange
         }`}
      >
         <div></div>
         <div></div>
      </div>
   );
};
export default Loading;
