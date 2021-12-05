import {connect} from "react-redux";
import {convertAmount, CountryMap, InternalCountry} from "../services/conversion.service";

interface PropsFromState {
    threshold: number,
    amount: number;
    baseCurrency: string;
}

const InfoPane = ({
    countries,
    threshold,
    amount,
    baseCurrency
}: { countries: CountryMap; } & PropsFromState) => {

    let millionaireCountries = Object.entries(countries)
        .map(([countryCode, country]) => {
            const millionaireCurrencies = country.currencies.filter(
                currency => convertAmount(amount, baseCurrency, currency.code) > threshold
            )
            return [
                countryCode,
                {...country, currencies: millionaireCurrencies}
            ] as [string, InternalCountry] // needs to be explicitly typed otherwise the type is thought to be (string, InternalCurrency)[]
        }).filter(([_, country]) => {
            return country.currencies.length > 0
        })
    const millionaireCount = millionaireCountries.length

    let countMessage: string;
    if (millionaireCount === 0) {
        countMessage = "You aren't a millionaire anywhere!"
    } else if (millionaireCount === 1) {
        countMessage = "You're a millionaire in 1 country"
    } else {
        countMessage = `You're a millionaire in ${millionaireCount} countries`
    }

    const millionaireCountryList = millionaireCountries.map(([countryCode, country]) => {
        return (
            <div key={countryCode}>
                <h3>{country.name.common}</h3>
                <ul>
                    {country.currencies.map(currency => (<li key={currency.code}>{currency.name}</li>))}
                </ul>
            </div>
        )
    })

    return (
        <>
            <h1>{countMessage}</h1>
            {millionaireCountryList}
        </>
    )
}

const mapStateToProps = (state: any): PropsFromState => {
    const { threshold, amount, baseCurrency } = state;
    return { threshold, amount, baseCurrency };
};

export default connect(mapStateToProps)(InfoPane)