import React, { useState } from "react";
import { connect } from "react-redux";
import { setAmount, setCurrency } from "../app/store";
import fx from "money";
import { Select, Input } from "@rebass/forms"
import {Box, Button, Flex} from "rebass";
import ReactDOM from "react-dom";

interface PropsFromState {
  amount: number;
  baseCurrency: string;
}

const fontSize = 2;

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

const AmountInput = (
  props: { setAmount?: any; setCurrency?: any } & PropsFromState
) => {
  const [amountInputValue, setAmountInputValue] = useState(
    props.amount ? props.amount.toString() : ""
  );
  const [currencyInputValue, setCurrencyInputValue] = useState(
    props.baseCurrency
  );

  const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInputValue(e.target.value);
    props.setAmount(e.target.value || null);
  };

  const updateCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyInputValue(e.target.value);
    props.setCurrency(e.target.value);
  };

  return (
    <Box pt={3}>
        <Flex>
            <Box mx='auto' />
            <Box width={75} mr={1}>
                <Select
                    id='currency'
                    name='currency'
                    fontSize={fontSize}
                    value={currencyInputValue}
                    // @ts-ignore
                    onChange={updateCurrency}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '6px',
                    }}
                >
                    {Object.keys(fx.rates).map((currency) => (
                        <option key={currency}>{currency}</option>
                    ))}
                </Select>
            </Box>
            <Box width={160}>
                <Input
                    id='amount'
                    name='amount'
                    type='number'
                    placeholder='amount'
                    fontSize={fontSize}
                    value={amountInputValue}
                    onChange={updateAmount}
                    sx={{
                        'background-color': 'white',
                        'border-radius': '6px'
                    }}
                />
            </Box>
            <Box mx='auto'>
                <Button onClick={downloadMapAsSVG}>
                    test
                </Button>
            </Box>
        </Flex>
    </Box>
  );
};

const mapStateToProps = (state: any): PropsFromState => {
  const { amount, baseCurrency } = state;
  return { amount, baseCurrency };
};

export default connect(mapStateToProps, { setAmount, setCurrency })(
  AmountInput
);
