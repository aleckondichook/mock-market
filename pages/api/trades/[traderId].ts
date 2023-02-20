import { prisma } from "../../../lib/prisma"
import type { NextApiRequest, NextApiResponse  } from "next";

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    
  try {
    const { query } = req
    const traderId = query.traderId
    const trades = await prisma.trade.findMany({
      where: { traderId: `${traderId}` }
    })
    return res.status(200).json(trades)
  }
  catch(e) {
    console.log('whoops', e)
    return res.status(500).json({ result: "failure" })
  }
}