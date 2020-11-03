import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

import { mainAPI } from '@/plugins/axios'

import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/Button'
import Input from '@/components/Input'

import styles from '@/styles/layouts/Auth.module.sass'

const Login = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const forgotPassword = async (e) => {
    e.preventDefault()
    if (!loading) {
      setError('')
      setLoading(true)
      try {
        await mainAPI.post('/auth/password', { email })
        setEmail(null)
        setSuccess('You\'ll receive an email soon with a confirmation link.')
        setTimeout(() => {
          setSuccess('')
        }, 5000)
      } catch (err) {
        const code = err.response && err.response.data
        if (code === 'Auth.password.forgot.notFound') {
          setError('No user found with this email address.')
        } else {
          setError('An error occurred.')
        }
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <AuthLayout>
      <Head>
        <title>Forgot password | FOMO</title>
      </Head>

      <h1 className={styles.title}>Forgot password</h1>
      <h2 className={styles.subtitle}>Enter your email to get a reset password link.</h2>

      <form onSubmit={forgotPassword}>
        <div>
          <Input
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Email"
            type="email"
            required
          />
        </div>
        { error && <p className={styles.error}>{error}</p> }
        { success && <p className={styles.success}>{success}</p> }
        <Button
          loading={loading}
          width="100%"
        >
          Send
        </Button>
      </form>
      <Link href="/login">
        <a className={styles.link}>Back to log in</a>
      </Link>
    </AuthLayout>
  )
}

export default Login