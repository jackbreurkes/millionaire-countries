# Where am I a millionaire? app

A simple app to show you which countries you would be a millionaire in in the local currency.

## Disclaimer

No guarantees are made that any information used in this app is accurate. It is just a fun project.

## Tech stack packages, and APIs

- React
- TypeScript
- yarn
- [Next.js](https://nextjs.org/) (for server side rendering)
- [react-simple-maps](https://www.react-simple-maps.io/) (for the map)
- [money](https://www.npmjs.com/package/money) (for simple currency conversions)
- [color](https://www.npmjs.com/package/color) (for color conversions and calculations)
- [Rebass](https://rebassjs.org/) (for styling)
- [styled-components](https://styled-components.com/) (for styling)
- [firebase](https://firebase.google.com/)
- Country data from [REST Countries](https://restcountries.com/) (`https://restcountries.com/v3.1/all?fields=name,cca2,cca3,currencies`)
- Exchange rate data from [Open Exchange Rates](https://openexchangerates.org/)
- Deployed on [Vercel](https://vercel.com/)

## Some lessons I learned

Redux has great [TS bindings](https://redux.js.org/usage/usage-with-typescript), particularly the [`ConnectedProps`](https://redux.js.org/usage/usage-with-typescript) type which allows you to type your component props without creating a separate `PropsFromState` for each one.

**GDPR is hard to get right for hobby projects**; I had to make sure that hosting platforms and APIs would not collect user data. I ended up writing my own basic view count code because other analytics frameworks would have required users to accept a privacy policy.

I learned a lot about **static generation with Next.js**; my primary motivation for using incremental static generation was to avoid hitting the exchange rates API for every request without having to write my own code to cache the response (Next.js handles it for me). Along the way I learned a lot about how to make my code compatible as well as the intricacies of hydration and how to ensure the correct code runs in the correct places (e.g. having code only run client-side using useEffect).

**Sometimes, the data served by an API is more stable than the API itself**. When I started this project I was using restcountries.eu, which changed its location to restcountries.com by the end. The data it served—country names, codes and currencies—are stable, making it safer for me to save the response as a JSON file than to repeat the request each time (also helps if the API goes down temporarily). This also propted me to provide a fallback set of exchange rates in case openexchangerates.org goes down.

Next.js 12 introduced middleware, which allowed me to estimate the user's country based on their IP address (without needing to request location permissions). Automatically selecting a currency based on the user's country made for a **more personal experience**, so I felt that the time investment was worth it.

Next.js doesn't allow you to use `getStaticProps` and `getServerSideProps` for the same component. This was problematic, since I needed to use static props to cache the API response but middleware responses are accessible in `getServerSideProps`. I ended up adding the **country code as a query parameter** to the URL to avoid this issue. I named this param `ephemeral` to show that it would not be persisted between page loads (e.g. when sending the URL to their friends).
