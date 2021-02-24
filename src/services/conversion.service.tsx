import axios from "axios";
import fx from "money";

// https://en.wikipedia.org/wiki/ISO_4217#National_currencies

const FIXER_API_KEY = "7765dac57cf1c67f6802d3b351a928cc";

interface APICountry {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  currencies: APICurrency[];
}

export interface APICurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface CountryCurrenciesMap {
  [country: string]: APICurrency[];
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
  const { data }: { data: APICountry[] } = await axios.get(
    // `https://restcountries.eu/rest/v2/all`
    `https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;alpha3Code;currencies`
  );
  const rates = await getRatesFromEuros();

  let countriesToCurrencies: CountryCurrenciesMap = {};
  data.reduce((acc, country) => {
    acc[country.alpha2Code] = country.currencies
      .filter((currency) => currency.code)
      .map((currency) => ({
        ...currency,
        code: currency.code.endsWith("[G]")
          ? currency.code.slice(0, -3)
          : currency.code,
      }))
      .filter((currency) => rates[currency.code] !== undefined);
    return acc;
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
