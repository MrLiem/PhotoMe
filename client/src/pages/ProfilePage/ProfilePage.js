import React, { useReducer, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useParams, useHistory } from "react-router-dom";

import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";

import { INITIAL_STATE, profileReducer } from "./ProfilePageReducer";
import { showModal, hideModal } from "../../redux/modal/modalActions";

import { getUserProfile, followUser } from "../../services/profileService";
import { getPosts } from "../../services/postService";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";

import ProfileCategory from "../../components/ProfileCategory/ProfileCategory";
import PreviewImage from "../../components/PreviewImage/PreviewImage";
import Loader from "../../components/Loader/Loader";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import LoginCard from "../../components/LoginCard/LoginCard";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";
import ProfileHeader from "./ProfileHeader";
import EmptyProfile from "./EmptyProfile";

// Component show ra profile
const ProfilePage = ({ currentUser, token, showModal, hideModal }) => {
  const { username } = useParams();
  const history = useHistory();
  // connect tới profileReducer
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);

  // Function follow user
  const follow = async () => {
    if (!currentUser) {
      return showModal(
        {
          children: <LoginCard onClick={() => hideModal("Card/Card")} modal />,
          style: {
            gridColumn: "center-start / center-end",
            justifySelf: "center",
            width: "40rem",
          },
        },
        "Card/Card"
      );
    }
    try {
      dispatch({ type: "FOLLOW_USER_START" });
      const response = await followUser(state.data.user._id, token);
      dispatch({
        type: "FOLLOW_USER_SUCCESS",
        payload: response.operation,
      });
    } catch (err) {
      dispatch({
        type: "FOLLOW_USER_FAILURE",
        payload: err,
      });
    }
  };

  // Load thêm posts khi scroll
  useScrollPositionThrottled(async () => {
    // Check xem đã scroll tới cuối trang chưa, và đã load hết posts chưa
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      state.data.posts.length < state.data.postCount &&
      !state.fetchingAdditionalPosts
    ) {
      try {
        dispatch({ type: "FETCH_ADDITIONAL_POSTS_START" });
        const posts = await getPosts(username, state.data.posts.length);
        dispatch({ type: "FETCH_ADDITIONAL_POSTS_SUCCESS" });
        // ADD POSTS vào state reducer hiện tại
        dispatch({ type: "ADD_POSTS", payload: posts });
      } catch (err) {
        dispatch({ type: "FETCH_ADDITIONAL_POSTS_FAILURE", payload: err });
      }
    }
  }, null);

  // Fetching posts của user mỗi khi load trang xong
  useEffect(() => {
    document.title = `@${username} • PhotoMe`;
    (async function () {
      try {
        dispatch({ type: "FETCH_PROFILE_START" });
        const profile = await getUserProfile(username, token);
        dispatch({ type: "FETCH_PROFILE_SUCCESS", payload: profile });
      } catch (err) {
        dispatch({ type: "FETCH_PROFILE_FAILURE", payload: err });
      }
    })();
  }, [username, token]);

  // Function show ra models hoặc qua trang post detail mỗi khi ấn vào 1 post
  const handleClick = (postId) => {
    if (window.outerWidth <= 600) {
      history.push(`/post/${postId}`);
    } else {
      showModal(
        {
          postId,
          avatar: state.data.avatar,
          profileDispatch: dispatch,
        },
        "PostDialog/PostDialog"
      );
    }
  };

  // Render Profile Page
  const renderProfile = () => {
    // Show loader component khi đang load page
    if (state.fetching) {
      return <Loader />;
    }
    if (!state.fetching && state.data) {
      return (
        <Fragment>
          <ProfileHeader
            currentUser={currentUser}
            data={state.data}
            showModal={showModal}
            token={token}
            follow={follow}
            loading={state.following}
          />
          {/* Show các posts của chính user đó */}
          <ProfileCategory category="POSTS" icon="apps-outline" />
          {state.data.posts.length > 0 ? (
            <div className="profile-images">
              {state.data.posts.map((post, idx) => {
                return (
                  <PreviewImage
                    onClick={() => handleClick(post._id)}
                    image={post.image}
                    likes={post.postVotes}
                    comments={post.comments}
                    filter={post.filter}
                    key={idx}
                  />
                );
              })}
              {/* Đang fetching posts thì show skeletonLoader */}
              {state.fetchingAdditionalPosts && (
                <Fragment>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                </Fragment>
              )}
            </div>
          ) : (
            // Th user đó chưa có posts nào
            <EmptyProfile
              currentUserProfile={
                currentUser && currentUser.username === username
              }
              username={username}
            />
          )}
        </Fragment>
      );
    }
  };

  // TH user đã ko còn tồn tại thì show NotFoundPage
  return state.error ? (
    <NotFoundPage />
  ) : (
    <Fragment>
      {/* TH là user hiện tại */}
      {currentUser && currentUser.username === username ? (
        <MobileHeader>
          {/* Setting button --- logout-- change Pass--- */}
          <SettingsButton />
          <h3 className="heading-3">{username}</h3>
          <div></div>
        </MobileHeader>
      ) : (
        // TH là user khác
        <MobileHeader backArrow>
          <h3 className="heading-3">{username}</h3>
          <div></div>
        </MobileHeader>
      )}
      {/* Render profile */}
      <main className="profile-page grid">{renderProfile()}</main>
    </Fragment>
  );
};

// lấy state từ reducer
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
});

// Dispatch action lên reducer
const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
