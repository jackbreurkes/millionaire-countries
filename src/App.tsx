import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import MapChart from "./components/MapChart";
import Legend from "./components/Legend";
import ReactTooltip from "react-tooltip";
import { Provider } from "react-redux";
import {
  CountryCurrenciesMap,
  getCountriesToCurrenciesMap,
} from "./services/conversion.service";
import store from "./store";
import AmountInput from "./components/AmountInput";

function App() {
  const [currencies, setCurrencies] = useState<CountryCurrenciesMap>({});
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    getCountriesToCurrenciesMap().then((c) => setCurrencies(c));
  }, []);

  if (Object.keys(currencies).length === 0) {
    return <></>;
  }

  return (
    <div>
      <Provider store={store}>
        <AmountInput />
        <MapChart
          setTooltipContent={setTooltipContent}
          currencies={currencies}
        />
        <ReactTooltip>{tooltipContent}</ReactTooltip>
        <Legend />
      </Provider>
    </div>
  );
}

export default App;
