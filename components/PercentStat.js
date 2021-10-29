import { useEffect, useRef, useState } from "react";
import GaugeChart from "react-gauge-chart";

import styles from "@/styles/components/Stat.module.sass";

const PercentStat = ({ text, value }) => {
  return (
    <div className={styles.stat}>
      <GaugeChart
        nrOfLevels={10}
        arcPadding={0.1}
        cornerRadius={3}
        percent={value / 100}
        style={{ width: "90%", maxWidth: "250px" }}
        textColor={"#5F59F7"}
        colors={["#5F59F7", "#EFEFFE"]}
        needleColor={"#5A7184"}
        needleBaseColor={"#5A7184"}
        animate={false}
      />
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default PercentStat;
