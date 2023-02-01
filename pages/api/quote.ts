import type { NextApiRequest, NextApiResponse  } from "next";
import type { User } from "../../interfaces"

const users: User[] = [{ id: 1 }, { id: 2 }, { id: 3 }]

export default function Handler(req: NextApiRequest, res: NextApiResponse) {

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
  
  // fetch('https://finnhub.io/api/v1/quote?symbol=ZM&token=cf6ti3qad3i6ivmktfg0cf6ti3qad3i6ivmktfgg')
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data)
  //     return res.status(200).json(data)
  //   })
  
  
  
}