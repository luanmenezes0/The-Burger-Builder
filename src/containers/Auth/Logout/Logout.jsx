import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../../store/actions/index";
import { useEffect } from "react";

const Logout = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Redirect to="/" />;
};

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(Logout);
