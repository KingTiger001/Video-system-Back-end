import dayjs from 'dayjs'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Link as LinkScroll, Element as ElementScroll } from 'react-scroll'

import Button from '@/components/Button'

import styles from '@/styles/pages/index.module.sass'

const Index = () => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)

  useEffect(() => {
    const header = document.getElementsByTagName('header')[0];
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      window.pageYOffset > sticky ? setIsHeaderSticky(true) : setIsHeaderSticky(false)
    });
    return () => {
      window.removeEventListener('scroll', scrollCallBack);
    };
  }, []);
  
  return (
    <div className={styles.homepage}>
      <Head>
        <title>FOMO</title>
      </Head>

      <main className={styles.main}>
        <section className={`${styles.engageSection} ${isHeaderSticky ? styles.sticky : ''}`}>
          <header className={`${styles.header} ${isHeaderSticky ? styles.sticky : ''}`}>
            <div className={styles.container}>
              <img
                src="/logo.svg"
                alt="Logo FOMO"
                className={styles.logo}
              />
              <nav className={styles.headerMenu}>
                <LinkScroll
                  to="solution"
                  smooth={true}
                  offset={-50}
                  duration={500}
                >
                  Why FOMO?
                </LinkScroll>
                <LinkScroll
                  to="product"
                  smooth={true}
                  offset={-170}
                  duration={500}
                >
                  Features
                </LinkScroll>
                <LinkScroll
                  to="pricing"
                  smooth={true}
                  offset={-20}
                  duration={500}
                >
                  Pricing
                </LinkScroll>
              </nav>
              <div className={styles.headerButtons}>
                <Button
                  href="/login"
                  outline={true}
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
          </header>
            
          <div className={styles.container}>
            <h1 className={styles.engageTitle}>Reinvent your professional interactions<br/><span>Send a video message</span></h1>
            <h2 className={styles.engageSubtitle}>Story telling is what makes you unique<br />Sharing it is what makes your mission exist.</h2>
            <div className={styles.engageButtons}>
              <Button
                href="/signup"
                type="link"
                width={240}
              >
                Start 7 Days Free Trial
              </Button>
              <Button
                href="/"
                outline={true}
                type="link"
                width={240}
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
                  src="/assets/home/engageScreenshot.webp"
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
              <h3 className={styles.sectionTitleCenter}>For a stronger competitive advantage</h3>
              <span className={styles.sectionSubtitleCenter}>Video messaging is the human element strengthening your customer-centric strategy and your company culture.</span>
              <div className={styles.solutionGrid}>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/home/solutionIconOne.png" />
                  </div>
                  <p className={styles.solutionItemTitle}>Prospect</p>
                  <p className={styles.solutionItemText}>Reach your business targets/partners at scale.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/home/solutionIconTwo.png" />
                  </div>
                  <p className={styles.solutionItemTitle}>Attract</p>
                  <p className={styles.solutionItemText}>Catch attention with impactful customized video messages.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/home/solutionIconThree.png" />
                  </div>
                  <p className={styles.solutionItemTitle}>Convert</p>
                  <p className={styles.solutionItemText}>Increase your engagement success rate.</p>
                </div>
                <div className={styles.solutionItem}>
                  <div className={styles.icon}>
                    <img src="/assets/home/solutionIconFour.png" />
                  </div>
                  <p className={styles.solutionItemTitle}>Retain</p>
                  <p className={styles.solutionItemText}>Build a special connection with your business relations.</p>
                </div>
              </div>
              <Button
                href="/signup"
                type="link"
                width={240}
              >
                Start 7 Days Free Trial
              </Button>
            </div>
          </section>
        </ElementScroll>

        <ElementScroll name="product">
          <section className={styles.productSection}>
            <div className={styles.container}>
              <h3 className={styles.productTitle}>Send a video note</h3>
              <span className={styles.productSubtitle}>After emails, text messages and voice notes, send video messages on demand.</span>
              <ul className={styles.productList}>
                <li className={styles.productItem}>
                  <div className={styles.label}>create</div>
                  <p className={styles.productItemText}><b>Create</b> a customized video message<br />through a seamless process</p>
                </li>
                <li className={styles.productItem}>
                  <div className={styles.label}>share</div>
                  <p className={styles.productItemText}><b>Share</b> and scale with your contact lists</p>
                </li>
                <li className={styles.productItem}>
                  <div className={styles.label}>measure</div>
                  <p className={styles.productItemText}><b>Measure</b> with analytics to optimize<br />your success rate</p>
                </li>
              </ul>
              <Button
                href="/signup"
                type="link"
                width={240}
              >
                Start 7 Days Free Trial
              </Button>
              <div className={styles.productVisual}>
                <img
                  className={styles.productVisualOval}
                  src="/assets/home/productOval.svg"
                />
                <img
                  alt="Screenshot dashboard FOMO"
                  className={styles.productScreenshot}
                  src="/assets/home/productVisual.png"
                />
              </div>
            </div>
          </section>
        </ElementScroll>

        <section className={styles.stepsSection}>
          <div className={styles.container}>
            <div className={styles.stepsVisual}>
              <img
                className={styles.stepsVisualOval}
                src="/assets/home/stepsOval.svg"
              />
              <img
                alt="Screenshot dashboard FOMO"
                className={styles.stepsVisualScreenshot}
                src="/assets/home/stepsVisual.png"
              />
            </div>
            <h3 className={styles.sectionTitle}>Create a message<br />in 3 steps</h3>
            <ul className={styles.stepsList}>
              <li className={styles.stepsItem}>
                <p className={styles.stepsItemNumber}>1</p>
                <p className={styles.stepsItemText}>Record a video message</p>
              </li>
              <li className={styles.stepsItem}>
                <p className={styles.stepsItemNumber}>2</p>
                <p className={styles.stepsItemText}>Personalize and scale</p>
              </li>
              <li className={styles.stepsItem}>
                <p className={styles.stepsItemNumber}>3</p>
                <p className={styles.stepsItemText}>Share your message with your contacts</p>
              </li>
            </ul>
            <Button
              href="/signup"
              type="link"
              width={240}
            >
              Start 7 Days Free Trial
            </Button>
          </div>
        </section>

        <img
          src="/assets/home/stepsWave.svg"
          className={styles.wave}
        />

        <ElementScroll name="pricing">
          <section className={styles.plansSection}>
            <div className={styles.container}>
              <h3 className={styles.plansTitle}>Choose the plan that’s right<br/>for your business</h3>
              <span className={styles.plansSubtitle}>Boost productivity and reshape remote interactions.</span>
              <ul className={styles.plansList}>
                <li>
                  <div className={styles.planContent}>
                    <p className={styles.planTitle}>Free</p>
                    <div className={styles.planPrice}>
                      <p className={styles.planPriceValue}>$0</p>
                    </div>
                    <ul className={styles.planDetails}>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckBlue.svg" />
                        <p>Record a video message</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckBlue.svg" />
                        <p>Share your video</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckBlue.svg" />
                        <p>FOMO branding</p>
                      </li>
                    </ul>
                    <Button
                      href="/signup"
                      outline={true}
                      type="link"
                      width={160}
                    >
                      Try it free
                    </Button>
                    <p className={styles.creditCardNotRequired}>No credit card required</p>
                  </div>
                </li>
                <li className={styles.planBusiness}>
                  <div className={styles.planColorBanner} />
                  <div className={styles.planContent}>
                    <p className={styles.planTitle}>Business</p>
                    <div className={styles.planPrice}>
                      <p className={styles.planPriceValue}>$70</p>
                      <p className={styles.planPriceText}>per user/month<br/><span>billed annually</span></p>
                    </div>
                    <ul className={styles.planDetails}>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckSecondary.svg" />
                        <p>Analytics</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckSecondary.svg" />
                        <p>Dashboard</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckSecondary.svg" />
                        <p>Add your logo</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckSecondary.svg" />
                        <p>Create a call-to-action<br/>in your videos</p>
                      </li>
                    </ul>
                    <Button
                      color="secondary"
                      href="/signup"
                      type="link"
                      width={160}
                    >
                      Try it free
                    </Button>
                    <p className={styles.creditCardNotRequired}>No credit card required</p>
                  </div>
                </li>
                <li className={styles.planTeams}>
                  <div className={styles.planColorBanner} />
                  <div className={styles.planContent}>
                    <p className={styles.planTitle}>Business</p>
                    <div className={styles.planPrice}>
                      <p className={styles.planPriceValue}>$240</p>
                      <p className={styles.planPriceText}>per user/month<br/><span>billed annually</span></p>
                    </div>
                    <ul className={styles.planDetails}>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckPrimary.svg" />
                        <p>Start Screen Automation</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckPrimary.svg" />
                        <p>Prompter</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckPrimary.svg" />
                        <p>Subtitles</p>
                      </li>
                      <li className={styles.planDetailsItem}>
                        <img src="/assets/home/planCheckPrimary.svg" />
                        <p>Enhanced storage</p>
                      </li>
                    </ul>
                    <Button
                      href="mailto:contact@myfomo.io"
                      type="link"
                      width={160}
                    >
                      Contact us
                    </Button>
                    <p className={styles.creditCardNotRequired}></p>
                  </div>
                </li>
                <li>
                  <div className={styles.planContent}>
                    <p className={styles.planTitle}>Elite</p>
                    <div className={styles.planPrice}>
                      <p className={styles.planPriceValue}>Contact us</p>
                    </div>
                    <div className={styles.planDetails}>
                      <div className={styles.advanced}>
                        <img src="/logo-circle.svg" />
                        <p>Advanced features</p>
                      </div>
                    </div>
                    <Button
                      href="mailto:contact@myfomo.io"
                      outline={true}
                      type="link"
                      width={160}
                    >
                      Contact us
                    </Button>
                    <p className={styles.creditCardNotRequired}></p>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </ElementScroll>

        <section className={styles.tryItSection}>
          <h3 className={styles.sectionTitle}>Never miss an opportunity<br />to connect and engage</h3>
          <Button
            color="white"
            outline={true}
            href="/"
            type="link"
            width={240}
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
              className={styles.footerLogo}
            />
          </div>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/">
                <a>About us</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Terms & Conditions</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Privacy Policy</a>
              </Link>
            </li>
            <li>
              <Link href="mailto:contact@myfomo.io">
                <a>Contact us</a>
              </Link>
            </li>
          </ul>
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
      </footer>
    </div>
  )
}

export default Index