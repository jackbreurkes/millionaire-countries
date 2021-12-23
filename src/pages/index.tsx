import React, { useEffect, useState } from "react";
import MapChart from "../components/MapChart";
import Legend from "../components/Legend";
import ReactTooltip from "react-tooltip";
import { Provider } from "react-redux";
import {
  CountryMap,
  getCountryMap,
} from "../services/conversion.service";
import store from "../app/store";
import AmountInput from "../components/AmountInput";
import InfoPane from "../components/InfoPane";

function Home({ currenciesSSR }: { currenciesSSR: CountryMap }) { // TODO use currenciesSSR
  const [currencies, setCurrencies] = useState<CountryMap>({});
  const [tooltipContent, setTooltipContent] = useState("");
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    getCountryMap().then((c) => setCurrencies(c));
  }, []);

  if (Object.keys(currencies).length === 0) { // TODO check if object empty instead
    return <></>;
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
  const currenciesSSR = await getCountryMap();
  return {
    props: {
      currenciesSSR
    }
  }
}

export default Home;
