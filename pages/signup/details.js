import Head from "next/head";
import withAuth from "@/hocs/withAuth";
import withAuthServerSideProps from "@/hocs/withAuthServerSideProps";
import AuthLayout from "@/layouts/Auth";
import { SignupFormDetails } from "@/layouts/Signup";

const SignupDetails = () => {
   return (
      <AuthLayout>
         <Head>
            <title>Sign up | FOMO</title>
         </Head>
         <SignupFormDetails />
      </AuthLayout>
   );
};

export default withAuth(SignupDetails);
export const getServerSideProps = withAuthServerSideProps((ctx, user) => {
   if (user && user.firstName && user.lastName) {
      ctx.res.writeHead(302, { Location: "/app" });
      ctx.res.end();
   }
   return false;
});
