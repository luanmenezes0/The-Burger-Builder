import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "./hoc/Layout/Layout";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Logout from "./containers/Auth/Logout/Logout";
import { authCheckState } from "./store/actions/auth";

const asyncCheckout = asyncComponent(() => {
  return import("./containers/Checkout/Checkout");
});

const asyncOrders = asyncComponent(() => {
  return import("./containers/Orders/Orders");
});

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignUp();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/orders" component={asyncOrders} />
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/" component={BurgerBuilder} />
        </Switch>
      );
    }
    return (
      <BrowserRouter>
        <div>
          <Layout>{routes}</Layout>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
