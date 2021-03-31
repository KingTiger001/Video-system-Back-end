import Link from 'next/link'

import styles from '@/styles/layouts/Signup.module.sass'

export default function SignupLayout ({ children }) {
  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        <div className={styles.onboarding}>
          <div>
            <Link href="/">
              <a>
                <img
                  className={styles.logo}
                  src="/logo.svg"
                />
              </a>
            </Link>
            <p className={styles.onboardingTitle}>Easy as<br/>1, 2, 3</p>
            <p className={styles.onboardingSubtitle}>Start your 14 days free trial.</p>
          </div>
        </div>

        <div>
          {children}
          <p className={styles.termsOfService}>By signing up, you agree to FOMO’s Terms of Use and Privacy Policy.</p>
        </div>
      </main>
    </div>
  )
}