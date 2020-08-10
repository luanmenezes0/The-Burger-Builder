import React, { useState, useCallback } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import {
  addIngredient,
  removeIngredient,
  initIngredients,
  purchaseInit,
  setAuthRedirectPath,
} from "../../store/actions/index";
import { useEffect } from "react";

export const BurgerBuilder = (props) => {
  const { history } = props;

  const [purchasing, setPurchasing] = useState(false);

  const ings = useSelector((state) => state.burgerBuilder.ingredients);
  const totalPrice = useSelector((state) => state.burgerBuilder.totalPrice);
  const error = useSelector((state) => state.burgerBuilder.error);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const dispatch = useDispatch();
  const onIngredientAdded = (ingName) => dispatch(addIngredient(ingName));
  const onIngredientRemoved = (ingName) => dispatch(removeIngredient(ingName));
  const onInitIngredients = useCallback(() => dispatch(initIngredients()), [
    dispatch,
  ]);
  const onInitPurchase = () => dispatch(purchaseInit());
  const onSetAuthRedirectPath = (path) => dispatch(setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath("/checkout");
      history.push("/auth");
    }
  };

  const purchaseContinueHandler = () => {
    onInitPurchase();
    history.push("/checkout");
  };

  const purhaseCancelHandler = () => {
    setPurchasing(false);
  };

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  const disabledInfo = {
    ...ings,
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  let burger = error ? (
    <p style={{ textAlign: "center" }}>Ingredients can't be loaded... :(</p>
  ) : (
    <Spinner />
  );
  let orderSummary = null;

  if (ings) {
    burger = (
      <>
        <Burger ingredients={ings} />
        <BuildControls
          price={totalPrice}
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          purchasable={updatePurchaseState(ings)}
          isAuth={isAuthenticated}
          disabled={disabledInfo}
          ordered={purchaseHandler}
        />
      </>
    );
    orderSummary = (
      <OrderSummary
        price={totalPrice}
        purchaseCancelled={purhaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
        ingredients={ings}
      />
    );
  }

  return (
    <>
      <Modal show={purchasing} modalClosed={purhaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </>
  );
};

export default withErrorHandler(BurgerBuilder, axios);
