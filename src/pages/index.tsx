import React, { useEffect, useState } from "react";
import MapChart from "../components/MapChart";
import Legend from "../components/Legend";
import ReactTooltip from "react-tooltip";
import {
  CountryMap, getCountryMap, getExchangeRates, initMoneyJS, RatesDetails,
} from "../services/conversion.service";
import AmountInput from "../components/AmountInput";
import InfoPane from "../components/InfoPane";

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
      <AmountInput />
      <MapChart
        setTooltipContent={setTooltipContent}
        countries={currencies}
      />
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <Legend />
      {/*<InfoPane countries={currencies} />*/}
    </div>
  );
}

export async function getStaticProps() {
  const rates = await getExchangeRates();
  const currencies = await getCountryMap(rates); // TODO use promise.all
  return {
    props: {
      currencies,
      rates,
    }
  }
}

export default Home;
