import React from "react";
import { APICurrency, convertAmount } from "../services/conversion.service";
import { connect } from "react-redux";

interface BaseProps {
  country: string;
  currencies: APICurrency[]; // TODO handle no currencies
}

interface PropsFromState {
  amount: number;
  baseCurrency: string;
}

const formatAmount = (amount: number, currencyCode: string): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

const CurrencyDisplay = (props: BaseProps & PropsFromState) => {
  const amounts = props.currencies.map((currency) => {
    const convertedAmount = convertAmount(
      props.amount,
      props.baseCurrency,
      currency.code
    );

    return (
      <p key={currency.code}>
        {currency.name}: {formatAmount(convertedAmount, currency.code)}
      </p>
    );
  });

  return (
    <>
      <h3>{props.country}</h3>
      {amounts}
    </>
  );
};

const mapStateToProps = (state: any): PropsFromState => {
  const { amount, baseCurrency } = state;
  return { amount, baseCurrency };
};

export default connect(mapStateToProps)(CurrencyDisplay);
