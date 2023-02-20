import { AppProps } from "next/app"
import Layout from "./components/Layout"
import Head from "next/head"
import "../styles/global.css"



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mock Market</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp