import React, { useState, memo, Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSelectors";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";

import { ReactComponent as LogoCamera } from "../../assets/svg/logo-camera.svg";
import SearchBox from "../SearchBox/SearchBox";
import NewPostButton from "../NewPost/NewPostButton/NewPostButton";
import NotificationButton from "../Notification/NotificationButton/NotificationButton";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

//Header Component
const Header = memo(({ currentUser }) => {
  //  state xét xem có nên minimize header hay không
  const [shouldMinimizeHeader, setShouldMinimizeHeader] = useState(false);
  const {
    location: { pathname },
  } = useHistory();

  // Shrink header height lại và xóa logo khi scroll
  useScrollPositionThrottled(({ currentScrollPosition }) => {
    // Outerwidth gồm width+ padding+border
    if (window.outerWidth > 600) {
      setShouldMinimizeHeader(currentScrollPosition > 100);
    }
  });

  const headerClassNames = classNames({
    header: true,
    "header--small": shouldMinimizeHeader,
  });

  return (
    <header className={headerClassNames}>
      <div className="header__content">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <div className="header__logo-image">
            <LogoCamera />
          </div>
          <div className="header__logo-header">
            <h3 className="heading-logo">Photo Me</h3>
          </div>
        </Link>
        {/* Search box */}
        <SearchBox />
        <div className="header__icons">
          {/* Xét xem có phải current user hay ko */}
          {currentUser ? (
            <Fragment>
              <Link to="/explore">
                <Icon
                  icon={pathname === "/explore" ? "compass" : "compass-outline"}
                />
              </Link>
              {/* Button show thông báo */}
              <NotificationButton />
              {/* edit profile */}
              <Link to={"/" + currentUser.username}>
                <Icon
                  icon={
                    pathname === "/" + currentUser.username
                      ? "person-circle"
                      : "person-circle-outline"
                  }
                />
              </Link>
              {/* Add new post button */}
              <NewPostButton />
            </Fragment>
          ) : (
            //Nếu ko phải user thì show button login hoặc sign up
            <Fragment>
              <Link style={{ marginRight: "1rem" }} to="/login">
                <Button>Log In</Button>
              </Link>
              <Link to="/signup">
                <h3 className="heading-3 heading--button color-blue">
                  Sign Up
                </h3>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
    </header>
  );
});

// Monitor số lần re-render lại của header
Header.whyDidYouRender = true;

// lấy state từ reducer
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(Header);
