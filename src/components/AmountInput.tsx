import React, { useState } from "react";
import {connect, ConnectedProps} from "react-redux";
import { RootState, setAmount, setCurrency } from "../app/store";
import fx from "money";
import { Select, Input } from "@rebass/forms"
import {Box, Flex} from "rebass";

const fontSize = 2;

const AmountInput = (
    {
        amount,
        baseCurrency,
        setAmount,
        setCurrency
    }: PropsFromRedux
) => {
  const [amountInputValue, setAmountInputValue] = useState(
    amount ? amount.toString() : ""
  );
  const [currencyInputValue, setCurrencyInputValue] = useState(
    baseCurrency
  );

  const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInputValue(e.target.value);
    setAmount(parseFloat(e.target.value) || null);
  };

  const updateCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyInputValue(e.target.value);
    setCurrency(e.target.value);
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
                        backgroundColor: 'white',
                        borderRadius: '6px'
                    }}
                />
            </Box>
            <Box mx='auto' />
        </Flex>
    </Box>
  );
};

const mapStateToProps = (state: RootState) => {
  const { amount, baseCurrency } = state;
  return { amount, baseCurrency };
};

const connector = connect(mapStateToProps, { setAmount, setCurrency });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AmountInput);
