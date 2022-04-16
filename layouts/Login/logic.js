import { mainAPI } from "@/plugins/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import jscookie from "js-cookie";

const useLogin = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();

   const login = async ({ email, password }) => {
      if (!loading) {
         setError("");
         setLoading(true);
         try {
            const {
               data: { jwt, user },
            } = await mainAPI.post("/auth/login", {
               email,
               password,
            });
            await mainAPI
               .get("/auth/test")
               .catch((err) => console.log("test api err", err));
            jscookie.set("fo_sas_tk", jwt, { expires: 30 });
            mainAPI.defaults.headers.common.Authorization = `Bearer ${jwt}`;
            router.push(
               !user.firstName || !user.lastName ? "/signup/details" : "/app"
            );
         } catch (err) {
            const code = err.response && err.response.data;
            if (code === "Auth.login.invalidCredentials") {
               setError("Invalid credentials.");
            } else {
               setError("An error occurred.");
            }
         } finally {
            setLoading(false);
         }
      }
   };

   return { login, loading, error };
};

export default useLogin;
