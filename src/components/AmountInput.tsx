import React, { useState } from "react";
import { connect } from "react-redux";
import { setAmount, setCurrency } from "../store";
import fx from "money";
import styled from "styled-components";

import { InputGroup, Input } from "reactstrap";

interface PropsFromState {
  amount: number;
  baseCurrency: string;
}

const Container = styled.div`
  position: fixed;
  width: 500px;
  left: 50%;
  margin-left: -250px;
  display: flex;
`;

const DropdownContainer = styled.div`
  flex: 1;
`;

const InputContainer = styled.div`
  flex: 3;
`;

const AmountInput = (
  props: { setAmount?: any; setCurrency?: any } & PropsFromState
) => {
  const [amountInputValue, setAmountInputValue] = useState(
    props.amount.toString()
  );
  const [currencyInputValue, setCurrencyInputValue] = useState(
    props.baseCurrency
  );

  const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInputValue(e.target.value);
    props.setAmount(e.target.value);
  };

  const updateCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyInputValue(e.target.value);
    props.setCurrency(e.target.value);
  };

  return (
    <Container>
      <InputGroup>
        <DropdownContainer>
          <Input
            type="select"
            name="currency"
            value={currencyInputValue}
            onChange={updateCurrency}
          >
            {Object.keys(fx.rates).map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </Input>
        </DropdownContainer>
        <InputContainer>
          <Input
            type="number"
            name="amount"
            value={amountInputValue}
            onChange={updateAmount}
          />
        </InputContainer>
      </InputGroup>
    </Container>
  );
};

const mapStateToProps = (state: any): PropsFromState => {
  const { amount, baseCurrency } = state;
  return { amount, baseCurrency };
};

export default connect(mapStateToProps, { setAmount, setCurrency })(
  AmountInput
);
