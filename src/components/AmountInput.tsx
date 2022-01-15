import React, {useEffect, useState} from "react";
import {connect, ConnectedProps, useSelector} from "react-redux";
import {RootState, setAmount, setCurrency} from "../app/store";
import {Select, Input} from "@rebass/forms"
import {Box, Flex} from "rebass";
import {CountryMap, RatesDetails} from "../services/conversion.service";

const COUNTRY_CODE_PARAM = 'userCountry'; // must match the constant declared in _middleware.ts
const CURRENCY_URL_PARAM = "currency";

const fontSize = 2;

const AmountInput = (
    {
        amount,
        setAmount,
        setCurrency,
        countries,
        rates
    }: PropsFromRedux & { countries: CountryMap, rates: RatesDetails["rates"] }
) => {
    const [amountInputValue, setAmountInputValue] = useState(
        amount ? amount.toString() : ""
    );
    const baseCurrency: string = useSelector((state: RootState) => state.baseCurrency);

    useEffect(() => {
        let newCurrency: string | undefined;

        // update the currency on client-side to avoid generating a static page for each possible currency
        const params = new URLSearchParams(window.location.search);
        const currencyParam = params.get(CURRENCY_URL_PARAM);
        const countryParam = params.get(COUNTRY_CODE_PARAM);
        if (currencyParam) {
            newCurrency = currencyParam
        } else if (countryParam) {
            // try to infer from the detected country
            const currencyFromCountry = countries[countryParam]?.currencies[0]?.code;
            if (currencyFromCountry) {
                newCurrency = currencyFromCountry
            }
        }

        if (newCurrency && (newCurrency in rates)) {
            setCurrency(newCurrency);
        }
    }, [])

    const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountInputValue(e.target.value);
        setAmount(parseFloat(e.target.value) || null);
    };

    const updateCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value);
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
