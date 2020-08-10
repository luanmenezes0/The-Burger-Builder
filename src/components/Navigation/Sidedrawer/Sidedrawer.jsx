import React from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import styles from "./Sidedrawer.module.css";
import Backdrop from "../../UI/Backdrop/Backdrop";

const sidedrawer = (props) => {
  let attachedClasses = [styles.Sidedrawer, styles.Close];
  if (props.open) {
    attachedClasses = [styles.Sidedrawer, styles.Open];
  }

  return (
    <>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(" ")} onClick={props.closed}>
        <div className={styles.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems isAuthenticated={props.isAuth} />
        </nav>
      </div>
    </>
  );
};

export default sidedrawer;
