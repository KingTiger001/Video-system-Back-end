import { mainAPI } from "@/plugins/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import jscookie from "js-cookie";

const useSignup = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();

   const signup = async ({ email, password, passwordCheck, privacyPolicy }) => {
      if (!loading) {
         setError("");
         setLoading(true);
         try {
            if (password !== passwordCheck) {
               return setError("Password doesn't match");
            }
            if (!privacyPolicy) {
               return setError("Please Accept Privacy Policy");
            }
            const {
               data: { jwt },
            } = await mainAPI.post("/auth/signup", {
               email,
               password,
            });
            jscookie.set("fo_sas_tk", jwt, { expires: 30 });
            mainAPI.defaults.headers.common.Authorization = `Bearer ${jwt}`;
            router.push("/signup/details");
         } catch (err) {
            const code = err.response && err.response.data;
            if (code === "Auth.signup.userExist") {
               setError("An user already exist with this email address.");
            } else {
               setError("An error occurred.");
            }
         } finally {
            setLoading(false);
         }
      }
   };

   const updateProfile = async ({
      company,
      country,
      firstName,
      lastName,
      job,
      phone,
   }) => {
      if (!loading) {
         setError("");
         setLoading(true);
         try {
            const { data: user } = await mainAPI.patch("/users/me", {
               company,
               country,
               firstName,
               lastName,
               job,
               phone,
            });
            await mainAPI.post("/auth/email/confirmation/new", {
               userId: user._id,
            });
            router.push("/app");
         } catch (err) {
            console.log(err);
            setError("An error occured.");
         } finally {
            setLoading(false);
         }
      }
   };

   return { signup, updateProfile, loading, error };
};

export default useSignup;
