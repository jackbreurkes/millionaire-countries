import React, { useEffect, useState } from "react";
import MapChart from "../components/MapChart";
import Legend from "../components/Legend";
import ReactTooltip from "react-tooltip";
import {
    CountryMap, getCountryMap, getExchangeRates, initMoneyJS, RatesDetails,
} from "../services/conversion.service";
import AmountInput from "../components/AmountInput";
import MillionaireCount from "../components/MillionaireCount";
import styled from "styled-components";
import Links from "../components/Links";
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
                <Links/>
                <Legend/>
            </FooterBar>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const ratesDetails = await getExchangeRates();
    const currencies = await getCountryMap(ratesDetails); // TODO use promise.all? does it matter for SSR?
    return {
        props: {
            currencies,
            ratesDetails,
        }
    }
}

export default Home;
