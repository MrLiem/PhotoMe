import React, { Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";

import { selectCurrentUser } from "../../../redux/user/userSelectors";

import Icon from "../../Icon/Icon";
import Button from "../../Button/Button";
import TextButton from "../../Button/TextButton/TextButton";

// Header component khi ở màn hình điện thoại
const MobileHeader = ({ children, backArrow, style, show, currentUser }) => {
  const history = useHistory();
  return (
    <header
      style={{ ...style, display: `${show && "grid"}` }}
      className="header--mobile"
    >
      {/* Check xem có phải user hiện tại ko */}
      {currentUser ? (
        <Fragment>
          {backArrow && (
            <Icon
              onClick={() => history.goBack()}
              style={{ cursor: "pointer" }}
              icon="chevron-back"
            />
          )}
          {/* Render các component dc add vào */}
          {children}
        </Fragment>
      ) : (
        // TH ko phải current user thì yêu cầu phải login hoặc signup
        <Fragment>
          <h3 style={{ fontSize: "2.5rem" }} className="heading-logo">
            PhotoMe
          </h3>
          <div style={{ gridColumn: "-1" }}>
            <Button
              onClick={() => history.push("/")}
              style={{ marginRight: "1rem" }}
            >
              Log In
            </Button>
            <TextButton onClick={() => history.push("/signup")} bold blue>
              Sign Up
            </TextButton>
          </div>
        </Fragment>
      )}
    </header>
  );
};

// Lấy state từ reducer
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(MobileHeader);
