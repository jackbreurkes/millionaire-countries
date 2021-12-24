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

export interface RatesMap { [countryCodeA3: string]: number }

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


export async function getCountryMap(ratesFromEuros: RatesMap) {
    // const {data}: { data: APICountry[] } = await axios.get(
    //     `https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies`
    // );
    await new Promise(resolve => setTimeout(resolve, 500));  // TODO remove
    // @ts-ignore
    const data: APICountry[] = demoRestCountriesRes; // TODO remove
    const rates = await getRatesFromEuros();
    // TODO use promise.all for above requests to speed things up

    let countriesToCurrencies: CountryMap = {};
    console.log(rates)
    data.reduce((accumulator, country) => {
        let apiCurrencies = country.currencies;
        let currencies: ICurrency[] = Object.keys(apiCurrencies).map(code => ({code, ...apiCurrencies[code]}));
        currencies = currencies.filter((currency) => rates[currency.code] !== undefined);
        accumulator[country.cca2] = { ...country, currencies }
        return accumulator
    }, countriesToCurrencies);

    return countriesToCurrencies;
}

export async function getRatesFromEuros(): Promise<RatesMap> {
    // const res = await axios.get(
    //     `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`
    // );

    await new Promise(resolve => setTimeout(resolve, 500)); // TODO remove
    const rates = demoFixerRes.data.rates; // TODO remove
    initMoneyJS(rates);
    return rates;
}

export function initMoneyJS(rates: RatesMap) {
    fx.rates = rates;
    fx.base = EUR_CURRENCY_CODE;
}
