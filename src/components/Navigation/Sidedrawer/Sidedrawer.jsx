import React from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import styles from "./Sidedrawer.module.css";
import Backdrop from "../../UI/Backdrop/Backdrop";
import Auxi from "../../../hoc/_Aux/Auxi";

const sidedrawer = (props) => {
  let attachedClasses = [styles.Sidedrawer, styles.Close];
  if (props.open) {
    attachedClasses = [styles.Sidedrawer, styles.Open];
  }

  return (
    <Auxi>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(" ")} onClick={props.closed}>
        <div className={styles.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems isAuthenticated={props.isAuth} />
        </nav>
      </div>
    </Auxi>
  );
};

export default sidedrawer;
