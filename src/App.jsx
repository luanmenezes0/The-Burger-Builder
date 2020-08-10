import React, { Suspense } from "react";
import { connect } from "react-redux";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Logout from "./containers/Auth/Logout/Logout";
import { authCheckState } from "./store/actions/auth";
import { useEffect } from "react";

const Checkout = React.lazy(() => {
  return import("./containers/Checkout/Checkout");
});

const Orders = React.lazy(() => {
  return import("./containers/Orders/Orders");
});

const Auth = React.lazy(() => {
  return import("./containers/Auth/Auth");
});

const App = (props) => {
  const { onTryAutoSignUp } = props;

  useEffect(() => {
    onTryAutoSignUp();
  }, [onTryAutoSignUp]);

  let routes = (
    <Switch>
      <Route path="/auth" component={(props) => <Auth {...props}/>} />
      <Route path="/" component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/orders" component={(props) => <Orders {...props} />} />
        <Route path="/checkout" component={(props) => <Checkout {...props}/>} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" component={(props) => <Auth {...props}/>} />
        <Route path="/" component={BurgerBuilder} />
      </Switch>
    );
  }
  return (
    <BrowserRouter>
      <div>
        <Suspense fallback={<p>Loading...</p>}>
          <Layout>{routes}</Layout>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
