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

const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
`

function Home({ currencies, rates }: { currencies: CountryMap, rates: RatesDetails }) { // TODO use currenciesSSR
  const [tooltipContent, setTooltipContent] = useState("");
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    initMoneyJS(rates); // required because money.js uses global state
    setShowMap(true)
  }, []);

  if (!showMap) {
    return <><p>loading...</p></>;
  }

  return (
    <div>
        <HeaderBar>
            <MillionaireCount countries={currencies}/>
            <AmountInput />
        </HeaderBar>
      <MapChart
        setTooltipContent={setTooltipContent}
        countries={currencies}
      />
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <Legend />
    </div>
  );
}

export async function getStaticProps() {
  const rates = await getExchangeRates();
  const currencies = await getCountryMap(rates); // TODO use promise.all? does it matter for SSR?
  return {
    props: {
      currencies,
      rates,
    }
  }
}

export default Home;
