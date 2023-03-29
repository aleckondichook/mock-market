import { TradeData, HoldingsData } from "../interfaces"

const useDashboard = (trades: TradeData[]) => {

  let dateArray: string[] = []
  const initialValue: number = 0
  const tradeArray: string[] = []
  const timestamps: number[] = []
  const intervalTimestamps: number[] = []
  const tradeArrayArray: TradeData[][] = []
  
  if(trades) {
    trades.forEach((trade: TradeData) => {
      return timestamps.push(new Date(trade.filledAt).getTime())
    })
  }
  const interval = (timestamps[timestamps.length - 1] - timestamps[0]) / 11
  for(let i = timestamps[0]; i < timestamps[timestamps.length - 1]; i += interval) {
    intervalTimestamps.push(i)
    let tempDate = new Date(i)
    dateArray.push(`${tempDate.getMonth() + 1}/${tempDate.getDate()}`)
  }
  
  if(trades) {
    trades.forEach((trade) => {
      return tradeArray.push(trade.ticker)
    })
  }

  const tickers: string[] = Array.from(new Set(tradeArray))
  const holdings: HoldingsData[] = []
  tickers.forEach((ticker) => {
    let temp: number = 0
    for(let trade of trades) {
      if(trade.ticker.toUpperCase() === ticker.toUpperCase()) {
        if(trade.direction === "BUY") {
          temp += trade.amount
        }
        else {
          temp -= trade.amount
        }
      }
    }
    holdings.push({
      ticker: ticker,
      amount: temp
    })
  })

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
  
  let portfolioValue: number[] = []
  let pvAcc: number = 0
  tradeArrayArray.map((interval) => {
    pvAcc += interval.reduce((acc, val) => {
      if(val.direction === "BUY") {
        return acc + (val.amount * val.price)
      }
      else {
        return acc - (val.amount * val.price)
      }
    }, initialValue)
    portfolioValue.push(pvAcc)
  })

  if(dateArray[0] === dateArray[dateArray.length - 1]) {
    dateArray = ["", "", "", "", "", dateArray[0], "", "", "", "", ""]
  }

  if(trades.length == 1) {
    dateArray = ["", "", "", "", "", `${new Date(trades[0].filledAt).getMonth() + 1}/${new Date(trades[0].filledAt).getDate()}`, "", "", "", "", ""]
    portfolioValue = [0, trades[0].amount * trades[0].price]
  }

  return {
    labels: dateArray,
    dataset: portfolioValue,
    holdings: holdings
  }

}

export default useDashboard