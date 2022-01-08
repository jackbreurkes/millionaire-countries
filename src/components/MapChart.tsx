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
import ReactDOM from "react-dom";
import { isMobile } from "react-device-detect";

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
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  const [position, setPosition] = useState<MapPosition>(getDefaultPosition(dimensions.width, dimensions.height));

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }

    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleMove() {
    if (isMobile) {
      setTooltipContent("")
    }
  }

  function handleMoveEnd(position: MapPosition) {
    setPosition(position);
  }

  return (
    <>
      <ComposableMap
        width={dimensions.width}
        height={dimensions.height}
        projection={projection}
        projectionConfig={{ scale: 147 }} // magic number from the example
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          data-tip="" // required for tooltip to work
          minZoom={0.5}
          onMove={handleMove}
          onMoveEnd={handleMoveEnd}
        >
          {/* @ts-ignore missing required properties error */}
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


/**
 * This function takes the <svg> element rendered by react-simple-maps and downloads
 * it for the user.
 *
 * The entire function is likely a mess of bad practices and hacks - the scope is limited
 * so hopefully this doesn't matter.
 *
 *
 * conversion of svg Element to download link comes from https://stackoverflow.com/a/23218877
 * auto-downloading of svg file comes from https://medium.com/code-sections/exporting-svg-and-png-out-of-your-printable-html-elements-45bda7d618a2
 */
export function downloadMapAsSVG() {
  const element = document.querySelector("svg.rsm-svg")
  if (!element) {
    alert("failed to download SVG")
    return
  }

  // clone the HTML representing the svg and modify tags
  const svg = ReactDOM.findDOMNode(element)?.cloneNode(true) as Element
  svg.setAttribute("version", "1.1")
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  if (svg.firstElementChild?.lastElementChild) {
    svg.firstElementChild.lastElementChild.removeAttribute("transform") // centers the map in the svg
  }

  // add xml tag and convert to a downloadable URL
  let svgData = new XMLSerializer().serializeToString(svg);
  svgData = '<?xml version="1.0" standalone="no"?>\r\n' + svgData;
  let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

  // TODO is there a more correct way to do this (that doesn't modify the DOM)?
  const link = document.createElement('a');
  link.download = 'millions.svg';
  link.href = url;
  link.click();
}
