import Spinner from "react-spinner-material";

import styles from "./spinner.module.css";

export default function SpinnerLoader() {
  return (
    <div className={styles.spinnerContainer}>
      <Spinner radius={120} color={"#333"} stroke={2} visible={true} />
    </div>
  );
}
