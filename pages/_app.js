import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { useStore } from "@/store";

import "react-toastify/dist/ReactToastify.min.css";
import "@/styles/fonts.css";
import "@/styles/_globals.sass";

NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    let routeChangeStart = () => NProgress.start();
    let routeChangeComplete = () => NProgress.done();

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeComplete);
    router.events.on("routeChangeError", routeChangeComplete);
    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeComplete);
      router.events.off("routeChangeError", routeChangeComplete);
    };
  }, []);

  const store = useStore(pageProps.initialReduxState);

  const head = (
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
        rel="stylesheet"
      />
      {/* <link rel="icon" href="/favicon.ico" /> */}
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <div className="page">
          {head}
          <Component {...pageProps} />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnHover={false}
            draggable={true}
          />
        </div>
      </Elements>
    </Provider>
  );
}

export default MyApp;
