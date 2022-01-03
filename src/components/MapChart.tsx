import React, {memo, useEffect, useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography, Graticule, Sphere,
} from "react-simple-maps";
import {
  CountryMap,
} from "../services/conversion.service";
import TooltipContent from "./TooltipContent";
import {getGeoStyle, IGeography, getHoverColour} from "../controllers/map-chart.controller";
import ReactTooltip from "react-tooltip";
import {RootState} from "../app/store";

// geojson from https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json
const geoUrl = "/world-110m.json"; // defines the shapes of each country
const projection = "geoEqualEarth"; // defines the shape/warping of the map as a whole
const graticuleColor = "#86C8F4";
const fillColor = "#95D4FF";

interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

const getDefaultPosition = (width: number, height: number): MapPosition => ({
  coordinates: [0, -height * 0.005],
  zoom: Math.min(width / 800, 1.5)
});

const MapChart = ({
  setTooltipContent,
  countries,
  threshold,
  amount,
  baseCurrency,
}: {
  setTooltipContent: (content: any) => void;
  countries: CountryMap;
} & PropsFromRedux) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const [position, setPosition] = useState<MapPosition>(getDefaultPosition(width, height));
  const [hasDragged, setHasDragged] = useState(false);

  const [innerWidth, setInnerWidth] = useState<number | undefined>();


  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setInnerWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // setHeight(window.innerHeight);
    if (!hasDragged) {
      setPosition(getDefaultPosition(width, height));
    }
  }, [innerWidth]);

  function handleMoveEnd(position: MapPosition) {
    setPosition(position);
    console.log("moved")
    setHasDragged(true);
  }

  return (
    <>
      <ComposableMap
        width={width}
        height={height}
        projection={projection}
        projectionConfig={{ scale: 147 }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          data-tip="" // required for tooltip to work
          minZoom={0.5}
          // translateExtent={[[-0.5 * width, -0.5 * height], [1.5 * width, 1.5 * height]]}
          onMoveEnd={handleMoveEnd}
        >
          {/* @ts-ignore required properties */}
          <Sphere stroke={graticuleColor} strokeWidth={1.2} fill={fillColor} />
          <Graticule stroke={graticuleColor} strokeWidth={0.6} step={[10, 10]} />
          <Geographies
              geography={geoUrl}
              stroke="#222"
              strokeWidth={0.3}
              data-tip="" // having this in multiple places feels hacky but seems to dodge the pointer follow bug
          >
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
                        <TooltipContent
                          country={NAME}
                          currencies={countries[ISO_A2].currencies}
                          amount={amount}
                          baseCurrency={baseCurrency}
                        />
                      );
                      ReactTooltip.rebuild() // this might help to fix the pointer tracking bug?
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: geoStyle,
                      hover: {
                        fill: getHoverColour(geoStyle.fill),
                        outline: "none",
                      },
                      pressed: {
                        fill: getHoverColour(geoStyle.fill),
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

const mapStateToProps = (state: RootState) => {
  const { threshold, amount, baseCurrency } = state;
  return { threshold, amount, baseCurrency };
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(memo(MapChart));
