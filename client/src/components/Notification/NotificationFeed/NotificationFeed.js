import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";

import {
  selectNotifications,
  selectNotificationState,
} from "../../../redux/notification/notificationSelectors";
import { selectToken } from "../../../redux/user/userSelectors";

import {
  fetchNotificationsStart,
  readNotificationsStart,
  clearNotifications,
} from "../../../redux/notification/notificationActions";

import UserCard from "../../UserCard/UserCard";
import UsersListSkeleton from "../../UsersList/UsersListSkeleton/UsersListSkeleton";
import Icon from "../../Icon/Icon";
import FollowButton from "../../Button/FollowButton/FollowButton";
import Divider from "../../Divider/Divider";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import mention from "linkifyjs/plugins/mention";

import { linkifyOptions } from "../../../utils/linkifyUtils";

mention(linkify);

const NotificationFeed = ({
  notifications,
  fetchNotificationsStart,
  readNotificationsStart,
  notificationState,
  clearNotifications,
  setShowNotifications,
  token,
}) => {
  useEffect(() => {
    (async function () {
      await fetchNotificationsStart(token);
      await readNotificationsStart(token);
    })();

    return () => {
      clearNotifications();
    };
  }, [
    fetchNotificationsStart,
    readNotificationsStart,
    clearNotifications,
    token,
  ]);

  return (
    <Fragment>
      {/* Đang fetching notification state, show skeleton, ngược lại, show các notification */}
      {notificationState.fetching ? (
        <UsersListSkeleton style={{ height: "7rem" }} />
      ) : notifications.length > 0 ? (
        notifications.map((notification, idx) => {
          const userCardProps = {
            username: notification.sender.username,
            avatar: notification.sender.avatar,
            subTextDark: true,
            token: token,
            date: notification.date,
            style: { minHeight: "7rem", padding: "1rem 1.5rem" },
          };
          let userCardChild = null;
          //  Các th hiện thông báo: Follow, like
          switch (notification.notificationType) {
            case "follow": {
              userCardProps.subText = "started following you.";
              userCardChild = (
                <FollowButton
                  username={notification.sender.username}
                  avatar={notification.sender.avatar}
                  following={notification.isFollowing}
                  userId={notification.sender._id}
                />
              );
              break;
            }
            case "like": {
              userCardProps.subText = "liked your photo.";
              userCardChild = (
                <Link to={`/post/${notification.notificationData.postId}`}>
                  <img
                    src={notification.notificationData.image}
                    style={{
                      display: "flex",
                      filter: notification.notificationData.filter,
                    }}
                    onClick={() =>
                      setShowNotifications && setShowNotifications(false)
                    }
                    alt="liked post"
                  />
                </Link>
              );
              break;
            }
            default: {
              userCardProps.subText = (
                // Phân loại tag hay mention
                <Linkify options={linkifyOptions}>{`${
                  notification.notificationType === "comment"
                    ? "commented:"
                    : "mentioned you in a comment:"
                } ${notification.notificationData.message}`}</Linkify>
              );
              // Link image tới post chứa image này
              userCardChild = (
                <Link to={`/post/${notification.notificationData.postId}`}>
                  <img
                    src={notification.notificationData.image}
                    style={{
                      display: "flex",
                      filter: notification.notificationData.filter,
                    }}
                    onClick={() =>
                      setShowNotifications && setShowNotifications(false)
                    }
                    alt="post commented on"
                  />
                </Link>
              );
            }
          }

          return (
            <li key={idx}>
              {/* Render từng usercard trong notification */}
              <UserCard {...userCardProps}>
                {userCardChild && userCardChild}
              </UserCard>
              {notifications.length - 1 > idx && <Divider />}
            </li>
          );
        })
      ) : (
        // Trường hợp ko có notification nào
        <div className="popup-card__empty">
          <Icon className="icon--larger" icon="heart-circle-outline" />
          <h2 className="heading-2 font-medium">Activity On Your Posts</h2>
          <h4 className="heading-4 font-medium">
            When someone likes or comments on your posts, you'll see them here.
          </h4>
        </div>
      )}
    </Fragment>
  );
};

// lấy state từ reducer
const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications,
  notificationState: selectNotificationState,
  token: selectToken,
});

// dispatch action tới reducer
const mapDispatchToProps = (dispatch) => ({
  fetchNotificationsStart: (authToken) =>
    dispatch(fetchNotificationsStart(authToken)),
  readNotificationsStart: (authToken) =>
    dispatch(readNotificationsStart(authToken)),
  clearNotifications: () => dispatch(clearNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationFeed);
