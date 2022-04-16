import { mainAPI } from "@/plugins/axios";
import { useState } from "react";

const useForgotPassword = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   const forgotPassword = async ({ email, password }) => {
      if (!loading) {
         setError("");
         setLoading(true);
         try {
            await mainAPI.post("/auth/password", { email });
            setEmail(null);
            setSuccess(
               "You'll receive an email soon with a confirmation link."
            );
            setTimeout(() => {
               setSuccess("");
            }, 5000);
         } catch (err) {
            const code = err.response && err.response.data;
            if (code === "Auth.password.forgot.notFound") {
               setError("No user found with this email address.");
            } else {
               setError("An error occurred.");
            }
            console.log(err);
         } finally {
            setLoading(false);
         }
      }
   };

   return { forgotPassword, loading, error, success };
};

export default useForgotPassword;
