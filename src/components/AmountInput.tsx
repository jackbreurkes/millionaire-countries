import React, { useState } from "react";
import { connect } from "react-redux";
import { setAmount, setCurrency } from "../app/store";
import fx from "money";
import { Select, Input } from "@rebass/forms"
import {Box, Button, Flex} from "rebass";
import ReactDOM from "react-dom";

interface PropsFromState {
  amount: number;
  baseCurrency: string;
}

const fontSize = 2;

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
    <Box pt={3}>
        <Flex>
            <Box mx='auto' />
            <Box width={75} mr={1}>
                <Select
                    id='currency'
                    name='currency'
                    fontSize={fontSize}
                    value={currencyInputValue}
                    // @ts-ignore
                    onChange={updateCurrency}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '6px',
                    }}
                >
                    {Object.keys(fx.rates).map((currency) => (
                        <option key={currency}>{currency}</option>
                    ))}
                </Select>
            </Box>
            <Box width={160}>
                <Input
                    id='amount'
                    name='amount'
                    type='number'
                    placeholder='amount'
                    fontSize={fontSize}
                    value={amountInputValue}
                    onChange={updateAmount}
                    sx={{
                        'background-color': 'white',
                        'border-radius': '6px'
                    }}
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
