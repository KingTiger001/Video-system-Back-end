import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { mainAPI } from "@/plugins/axios";

import Button from "../Button";
import Input from "../Input";
import Popup from "./Popup";

//user with multiple users (3 users, user1, user2, user3) = customer

//super-admin

import styles from "@/styles/components/Popups/PopupCreateCampaign.module.sass";

const PopupCreateCampaign = () => {
   const router = useRouter();
   const dispatch = useDispatch();
   const hidePopup = () => dispatch({ type: "HIDE_POPUP" });

   const [loading, setLoading] = useState(false);
   const [name, setName] = useState(null);

   const create = async (e) => {
      e.preventDefault();
      if (!loading) {
         try {
            setLoading(true);
            const { data: campaign } = await mainAPI.post("/campaigns", {
               name,
            });
            router.push(`/app/campaigns/${campaign._id}`);
            hidePopup();
         } catch (err) {
            setLoading(false);
            console.log(err);
         }
      }
   };

   return (
      <Popup title="Video title">
         <div className={styles.body}>
            <p
               style={{
                  marginBottom: "10px",
                  fontSize: "12px",
               }}
               className={styles.cancel}
            >
               The title will appear when you share the video
            </p>
         </div>
         <form className={styles.form} onSubmit={create}>
            <Input
               onChange={(e) => setName(e.target.value)}
               placeholder="Title*"
               type="text"
               required
            />
            <div className={styles.actions}>
               <Button loading={loading} color="orange">
                  Create
               </Button>
               <Button onClick={hidePopup} loading={loading} color="primary">
                  Cancel
               </Button>
            </div>
         </form>
      </Popup>
   );
};

export default PopupCreateCampaign;
