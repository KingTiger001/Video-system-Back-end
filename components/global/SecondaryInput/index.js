import styles from "./styles.module.css";

const SecondaryInput = (props) => {
   return (
      <div className={styles.root}>
         <label htmlFor={props.id}>
            {props.label}
            {props.required && props.label ? (
               <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  fill="none"
                  style={{ display: "inline-block", marginBottom: "8px" }}
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M2.5 0L3.06129 1.72746H4.87764L3.40818 2.79508L3.96946 4.52254L2.5 3.45492L1.03054 4.52254L1.59182 2.79508L0.122359 1.72746H1.93871L2.5 0Z"
                     fill="#2D475E"
                  />
               </svg>
            ) : (
               ""
            )}
         </label>
         {props.inputRender ? (
            props.inputRender
         ) : (
            <input id={props.id} {...props} />
         )}
      </div>
   );
};

export default SecondaryInput;
