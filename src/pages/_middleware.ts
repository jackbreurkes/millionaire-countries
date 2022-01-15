import { NextResponse, NextRequest } from 'next/server'

const COUNTRY_CODE_PARAM = 'ephemeral' // ephemeral country (named as such to avoid confusing users)

// TODO get middleware working (leave for a different commit maybe?)
export async function middleware(req: NextRequest) {
    const { nextUrl: url, geo } = req
    if (url.pathname !== '/') {
        return NextResponse.next()
    }

    const countryCodeA2 = geo?.country
    if (countryCodeA2 === undefined) {
        return NextResponse.next()
    }

    // without this we get an infinite redirect loop
    if (url.searchParams.get(COUNTRY_CODE_PARAM) === countryCodeA2) {
        return NextResponse.next()
    }

    url.searchParams.set(COUNTRY_CODE_PARAM, countryCodeA2)
    return NextResponse.redirect(url)
}