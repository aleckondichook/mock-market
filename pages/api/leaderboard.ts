import { prisma } from "../../lib/prisma"
import type { NextApiRequest, NextApiResponse  } from "next"
import { TradeData } from "../../interfaces"

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const trades = await prisma.trade.findMany({})
    const traders = await prisma.trader.findMany({})
    return res.status(200).json({ trades, traders })
  }
  catch (e) {
    console.log('whoops', e)
    return res.status(500).json({ result: "failure" })
  }

}