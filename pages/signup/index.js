import jscookie from 'js-cookie'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { mainAPI } from '../../plugins/axios'

import withAuth from '../../hocs/withAuth'
import withAuthServerSideProps from '../../hocs/withAuthServerSideProps'

import SignupLayout from '../../layouts/SignupLayout'
import Button from '../../components/Button'
import Input from '../../components/Input'

import styles from '../../styles/layouts/Signup.module.sass'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')

  const router = useRouter()

  const signup = async (e) => {
    e.preventDefault()
    if (!loading) {
      setError('')
      setLoading(true)
      try {
        if (password !== passwordCheck) {
          return setError('Password doesn\'t match')
        }
        const { data: { jwt } } = await mainAPI.post('/auth/signup', {
          email,
          password,
        })
        jscookie.set('fo_sas_tk', jwt, { expires: 30 })
        mainAPI.defaults.headers.common.Authorization = `Bearer ${jwt}`
        router.push('/signup/details')
      } catch (err) {
        const code = err.response && err.response.data
        if (code === 'Auth.signup.userExist') {
          setError('An user already use this email address.')
        } else {
          setError('An error occurred.')
        }
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <SignupLayout>
      <Head>
        <title>Sign up | FOMO</title>
      </Head>

      <h1 className={styles.title}>Sign up</h1>
      <h2 className={styles.subtitle}>Enter your details to create your account.</h2>

      <form onSubmit={signup}>
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
        <div>
          <Input
            onChange={(e) => setPasswordCheck(e.target.value.trim())}
            placeholder="Confirm password"
            type="password"
            required
          />
        </div>
        { error && <p className={styles.error}>{error}</p> }
        <Button
          loading={loading}
          width="100%"
        >
          Sign up
        </Button>
      </form>
      <p className={styles.switchLogin}>Already have an account ? <Link href="/login"><a>Login</a></Link></p>
    </SignupLayout>
  )
}

export default withAuth(Signup)
export const getServerSideProps = withAuthServerSideProps((ctx, user) => {
  if (user) {
    ctx.res.writeHead(302, { Location: '/app' });
    ctx.res.end();
  }
  return false
});