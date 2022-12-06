import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";

import PageLayout from "../Components/layout/PageLayout";
import Auth from "../Pages/Auth";

import { ROOT, RECENT } from "./CONSTANTS";

const RouterConfig = () => {
  return (
    <Fragment>
      <Switch>
        <PageLayout>
          <Route path={ROOT}>
            <Auth />
          </Route>
        </PageLayout>
      </Switch>
    </Fragment>
  );
};

export default RouterConfig;
