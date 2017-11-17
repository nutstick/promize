import { ApolloClient } from 'apollo-client';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';
import { IntlQuery, LocaleQuery } from '../../apollo/intl';
import * as INTLQUERY from '../../apollo/intl/IntlQuery.gql';
import * as LOCALEQUERY from '../../apollo/intl/LocaleQuery.gql';

namespace App {
  export interface Context {
    insertCss: any;
    fetch: any;
    client: ApolloClient<any>;
    intl: any;
  }

  interface IProps extends React.Props<any> {
    context: Context;
  }

  export type Props = IProps;

  export interface State {
    intl: any;
  }
}

class App extends React.Component<App.Props, App.State> {
  context: App.Context;
  unsubscribe: () => void;
  intl: {
    initialNow?: string,
    locale?: string,
    messages?: string,
  };

  constructor(props) {
    super(props);

    this.state = {
      intl: props.context.intl,
    };
  }

  static childContextTypes = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: PropTypes.func.isRequired,
    // Universal HTTP client
    fetch: PropTypes.func.isRequired,
    // Apollo Client
    client: PropTypes.object.isRequired,
    // ReactIntl
    intl: IntlProvider.childContextTypes.intl,
  };

  public getChildContext() {
    return {
      ...this.props.context,
      ...this.state,
    };
  }

  public componentDidMount() {
    const s = this.setState.bind(this);
    const { client } = this.props.context;

    this.unsubscribe = client.watchQuery<LocaleQuery>({
      query: LOCALEQUERY,
    }).subscribe({
      next({ data }) {
        const { locale, initialNow } = data;
        // TODO: fetchPolicy network-only to manage some way
        client.query<IntlQuery>({
          query: INTLQUERY,
          variables: { locale },
          fetchPolicy: 'network-only',
        })
          .then(({ data: x }) => {
            const messages = x.intl.reduce((msgs, msg) => {
              msgs[msg.id] = msg.message;
              return msgs;
            }, {});

            s({
              intl: new IntlProvider({
                initialNow,
                locale,
                messages,
                defaultLocale: 'en-US',
              }).getChildContext().intl,
            });
          });
      },
    }).unsubscribe;
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  public render() {
    // Here, we are at universe level, sure? ;-)
    const { client } = this.props.context;

    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return (
      <ApolloProvider client={client}>
        {this.props.children}
      </ApolloProvider>
    );
  }
}

export default App;
