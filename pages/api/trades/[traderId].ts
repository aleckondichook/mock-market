import { prisma } from "../../../lib/prisma"
import type { NextApiRequest, NextApiResponse  } from "next";

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    
  try {
    const { query } = req
    const traderId = query.traderId
    return prisma.trade.findMany({
      where: { traderId: `${traderId}` }
    }).then((response) => {
      return res.status(200).json(response)
    })
    
  }
  catch(e) {
    console.log('whoops', e)
    return res.status(500).json({ result: "failure" })
  }
}