import { NextResponse, NextRequest } from 'next/server'
import countries from '../lib/countries.json'

const CURRENCY_CODE_PARAM = 'currency' // same as in AmountInput.tsx

// TODO get middleware working (leave for a different commit maybe?)
export async function middleware(req: NextRequest) {
    const { nextUrl: url, geo } = req
    if (url.pathname !== '/' || url.searchParams.has(CURRENCY_CODE_PARAM)) {
        return NextResponse.next()
    }

    const countryCodeA2 = geo?.country || 'US'
    const countryInfo = countries.find((x) => x.cca2 === countryCodeA2)

    if (countryInfo === undefined) {
        return NextResponse.next()
    }

    const currencyCode = Object.keys(countryInfo.currencies)[0]
    url.searchParams.set(CURRENCY_CODE_PARAM, "NZD") // TODO un-hardcode
    console.log(url.href)
    return NextResponse.rewrite(url.href)
}