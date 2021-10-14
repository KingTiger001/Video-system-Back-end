import styles from "@/styles/components/Campaign/Timeline.module.sass";

const ContextMenu = ({ anchorPoint, onDelete }) => {
  const getTranslatePosition = () => {
    if (anchorPoint.x > window.innerWidth / 2) {
      return "translate(-100%,-100%)";
    } else {
      return "translate(0%,-100%)";
    }
  };
  return (
    <ul
      onClick={onDelete}
      className={styles.contextMenu}
      style={{
        top: anchorPoint.y,
        left: anchorPoint.x,
        transform: getTranslatePosition(),
      }}
    >
      {/* <hr className={styles.divider} /> */}
      <li>Delete</li>
    </ul>
  );
};

export default ContextMenu;
