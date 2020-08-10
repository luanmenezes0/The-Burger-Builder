import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Sidedrawer from "../../components/Navigation/Sidedrawer/Sidedrawer";

const Layout = (props) => {
  const [drawerIsVisible, setDrawerVisible] = useState(false);

  const sidedrawerClosedHandler = () => {
    setDrawerVisible(false);
  };

  const sidedrawerToggleHandler = () => {
    setDrawerVisible(prevValue => !prevValue);
  };

  return (
    <>
      <Toolbar
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sidedrawerToggleHandler}
      />
      <Sidedrawer
        isAuth={props.isAuthenticated}
        open={drawerIsVisible}
        closed={sidedrawerClosedHandler}
      />
      <main className={styles.Content}>{props.children}</main>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token != null,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
