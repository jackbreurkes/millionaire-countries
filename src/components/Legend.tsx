import React from "react";
import styled from "styled-components";
import Image from "next/image";
import {Box, Flex} from "rebass";

const Legend = () => {
    return (
        <Flex justifyContent="center">
            <Box width={1 / 2} maxWidth={400} px={2}>
                <Image src="/images/RedGradientLegend.png" width={992} height={100}/>
            </Box>
            <Box width={1 / 2} maxWidth={400} px={2}>
                <Image src="/images/GreenGradientLegend.png" width={992} height={100}/>
            </Box>
        </Flex>
    );
};

export default Legend;
