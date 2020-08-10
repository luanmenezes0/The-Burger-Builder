import React from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route, Redirect } from "react-router-dom";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";

const Checkout = (props) => {
  const { history, ings, purchased, match } = props;
  
  const checkoutCancelledHandler = () => {
    history.goBack();
  };

  const checkoutContinuedHandler = () => {
    history.replace("/checkout/contact-data");
  };

  let summary = <Redirect to="/" />;
  if (ings) {
    const purchaseRedirect = purchased ? <Redirect to="/" /> : null;
    summary = (
      <>
        {purchaseRedirect}
        <CheckoutSummary
          checkoutContinued={checkoutContinuedHandler}
          checkoutCancelled={checkoutCancelledHandler}
          ingredients={ings}
        />
        <Route path={match.path + "/contact-data"} component={ContactData} />
      </>
    );

    return <>{summary}</>;
  }
};

const mapStateToProps = (state) => ({
  ings: state.burgerBuilder.ingredients,
  purchased: state.order.purchased,
});

export default connect(mapStateToProps)(Checkout);
