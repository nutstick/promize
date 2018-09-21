import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { BuyNow } from '../routes/BuyNow';
import { BuyNowSuccess } from '../routes/BuyNowSuccess';
import { Demo } from '../routes/Demo';
import { Home } from '../routes/Home';
import { NotFound } from '../routes/NotFound';
import { Register } from '../routes/Register';
import { Search } from '../routes/Search';
import { User } from '../routes/User';

export default (props) => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/search" component={Search} />
      <Route path="/users/:id" component={User} />
      <Route path="/products/:id/buynow/success" component={BuyNowSuccess} />
      <Route path="/products/:id/buynow" component={BuyNow} />
      <Route path="/demo" component={Demo} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
);
