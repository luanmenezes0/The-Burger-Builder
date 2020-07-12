import React, { Component } from "react";
import Auxi from "../../hoc/_Aux/Auxi";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import {
  addIngredient,
  removeIngredient,
  initIngredients,
  purchaseInit,
  setAuthRedirectPath,
} from "../../store/actions/index";

export class BurgerBuilder extends Component {
  state = {
    purchasing: false,
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  purhaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  render() {
    const disabledInfo = {
      ...this.props.ings,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.props.error ? (
      <p style={{ textAlign: "center" }}>Ingredients can't be loaded... :(</p>
    ) : (
      <Spinner />
    );
    let orderSummary = null;

    if (this.props.ings) {
      burger = (
        <Auxi>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            price={this.props.totalPrice}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            purchasable={this.updatePurchaseState(this.props.ings)}
            isAuth={this.props.isAuthenticated}
            disabled={disabledInfo}
            ordered={this.purchaseHandler}
          />
        </Auxi>
      );
      orderSummary = (
        <OrderSummary
          price={this.props.totalPrice}
          purchaseCancelled={this.purhaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          ingredients={this.props.ings}
        />
      );
    }

    return (
      <Auxi>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purhaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Auxi>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch(addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(removeIngredient(ingName)),
    onInitIngredients: () => dispatch(initIngredients()),
    onInitPurchase: () => dispatch(purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
