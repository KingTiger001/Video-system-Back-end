import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { mainAPI } from "@/plugins/axios";

import Button from "@/components/Button";
import styles from "@/styles/components/Plans.module.sass";

let stripePromise;

const getStripe = () => {
   if (!stripePromise) {
      stripePromise = loadStripe(
         "pk_test_51HVPIcGGTGLaoBgeyXuRyJ6wonYC6QDaTPwO3Wg5V85keEOzptmx99k5Z9quTmoGXa6btyEoXo5RxgxgemtUFn9Y006oRn58yy"
      );
   }
   return stripePromise;
};

const Plans = ({ className, renderAction }) => {
   const [products, setProducts] = useState([]);
   const [checkoutOptions, setCheckoutOptions] = useState(undefined);

   useEffect(() => {
      async function getProducts() {
         const { data: products } = await mainAPI.get(
            "/subscriptions/products"
         );
         const { data: prices } = await mainAPI.get("/subscriptions/prices");
         const productsOrdered = products.data
            .filter((p) => p.name !== "Pro") // TODO: remove this line to reactivate Pro plan
            .map((product) => ({
               ...product,
               price: prices.data.find((price) => price.product === product.id),
            }))
            .sort((a, b) => (a.metadata.order > b.metadata.order ? 1 : -1));
         setProducts(productsOrdered);

         const businessPlan = productsOrdered.find(
            (prod) => prod.name === "Business"
         );

         if (businessPlan) {
            const item = {
               price: businessPlan?.price?.id ?? "",
               quantity: 1,
            };
            const checkoutOptions = {
               lineItems: [item],
               mode: "subscription",
               successUrl: `${window.location.origin}/app/billing`,
               cancelUrl: `${window.location.origin}/app/billing`,
            };
            setCheckoutOptions(checkoutOptions);
         }
      }

      getProducts();
   }, []);

   const redirectToCheckout = async (options) => {
      const stripe = await getStripe();
      await stripe.redirectToCheckout(options);
   };

   return products.length > 0 ? (
      <ul className={`${className} ${styles.plansList}`}>
         {products

            .map((product) => (
               <li
                  className={
                     product.name === "Business"
                        ? styles.planBusiness
                        : styles.planPro
                  }
                  key={product.id}
               >
                  <div className={styles.planColorBanner} />
                  <div className={styles.planContent}>
                     <p className={styles.planTitle}>
                        <img
                           src="/assets/common/dashboard-orange-icon.png"
                           width="40px"
                           height="29px"
                        />
                        {product.name}
                     </p>
                     <div className={styles.planPrice}>
                        <p className={styles.planPriceValue}>$24*</p>
                        <p className={styles.planPriceText}>
                           per user/per month/ billed annually
                           <br />
                           <span style={{ color: "#FF5C00" }}>*Save 20%</span>
                           <br />
                           <span style={{ color: "#000" }}>
                              or $30* billed monthly
                           </span>
                        </p>
                     </div>

                    <ul className={styles.planDetails}>
                     {product.metadata.features ? (product.metadata.features.split(",").map((feature) => (
                           <li className={styles.planDetailsItem} key={feature}>
                              <img
                                 src={`/assets/home/${
                                    product.name === "Business"
                                       ? "planCheckPrimary"
                                       : "planCheckSecondary"
                                 }.svg`}
                              />
                              <p>
                                 {feature.charAt(0).toUpperCase() +
                                    feature.slice(1)}
                              </p>
                           </li>
                        ))) : (
                            <li></li>
                        )
                        }
                         </ul>

                     {/*<span style={{*/}
                     {/*    fontSize: '9px',*/}
                     {/*    lineHeight: '8px',*/}
                     {/*    textAlign: 'center',*/}
                     {/*    letterSpacing: '-0.01px',*/}
                     {/*    textTransform: 'capitalize',*/}
                     {/*    color: '#3C546A',*/}
                     {/*    marginBottom: '2px',*/}
                     {/*    display: 'flex',*/}
                     {/*    alignItems: 'ceter',*/}
                     {/*    justifyContent: 'center'*/}
                     {/*}}>No credit card required</span>*/}

                     {renderAction(product)}

                     {/*<div style={{*/}
                     {/*    display: "flex",*/}
                     {/*    marginTop: '15px',*/}
                     {/*    justifyContent: 'center',*/}
                     {/*    alignItems: 'center',*/}
                     {/*}}>*/}
                     {/*    <b>or &nbsp;</b>*/}
                     {/*    <p*/}
                     {/*        onClick={() => redirectToCheckout(checkoutOptions)}*/}
                     {/*        style={{*/}
                     {/*            fontWeight: 'bold',*/}
                     {/*            fontSize: '17px',*/}
                     {/*            lineHeight: '8px',*/}
                     {/*            color: '#535BFF',*/}
                     {/*            cursor: 'pointer',*/}
                     {/*        }}>Buy Now</p>*/}
                     {/*</div>*/}
                  </div>
               </li>
            ))}

         <li className={styles.planPro}>
            <div className={styles.planColorBanner} />
            <div className={styles.planContent}>
               <p className={styles.planTitle}>
                  <img
                      src="/assets/common/dashboard-purple.png"
                      width="40px"
                      height="29px"
                  />
                  Entreprise
               </p>
               <div className={styles.planPrice}>
                  <p className={styles.planPriceValue}>For Teams</p>
               </div>
               <ul className={styles.planDetails}>
                  <li className={styles.planDetailsItem}>
                     <img src={`/assets/home/planCheckSecondary.svg`} />
                     <p>+ Users</p>
                  </li>
                  <li className={styles.planDetailsItem}>
                     <img src={`/assets/home/planCheckSecondary.svg`} />
                     <p>More features</p>
                  </li>
                  <li className={styles.planDetailsItem}>
                     <img src={`/assets/home/planCheckSecondary.svg`} />
                     <p>Team collaboration</p>
                  </li>
                  <li className={styles.planDetailsItem}>
                     <img src={`/assets/home/planCheckSecondary.svg`} />
                     <p>Custom offer</p>
                  </li>
               </ul>

               <Button className={styles.planButton} href="mailto:contact@seemee.io" type="link" width={160}>
                  Contact Sales
               </Button>
            </div>
         </li>
      </ul>
   ) : null;
};

export default Plans;
