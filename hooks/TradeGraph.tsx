import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"


export default function TradeGraph(data: {"data": any}) {
  
  const [dayToggle, setDayToggle] = useState<boolean>(false)
  const [weekToggle, setWeekToggle] = useState<boolean>(false)
  const [monthToggle, setMonthToggle] = useState<boolean>(false)
  const [yearToggle, setYearToggle] = useState<boolean>(true)
  const [yearMonths, setYearMonths] = useState<string[]>(getYearMonths())
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
  )

  const dayInMilliseconds: number = 86400000

  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: getBorderColor() ? "rgba(73, 233, 23, 1)" : "rgba(255,3,3,1)",
        fill: "start",
        backgroundColor: getBackgroundColor() ? "rgba(49, 148, 18, 0.3)" : "rgba(255,3,3,0.3)"
      },
      point: {
        radius: 0,
        hitRadius: 0
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: getLabelSize()
          }
        }
      },
      y: {
        ticks: {
          min: getMinTick(),
          max: getMaxTick(),
          stepSize: getStepSize(),
          font: {
            size: 16
          }
        }
      }
    }    
  }
  
  const candleData = {
    labels: getTimeframe(),
    datasets: [
      {
        data: getDataset()
      }
    ]
  }

  function getStepSize() {
    if(dayToggle) {
      return Math.round((Math.max(...data.data.day.c.slice(-14)) - Math.min(...data.data.day.c.slice(-14))) / 2) == 0 ? 10 : Math.round((Math.max(...data.data.day.c.slice(-14)) - Math.min(...data.data.day.c.slice(-14))) / 2)
    }
    if(weekToggle) {
      return Math.round((Math.max(...data.data.year.c.slice(-6)) - Math.min(...data.data.year.c.slice(-6))) / 2) == 0 ? 10 : Math.round((Math.max(...data.data.year.c.slice(-6)) - Math.min(...data.data.year.c.slice(-6))) / 2)
    }
    if(monthToggle) {
      return Math.round((Math.max(...data.data.year.c.slice(-23)) - Math.min(...data.data.year.c.slice(-23))) / 2) == 0 ? 10 :  Math.round((Math.max(...data.data.year.c.slice(-23)) - Math.min(...data.data.year.c.slice(-23))) / 2)
    }
    if(yearToggle) {
      return Math.round((Math.max(...data.data.year.c) - Math.min(...data.data.year.c)) / 2) == 0 ? 10 : Math.round((Math.max(...data.data.year.c) - Math.min(...data.data.year.c)) / 2)
    }
  }

  function getMinTick() {
    if(dayToggle) {
      return Math.min(...data.data.day.c.slice(-14))
    }
    if(weekToggle) {
      return Math.min(...data.data.year.c.slice(-6))
    }
    if(monthToggle) {
      return Math.min(...data.data.year.c.slice(-21))
    }
    if(yearToggle) {
      return Math.min(...data.data.year.c)
    }
  }

  function getMaxTick() {
    if(dayToggle) {
      return Math.max(...data.data.day.c.slice(-14))
    }
    if(weekToggle) {
      return Math.max(...data.data.year.c.slice(-6))
    }
    if(monthToggle) {
      return Math.max(...data.data.year.c.slice(-21))
    }
    if(yearToggle) {
      return Math.max(...data.data.year.c)
    }
  }

  function getDataset() {
    if(dayToggle) {
      return checkTimeOfDay()
    }
    if(weekToggle) {
      return data.data.year.c.slice(-6)
    }
    if(monthToggle) {
      return data.data.year.c.slice(-getMonthTimeframe().length)
    }
    if(yearToggle) {
      return data.data.year.c
    }
  }

  function checkTimeOfDay() {
    const rn = new Date(Date.now())
    if(rn.getHours() < 16 && rn.getHours() >= 9) {
      if(rn.getHours() == 9 && rn.getMinutes() < 30) {
        return data.data.day.c.slice(-14)
      }
      if(rn.getDay() == 0 || rn.getDay() == 6) {
        return data.data.day.c.slice(-14)
      }
      return getDayDataset()
    }
    return data.data.day.c.slice(-14)
  }
  
  function getDayDataset() {
    const rn = new Date(Date.now())
    let time = rn.getHours()
    if(rn.getMinutes() >= 30) {
      time = ((time - 9) * 2) + 1
    }
    else {
      time = (time - 9) * 2
    }
    return data.data.day.c.slice(-time)
  }

  function getBorderColor() {
    if(dayToggle) {
      return data.data.day.c[9] < data.data.day.c[data.data.day.c.length - 1]
    }
    if(weekToggle) {
      return data.data.year.c[245] < data.data.year.c[data.data.year.c.length - 1]
    }
    if(monthToggle) {
      return data.data.year.c[228] < data.data.year.c[data.data.year.c.length - 1]
    }
    if(yearToggle) {
      return data.data.year.c[0] < data.data.year.c[data.data.year.c.length - 1]
    }
  }

  function getBackgroundColor() {
    if(dayToggle) {
      return data.data.day.c[9] < data.data.day.c[data.data.day.c.length - 1]
    }
    if(weekToggle) {
      return data.data.year.c[245] < data.data.year.c[data.data.year.c.length - 1]
    }
    if(monthToggle) {
      return data.data.year.c[228] < data.data.year.c[data.data.year.c.length - 1]
    }
    if(yearToggle) {
      return data.data.year.c[0] < data.data.year.c[data.data.year.c.length - 1]
    }
  }

  function getLabelSize(): number {
    if(dayToggle) {
      return 12
    }
    if(yearToggle) {
      return 1
    }
    return 16
  }

  function getTimeframe() {
    if(dayToggle) {
      return ["9:30am", "10am", "10:30am", "11am", "11:30am", "12pm", "12:30pm", "1pm", "1:30pm", "2pm", "2:30pm", "3pm", "3:30pm", "4pm"]
    }
    if(weekToggle) {
      const dates = getWeekTimeframe()
      return dates
    }
    if(monthToggle) {
      const dates = getMonthTimeframe()
      return dates
    }
    if(yearToggle) {
      const months = getYearTimeframe()
      return months
    }
  }

  function getWeekTimeframe(): string[] {
    const dates: string[] = []
    const todayDate: Date = new Date(Date.now())
    const lastWeekDate: Date = new Date(Date.now() - (dayInMilliseconds * 7))
    let start: number = Date.parse(lastWeekDate.toString())
    while(start <= Date.parse(todayDate.toString())) {
      let tempDate = new Date(start)
      if(tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
        dates.push(`${tempDate.getMonth() + 1}/${tempDate.getDate()}`)
      }
      start += dayInMilliseconds
    }
    return dates
  }

  function getMonthTimeframe(): string[] {
    const dates: string[] = []
    const todayDate: Date = new Date(Date.now())
    const lastMonthDate: Date = new Date(Date.now() - (dayInMilliseconds * 30))
    let start: number = Date.parse(lastMonthDate.toString())
    while(start <= Date.parse(todayDate.toString())) {
      let tempDate = new Date(start)
      if(tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
        dates.push(`${tempDate.getMonth() + 1}/${tempDate.getDate()}`)
      }
      start += dayInMilliseconds
    }
    return dates
  }

  function getYearTimeframe(): (string | undefined)[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date(Date.now()).getMonth()
    const currentMonths = months.slice(currentMonth + 1, currentMonth + 13)
    const modifiedMonths = []
    for(let month of currentMonths) {
      for(let i = 0; i < 20; i++) {
        modifiedMonths.push('')
      }
      modifiedMonths.push(month)
    }
    while(modifiedMonths.length > data.data.year.c.length) {
      modifiedMonths.pop()
    }
    return modifiedMonths
  }

  function getYearMonths(): string[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date(Date.now()).getMonth()
    return months.slice(currentMonth + 1, currentMonth + 13)
  }

  function handleToggle(newToggle: string) {
    if(newToggle === "D") {
      setDayToggle(true)
      setWeekToggle(false)
      setMonthToggle(false)
      setYearToggle(false)
    }
    if(newToggle === "W") {
      setDayToggle(false)
      setWeekToggle(true)
      setMonthToggle(false)
      setYearToggle(false)
    }
    if(newToggle === "M") {
      setDayToggle(false)
      setWeekToggle(false)
      setMonthToggle(true)
      setYearToggle(false)
    }
    if(newToggle === "Y") {
      setDayToggle(false)
      setWeekToggle(false)
      setMonthToggle(false)
      setYearToggle(true)
    }
  }
  return (
    <div className="w-[50vw] h-[50vh] flex flex-col">
      <div className="flex flex-row self-end mr-20 border-black border-2 rounded-2xl">
        <div className={`w-14 py-1 text-center ${dayToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 rounded-l-xl cursor-pointer border-black border-r-2`} onClick={() => handleToggle("D")}>D</div>
        <div className={`w-14 py-1 text-center ${weekToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 cursor-pointer border-black border-r-2`} onClick={() => handleToggle("W")}>W</div>
        <div className={`w-14 py-1 text-center ${monthToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 cursor-pointer border-black border-r-2`} onClick={() => handleToggle("M")}>M</div>
        <div className={`w-14 py-1 text-center ${yearToggle ? "bg-slate-300" : "bg-white"} hover:bg-slate-400 rounded-r-xl cursor-pointer`} onClick={() => handleToggle("Y")}>Y</div>
      </div>
      <Line data={candleData} width={130} height={80} options={options}/>
      <div className="flex flex-row absolute bottom-[20%]">
        {
          yearToggle && yearMonths.map((month) => {
            return <span key={month} className="text-[#666666] ml-9 min-[1900px]:ml-10">{month}</span>
          })
        }
      </div>
    </div>
  )
}