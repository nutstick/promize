import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Home } from '../routes/Home';
import { NotFound } from '../routes/NotFound';
import { Search } from '../routes/Search';

export default (props) => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
);
