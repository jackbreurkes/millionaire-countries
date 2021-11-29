import React from "react";
import greenGradientLegend from "../assets/GreenGradientLegend.png"
import redGradientLegend from "../assets/RedGradientLegend.png"
import styled from "styled-components";

const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const FlexContent = styled.div`
  padding: 10px;
`

const FlexImg = styled.img`
  width: 100%;
  max-height: 40px;
`

const Legend = () => {
    return (
        <>
            <FlexContainer>
                <FlexContent>
                    <FlexImg src={redGradientLegend} alt="Gradient for amounts below one million"/>
                </FlexContent>
                <FlexContent>
                    <FlexImg src={greenGradientLegend} alt="Gradient for amounts over one million"/>
                </FlexContent>
            </FlexContainer>
        </>
    );
};

export default Legend;
