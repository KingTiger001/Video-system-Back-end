import Head from "next/head";
import AuthLayout from "@/layouts/Auth";
import withAuth from "../../hocs/withAuth";
import withAuthServerSideProps from "../../hocs/withAuthServerSideProps";
import { SignupForm } from "@/layouts/Signup";

const Signup = () => {
   return (
      <AuthLayout>
         <Head>
            <title>Sign up | FOMO</title>
         </Head>
         <SignupForm />
      </AuthLayout>
   );
};

export default withAuth(Signup);
export const getServerSideProps = withAuthServerSideProps((ctx, user) => {
   if (user) {
      ctx.res.writeHead(302, { Location: "/app" });
      ctx.res.end();
   }
   return false;
});
