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

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

interface IGeography {
  geometry: any;
  properties: IGeographyProperties;
  rsmKey: string;
}

interface IGeographyProperties {
  ABBREV: string;
  CONTINENT: string;
  FORMAL_EN: string;
  GDP_MD_EST: number;
  GDP_YEAR: number;
  ISO_A2: string;
  ISO_A3: string;
  NAME: string;
  NAME_LONG: string;
  POP_EST: number;
  POP_RANK: number;
  POP_YEAR: number;
  REGION_UN: string;
  SUBREGION: string;
}

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

              geographies.forEach((g) => {
                const geoCurrencies = currencies[g.properties.ISO_A2];
                if (geoCurrencies === undefined || geoCurrencies.length === 0) {
                  console.warn(
                    `no exchange rates found for ${g.properties.NAME_LONG}`
                  );
                }
              });

              return geographies.map((geo) => {
                const baseStyle = {
                  fill: "#D6D6DA",
                  outline: "none",
                };
                const geoCurrencies = currencies[geo.properties.ISO_A2];
                const millions =
                  geoCurrencies &&
                  geoCurrencies.filter(
                    (currency) =>
                      convertAmount(amount, baseCurrency, currency.code) >
                      1000000
                  ).length > 0;
                if (millions) {
                  baseStyle.fill = "#00FF00";
                }
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
                      default: baseStyle,
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
