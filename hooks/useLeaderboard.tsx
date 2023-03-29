import useDashboard from "./useDashboard"

const useLeaderboard = (data: any) => {

  const traderTrades: { trader: any; trades: any[] }[] = []
  const portfolioValues: any[] = []

  data.traders.forEach((trader: any) => {
    let tempTrades: any[] = []
    for(let trade of data.trades) {
      if(trade.traderId === trader.id) {
        tempTrades.push(trade)
      }
    }
    traderTrades.push({
      trader: trader,
      trades: tempTrades
    })
  })
  
  for(let i = 0; i < traderTrades.length; i++) {
    if(traderTrades[i].trades.length < 1) {
      portfolioValues.push({
        trader: traderTrades[i].trader,
        value: 0
      })
    }
    else {
      const dashboardData = useDashboard(traderTrades[i].trades)
      portfolioValues.push({
        trader: traderTrades[i].trader,
        value: dashboardData.dataset[dashboardData.dataset.length - 1]
      })
    }
  }

  return portfolioValues

}

export default useLeaderboard