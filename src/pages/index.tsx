import React, { useEffect, useState } from "react";
import MapChart from "../components/MapChart";
import LegendAndLinks from "../components/LegendAndLinks";
import ReactTooltip from "react-tooltip";
import {
    CountryMap, getCountries, getCountryMap, getExchangeRates, initMoneyJS, RatesDetails,
} from "../services/conversion.service";
import AmountInput from "../components/AmountInput";
import MillionaireCount from "../components/MillionaireCount";
import styled from "styled-components";
import {GetStaticProps} from "next";

const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
`

const FooterBar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`

function Home({ currencies, ratesDetails }: { currencies: CountryMap, ratesDetails: RatesDetails }) {
    const [tooltipContent, setTooltipContent] = useState("");
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        initMoneyJS(ratesDetails); // required because money.js uses global state
        setIsClient(true)
    }, []);

    return (
        <div>
            <HeaderBar>
                <MillionaireCount countries={currencies}/>
                <AmountInput rates={ratesDetails.rates} />
            </HeaderBar>

            {isClient && (
                <>
                    <MapChart
                        setTooltipContent={setTooltipContent}
                        countries={currencies}
                    />
                    <ReactTooltip>{tooltipContent}</ReactTooltip>
                </>
            )}

            <FooterBar>
                <LegendAndLinks/>
            </FooterBar>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const [countries, ratesDetails] = await Promise.all([getCountries(), getExchangeRates()]);
    initMoneyJS(ratesDetails);
    const currencies = getCountryMap(countries, ratesDetails);
    console.info("Static props fetched")
    return {
        props: {
            currencies,
            ratesDetails,
        },
        revalidate: 3600, // revalidate every hour
    }
}

export default Home;
