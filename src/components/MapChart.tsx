import React, { memo } from "react";
import { connect } from "react-redux";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import {
  CountryMap,
} from "../services/conversion.service";
import CurrencyDisplay from "./CurrencyDisplay";
import { getGeoStyle, IGeography } from "../controllers/map-chart.controller";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

interface PropsFromState {
  threshold: number;
  amount: number;
  baseCurrency: string;
}

const MapChart = ({
  setTooltipContent,
  countries,
  threshold,
  amount,
  baseCurrency,
}: {
  setTooltipContent: (content: any) => void;
  countries: CountryMap;
} & PropsFromState) => {
  return (
    <>
      <ComposableMap
        width={window.innerWidth}  // TODO fix this
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
                const country = countries[geo.properties.ISO_A2];
                const geoStyle = getGeoStyle(geo, country.currencies, amount, baseCurrency, threshold)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const { NAME, ISO_A2 } = geo.properties;
                      setTooltipContent(
                        <CurrencyDisplay
                          country={NAME}
                          currencies={countries[ISO_A2].currencies}
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
  const { threshold, amount, baseCurrency } = state;
  return { threshold, amount, baseCurrency };
};

export default connect(mapStateToProps)(memo(MapChart));
