import styles from "./styles.module.css";
import Button from "../../components/Button";
import SecondaryInput from "../../components/global/SecondaryInput";
import Link from "next/link";
import CheckBox from "@/components/global/CheckBox";
import useLogin from "./logic";
import { useState } from "react";

export const LoginForm = () => {
   const { login, loading, error } = useLogin();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      login({
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
               <SecondaryInput
                  onChange={(e) => setPassword(e.target.value.trim())}
                  label="Password"
                  type="password"
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
                  Sign in
               </Button>
            </form>
         </div>

         <Link href="/forgot-password">
            <a className={styles.link}>Forgot your password ?</a>
         </Link>
         <p className={styles.switchSignup}>
            Don’t have an account ?{" "}
            <Link href="/signup">
               <a>Sign up</a>
            </Link>
         </p>
      </div>
   );
};
