import fx from "money";
import {demoCountriesDate, demoRatesDate, demoRatesRes, demoRestCountriesRes} from "./demo-data";
import axios from "axios";

// https://en.wikipedia.org/wiki/ISO_4217#National_currencies

interface BaseCountry {
    name: { common: string };
    cca2: string; // two-letter country code
    cca3: string; // three-letter country code
}

interface APICountry extends BaseCountry {
    currencies: {[code: string]: {name: string, symbol: string} };
}

export interface RatesDetails {
    base: string;
    rates: { [countryCodeA3: string]: number };
}

export interface InternalCountry extends BaseCountry {
    currencies: ICurrency[];
}

export interface ICurrency {
    code: string;
    name: string;
    symbol: string;
}

export interface CountryMap {
    [countryCodeA2: string]: InternalCountry;
}

export function convertAmount(
    amount: number,
    from: string,
    to: string
): number {
    return fx.convert(amount, {
        from,
        to,
    });
}

export async function getCountries(): Promise<APICountry[]> {
    const res = await axios.get(
        `https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies`
    )
        .catch(() => {
            console.warn(`Could not access countries API, using response cached at ${demoCountriesDate}`);
            return { data: demoRestCountriesRes }
        });
    return res.data;
}

export async function getExchangeRates(): Promise<RatesDetails> {
    const res = await axios.get(
        `https://openexchangerates.org/api/latest.json?app_id=${process.env.RATES_KEY}`
    )
        .catch(() => {
            console.warn(`Could not access exchange rates API, using response cached at ${demoRatesDate}`);
            return {data: demoRatesRes};
        });
    return res.data;
}

export function getCountryMap(countries: APICountry[], rates: RatesDetails) {
    let countriesToCurrencies: CountryMap = {};
    countries.reduce((accumulator, country) => {
        let apiCurrencies = country.currencies;
        let currencies: ICurrency[] = Object.keys(apiCurrencies).map(code => ({code, ...apiCurrencies[code]}));
        currencies = currencies.filter((currency) => rates.rates[currency.code] !== undefined);
        accumulator[country.cca2] = { ...country, currencies }
        return accumulator
    }, countriesToCurrencies);

    return countriesToCurrencies;
}

/**
 * initialises the global state of money.js
 */
export function initMoneyJS(rates: RatesDetails) {
    fx.rates = rates.rates;
    fx.base = rates.base;
}
