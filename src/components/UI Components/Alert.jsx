import React, { useEffect } from "react";
import styles from "../Components CSS/Alert.module.css";

const Alert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto close after 3 sec
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.alertBox}>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
