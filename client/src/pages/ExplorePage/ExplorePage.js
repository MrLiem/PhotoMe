import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectToken } from "../../redux/user/userSelectors";
import { showAlert } from "../../redux/alert/alertActions";
import { showModal } from "../../redux/modal/modalActions";
import SuggestedPosts from "../../components/SuggestedPosts/SuggestedPosts";
import HashtagPosts from "../../components/HashtagPosts/HashtagPosts";

import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

// Explore page
const ExplorePage = ({ token, showAlert, showModal, match }) => {
  useEffect(() => {
    document.title = "PhotoMe";
  }, []);

  return (
    <Switch>
      <ProtectedRoute exact path={match.url + "/"}>
        {/* main route--- show all image dưới dạng grid */}
        <main className="explore-page grid">
          <SuggestedPosts
            token={token}
            showModal={showModal}
            showAlert={showAlert}
          />
        </main>
      </ProtectedRoute>
      {/* Route tìm theo hastag */}
      <ProtectedRoute path={match.url + "/tags/:hashtag"}>
        <main className="explore-page grid">
          <HashtagPosts
            token={token}
            showModal={showModal}
            showAlert={showAlert}
          />
        </main>
      </ProtectedRoute>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

// lấy state từ reducer
const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

// dispatch action to reducer
const mapDistpachToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDistpachToProps)(ExplorePage);
