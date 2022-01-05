import React from "react";
import Image from "next/image";
import {Box, Button, Flex, Text} from "rebass";
import {downloadMapAsSVG} from "./MapChart";

const buttonFontSize = 1;
const iconSize = 18;
const buttonBoxWidth = 132;

const buttonStyle = {
    color: "black",
    backgroundColor: "white",
    padding: "6px 0",
    width: "56px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: 6,
    ':hover': {
        backgroundColor: "#efefef",
    },
}

const sizeMultiplier = 0.4;
const gradientWidth = 992 * sizeMultiplier;
const gradientHeight = 100 * sizeMultiplier;

const LegendAndLinks = () => {
    return (
        <Flex justifyContent="center" alignItems="center">

            <Box width={buttonBoxWidth} flexShrink={10} />

            <Box maxWidth={gradientWidth * 2 + 10}>
                <Flex justifyContent="center" flexWrap='wrap'>
                    <Box width={[1, 1 / 2]} maxWidth={gradientWidth} px={2}>
                        <Image src="/images/RedGradientLegend.png"
                               alt="red color for less than a million"
                               width={gradientWidth}
                               height={gradientHeight}/>
                    </Box>
                    <Box width={[1, 1 / 2]} maxWidth={gradientWidth} px={2}>
                        <Image src="/images/GreenGradientLegend.png"
                               alt="green color for more than a million"
                               width={gradientWidth}
                               height={gradientHeight}/>
                    </Box>
                </Flex>
            </Box>

            <Box minWidth={buttonBoxWidth}>
                <Button onClick={downloadMapAsSVG} sx={buttonStyle}>
                    <Image src="/images/mat-download-icon.svg" alt="download icon" height={iconSize}
                           width={iconSize}/>
                    <Text fontSize={buttonFontSize}>Save</Text>
                </Button>


                <Button ml={1} sx={buttonStyle}
                        onClick={() => window.open('https://github.com/jackbreurkes/millions', "_blank")}>
                    <Image src="/images/github-logo.svg" alt="GitHub logo" height={iconSize} width={iconSize}/>
                    <Text fontSize={buttonFontSize}>GitHub</Text>
                </Button>
            </Box>

        </Flex>
    );
};

export default LegendAndLinks;
