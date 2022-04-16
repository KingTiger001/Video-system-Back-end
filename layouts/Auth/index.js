import styles from "./styles.module.css";

const AuthLayout = ({ children, logo = "/logo-signup.png" }) => {
   return (
      <main className={styles.root}>
         <div className={styles.leftSection}>
            <img src={logo} alt="Logo" />
         </div>
         <div className={styles.content}>
            <div>{children}</div>
         </div>
      </main>
   );
};

export default AuthLayout;
