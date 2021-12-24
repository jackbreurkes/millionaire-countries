import React, { useEffect, useState } from "react";
import MapChart from "../components/MapChart";
import Legend from "../components/Legend";
import ReactTooltip from "react-tooltip";
import { Provider } from "react-redux";
import {
  CountryMap, getCountryMap, getRatesFromEuros, initMoneyJS, RatesMap,
} from "../services/conversion.service";
import store from "../app/store";
import AmountInput from "../components/AmountInput";
import InfoPane from "../components/InfoPane";

function Home({ currenciesSSR, ratesSSR }: { currenciesSSR: CountryMap, ratesSSR: RatesMap }) { // TODO use currenciesSSR
  const currencies: CountryMap = currenciesSSR;
  const [tooltipContent, setTooltipContent] = useState("");
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    initMoneyJS(ratesSSR);
    setShowMap(true)
  }, []);

  if (!showMap) {
    return <><p>loading...</p></>;
  }

  return (
    <div>
      <Provider store={store}>
        <AmountInput />
        <MapChart
          setTooltipContent={setTooltipContent}
          countries={currencies}
        />
        <ReactTooltip>{tooltipContent}</ReactTooltip>
        <Legend />
        <InfoPane countries={currencies} />
      </Provider>
    </div>
  );
}

export async function getStaticProps() {
  const ratesSSR = await getRatesFromEuros();
  const currencies = await getCountryMap(ratesSSR);
  return {
    props: {
      currenciesSSR: currencies,
      ratesSSR,
    }
  }
}

export default Home;
