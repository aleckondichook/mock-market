import type { NextApiRequest, NextApiResponse  } from "next";
import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {

  const { firstName, lastName, email, password: rawPassword } = JSON.parse(req.body)

  const salt = await bcrypt.genSalt()
  const password = await bcrypt.hash(rawPassword, salt)

  try {
    await prisma.trader.create({
      data: {
        firstName,
        lastName,
        email,
        password
      }
    })
    return res.status(200).json({ result: "success" })
  }
  catch(e) {
    console.log('whoops', e)
    return res.status(500).json({ result: "failure" })
  }
}