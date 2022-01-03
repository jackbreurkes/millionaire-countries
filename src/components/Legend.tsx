import React from "react";
import Image from "next/image";
import {Box, Flex} from "rebass";

const sizeMultiplier = 0.4;
const gradientWidth = 992 * sizeMultiplier;
const gradientHeight = 100 * sizeMultiplier;

const Legend = () => {
    return (
        <Flex justifyContent="center" flexWrap='wrap'>
            <Box width={[1, 1 / 2]} maxWidth={gradientWidth} px={2}>
                <Image src="/images/RedGradientLegend.png" width={gradientWidth} height={gradientHeight}/>
            </Box>
            <Box width={[1, 1 / 2]} maxWidth={gradientWidth} px={2}>
                <Image src="/images/GreenGradientLegend.png" width={gradientWidth} height={gradientHeight}/>
            </Box>
        </Flex>
    );
};

export default Legend;
