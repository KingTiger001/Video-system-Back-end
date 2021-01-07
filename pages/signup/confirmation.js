import Head from 'next/head'

import SignupLayout from '@/layouts/SignupLayout'

import styles from '@/styles/layouts/Signup.module.sass'

const SignupConfirmation = ({ user }) => {
  return (
    <SignupLayout>
      <Head>
        <title>Sign up | FOMO</title>
      </Head>

      <h1 className={styles.title}>Last step !</h1>
      <h2 className={styles.subtitle}>Enter these details to complete your account.</h2>

    </SignupLayout>
  )
}

export default SignupConfirmation
// export const getServerSideProps = withAuthServerSideProps((ctx, user) => {
//   if (user && user.firstName && user.lastName) {
//     ctx.res.writeHead(302, { Location: '/app' });
//     ctx.res.end();
//   }
//   return false
// });