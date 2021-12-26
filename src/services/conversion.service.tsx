import fx from "money";
import {demoFixerRes, demoRestCountriesRes} from "./demo-data";

// https://en.wikipedia.org/wiki/ISO_4217#National_currencies

const FIXER_API_KEY = "7765dac57cf1c67f6802d3b351a928cc";
const EUR_CURRENCY_CODE = "EUR";

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


// TODO split getting response from restructuring to avoid awaiting both at once
// although... does it even matter if its all SSR'd?
export async function getCountryMap(rates: RatesDetails) {
    // const {data}: { data: APICountry[] } = await axios.get(
    //     `https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies`
    // );
    await new Promise(resolve => setTimeout(resolve, 500));  // TODO remove
    // @ts-ignore
    const data: APICountry[] = demoRestCountriesRes; // TODO remove, go back to API

    let countriesToCurrencies: CountryMap = {};
    data.reduce((accumulator, country) => {
        let apiCurrencies = country.currencies;
        let currencies: ICurrency[] = Object.keys(apiCurrencies).map(code => ({code, ...apiCurrencies[code]}));
        currencies = currencies.filter((currency) => rates.rates[currency.code] !== undefined);
        accumulator[country.cca2] = { ...country, currencies }
        return accumulator
    }, countriesToCurrencies);

    return countriesToCurrencies;
}

export async function getExchangeRates(): Promise<RatesDetails> {
    // const res = await axios.get(
    //     `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`
    // ); // TODO maybe use openexchangerates.org since I get 1000 requests per month

    await new Promise(resolve => setTimeout(resolve, 500)); // TODO remove
    const rates = demoFixerRes; // TODO remove
    initMoneyJS(rates);
    return rates;
}

export function initMoneyJS(rates: RatesDetails) {
    fx.rates = rates.rates;
    fx.base = rates.base;
}
