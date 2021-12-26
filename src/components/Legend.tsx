import React from "react";
import styled from "styled-components";

const FlexContainer = styled.div`
  position: fixed;
  bottom: 0;
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
        <FlexContainer>
            <FlexContent>
                <FlexImg src="/RedGradientLegend.png" alt="Gradient for amounts below one million"/>
            </FlexContent>
            <FlexContent>
                <FlexImg src="/GreenGradientLegend.png" alt="Gradient for amounts over one million"/>
            </FlexContent>
        </FlexContainer>
    );
};

export default Legend;
