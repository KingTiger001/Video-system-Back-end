import jscookie from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { mainAPI } from "@/plugins/axios";

import withAuth from "@/hocs/withAuth";
import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";

import styles from "../styles/layouts/Auth.module.sass";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
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
        console.log("login !-!", mainAPI.c);
        await mainAPI
          .get("/auth/test")
          .catch((err) => console.log("test api err", err))
          .then((res) => console.log("res test api", res));
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
  console.log("SO?");

  return (
    <AuthLayout>
      <Head>
        <title>Log in | FOMO</title>
      </Head>

      <h1 className={styles.title}>Welcome back</h1>
      <h2 className={styles.subtitle}>Sign in to manage your account.</h2>

      <form onSubmit={login}>
        <div>
          <Input
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Email"
            type="email"
            required
          />
        </div>
        <div>
          <Input
            onChange={(e) => setPassword(e.target.value.trim())}
            placeholder="Password"
            type="password"
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button loading={loading} width="100%">
          Log in
        </Button>
      </form>
      <Link href="/forgot-password">
        <a className={styles.link}>Forgot your password ?</a>
      </Link>
      <p className={styles.switchSignup}>
        Don’t have an account ?{" "}
        <Link href="/signup">
          <a>Sign up</a>
        </Link>
      </p>
    </AuthLayout>
  );
};

export default withAuth(Login);
export const getServerSideProps = withAuthServerSideProps((ctx, user) => {
  if (user) {
    ctx.res.writeHead(302, { Location: "/app" });
    ctx.res.end();
  }
  return false;
});
