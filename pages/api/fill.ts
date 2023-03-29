import { prisma } from "../../lib/prisma"
import type { NextApiRequest, NextApiResponse  } from "next"

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {

  const { trader, ticker, amount, price, direction } = req.body

  try {
    await prisma.trade.create({
      data: { 
        trader,
        ticker,
        amount,
        price,
        direction
      }
    })
    return res.status(200).json({message: 'trade filled'})
  }
  catch (e) {
    console.log('whoops', e)
    return res.status(500).json({ result: "failure" })
  }

}