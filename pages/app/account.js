import Head from 'next/head'
import { useState } from 'react'
import { toast } from 'react-toastify'

import withAuthServerSideProps from '@/hocs/withAuthServerSideProps'

import { mainAPI } from '@/plugins/axios'

import AccountLayout from '@/layouts/AccountLayout'
import AppLayout from '@/layouts/AppLayout'

import Button from '@/components/Button'
import CountriesSelect from '@/components/CountriesSelect'
import Input from '@/components/Input'

import layoutStyles from '@/styles/layouts/App.module.sass'
import styles from '@/styles/pages/app/account.module.sass'

const Account = ({ me }) => {
  const [account, setAccount] = useState(me)
  const [email, setEmail] = useState({ value: me.email })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState({})

  const updateAccount = async (e) => {
    e.preventDefault()

    setError(null)

    if (password.value && !password.confirm) {
      return setError('Confirm password is missing.')
    }
    if (password.value && password.confirm && password.value !== password.confirm) {
      return setError('The passwords don\'t match.')
    }
    if (email.value && email.confirm && email.value !== email.confirm) {
      return setError('The emails don\'t match.')
    }

    try {
      setLoading(true)
      await mainAPI.patch('/users/me', {
        company: account.company,
        country: account.country,
        firstName: account.firstName,
        job: account.job,
        lastName: account.lastName,
        phone: account.phone,
        ...(email.value && email.confirm && { email: email.value }),
        ...(password.value && password.confirm && { password }),
      })
      toast.success('Account updated')
      setEmail({ value: me.email })
      setPassword({})
    } catch (err) {
      toast.error('An error succeeded')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <Head>
        <title>Account | FOMO</title>
      </Head>

      <AccountLayout>
        <div className={layoutStyles.header}>
          <div className={layoutStyles.headerTop}>
            <h1 className={layoutStyles.headerTitle}>Edit your account</h1>
            <Button loading={loading} onClick={updateAccount}>Update infos</Button>
          </div>
          <div className={layoutStyles.headerBottom} />
        </div>

        <form
          className={styles.form}
        >
          <div className={styles.formRow}>
            <div>
              <label className={styles.label}>First name*</label>
              <Input
                onChange={(e) => setAccount({
                  ...account,
                  firstName: e.target.value,
                })}
                type="text"
                required
                value={account.firstName}
              />
            </div>
            <div>
              <label className={styles.label}>Company name*</label>
              <Input
                onChange={(e) => setAccount({
                  ...account,
                  company: e.target.value,
                })}
                type="text"
                required
                value={account.company}
              />
            </div>
            <div>
              <label className={styles.label}>Phone*</label>
              <Input
                onChange={(e) => setAccount({
                  ...account,
                  phone: e.target.value,
                })}
                type="text"
                required
                value={account.phone}
              />
            </div>
            <div>
              <label className={styles.label}>Last name*</label>
              <Input
                onChange={(e) => setAccount({
                  ...account,
                  lastName: e.target.value,
                })}
                type="text"
                required
                value={account.lastName}
              />
            </div>
            <div>
              <label className={styles.label}>Job title*</label>
              <Input
                onChange={(e) => setAccount({
                  ...account,
                  job: e.target.value,
                })}
                type="text"
                required
                value={account.job}
              />
            </div>
            <div>
              <label className={styles.label}>Country</label>
              <CountriesSelect
                defaultCountrySelected={account.country}
                onChange={(country) => setAccount({
                  ...account,
                  country
                })}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.newEmail}>
              <div>
                <label className={styles.label}>Email address</label>
                <Input
                  onChange={(e) => setEmail({
                    ...email,
                    value: e.target.value,
                  })}
                  type="email"
                  value={email.value}
                />
              </div>
              <div>
                <label className={styles.label}>Confirm Email address</label>
                <Input
                  onChange={(e) => setEmail({
                    ...email,
                    confirm: e.target.value,
                  })}
                  type="text"
                  value={email.confirm}
                />
              </div>
            </div>
            <div className={styles.newPassword}>
              <div>
                <label className={styles.label}>Password</label>
                <Input
                  onChange={(e) => setPassword({
                    ...password,
                    value: e.target.value,
                  })}
                  type="password"
                  value={password.value}
                />
              </div>
              <div>
                <label className={styles.label}>Confirm password</label>
                <Input
                  onChange={(e) => setPassword({
                    ...password,
                    confirm: e.target.value,
                  })}
                  type="password"
                  value={password.confirm}
                />
              </div>
            </div>
          </div>

          <div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </form>
        
      </AccountLayout>
    </AppLayout>
  )
};

export default Account
export const getServerSideProps = withAuthServerSideProps()