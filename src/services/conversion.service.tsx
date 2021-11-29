import axios from "axios";
import fx from "money";

// https://en.wikipedia.org/wiki/ISO_4217#National_currencies

const FIXER_API_KEY = "7765dac57cf1c67f6802d3b351a928cc";

interface APICountry {
    name: { common: string };
    cca2: string; // two-letter country code
    cca3: string; // three-letter country code
    currencies: {[code: string]: {name: string, symbol: string} };
}

export interface ICurrency {
    code: string;
    name: string;
    symbol: string;
}

export interface CountryCurrenciesMap {
    [countryCodeA2: string]: ICurrency[];
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

export async function getCountriesToCurrenciesMap() {
    const {data}: { data: APICountry[] } = await axios.get(
        `https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies`
    );
    const rates = await getRatesFromEuros();

    let countriesToCurrencies: CountryCurrenciesMap = {};
    data.reduce((accumulator, country) => {
        let apiCurrencies = country.currencies
        let currencies: ICurrency[] = Object.keys(apiCurrencies).map(code => ({code, ...apiCurrencies[code]}))
        currencies = currencies.filter((currency) => rates[currency.code] !== undefined);
        accumulator[country.cca2] = currencies
        return accumulator;
    }, countriesToCurrencies);

    return countriesToCurrencies;
}

export async function getRatesFromEuros(): Promise<{
    [country: string]: number;
}> {
    const res = await axios.get(
        `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`
    );
    fx.rates = res.data.rates;
    fx.base = res.data.base;
    return res.data.rates;
}
