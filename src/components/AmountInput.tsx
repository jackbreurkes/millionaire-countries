import React, {useEffect, useState} from "react";
import {connect, ConnectedProps, useSelector} from "react-redux";
import {RootState, setAmount, setCurrency} from "../app/store";
import {Select, Input} from "@rebass/forms"
import {Box, Flex} from "rebass";
import {RatesDetails} from "../services/conversion.service";
import qs from "qs";

const CURRENCY_URL_PARAM = "currency";

const fontSize = 2;

const AmountInput = (
    {
        amount,
        setAmount,
        setCurrency,
        rates
    }: PropsFromRedux & { rates: RatesDetails["rates"] }
) => {
    const [amountInputValue, setAmountInputValue] = useState(
        amount ? amount.toString() : ""
    );

    useEffect(() => {
        // update the currency on client-side to avoid generating a static page for each possible currency
        const params = new URLSearchParams(window.location.search);
        const currencyCode = params.get(CURRENCY_URL_PARAM);
        if (currencyCode) {
            setCurrency(currencyCode);
        }
    }, [])

    let baseCurrency: string = useSelector((state: RootState) => state.baseCurrency);
    if (!(baseCurrency in rates)) {
        baseCurrency = "USD";
        setCurrency(baseCurrency);
    }

    const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountInputValue(e.target.value);
        setAmount(parseFloat(e.target.value) || null);
    };

    const updateCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value);
        setQueryStringValue(CURRENCY_URL_PARAM, e.target.value);
    };

    return (
        <Flex mt={3} justifyContent="center">
            <Box width={75} mr={1}>
                <Select
                    id='currency'
                    name='currency'
                    fontSize={fontSize}
                    value={baseCurrency}
                    onChange={updateCurrency}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '6px',
                    }}
                >
                    {Object.keys(rates).map((currency) => (
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
        </Flex>
    );
};

const mapStateToProps = (state: RootState) => {
    const {amount} = state;
    return {amount};
};

const connector = connect(mapStateToProps, {setAmount, setCurrency});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AmountInput);

const setQueryStringWithoutPageReload = (qsValue: string) => {
    const newurl = window.location.protocol + "//" +
        window.location.host +
        window.location.pathname +
        qsValue;

    window.history.pushState({path: newurl}, "", newurl);
};

/**
 * this only allows one query to be in the url at a time. not an issue for current use case
 */
const setQueryStringValue = (
    key: string,
    value: string,
) => {
    const newQsValue = qs.stringify({[key]: value}, {addQueryPrefix: true});
    console.log(newQsValue)
    setQueryStringWithoutPageReload(newQsValue);
};
