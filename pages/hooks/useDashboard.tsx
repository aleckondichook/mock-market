import { TradeData } from "../../interfaces"

const useDashboard = (trades: TradeData[]) => {

  const dateArray: string[] = []
  const initialValue: number = 0
  const tradeArray: string[] = []
  const timestamps: number[] = []
  const intervalTimestamps: number[] = []
  const tradeArrayArray: TradeData[][] = []
  
  
  
  trades.forEach((trade: TradeData) => {
    return timestamps.push(new Date(trade.filledAt).getTime())
  })
  const interval = (timestamps[timestamps.length - 1] - timestamps[0]) / 11
  for(let i = timestamps[0]; i < timestamps[timestamps.length - 1]; i += interval) {
    intervalTimestamps.push(i)
    let tempDate = new Date(i)
    dateArray.push(`${tempDate.getMonth() + 1}/${tempDate.getDate()}`)
  }
  

  trades.forEach((trade) => {
    return tradeArray.push(trade.ticker)
  })
  const tickers = Array.from(new Set(tradeArray))

  for(let i = 0; i < intervalTimestamps.length; i++) {
    let tempTrades: TradeData[] = []
    trades.forEach((trade) => {
      if(!intervalTimestamps[i+1]) {
        if(new Date(trade.filledAt).getTime() >= intervalTimestamps[i]) {
          tempTrades.push(trade)
        }
      }
      else {
        if(new Date(trade.filledAt).getTime() >= intervalTimestamps[i] && new Date(trade.filledAt).getTime() < intervalTimestamps[i + 1]) {
          tempTrades.push(trade)
        }
      }
    })
    tradeArrayArray.push(tempTrades)
  }

  const reduced = trades.reduce((acc, val) => {
    if(val.direction === "BUY") {
      return acc + (val.amount * val.price)
    }
    else {
      return acc - (val.amount * val.price)
    }
  }, initialValue)



  
  console.log(tradeArrayArray)
  console.log(dateArray)


  return {
    labels: dateArray
  }

}

export default useDashboard