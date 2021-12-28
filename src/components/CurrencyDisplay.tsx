import React, {ReactElement} from "react";
import { ICurrency, convertAmount } from "../services/conversion.service";

interface BaseProps {
  country: string;
  currencies: ICurrency[]; // TODO handle no currencies
  amount: number | null;
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

const CurrencyDisplay = (props: BaseProps) => {
  let amounts: ReactElement | ReactElement[] | null = <p>No currencies found</p>

  if (props.amount === null) {
    amounts = null
  } else if (props.currencies.length > 0) {
    amounts = props.currencies.map((currency) => {
      const convertedAmount = convertAmount(
          props.amount!!,
          props.baseCurrency,
          currency.code
      );

      return (
          <p key={currency.code}>
            {currency.name}: {formatAmount(convertedAmount, currency.code)}
          </p>
      );
    });
  }

  return (
    <>
      <h3>{props.country}</h3>
      {amounts}
    </>
  );
};

export default CurrencyDisplay;
