import { graphql } from 'graphql';
import { Schema } from '../../../';
import { database } from '../../../models';
import resolver from '../resolver';

it('PaymentMethod creditCardNumber should return visible only last 4 digits', () => {
  const card = { credit_card_number: '1000234560007890' };
  expect(resolver.PaymentMethod.creditCardNumber(card))
    .toBe('############7890');
});
