import styles from "./styles.module.css";
import Button from "../../components/Button";
import SecondaryInput from "../../components/global/SecondaryInput";
import Link from "next/link";
import CheckBox from "@/components/global/CheckBox";
import useSignup from "./logic";
import { useState } from "react";
import CountriesSelect from "@/components/CountriesSelect";

export const SignupForm = () => {
   const { signup, loading, error } = useSignup();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [passwordCheck, setPasswordCheck] = useState("");
   const [privacyPolicy, setPrivacyPolicy] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      signup({
         email,
         password,
         passwordCheck,
         privacyPolicy,
      });
   };
   return (
      <div className={styles.root}>
         <h1 className={styles.title}>Sign up</h1>
         <h2 className={styles.subtitle}>
            Enter your details to create your account.
         </h2>
         {error && <p className={styles.error}>{error}</p>}

         <div className={styles.form}>
            <form style={{ all: "unset" }} onSubmit={handleSubmit}>
               <SecondaryInput
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="Enter your email address"
                  label="Email Address"
                  type="email"
                  required
               />
               <SecondaryInput
                  onChange={(e) => setPassword(e.target.value.trim())}
                  placeholder="Create password"
                  label="Password"
                  type="password"
                  required
               />
               <SecondaryInput
                  onChange={(e) => setPasswordCheck(e.target.value.trim())}
                  placeholder="Confirm password"
                  type="password"
                  required
               />
               <CheckBox
                  label="I am 18 years old or older, I agree to My SEEMEE’s"
                  link="Terms & Conditions and Privacy Policy"
                  href="https://www.seemee.io/terms-conditions/"
                  target="_blank"
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
               />
               <Button
                  color="orange"
                  height="45px"
                  size="small"
                  width="120px"
                  style={{ marginRight: "30px", marginInline: "auto" }}
                  disabled={loading}
                  loading={loading}
               >
                  Sign up
               </Button>
            </form>
         </div>

         <p className={styles.switchLogin}>
            Already have an account ?{" "}
            <Link href="/login">
               <a>Login</a>
            </Link>
         </p>
      </div>
   );
};

export const SignupFormDetails = () => {
   const { updateProfile, loading, error } = useSignup();
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [company, setCompany] = useState("");
   const [job, setJob] = useState("");
   const [phone, setPhone] = useState("");
   const [country, setCountry] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      updateProfile({
         company,
         country,
         firstName,
         lastName,
         job,
         phone,
      });
   };
   return (
      <div className={styles.root}>
         <h1 className={styles.title}>Sign up</h1>
         <h2 className={styles.subtitle}>
            Enter your details to create your account.
         </h2>
         {/* {error && <p className={styles.error}>{error}</p>} */}

         <div className={styles.form}>
            <form style={{ all: "unset" }} onSubmit={handleSubmit}>
               <SecondaryInput
                  onChange={(e) => setFirstName(e.target.value.trim())}
                  label="First name"
                  type="text"
                  required
               />
               <SecondaryInput
                  onChange={(e) => setLastName(e.target.value.trim())}
                  label="Last name"
                  type="text"
                  required
               />
               <SecondaryInput
                  onChange={(e) => setCompany(e.target.value.trim())}
                  label="Company name"
                  type="text"
                  required
               />
               <SecondaryInput
                  onChange={(e) => setJob(e.target.value.trim())}
                  label="Job title"
                  type="text"
                  required
               />
               <SecondaryInput
                  onChange={(e) => setPhone(e.target.value.trim())}
                  label="Phone number"
                  type="tel"
               />
               {/* <CountriesSelect onChange={(country) => setCountry(country)} /> */}
               <SecondaryInput
                  onChange={(e) => setCountry(e.target.value.trim())}
                  label="Country"
                  type="password"
                  inputRender={
                     <CountriesSelect
                        onChange={(country) => setCountry(country)}
                     />
                  }
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
                  Sign up
               </Button>
            </form>
         </div>
      </div>
   );
};
