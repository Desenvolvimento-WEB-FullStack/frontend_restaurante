import styles from "./Loading.module.css";

function Loading() {
  return (
    <div className={styles.loader}>
      <div className={styles.top}></div>
      <div className={styles.bottom}></div>
      <div className={styles.line}></div>
    </div>
  );
}

export default Loading;
