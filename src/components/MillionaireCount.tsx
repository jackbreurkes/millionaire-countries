import {connect, ConnectedProps} from "react-redux";
import {convertAmount, CountryMap, InternalCountry} from "../services/conversion.service";
import styled from "styled-components";
import {Box, Flex} from "rebass";
import React from "react";
import {RootState} from "../app/store";

type AllProps = PropsFromRedux & { countries: CountryMap };

const MessageHeading = styled.h1`
  margin: 0;
`

const HeadingHighlight = styled.span`
  padding: 2px 6px;
  line-height: 1.1; /* adjust this to avoid overlapping the padding */
  background-color: white;
  border-radius: 6px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
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

const MillionaireCount = (props: AllProps) => {
    const countMessage = getMessage(props)
    return (
        <Flex mt={3} justifyContent="center">
            <Box>
                <MessageHeading>
                    <HeadingHighlight>{countMessage}</HeadingHighlight>
                </MessageHeading>
            </Box>
        </Flex>
    )
}

const mapStateToProps = (state: RootState) => {
    const { threshold, amount, baseCurrency } = state;
    return { threshold, amount, baseCurrency };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MillionaireCount)