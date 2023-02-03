import type { NextApiRequest, NextApiResponse  } from "next";

export default function Handler(req: NextApiRequest, res: NextApiResponse) {

  const { query } = req

  let fakeData = {
    c: 69.25,
    d: -1.72,
    dp: -2.4236,
    h: 71.84,
    l: 69.21,
    o: 70.79,
    pc: 70.97,
    t: 1674593628
  }
  return res.status(200).json(fakeData)
  
  // try {
  //   fetch(`https://finnhub.io/api/v1/quote?symbol=${query.ticker}&token=${process.env.FINNHUB_TOKEN}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       return res.status(200).json(data)
  //   })
  // }
  // catch(e) {
  //   console.log('whoops', e)
  //   return res.status(500).json({ result: "failure" })
  // }
}