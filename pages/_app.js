import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware } from "redux";

import { useStore } from "@/store";

import "react-toastify/dist/ReactToastify.min.css";
import "@/styles/fonts.css";
import "@/styles/_globals.sass";
import { textFamilies } from "data/fonts";
import GoogleFontLoader from "react-google-font-loader";

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
         <link rel="preconnect" href="https://fonts.googleapis.com" />
         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
         <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
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
               {typeof window === "object" ? (
                  <GoogleFontLoader
                     fonts={textFamilies.map((text) => {
                        return {
                           font: text.value,
                           weights: [300, 400, 500, 600, 700, 800],
                        };
                     })}
                  />
               ) : (
                  ""
               )}
            </div>
         </Elements>
      </Provider>
   );
}

export default MyApp;
