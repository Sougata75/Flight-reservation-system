import { CapacityType } from "@/typescript/interfaces/interface.props"
import { Progress } from "../ui/progress";


function CapacitYProgress({booked,capacity}: CapacityType) {
   const loadPercentage = capacity > 0 ? Math.round((booked / capacity) * 100) : 0;

  return (
    <div className="w-full min-w-30 ">
      <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
        <span className="text-slate-800">{loadPercentage}%</span>
        <span className="text-slate-400 font-medium">{booked}/{capacity}</span>
      </div>
      
      <Progress value={loadPercentage} className="h-1.5 w-35 bg-slate-100" />
    </div>
  )
}

export default CapacitYProgress