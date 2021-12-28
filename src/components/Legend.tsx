import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Box } from "rebass";

const FlexContainer = styled.div`
  position: fixed;
  bottom: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Legend = () => {
    return (
        <FlexContainer>
            <Box width={1 / 2} maxWidth={400} px={2}>
                <Image src="/images/RedGradientLegend.png" width={992} height={100}/>
            </Box>
            <Box width={1 / 2} maxWidth={400} px={2}>
                <Image src="/images/GreenGradientLegend.png" width={992} height={100}/>
            </Box>
        </FlexContainer>
    );
};

export default Legend;
