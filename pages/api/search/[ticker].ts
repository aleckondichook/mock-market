import type { NextApiRequest, NextApiResponse } from "next"

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  
  const { query } = req

  try {
    return fetch(`https://finnhub.io/api/v1/quote?symbol=${query.ticker?.toString().toUpperCase()}&token=${process.env.FINNHUB_TOKEN}`)
      .then((response) => response.json())
      .then((data) => {
        if(!data.d) {
          return res.status(200).json({ exists: "no" })
        }
        else {
          return res.status(200).json({ exists: "yes" })
        }
      })
  }
  catch(e) {
    console.log('whoops', e)
    return res.status(500).json({ result: "failure"})
  }

}