import { AppProps } from "next/app"
import { useEffect, useState } from "react"
import Layout from "./components/Layout"
import Head from "next/head"
import "../styles/global.css"



function MyApp({ Component, pageProps }: AppProps) {

  const [isDesktop, setIsDesktop] = useState<boolean>(true)

  useEffect(() => {
    updateDimensions()

    window.addEventListener("resize", updateDimensions)
  
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  function updateDimensions() {
    if(window.innerWidth > 1024) {
      setIsDesktop(true)
    }
    else {
      setIsDesktop(false)
    }
  }

  return (
    isDesktop ? 
    <>
      <Head>
        <title>Mock Market</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </> : 
    <>
      <Head>
        <title>Mock Market</title>
      </Head>
      <Layout>
        <div className="flex flex-1">
          <div className="mx-auto font-german text-[30px] mt-36">please use desktop</div>
        </div>
      </Layout>
    </>
  )
}

export default MyApp