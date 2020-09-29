import dayjs from 'dayjs'
import Head from 'next/head'
import Link from 'next/link'
import { Link as LinkScroll, Element as ElementScroll } from 'react-scroll'

import Button from '../components/Button'

import styles from '../styles/pages/index.module.sass'

const Index = () => {
  return (
    <div className={styles.homepage}>
      <Head>
        <title>FOMO</title>
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
                href="/login"
                style="outline"
                type="link"
                width={120}
              >
                Log in
              </Button>
              <Button
                href="/signup"
                type="link"
                width={120}
              >
                Try it free
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.engageSection}>
          <div className={styles.container}>
            <h1 className={styles.engageTitle}>Engage your leads through a video message</h1>
            <h2 className={styles.engageSubtitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Olor sit amet, consectetur adipiscing eli.</h2>
            <div className={styles.engageButtons}>
              <Button
                href="/signup"
                type="link"
                width={200}
              >
                Start 7 Days Free Trial
              </Button>
              <Button
                href="/"
                style="outline"
                type="link"
                width={200}
              >
                Watch our demo
              </Button>
            </div>
            <p className={styles.creditCardNotRequired}>No credit card required</p>
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
                  src="/assets/home/screenshot.jpg"
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
              <h1 className={styles.sectionTitleCenter}>Solution made for you</h1>
              <h2 className={styles.sectionSubtitleCenter}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor,  adipiscing elit sed.</h2>
              <div className={styles.solutionGrid}>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/common/iconPlus.svg" />
                  </div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/common/iconPlus.svg" />
                  </div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/common/iconPlus.svg" />
                  </div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/common/iconPlus.svg" />
                  </div>
                  <p className={styles.solutionItemTitle}>Text</p>
                  <p className={styles.solutionItemText}>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
              </div>
              <Button
                href="/signup"
                type="link"
              >
                Start 7 Days Free Trial
              </Button>
            </div>
          </section>
        </ElementScroll>

        <ElementScroll name="product">
          <section className={styles.productSection}>
            <div className={styles.container}>
              <h1 className={styles.productTitle}>Product & advantages</h1>
              <h2 className={styles.productSubtitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </h2>
              <ul className={styles.productList}>
                <li className={styles.productItem}>
                  <div className={styles.icon}>
                    <img src="/assets/common/iconPeople.svg" />
                  </div>
                  <p>Connect with new people</p>
                </li>
                <li className={styles.productItem}>
                  <div className={styles.icon}>
                    <img src="/assets/common/iconChart.svg" />
                  </div>
                  <p>Increase chance to engage</p>
                </li>
                <li className={styles.productItem}>
                  <div className={styles.icon}>
                    <img src="/assets/common/iconSDCard.svg" />
                  </div>
                  <p>Unlimited storage</p>
                  <div className={styles.premiumLabel}>premium</div>
                </li>
              </ul>
              <Button
                href="/signup"
                type="link"
              >
                Start 7 Days Free Trial
              </Button>
              <div className={styles.productVisual}>
                <img
                  src="/assets/home/productOval.svg"
                  className={styles.productVisualOval}
                />
                <img
                  src="/assets/home/screenshot.jpg"
                  alt="Screenshot dashboard FOMO"
                  className={styles.productScreenshot}
                />
              </div>
            </div>
          </section>
        </ElementScroll>

        <section className={styles.stepsSection}>
          <div className={styles.container}>
            <div className={styles.stepsVisual}>
              <img src="/assets/home/stepsVisual.svg" />
              <Button
                href="/signup"
                type="link"
              >
                Start 7 Days Free Trial
              </Button>
            </div>
            <div>
              <h1 className={styles.sectionTitle}>Create a pitch in 3 steps</h1>
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
              <h1 className={styles.plansTitle}>Choose the plan that’s right for your business</h1>
              <h2 className={styles.plansSubtitle}>Get started for free, try out our platform  for an unlimited period of time. Explore our monthly and yearly plans and pick the one that best suits your needs.</h2>
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
                        <img src="/assets/home/planBasic.svg" />
                        <p>Single project use</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planBasic.svg" />
                        <p>Basic dashboard</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planBasic.svg" />
                        <p>All components included</p>
                      </li>
                    </ul>
                    <Button
                      color="grey"
                      href="/signup"
                      style="outline"
                      type="link"
                      width={160}
                    >
                      Try it free
                    </Button>
                    <p className={styles.creditCardNotRequired}>No credit card required</p>
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
                        <img src="/assets/home/planRecommended.svg" />
                        <p>Unlimited project use</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planRecommended.svg" />
                        <p>Advanced dashboard</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planRecommended.svg" />
                        <p>All components included</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planRecommended.svg" />
                        <p>Advanced insight</p>
                      </li>
                    </ul>
                    <Button
                      color="secondary"
                      href="/"
                      type="link"
                    >
                      Try it free
                    </Button>
                    <p className={styles.creditCardNotRequired}>No credit card required</p>
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
                        <img src="/assets/home/planPremium.svg" />
                        <p>Single project use</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planPremium.svg" />
                        <p>Basic dashboard</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planPremium.svg" />
                        <p>Mutlivariate components</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planPremium.svg" />
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
                      Try it free
                    </Button>
                    <p className={styles.creditCardNotRequired}>No credit card required</p>
                  </div>
                </li>
                
              </ul>
            </div>
          </section>
        </ElementScroll>

        <section className={styles.tryItSection}>
          <h1 className={styles.sectionTitle}>Try it free</h1>
          <h2 className={styles.sectionSubtitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</h2>
          <Button
            color="white"
            style="outline"
            href="/"
            type="link"
            width={160}
          >
            Try it free
          </Button>
          <p className={styles.creditCardNotRequired}>No credit card required</p>
          <img
            src="/assets/home/tryItOval.svg"
            className={styles.tryItOval}
          />
          <img
            src="/assets/home/tryItSquare.svg"
            className={styles.tryItSquare}
          />
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
                <Link href="/">
                  <a>
                    <img src="/assets/socials/facebook.svg" />
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>
                    <img src="/assets/socials/youtube.svg" />
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>
                    <img src="/assets/socials/twitter.svg" />
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>
                    <img src="/assets/socials/linkedin.svg" />
                  </a>
                </Link>
              </li>
            </ul>
            <p className={styles.copyright}>Copyright © {dayjs().format('YYYY')}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index