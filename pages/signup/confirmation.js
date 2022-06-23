import jscookie from 'js-cookie'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { mainAPI } from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'

import SignupLayout from '@/layouts/SignupLayout'

import Button from '@/components/Button'

import styles from '@/styles/layouts/Signup.module.sass'

const SignupConfirmation = () => {
  const router = useRouter()

  const [error, setError] = useState(false)

  useEffect(() => {
    async function confirmEmail () {
      if (router.query.t) {
        try {
          const { data: { jwt, user } } = await mainAPI.post(`/auth/email/confirmation/${router.query.t}`)
          jscookie.set('fo_sas_tk', jwt, { expires: dayjs().add(30, 'day').toDate() })
          mainAPI.defaults.headers.common.Authorization = `Bearer ${jwt}`
          router.replace('/app')
        } catch (err) {
          return setError(true)
        }
      }
    }
    confirmEmail()
  }, [router])

  return (
    <SignupLayout>
      <Head>
        <title>Sign up | SEEMEE</title>
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
      { !error && <p className={styles.emailConfirmationChecking}>Checking...</p>}
    </SignupLayout>
  )
}

export default SignupConfirmation
// export const getServerSideProps = async ({ query, req, res }) => {
//   const cookies = new Cookies(req, res)
//   if (!query.t) {
//     return { props: { error: true }}
//   }
//   try {
//     const { data: { jwt, user } } = await mainAPI.post(`/auth/email/confirmation/${query.t}`)
//     cookies.set('fo_sas_tk', jwt, { expires: dayjs().add(30, 'day').toDate() })
//     console.log(mainAPI.defaults, '\n')
//     console.log(mainAPI.defaults.headers, '\n')
//     console.log(mainAPI.defaults.headers.common)
//     mainAPI.defaults.headers.common.Authorization = `Bearer ${jwt}`
//     res.writeHead(302, { Location: '/app' })
//     res.end()
//     return { props: {} }
//   } catch (err) {
//     console.log(err)
//     return { props: { error: true }}
//   }
// };
