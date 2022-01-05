import {Box, Button, Flex, Link, Text} from "rebass";
import Image from "next/image";
import React from "react";
import ReactDOM from "react-dom";

const iconSize = 20;

const buttonStyle = {
    color: "black",
    backgroundColor: "white",
    padding: "6px 12px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: 6,
    ':hover': {
        backgroundColor: "#efefef",
    },
}

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
function downloadMapAsSVG() {
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

const Links = () => {
    return (
        <Flex justifyContent="center">
            <Box width={1 / 2} p={1}>
                <Flex justifyContent="flex-end">
                    <Box>
                        <Button m={1} onClick={downloadMapAsSVG} sx={buttonStyle}>
                            <Image src="/images/mat-download-icon.svg" height={iconSize} width={iconSize}/>
                            <Text pt={1}>Save</Text>
                        </Button>
                    </Box>
                </Flex>
            </Box>

            <Box width={1 / 2} p={1}>
                <Flex justifyContent="flex-start">
                    <Box>
                        <Button m={1} sx={buttonStyle}
                                onClick={() => window.open('https://github.com/jackbreurkes/millions', "_blank")}>
                            <Image src="/images/github-logo.svg" height={iconSize} width={iconSize}/>
                            <Text pt={1}>GitHub</Text>
                        </Button>
                    </Box>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Links