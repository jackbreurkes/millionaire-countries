import {connect} from "react-redux";
import {convertAmount, CountryCurrenciesMap} from "../services/conversion.service";

interface PropsFromState {
    amount: number;
    baseCurrency: string;
}

const InfoPane = ({
    countryCurrencies,
    amount,
    baseCurrency
}: { countryCurrencies: CountryCurrenciesMap; } & PropsFromState) => {

    // let millionaireCount = 0;
    // Object.values(countryCurrencies).forEach(currencies => {
    //     const maxWealthInGeo = Math.max(...currencies.map(
    //         (currency) => convertAmount(amount, baseCurrency, currency.code)
    //     ));
    //     if (maxWealthInGeo >= 1e6) {
    //         millionaireCount += 1;
    //     }
    // })

    let millionaireCountries = Object.entries(countryCurrencies)
        .map(([countryCode, currencies]) => {
            const millionaireCurrencies = currencies.filter(currency => convertAmount(amount, baseCurrency, currency.code) > 1e6)
            return [countryCode, millionaireCurrencies]
        }).filter(([countryCode, countryCurrencies]) => {
            return countryCurrencies.length > 0
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

    const millionaireCountryList = millionaireCountries.map(([countryCode, currencies]) => {
        return (
            <>
                <p></p>
                <li>

                </li>
            </>
        )
    })

    return (
        <>
            <h1>{countMessage}</h1>
        </>
    )
}

const mapStateToProps = (state: any): PropsFromState => {
    const { amount, baseCurrency } = state;
    return { amount, baseCurrency };
};

export default connect(mapStateToProps)(InfoPane)