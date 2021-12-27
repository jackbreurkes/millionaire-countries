import React, { useState } from "react";
import { connect } from "react-redux";
import { setAmount, setCurrency } from "../app/store";
import fx from "money";
import { Label, Select, Input } from "@rebass/forms"
import {Box, Flex} from "rebass";

interface PropsFromState {
  amount: number;
  baseCurrency: string;
}

const fontSize = 3;

const AmountInput = (
  props: { setAmount?: any; setCurrency?: any } & PropsFromState
) => {
  const [amountInputValue, setAmountInputValue] = useState(
    props.amount ? props.amount.toString() : ""
  );
  const [currencyInputValue, setCurrencyInputValue] = useState(
    props.baseCurrency
  );

  const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInputValue(e.target.value);
    props.setAmount(e.target.value || null);
  };

  const updateCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyInputValue(e.target.value);
    props.setCurrency(e.target.value);
  };

  return (
    <Box py={3}>
        <Flex mb={3}>
            <Box mx='auto' />
            <Box width={110} px={1}>
                <Label htmlFor='currency'>Currency</Label>
                <Select
                    id='currency'
                    name='currency'
                    fontSize={fontSize}
                    value={currencyInputValue}
                    // @ts-ignore
                    onChange={updateCurrency}
                >
                    {Object.keys(fx.rates).map((currency) => (
                        <option key={currency}>{currency}</option>
                    ))}
                </Select>
            </Box>
            <Box width={250} px={1}>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                    id='amount'
                    name='amount'
                    type='number'
                    fontSize={fontSize}
                    value={amountInputValue}
                    onChange={updateAmount}
                />
            </Box>
            <Box mx='auto' />
        </Flex>
    </Box>
  );
};

const mapStateToProps = (state: any): PropsFromState => {
  const { amount, baseCurrency } = state;
  return { amount, baseCurrency };
};

export default connect(mapStateToProps, { setAmount, setCurrency })(
  AmountInput
);
