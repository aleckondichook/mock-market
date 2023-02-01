import { prisma } from "../../../lib/prisma"
import type { NextApiRequest, NextApiResponse  } from "next"

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {

  // const { ticker, amount, price, direction, filledAt, traderId } = req.body

  try {
    await prisma.trade.create({
      data: { ...req.body }
    })
    res.status(200).json({message: 'trade filled'})
  }
  catch (e) {
    console.log('error')
  }

  // await prisma.test.create({
  //   data: {
  //     name: "jacob jingleheimer"
  //   }
  // })
  // res.status(200).json({message: "success"})

}