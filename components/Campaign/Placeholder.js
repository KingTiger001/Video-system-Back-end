import styles from "@/styles/components/Campaign/Placeholder.module.sass";
import React from "react";

const tips = {
  record: {
    image: "/assets/campaign/record.svg",
    description: "Start a campaign !",
  },
  video: {
    image: "/assets/campaign/toolVideos.svg",
    description: "Record a video message or import a video",
  },
  helloScreen: {
    image: "/assets/campaign/toolHelloScreen.svg",
    description: "Personnalize your video with a Start Screen",
  },
  endScreen: {
    image: "/assets/campaign/toolEndScreen.svg",
    description:
      "Add a Screen with your contacts  and a Call \n to Action button (website, calendar, ...)",
  },
  logo: {
    image: "/assets/campaign/toolLogo.svg",
    description: `Don't forget to add your logo !`,
  },
};

// placeholder view in case user have no video or screens
const Placeholder = ({ of }) => {
  const data = tips[of];

  return data ? (
    <div className={styles.placeholder}>
      {data.image && <img src={data.image} className={styles.image} />}
      <p className={styles.description}>{data.description}</p>
    </div>
  ) : (
    <div className={styles.placeholder}>
      <div className={styles.placeholderGrid}>
        {Object.values(tips).map((data, i) => (
          <div key={i} className={styles.table}>
            {data.image && <img src={data.image} className={styles.image} />}
            <p className={styles.description}>{data.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Placeholder;
