import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import axios from '@/plugins/axios'

import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/Button'
import Input from '@/components/Input'

import styles from '@/styles/layouts/Auth.module.sass'

const Login = () => {
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')

  const router = useRouter()

  useEffect(() => {
    const checkToken = async () => {
      if (router.query.token) {
        const { data: isValid } = await axios.get(`/auth/password/${router.query.token}`)
        setIsValid(isValid)
      }
    }
    checkToken()
  }, [router.query]);

  const resetPassword = async (e) => {
    e.preventDefault()
    if (!loading) {
      setError('')
      setLoading(true)
      try {
        if (password !== passwordCheck) {
          return setError('Password doesn\'t match')
        }
        await axios.post(`/auth/password/${router.query.token}`, {
          password,
          passwordCheck,
        })
        router.push('/login')
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <AuthLayout>
      <Head>
        <title>Reset password | FOMO</title>
      </Head>

      <h1 className={styles.title}>Reset password</h1>
      <h2 className={styles.subtitle}>Choose a new and strong password.</h2>

      {
        isValid 
          ?
          <form onSubmit={resetPassword}>
            <div>
              <Input
                onChange={(e) => setPassword(e.target.value.trim())}
                placeholder="New password"
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
              Reset
            </Button>
          </form>
          :
          <div>
            <p className={styles.error} style={{ fontSize: 20, fontWeight: 500 }}>Your reset password link has expired.</p>
          </div>
      }
    </AuthLayout>
  )
}

export default Login