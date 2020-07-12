import React, { Component } from "react";
import { connect } from "react-redux";
import Auxi from "../_Aux/Auxi";
import styles from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Sidedrawer from "../../components/Navigation/Sidedrawer/Sidedrawer";

class Layout extends Component {
  state = {
    showSidedrawer: false,
  };

  sidedrawerClosedHandler = () => {
    this.setState({ showSidedrawer: false });
  };

  sidedrawerToggleHandler = (params) => {
    this.setState((prevState) => {
      return { showSidedrawer: !prevState.showSidedrawer };
    });
  };

  render() {
    return (
      <Auxi>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          drawerToggleClicked={this.sidedrawerToggleHandler}
        />
        <Sidedrawer
          isAuth={this.props.isAuthenticated}
          open={this.state.showSidedrawer}
          closed={this.sidedrawerClosedHandler}
        />
        <main className={styles.Content}>{this.props.children}</main>
      </Auxi>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token != null,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
