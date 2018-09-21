import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { Icon, Step } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { Card } from '../../components/Card';
import * as s from './BuyNow.css';
import { PaymentMethodStep } from './PaymentMethodStep';
import * as PRODUCTOPTIONSQUERY from './ProductOptionQuery.gql';
import { ProductStep } from './ProductStep';
import { Review } from './Review';
import { ShippingStep } from './ShippingStep';

namespace BuyNow {
  export type WithRouter = RouteComponentProps<{
    id: string;
  }>;

  export interface ProductQuery {
    product: {
      selectedSize: string;
      selectedColor: string;
    };
  }

  export type Props = ChildProps<WithRouter, ProductQuery>;

  export interface State {
    step: number;

    address?: string;
    city?: string;
    country?: string;
    zip?: string;

    userAddress?: string;

    creditCardNumber?: string;
    validFromMonth?: string;
    validFromYear?: string;

    userPaymentMethod?: string;
  }
}

@withStyles(s)
@graphql<BuyNow.WithRouter, BuyNow.ProductQuery>(PRODUCTOPTIONSQUERY, {
  options({ match }) {
    return { variables: { id: match.params.id } };
  },
})
export class BuyNow extends React.Component<BuyNow.Props, BuyNow.State> {
  constructor(props) {
    super(props);

    this.state = {
      step: !!props.data.product.selectedSize && !!props.data.product.selectedColor ? 2 : 1,
    };
  }

  public componentDidMount() {
    document.title = 'BuyNow';
  }

  private previosStep = () => {
    this.setState({ step: this.state.step - 1 });
  }

  private nextStep = () => {
    this.setState({ step: this.state.step + 1 });
  }

  private onShippingStateChange = (field, value) => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  }

  private onPaymentStateChange = (field, value) => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  }

  public render() {
    return (
      <div className={s.root}>
        <Card>
          <div>
            {/* <Steps current={1}>
              <Steps.Step title="first" />
              <Steps.Step title="second" />
              <Steps.Step title="third" />
            </Steps> */}
            <Step.Group attached="top" widths={4} size="mini">
              <Step
                link
                onClick={() => this.setState({ step: 1 })}
                completed={this.state.step > 1}
                active={this.state.step === 1}
                disabled={this.state.step < 1}>
                <Icon name="shop" />
                <Step.Content>
                  <Step.Title>Product</Step.Title>
                </Step.Content>
              </Step>

              <Step
                link
                onClick={() => this.setState({ step: 2 })}
                completed={this.state.step > 2}
                active={this.state.step === 2}
                disabled={this.state.step < 2}>
                <Icon name="truck" />
                <Step.Content>
                  <Step.Title>Shipping</Step.Title>
                </Step.Content>
              </Step>

              <Step
                link
                onClick={() => this.setState({ step: 3 })}
                completed={this.state.step > 3}
                active={this.state.step === 3}
                disabled={this.state.step < 3}>
                <Icon name="payment" />
                <Step.Content>
                  <Step.Title>Billing</Step.Title>
                </Step.Content>
              </Step>

              <Step
                link
                onClick={() => this.setState({ step: 4 })}
                completed={this.state.step > 4}
                active={this.state.step === 4}
                disabled={this.state.step < 4}>
                <Icon name="info" />
                <Step.Content>
                  <Step.Title>Confirm Order</Step.Title>
                </Step.Content>
              </Step>
            </Step.Group>
          </div>
          {
            <div className={this.state.step === 1 ? s.show : s.hidden}>
              <ProductStep
                id={this.props.match.params.id}
                next={this.nextStep} />
            </div>
          }
          {
            <div className={this.state.step === 2 ? s.show : s.hidden}>
              <ShippingStep
                prev={this.previosStep}
                next={this.nextStep}
                onStateChange={this.onShippingStateChange} />
            </div>
          }
          {
            <div className={this.state.step === 3 ? s.show : s.hidden}>
              <PaymentMethodStep
                prev={this.previosStep}
                next={this.nextStep}
                onStateChange={this.onPaymentStateChange} />
            </div>
          }
          {
            <div className={this.state.step === 4 ? s.show : s.hidden}>
              <Review
                history={this.props.history}
                location={this.props.location}
                prev={this.previosStep}
                id={this.props.match.params.id}
                address={this.state.address}
                city={this.state.city}
                country={this.state.country}
                zip={this.state.zip}
                userAddress={this.state.userAddress}
                creditCardNumber={this.state.creditCardNumber}
                validFromMonth={this.state.validFromMonth}
                validFromYear={this.state.validFromYear}
                userPaymentMethod={this.state.userPaymentMethod} />
            </div>
          }
        </Card>
      </div>
    );
  }
}
