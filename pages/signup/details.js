import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { mainAPI } from '@/plugins/axios'

import withAuth from '@/hocs/withAuth'
import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import SignupLayout from '@/layouts/SignupLayout'
import Button from '@/components/Button'
import CountriesSelect from '@/components/CountriesSelect'
import Input from '@/components/Input'

import styles from '@/styles/layouts/Signup.module.sass'

const SignupDetails = ({ user }) => {
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [job, setJob] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')

  const router = useRouter()

  const updateProfile = async (e) => {
    e.preventDefault()
    if (!loading) {
      setError('')
      setLoading(true)
      try {
        const { data: user } = await mainAPI.patch('/users/me', {
          company,
          country,
          firstName,
          lastName,
          job,
          phone,
        })
        await mainAPI.post('/auth/email/confirmation/new', { userId: user._id })
        router.push('/app')
      } catch (err) {
        console.log(err)
        setError('An error occured.')
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

      <h1 className={styles.title}>Last step !</h1>
      <h2 className={styles.subtitle}>Enter these details to complete your account.</h2>

      <form onSubmit={updateProfile}>
        <div>
          <Input
            onChange={(e) => setFirstName(e.target.value.trim())}
            placeholder="First name*"
            type="text"
            required
          />
        </div>
        <div>
          <Input
            onChange={(e) => setLastName(e.target.value.trim())}
            placeholder="Last name*"
            type="text"
            required
          />
        </div>
        <div>
          <Input
            onChange={(e) => setCompany(e.target.value.trim())}
            placeholder="Company name*"
            type="text"
            required
          />
        </div>
        <div>
          <Input
            onChange={(e) => setJob(e.target.value.trim())}
            placeholder="Job title*"
            type="text"
            required
          />
        </div>
        <div>
          <Input
            onChange={(e) => setPhone(e.target.value.trim())}
            placeholder="Phone*"
            type="text"
            required
          />
        </div>
        <div>
          <CountriesSelect
            onChange={(country) => setCountry(country)}
          />
        </div>
        { error && <p className={styles.error}>{error}</p> }
        <Button
          loading={loading}
          width="100%"
        >
          Sign Up
        </Button>
      </form>
    </SignupLayout>
  )
}

export default withAuth(SignupDetails)
export const getServerSideProps = withAuthServerSideProps((ctx, user) => {
  if (user && user.firstName && user.lastName) {
    ctx.res.writeHead(302, { Location: '/app' });
    ctx.res.end();
  }
  return false
});