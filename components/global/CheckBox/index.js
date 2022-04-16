import styles from "./styles.module.css";
import Link from "next/link";

const CheckBox = (props) => {
   return (
      <div className={styles.root}>
         <input type="checkbox" {...props} />
         <label htmlFor={props.id}>
            {props.label}{" "}
            {props.link ? <Link href={props.href}>{props.link}</Link> : ""}
         </label>
      </div>
   );
};

export default CheckBox;
