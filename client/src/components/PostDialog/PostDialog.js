import React, { useEffect, useReducer, Fragment, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";

import { selectToken, selectCurrentUser } from "../../redux/user/userSelectors";

import { showModal, hideModal } from "../../redux/modal/modalActions";
import { showAlert } from "../../redux/alert/alertActions";

import { getPost, deletePost } from "../../services/postService";
import { getComments } from "../../services/commentService";

import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import Comment from "../Comment/Comment";
import PostDialogCommentForm from "./PostDialogCommentForm/PostDialogCommentForm";
import PostDialogStats from "./PostDialogStats/PostDialogStats";

import { INITIAL_STATE, postDialogReducer } from "./postDialogReducer";

// PostDialog Component
const PostDialog = ({
  postId,
  token,
  currentUser,
  profileDispatch,
  showModal,
  hideModal,
  showAlert,
  style,
  className,
  postData,
  loading,
  simple,
}) => {
  // Sử dụng useRef tham chiếu tới commentsRef đế monitor sự thay đổi
  const commentsRef = useRef();
  // connect tới postDialogReducer
  const [state, dispatch] = useReducer(postDialogReducer, INITIAL_STATE);
  const history = useHistory();

  const fetching = loading !== undefined ? loading : state.fetching;

  useEffect(() => {
    if (!loading) {
      // Check xem  post data đã có sẵn ở component phía trước chưa
      if (postData) {
        dispatch({ type: "FETCH_POST_SUCCESS", payload: postData });
      } else {
        // Nếu chưa có thì quay lại url trc để lấy postId
        window.history.pushState(
          { prevUrl: window.location.href },
          null,
          `/post/${postId}`
        );
        // dùng postId để fetch post data
        (async function () {
          try {
            const response = await getPost(postId);
            dispatch({ type: "FETCH_POST_SUCCESS", payload: response });
          } catch (err) {
            history.push("/");
            dispatch({ type: "FETCH_POST_FAILURE", payload: err });
          }
        })();
      }
    }

    return () => {
      if (window.history.state && window.history.state.prevUrl) {
        window.history.pushState(
          "profile",
          "Profile",
          window.history.state.prevUrl
        );
      }
    };
  }, [postId, history, loading, postData]);

  // fetch comments về post từ server
  const fetchAdditionalComments = async () => {
    try {
      const commentData = await getComments(
        postId,
        state.data.comments.length,
        state.localStateComments.size
      );
      // dispatch comments fetch dc vào reducer
      dispatch({ type: "ADD_COMMENT", payload: commentData.comments });
    } catch (err) {
      showAlert("Unable to fetch additional comments.", () =>
        fetchAdditionalComments()
      );
    }
  };

  // xử lý xóa post
  const handleDeletePost = async () => {
    try {
      await deletePost(postId, token);
      profileDispatch &&
        profileDispatch({
          type: "DELETE_POST",
          payload: postId,
        });
      // Ẩn model nếu đang mở
      hideModal("PostDialog/PostDialog");
    } catch (err) {
      showAlert("Unable to delete post.", () => handleDeletePost());
    }
  };

  return (
    <div
      className={classNames({
        "post-dialog": true,
        "post-dialog--simple": simple,
        [className]: className,
      })}
      data-test="component-post-dialog"
      style={style}
    >
      <Fragment>
        <div
          className={classNames({
            "post-dialog__image": true,
            "post-dialog__image--simple": simple,
          })}
        >
          {/* đang fetching post thì load skeleton */}
          {fetching ? (
            <SkeletonLoader animated />
          ) : (
            // Load img
            <img
              src={state.data.image}
              alt="Post"
              style={{ filter: state.data.filter }}
            />
          )}
        </div>
        <header
          className={classNames({
            "post-dialog__header": true,
            "post-dialog__header--simple": simple,
          })}
        >
          {fetching ? (
            <SkeletonLoader
              style={{ height: "4rem", width: "4rem", borderRadius: "100px" }}
            />
          ) : (
            <Link
              to={`/${state.data.author.username}`}
              style={{ display: "flex" }}
            >
              <Avatar
                className="avatar--small"
                imageSrc={state.data.author.avatar}
              />
            </Link>
          )}
          {fetching ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <SkeletonLoader style={{ height: "1rem", width: "10rem" }} />
              <SkeletonLoader
                style={{ height: "1rem", width: "15rem", marginTop: "5px" }}
              />
            </div>
          ) : (
            // Liên kết tới user author
            <Link
              style={{ textDecoration: "none" }}
              to={`/${state.data.author.username}`}
            >
              <p className="heading-4 heading-4--bold">
                <b>{state.data.author.username}</b>
              </p>
            </Link>
          )}
          {!fetching && (
            <div
              onClick={() => {
                const options = [
                  {
                    // Go to post detail
                    text: "Go to post",
                    onClick: () => {
                      hideModal("PostDialog/PostDialog");
                      history.push(`/post/${postId}`);
                    },
                  },
                  {
                    // Copy Link function
                    text: "Copy link",
                    onClick: () => {
                      navigator.clipboard
                        .writeText(document.URL)
                        .then(() => showAlert("Link copied to clipboard."))
                        .catch(() =>
                          showAlert("Could not copy link to clipboard.")
                        );
                    },
                  },
                ];
                // Show model pop up lên khi ấn vào post
                showModal(
                  {
                    options:
                      currentUser &&
                      currentUser.username === state.data.author.username
                        ? [
                            ...options,
                            {
                              text: "Delete post",
                              warning: true,
                              onClick: () => {
                                handleDeletePost();
                                history.push("/" + currentUser.username);
                              },
                            },
                          ]
                        : options,
                  },
                  "OptionsDialog/OptionsDialog"
                );
              }}
              style={{ cursor: "pointer" }}
              className="post-dialog__more"
            >
              <Icon className="icon--small" icon="ellipsis-horizontal" />
            </div>
          )}
        </header>
        <div
          data-test="component-post-dialog-content"
          className={classNames({
            "post-dialog__content": true,
            "post-dialog__content--simple": simple,
          })}
        >
          <div
            ref={commentsRef}
            className={classNames({
              comments: true,
              "comments--simple": simple,
            })}
          >
            {/* Render 1 caption tương tự như 1 comment nếu có */}
            {state.data.caption && !fetching ? (
              <Comment
                comment={{
                  message: state.data.caption,
                  avatar: state.data.author.avatar,
                  username: state.data.author.username,
                }}
                currentUser={currentUser}
                token={token}
                post={state.data}
                caption
                simple={simple}
              />
            ) : null}
            {/* show comments */}
            {!fetching &&
              state.data.comments.map((comment, idx) => (
                <Comment
                  comment={comment}
                  currentUser={currentUser}
                  token={token}
                  post={state.data}
                  key={idx}
                  dialogDispatch={dispatch}
                  profileDispatch={profileDispatch}
                  simple={simple}
                />
              ))}
            {!postData &&
              // load thêm comments khi user vừa comment thêm
              state.data.comments.length - state.localStateComments.size <
                state.data.commentCount - state.localStateComments.size && (
                <div
                  style={{ padding: "2rem", cursor: "pointer" }}
                  onClick={() => fetchAdditionalComments()}
                >
                  <Icon
                    style={{
                      margin: "0 auto",
                    }}
                    icon="add-circle-outline"
                  />
                </div>
              )}
          </div>
          {fetching ? (
            // đang fetching thì load skeleton
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "2rem 2rem 6rem 2rem",
              }}
            >
              <SkeletonLoader style={{ height: "1.5rem", width: "15rem" }} />
              <SkeletonLoader
                style={{ height: "1.5rem", width: "20rem", marginTop: "1rem" }}
              />
              <SkeletonLoader
                style={{ height: "1.5rem", width: "10rem", marginTop: "1rem" }}
              />
            </div>
          ) : (
            // Load postdialogstats
            <PostDialogStats
              currentUser={currentUser}
              token={token}
              post={state.data}
              dispatch={dispatch}
              profileDispatch={profileDispatch}
              simple={simple}
            />
          )}
          {!fetching && (
            // Form để user comment
            <PostDialogCommentForm
              postId={postId}
              token={token}
              currentUser={currentUser}
              commentsRef={commentsRef}
              dialogDispatch={dispatch}
              profileDispatch={profileDispatch}
              replying={state.replying}
            />
          )}
        </div>
      </Fragment>
    </div>
  );
};

PostDialog.propTypes = {
  postId: PropTypes.string,
  token: PropTypes.string,
  currentUser: PropTypes.object,
  profileDispatch: PropTypes.func,
};

// lấy state từ reducer
const mapStateToProps = createStructuredSelector({
  token: selectToken,
  currentUser: selectCurrentUser,
});

// dispatch action lên reducer
const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

PostDialog.whyDidYouRender = true;

export default connect(mapStateToProps, mapDispatchToProps)(PostDialog);
