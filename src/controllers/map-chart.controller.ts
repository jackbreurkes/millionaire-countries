import {convertAmount, ICurrency} from "../services/conversion.service";
import Color from "color";

export interface IGeography {
    geometry: any;
    properties: IGeographyProperties;
    rsmKey: string;
}

interface IGeographyProperties {
    ABBREV: string;
    CONTINENT: string;
    FORMAL_EN: string;
    GDP_MD_EST: number;
    GDP_YEAR: number;
    ISO_A2: string;
    ISO_A3: string;
    NAME: string;
    NAME_LONG: string;
    POP_EST: number;
    POP_RANK: number;
    POP_YEAR: number;
    REGION_UN: string;
    SUBREGION: string;
}

interface IGeoStyle {
    fill: string,
    outline: string
}

type RangeTransformer = (original: number) => number;

let subThresholdR: undefined | RangeTransformer;
let subThresholdG: undefined | RangeTransformer;
let subThresholdB: undefined | RangeTransformer;

let overThresholdR: undefined | RangeTransformer;
let overThresholdG: undefined | RangeTransformer;
let overThresholdB: undefined | RangeTransformer;

/**
 * Generates a function that takes a range and maps it onto a new range
 * e.g. mapping a number from 0 to 1000000 to a range from 25 to 90
 * Numbers outside the expected range are clamped to the range
 * https://stackoverflow.com/questions/5731863/mapping-a-numeric-range-onto-another
 * @param startOriginal
 * @param endOriginal
 * @param startNew
 * @param endNew
 */
export const genRangeTransformer = (
    startOriginal: number, endOriginal: number, startNew: number, endNew: number
): RangeTransformer => {
    const originalRangeSize = endOriginal - startOriginal
    const newRangeSize = endNew - startNew

    if (originalRangeSize === 0 || newRangeSize === 0) {
        throw Error("Cannot generate transformer for a range of size 0");
    }

    return (original) => {
        const minOriginal = Math.min(startOriginal, endOriginal)
        const maxOriginal = Math.max(startOriginal, endOriginal)
        original = Math.min(Math.max(original, minOriginal), maxOriginal)
        return startNew + (original - startOriginal) * (newRangeSize / originalRangeSize)
    }
}

export const getGeoStyle = (
    geo: IGeography, currencies: ICurrency[], amount: number | null, baseCurrency: string, threshold: number
): IGeoStyle => {
    const baseStyle = {
        fill: "#fff",
        outline: "none",
    };
    if (amount === null) {
        return baseStyle;
    }

    if (!subThresholdR) {
        subThresholdR = genRangeTransformer(0, threshold, 128, 255)
        subThresholdG = genRangeTransformer(0, threshold, 0, 204)
        subThresholdB = subThresholdG

        overThresholdR = genRangeTransformer(threshold, threshold * 10, 204, 0)
        overThresholdG = genRangeTransformer(threshold, threshold * 10, 255, 128)
        overThresholdB = overThresholdR
    }

    if (currencies === undefined || currencies.length === 0) {
        console.warn(
            `no exchange rates found for ${geo.properties.NAME_LONG}`
        ); // TODO move this somewhere else?
    } else {
        const maxWealthInGeo = Math.max(...currencies.map(
            (currency) => convertAmount(amount, baseCurrency, currency.code)
        ));
        const r = maxWealthInGeo < threshold ? subThresholdR(maxWealthInGeo) : overThresholdR!!(maxWealthInGeo)
        const g = maxWealthInGeo < threshold ? subThresholdG!!(maxWealthInGeo) : overThresholdG!!(maxWealthInGeo)
        const b = maxWealthInGeo < threshold ? subThresholdB!!(maxWealthInGeo) : overThresholdB!!(maxWealthInGeo)
        baseStyle.fill = Color.rgb(r, g, b).hex();
    }

    return baseStyle
}

/**
 * Returns the correct hover colour for a given colour
 * @param color the colour string to modify
 */
export function getHoverColour(color: string) {
    let newColor = Color(color);
    if (newColor.luminosity() > 0.999) { // if colour is white
        return "#dfdfdf";
    }
    return "#f1f1f1";
}
