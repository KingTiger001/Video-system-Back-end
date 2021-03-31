import Head from 'next/head'

import { mainAPI } from '@/plugins/axios'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import SignupLayout from '@/layouts/SignupLayout'

import Button from '@/components/Button'

import styles from '@/styles/layouts/Signup.module.sass'

const SignupConfirmation = ({ error }) => {
  return (
    <SignupLayout>
      <Head>
        <title>Sign up | FOMO</title>
      </Head>

      <h1 className={styles.title}>Email confirmation</h1>

      { error &&
        <div className={styles.emailConfirmationError}>
          <p>Your confirmation link is expired or incorrect.</p>
          <Button
            href="/"
            type="link"
          >
            Back to home
          </Button>
        </div>
      }
    </SignupLayout>
  )
}

export default SignupConfirmation
export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
  if (!ctx.query.t) {
    return { error: true}
  }
  try {
    await mainAPI.post(`/auth/email/confirmation/${ctx.query.t}`)
    ctx.res.writeHead(302, { Location: '/app' })
    ctx.res.end()
    return {}
  } catch (err) {
    return { error: true }
  }
});