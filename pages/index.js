import dayjs from 'dayjs'
import Head from 'next/head'
import { Link as LinkScroll, Element as ElementScroll } from 'react-scroll'


import { Link, withTranslation } from '../i18n'

import Button from '../components/Button'

import styles from '../styles/pages/index.module.sass'

const Index = ({ t }) => {
  return (
    <div>
      <Head>
      </Head>

      <header className={styles.header}>
        <div className={styles.container}>
          <img
            src="/logo.svg"
            alt="Logo FOMO"
            className={styles.logo}
          />
          <div className={styles.headerContent}>
            <nav className={styles.headerMenu}>
              <LinkScroll
                to="solution"
                smooth={true}
                offset={150}
                duration={500}
              >
                Solution
              </LinkScroll>
              <LinkScroll
                to="product"
                smooth={true}
                offset={-100}
                duration={500}
              >
                Product
              </LinkScroll>
              <LinkScroll
                to="pricing"
                smooth={true}
                offset={50}
                duration={500}
              >
                Pricing
              </LinkScroll>
            </nav>
            <div className={styles.headerButtons}>
              <Button
                href="/"
                style="outline"
                type="link"
                width={120}
              >
                {t('landing:buttonLogin')}
              </Button>
              <Button
                href="/"
                type="link"
                width={120}
              >
                {t('landing:buttonTryItFree')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.engageSection}>
          <div className={styles.container}>
            <h1 className={styles.engageTitle}>{t('landing:engageTitle')}</h1>
            <h2 className={styles.engageSubtitle}>{t('landing:engageSubtitle')}</h2>
            <div className={styles.engageButtons}>
              <Button
                href="/"
                type="link"
                width={200}
              >
                {t('landing:buttonStartTrial')}
              </Button>
              <Button
                href="/"
                style="outline"
                type="link"
                width={200}
              >
                {t('landing:buttonDemo')}
              </Button>
            </div>
            <p className={styles.creditCardNotRequired}>{t('common:creditCardNotRequired')}</p>
          </div>
          <div className={styles.engageVisual}>
            <div className={styles.engageScreenshot}>
              <img
                src="/assets/home/engageOval.svg"
                className={styles.engageVisualOval}
              />
              <img
                src="/assets/home/engageSquare.svg"
                className={styles.engageVisualSquare}
              />
              <div className={styles.engageScreenshotHidden}>
                <img
                  src="/assets/home/screenshot.png"
                  alt="Screenshot dashboard FOMO"
                />
              </div>
            </div>
            <img
              src="/assets/home/engageWave.svg"
              className={styles.engageVisualWave}
            />
          </div>
        </section>

        <ElementScroll name="solution">
          <section className={styles.solutionSection}>
            <div className={styles.container}>
              <h1 className={styles.sectionTitleCenter}>{t('landing:solutionTitle')}</h1>
              <h2 className={styles.sectionSubtitleCenter}>{t('landing:solutionSubtitle')}</h2>
              <div className={styles.solutionGrid}>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}></div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}></div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}></div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}></div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
              </div>
              <Button
                href="/"
                type="link"
              >
                {t('landing:buttonStartTrial')}
              </Button>
            </div>
          </section>
        </ElementScroll>


        <ElementScroll name="product">
          <section className={styles.advantagesSection}>
            <div className={styles.container}>
              <h1 className={styles.advantagesTitle}>{t('landing:advantagesTitle')}</h1>
              <h2 className={styles.advantagesSubtitle}>{t('landing:advantagesSubtitle')}</h2>
              <ul className={styles.advantagesList}>
                <li className={styles.advantagesItem}>
                  <div className={styles.icon}></div>
                  <p>{t('landing:advantageOne')}</p>
                </li>
                <li className={styles.advantagesItem}>
                  <div className={styles.icon}></div>
                  <p>{t('landing:advantageTwo')}</p>
                </li>
                <li className={styles.advantagesItem}>
                  <div className={styles.icon}></div>
                  <p>{t('landing:advantageThree')}</p>
                </li>
              </ul>
              <Button
                href="/"
                type="link"
              >
                {t('landing:buttonStartTrial')}
              </Button>
              <div className={styles.advantagesVisual}>
                <img
                  src="/assets/home/advantagesOval.svg"
                  className={styles.advantagesVisualOval}
                />
                <img
                  src="/assets/home/screenshot.png"
                  alt="Screenshot dashboard FOMO"
                  className={styles.advantagesScreenshot}
                />
              </div>
            </div>
          </section>
        </ElementScroll>

        <section className={styles.stepsSection}>
          <div className={styles.container}>
            <div className={styles.stepsVisual}>
              <Button
                href="/"
                type="link"
              >
                {t('landing:buttonStartTrial')}
              </Button>
            </div>
            <div>
              <h1 className={styles.sectionTitle}>{t('landing:stepsTitle')}</h1>
              <ul className={styles.stepsList}>
                <li className={styles.stepsItem}>
                  <div className={styles.stepsItemNumber}>
                    <span>1</span>
                  </div>
                  <p className={styles.stepsItemTitle}>Step 1</p>
                  <p className={styles.stepsItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                </li>
                <li className={styles.stepsItem}>
                  <div className={styles.stepsItemNumber}>
                    <span>2</span>
                  </div>
                  <p className={styles.stepsItemTitle}>Step 2</p>
                  <p className={styles.stepsItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                </li>
                <li className={styles.stepsItem}>
                  <div className={styles.stepsItemNumber}>
                    <span>3</span>
                  </div>
                  <p className={styles.stepsItemTitle}>Step 3</p>
                  <p className={styles.stepsItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                </li>
              </ul>
            </div>
          </div>
          <img
            src="/assets/home/stepsWave.svg"
            className={styles.stepsWave}
          />
        </section>


        <ElementScroll name="pricing">
          <section className={styles.plansSection}>
            <div className={styles.container}>
              <h1 className={styles.plansTitle}>{t('landing:plansTitle')}</h1>
              <h2 className={styles.plansSubtitle}>{t('landing:plansSubtitle')}</h2>
              <ul className={styles.plansList}>
                <li>
                  <div className={styles.planContent}>
                    <div className={styles.planPrice}>
                      <p>$39</p>
                      <span>/month</span>
                    </div>
                    <p className={styles.planTitle}>Basic</p>
                    <p className={styles.planText}>All the basics for businesses that are just getting started.</p>
                    <ul className={styles.planDetails}>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Single project use</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Basic dashboard</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>All components included</p>
                      </li>
                    </ul>
                    <Button
                      color="grey"
                      href="/"
                      style="outline"
                      type="link"
                      width={160}
                    >
                      {t('landing:buttonTryItFree')}
                    </Button>
                    <p className={styles.creditCardNotRequired}>{t('common:creditCardNotRequired')}</p>
                  </div>
                </li>
                <li className={styles.planRecommended}>
                  <div className={styles.planRecommendedLabel}>Recommended</div>
                  <div className={styles.planContent}>
                    <div className={styles.planPrice}>
                      <p>$99</p>
                      <span>/month</span>
                    </div>
                    <p className={styles.planTitle}>Standard</p>
                    <p className={styles.planText}>Better for growing businesses that want more customers.</p>
                    <ul className={styles.planDetails}>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Unlimited project use</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Advanced dashboard</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>All components included</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Advanced insight</p>
                      </li>
                    </ul>
                    <Button
                      color="secondary"
                      href="/"
                      type="link"
                    >
                      {t('landing:buttonTryItFree')}
                    </Button>
                    <p className={styles.creditCardNotRequired}>{t('common:creditCardNotRequired')}</p>
                  </div>
                </li>
                <li className={styles.planPremium}>
                  <div className={styles.planContent}>
                    <div className={styles.planPrice}>
                      <p>$339</p>
                      <span>/month</span>
                    </div>
                    <p className={styles.planTitle}>Premium</p>
                    <p className={styles.planText}>Advanced features for pros who need more customization.</p>
                    <ul className={styles.planDetails}>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Single project use</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Basic dashboard</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Mutlivariate components</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheck.svg" />
                        <p>Phone Support</p>
                      </li>
                    </ul>
                    <Button
                      color="grey"
                      href="/"
                      style="outline"
                      type="link"
                      width={160}
                    >
                      {t('landing:buttonTryItFree')}
                    </Button>
                    <p className={styles.creditCardNotRequired}>{t('common:creditCardNotRequired')}</p>
                  </div>
                </li>
                
              </ul>
            </div>
          </section>
        </ElementScroll>

        <section className={styles.tryItSection}>
          <h1 className={styles.sectionTitle}>{t('landing:tryItTitle')}</h1>
          <h2 className={styles.sectionSubtitle}>{t('landing:tryItSubtitle')}</h2>
          <Button
            color="white"
            style="outline"
            href="/"
            type="link"
            width={160}
          >
            {t('landing:buttonTryItFree')}
          </Button>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div>
            <img
              src="/logo.svg"
              alt="Logo FOMO"
              className={styles.logo}
            />
          </div>
          <div>
            <p className={styles.footerLinksTitle}>Company</p>
            <div className={styles.footerLinks}>
              <Link href="/">
                <a className={styles.footerLinksItem}>About</a>
              </Link>
              <Link href="/">
                <a className={styles.footerLinksItem}>Privacy Policy</a>
              </Link>
              <Link href="/">
                <a className={styles.footerLinksItem}>Terms</a>
              </Link>
              <Link href="/">
                <a className={styles.footerLinksItem}>Careers</a>
              </Link>
            </div>
          </div>
          <div>
            <p className={styles.footerLinksTitle}>More</p>
            <div className={styles.footerLinks}>
              <Link href="/">
                <a className={styles.footerLinksItem}>Documentation</a>
              </Link>
              <Link href="/">
                <a className={styles.footerLinksItem}>License</a>
              </Link>
            </div>
          </div>
          <div>
            <ul className={styles.footerSocials}>
              <li>
                <img src="/assets/home/socials-facebook.svg" />
              </li>
              <li>
                <img src="/assets/home/socials-youtube.svg" />
              </li>
              <li>
                <img src="/assets/home/socials-twitter.svg" />
              </li>
              <li>
                <img src="/assets/home/socials-linkedin.svg" />
              </li>
            </ul>
            <p className={styles.copyright}>Copyright © {dayjs().format('YYYY')}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

Index.getInitialProps = async () => ({
  namespacesRequired: ['common', 'landing'],
})

export default withTranslation()(Index)