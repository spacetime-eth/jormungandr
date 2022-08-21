import type { AppProps } from 'next/app'
import "../public/reset.css"

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
