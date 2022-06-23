import jscookie from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { mainAPI } from "@/plugins/axios";

import withAuth from "@/hocs/withAuth";
import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";

import AuthLayout from "@/layouts/Auth";
import { LoginForm } from "@/layouts/Login";

const Login = () => {
   return (
      <AuthLayout logo="/assets/common/dashboard-orange.png">
         <Head>
            <title>Login | SEEMEE</title>
         </Head>
         <LoginForm />
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
