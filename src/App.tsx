import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import MapChart from "./components/MapChart";
import Legend from "./components/Legend";
import ReactTooltip from "react-tooltip";
import { Provider } from "react-redux";
import {
  CountryMap,
  getCountryMap,
} from "./services/conversion.service";
import store from "./store";
import AmountInput from "./components/AmountInput";
import InfoPane from "./components/InfoPane";

function App() {
  const [currencies, setCurrencies] = useState<CountryMap>({});
  const [tooltipContent, setTooltipContent] = useState("");

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
      {/*  TODO re-enable above */}
      </Provider>
    </div>
  );
}

export default App;
