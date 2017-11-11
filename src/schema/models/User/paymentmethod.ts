interface IPaymentMethod {
    credit_card_number: string;
    valid_from_month: number;
    valid_from_year: number;
}

const PaymentMethod = {
    credit_card_number: String,
    valid_from_month: Number,
    valid_from_year: Number,
};

export { IPaymentMethod, PaymentMethod };
