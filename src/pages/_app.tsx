import type { AppProps } from 'next/app'
import { createGlobalStyle } from "styled-components";
import {Provider} from "react-redux";
import store from "../app/store";
import Head from "next/head";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  }
`

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Where am I a millionaire?</title>

                {/* from https://uxwing.com/planet-icon/ */}
                <link rel="shortcut icon" href="/images/planet.svg" />

                <meta
                    name="description"
                    content="Find out the countries in which you have over one million of the local currency."
                />
            </Head>
            <GlobalStyle />
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </>)
}

export default MyApp