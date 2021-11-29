import {convertAmount, CountryCurrenciesMap, ICurrency} from "../services/conversion.service";

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

export const getGeoStyle = (
    geo: IGeography, currencies: ICurrency[], amount: number, baseCurrency: string
): IGeoStyle => {
    const baseStyle = {
        fill: "#D6D6DA",
        outline: "none",
    };

    if (currencies === undefined || currencies.length === 0) {
        console.warn(
            `no exchange rates found for ${geo.properties.NAME_LONG}`
        );
    } else {
        const maxWealthInGeo = Math.max(...currencies.map(
            (currency) => convertAmount(amount, baseCurrency, currency.code)
        ));
        const r = maxWealthInGeo < 1e6 ? subMillionR(maxWealthInGeo) : overMillionR(maxWealthInGeo)
        const g = maxWealthInGeo < 1e6 ? subMillionG(maxWealthInGeo) : overMillionG(maxWealthInGeo)
        const b = maxWealthInGeo < 1e6 ? subMillionB(maxWealthInGeo) : overMillionB(maxWealthInGeo)
        baseStyle.fill = `rgb(${r}, ${g}, ${b})`
    }

    return baseStyle
}

/**
 * Generates a function that takes a range and maps it onto a new range
 * e.g. mapping a number between 0 to 1000000 to a range from 25 to 90
 * Numbers outside the expected range are clamped to the range
 * https://stackoverflow.com/questions/5731863/mapping-a-numeric-range-onto-another
 * @param startOriginal
 * @param endOriginal
 * @param startNew
 * @param endNew
 */
const genRangeTransformer = (
    startOriginal: number, endOriginal: number, startNew: number, endNew: number
): (original: number) => number => {
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

const subMillionR = genRangeTransformer(0, 1e6, 128, 255)
const subMillionG = genRangeTransformer(0, 1e6, 0, 204)
const subMillionB = subMillionG

const overMillionR = genRangeTransformer(1e6, 1e7, 204, 0)
const overMillionG = genRangeTransformer(1e6, 1e7, 255, 128)
const overMillionB = overMillionR