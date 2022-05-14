import jscookie from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { mainAPI } from "@/plugins/axios";

import Button from "@/components/Button";

import styles from "@/styles/components/HeaderApp.module.sass";
import useCampaign from "hooks/campaign";
import Loading from "./global/Loading";

const HeaderApp = () => {
   const router = useRouter();
   const dispatch = useDispatch();
   const showPopup = (popupProps) =>
      dispatch({ type: "SHOW_POPUP", ...popupProps });
   const { create: createCampaign, isLoading } = useCampaign();

   const [displayUserMenu, showUserMenu] = useState(false);
   const [me, setMe] = useState({});

   useEffect(() => {
      async function getMe() {
         const { data } = await mainAPI.get("/users/me");
         setMe(data);
      }
      getMe();
   }, []);

   const userMenuRef = useRef(null);
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
            showUserMenu(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [userMenuRef]);

   const logout = () => {
      router.push("/login");
      jscookie.remove("fo_sas_tk");
   };

   const handleCreateNewVideo = () => {
      createCampaign("", (campaign) => {
         router.push(`/app/campaigns/${campaign._id}`);
      });
   };

   return (
      <div className={styles.header}>
         <div className={styles.container}>
            {/* <Link href="/app">
          <a className={styles.logo}>
            <img src="/logo-simple.svg" />
          </a>
        </Link> */}

            <nav className={styles.menu}>
               {router.route === "/app" && (
                  <p className={styles.dashboard_title}>
                     {me.firstName} - {me.company}
                  </p>
               )}
               {router.route === "/app/campaigns" && <p>Library</p>}
               {router.route === "/app/upgrade" && (
                  <p>Upgrade your My Fomo plan</p>
               )}
               {/* {
            router.route === '/app' &&
            <p>{me.firstName} - {me.company}</p>
          }
          {
            router.route === '/app' &&
            <p>{me.firstName} - {me.company}</p>
          } */}
               {/* <Link href="/app/campaigns">
            <a className={router.route === '/app/campaigns' ? styles.selected : ''}>My Videos</a>
          </Link> */}
               {/*<Link href="/app/analytics">*/}
               {/*  <a className={router.route === '/app/analytics' ? styles.selected : ''}>Analytics</a>*/}
               {/*</Link>*/}
               {/*<Link href="/app/contacts">*/}
               {/*  <a className={router.route.includes('/app/contacts') ? styles.selected : ''}>Contacts</a>*/}
               {/*</Link>*/}
            </nav>

            {/* <a className={styles.needHelp} href="mailto:contact@myfomo.io">Need help ?</a> */}
            {/* <Link style={styles.needHelp} href="/app/upgrade">Upgrade</Link> */}
            <div ref={userMenuRef} className={styles.user}>
               <Button
                  color="orange"
                  size="small"
                  width="120px"
                  style={{ marginRight: "30px" }}
                  onClick={handleCreateNewVideo}
                  disabled={isLoading}
               >
                  {!isLoading ? "New" : <Loading />}
               </Button>
               {me.firstName && (
                  <div
                     className={styles.userName}
                     onClick={() => showUserMenu(!displayUserMenu)}
                  >
                     {/* <p>{me.firstName}</p> */}
                     <img src="/assets/common/profile_dark.svg" />
                     {/* <img src={`/assets/common/${displayUserMenu ? 'expandLess' : 'expandMore'}.svg`} /> */}
                  </div>
               )}
               {displayUserMenu && (
                  <div className={styles.userDropdown}>
                     <ul className={styles.userMenu}>
                        <li>
                           <Link href="/app/account">
                              <a>Account</a>
                           </Link>
                        </li>
                        <li>
                           <Link href="/app/billing">
                              <a>Billing</a>
                           </Link>
                        </li>
                     </ul>
                     <a href="mailto:contact@myfomo.io">Need help ?</a>
                     <p className={styles.logout} onClick={logout}>
                        Log out
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default HeaderApp;
