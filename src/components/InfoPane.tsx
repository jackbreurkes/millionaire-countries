import {connect} from "react-redux";
import {convertAmount, CountryMap, InternalCountry} from "../services/conversion.service";
import styled from "styled-components";
import {Box, Flex} from "rebass";
import {Input, Label, Select} from "@rebass/forms";
import fx from "money";
import React from "react";

interface PropsFromState {
    threshold: number,
    amount: number | null;
    baseCurrency: string;
}

type AllProps = PropsFromState & { countries: CountryMap };

const MessageHeading = styled.h1`
  //padding: 10px;
  margin: 0;
  text-align: center;
`

const getMessage = ({amount, baseCurrency, threshold, countries}: AllProps) => {
    if (amount === null) {
        return "Enter your net worth below";
    }

    let millionaireCountries = Object.entries(countries)
        .map(([countryCode, country]) => {
            const millionaireCurrencies = country.currencies.filter(
                currency => convertAmount(amount, baseCurrency, currency.code) > threshold
            )
            return [
                countryCode,
                {...country, currencies: millionaireCurrencies}
            ] as [string, InternalCountry] // needs to be explicitly typed otherwise the type is thought to be (string, InternalCurrency)[]
        }).filter(([_, country]) => {
            return country.currencies.length > 0
        })
    const millionaireCount = millionaireCountries.length

    let countMessage: string;
    if (millionaireCount === 0) {
        countMessage = "You aren't a millionaire anywhere"
    } else if (millionaireCount === 1) {
        countMessage = "You're a millionaire in 1 country"
    } else {
        countMessage = `You're a millionaire in ${millionaireCount} countries`
    }
    return countMessage;
}

const InfoPane = ({
    countries,
    threshold,
    amount,
    baseCurrency
}: AllProps) => {
    const countMessage = getMessage({amount, baseCurrency, threshold, countries})
    return (
        <Box
            pt={3}>
            <Flex>
                <Box mx='auto'>
                    <MessageHeading>
                        {countMessage}
                    </MessageHeading>
                </Box>
            </Flex>
        </Box>
    )
}

const mapStateToProps = (state: any): PropsFromState => {
    const { threshold, amount, baseCurrency } = state;
    return { threshold, amount, baseCurrency };
};

export default connect(mapStateToProps)(InfoPane)