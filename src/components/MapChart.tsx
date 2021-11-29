import React, { memo } from "react";
import { connect } from "react-redux";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import {
  convertAmount,
  CountryCurrenciesMap,
} from "../services/conversion.service";
import CurrencyDisplay from "./CurrencyDisplay";
import { getGeoStyle, IGeography } from "../controllers/map-chart.controller";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

interface PropsFromState {
  amount: number;
  baseCurrency: string;
}

const MapChart = ({
  setTooltipContent,
  currencies,
  amount,
  baseCurrency,
}: {
  setTooltipContent: (content: any) => void;
  currencies: CountryCurrenciesMap;
} & PropsFromState) => {
  return (
    <>
      <ComposableMap
        width={window.innerWidth}
        height={700}
        data-tip=""
        projection="geoMercator"
        projectionConfig={{ scale: 100 }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: IGeography[] }) => {
              geographies.forEach((geo) => {
                let countryCode = geo.properties.ISO_A2;
                const countryName = geo.properties.NAME_LONG;
                if (countryName === "Northern Cyprus") countryCode = "CY"; // Northern Cyprus -> Cyprus
                if (countryName === "Somaliland") countryCode = "SO"; // Somaliland -> Somalia
                geo.properties.ISO_A2 = countryCode;
              });

              return geographies.map((geo) => {
                const geoStyle = getGeoStyle(geo, currencies, amount, baseCurrency)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const { NAME, ISO_A2 } = geo.properties;
                      setTooltipContent(
                        <CurrencyDisplay
                          country={NAME}
                          currencies={currencies[ISO_A2]}
                        />
                      );
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: geoStyle,
                      hover: {
                        fill: "#F53",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none",
                      },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

const mapStateToProps = (state: any): PropsFromState => {
  const { amount, baseCurrency } = state;
  return { amount, baseCurrency };
};

export default connect(mapStateToProps)(memo(MapChart));
