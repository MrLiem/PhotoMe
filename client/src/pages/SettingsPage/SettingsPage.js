import React, { Fragment } from "react";
import { NavLink, Switch } from "react-router-dom";

import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import Card from "../../components/Card/Card";
import ChangePasswordForm from "../../components/ChangePasswordForm/ChangePasswordForm";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";

// SettingsPage component-- chỉnh sửa thông tin nhân của user
const SettingsPage = () => (
  <Fragment>
    {/* Page settings thông tin cá nhân */}
    <MobileHeader backArrow>
      <h3 className="heading-3">Edit Profile</h3>
      <div></div>
    </MobileHeader>
    <main className="settings-page grid">
      <Card className="settings-card">
        <ul className="settings-card__sidebar">
          {/* section edit thông tin cá nhân */}
          <NavLink
            className="sidebar-link"
            to="/settings/edit"
            activeClassName="font-bold sidebar-link--active"
          >
            <li className="sidebar-link__text">Edit Profile</li>
          </NavLink>
          {/* Section change password */}
          <NavLink
            className="sidebar-link"
            to="/settings/password"
            activeClassName="font-bold sidebar-link--active"
          >
            <li className="sidebar-link__text">Change Password</li>
          </NavLink>
        </ul>
        <article className="settings-page__content">
          <Switch>
            <ProtectedRoute path="/settings/edit">
              <EditProfileForm />
            </ProtectedRoute>
            <ProtectedRoute path="/settings/password">
              <ChangePasswordForm />
            </ProtectedRoute>
          </Switch>
        </article>
      </Card>
    </main>
  </Fragment>
);

export default SettingsPage;
