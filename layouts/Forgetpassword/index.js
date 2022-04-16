import styles from "./styles.module.css";
import Button from "../../components/Button";
import SecondaryInput from "../../components/global/SecondaryInput";
import Link from "next/link";
import { useState } from "react";
import useForgotPassword from "./logic";

export const Forgetpassword = () => {
   const { forgotPassword, loading, error, success } = useForgotPassword();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      forgotPassword({
         email,
         password,
      });
   };
   return (
      <div className={styles.root}>
         <h1 className={styles.title}>Welcome back</h1>
         {error && <p className={styles.error}>{error}</p>}

         <div className={styles.form}>
            <form style={{ all: "unset" }} onSubmit={handleSubmit}>
               <SecondaryInput
                  onChange={(e) => setEmail(e.target.value.trim())}
                  label="Email Address"
                  type="email"
                  required
               />
               <Button
                  color="orange"
                  height="45px"
                  size="small"
                  width="120px"
                  style={{
                     marginTop: "80px",
                     marginRight: "30px",
                     marginInline: "auto",
                  }}
                  disabled={loading}
                  loading={loading}
               >
                  Send
               </Button>
            </form>
         </div>

         <Link href="/login">
            <a className={styles.link}>Back to log in</a>
         </Link>
      </div>
   );
};
