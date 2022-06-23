import Link from "next/link";

import styles from "@/styles/layouts/Signup.module.sass";

export default function SignupLayout({ children }) {
   return (
      <div className={styles.layout}>
         <main className={styles.content}>
            <div>
               {children}
               <p className={styles.termsOfService}>
                  By signing up, you agree to SEEMEE’s Terms of Use and Privacy
                  Policy.
               </p>
            </div>
         </main>
      </div>
   );
}
