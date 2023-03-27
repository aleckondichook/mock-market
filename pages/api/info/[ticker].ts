import type { NextApiRequest, NextApiResponse } from "next"

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  
  const { query } = req

  try {
    return fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${query.ticker?.toString().toUpperCase()}&metric=all&token=${process.env.FINNHUB_TOKEN}`)
      .then((response) => response.json())
      .then((data) => {
        if(!data.series?.annual?.bookValue) {
          return res.status(200).json({ result: "failure" })
        }
        else {
          return res.status(200).json({ 
            high: data["metric"]["52WeekHigh"],
            low: data["metric"]["52WeekLow"],
            marketCap: data["metric"]["marketCapitalization"],
            peRatio: data["metric"]["peExclExtraTTM"],
            dividend: data["metric"]["dividendYield5Y"]
          })
        }
      })
  }
  catch(e) {
    console.log('whoops', e)
    return res.status(500).json({ result: "failure"})
  }

}