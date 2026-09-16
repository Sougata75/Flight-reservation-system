import { useFlightFetch } from '@/hooks/useFlightData'
import { flightTable } from '@/services/json/flights.table'
import { Skeleton } from '../ui/skeleton'

import CapacitYProgress from './CapacitYProgress'
import { FileText, Pencil, Plane } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { openFlightData, paginationNext, paginationPrev, updateFlightOpen } from '@/store/slices/global.slice'

function ActiveFlights() {

    const dispatch = useAppDispatch();
    const {pagination} = useAppSelector((state)=> state.global);
    const {data:flightData, isLoading, isError} = useFlightFetch(pagination.currentPage,pagination.limitPerPage);

    const activeFlights = flightData?.filter((flight) => flight.status !== "Cancelled");

  return (
    <div className='w-full h-full flex flex-col overflow-x-auto pb-4'>
        {/* Table Header */}
        <div className='w-full flex justify-between border-b border-gray-200 pb-3 mb-3 min-w-350'>
            {flightTable.map((item) => (
                <div key={item} className='min-w-37.5 flex justify-between pl-4'>
                    <h2 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>{item}</h2>
                </div>
            ))}
        </div>

        {/* Table Body */}
        <div className='w-full flex flex-col h-[85%] py-2 min-w-350'>
            {isLoading ? (
                <div className='w-full h-full flex flex-col gap-4 justify-start mt-4'>
                    <Skeleton className='w-full h-12 bg-gray-300/60 rounded-md'></Skeleton>
                    <Skeleton className='w-full h-12 bg-gray-300/60 rounded-md'></Skeleton>
                    <Skeleton className='w-full h-12 bg-gray-300/60 rounded-md'></Skeleton>
                </div>
            ) : (
                <>
                {flightData?.map((item) => (
                    <div key={item.id} className='flex w-full justify-between items-center mt-1 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                        
                        {/* FLIGHT # */}
                        <div className='min-w-37.5 flex  flex-col pl-4'>
                            <h2 className='font-semibold text-gray-900'>{item.flight_number}</h2>
                            <span className="text-xs text-gray-400">{item.service_type}</span>
                        </div>
                        
                        <div className='w-px h-full bg-gray-300'></div>

                        {/* ROUTE */}
                        <div className='min-w-37.5 flex  items-center gap-2 text-gray-800 font-medium'>
                            <h2>{item.origin}</h2>
                            <Plane size={14} className="text-gray-400 rotate-45" />
                            <h2>{item.destination}</h2>
                        </div>

                        <div className='w-px h-full bg-gray-300'></div>
                        
                        {/* AIRCRAFT */}
                        <div className='min-w-37.5 flex  flex-col text-sm'>
                            <h2 className='text-gray-900'>{item.aircraft_model?.split(' ')[0] || 'Aircraft'}</h2>
                            <span className='text-gray-500'>{item.aircraft_model?.split(' ').slice(1).join(' ') || ''}</span>
                        </div>

                        <div className='w-px h-full bg-gray-300'></div>
                        
                        {/* STATUS */}
                        <div className='min-w-37.5 flex items-center gap-2'>
                            <span className={`h-2 w-2 rounded-full ${
                                item.status === 'On Time' ? 'bg-green-500' : 
                                item.status === 'Delayed' ? 'bg-orange-500' :
                                item.status === 'Cancelled'? 'bg-red-500':
                                'bg-blue-500'
                            }`}></span>
                            <h2 className='text-sm font-medium text-gray-700'>{item.status}</h2>
                        </div>

                        <div className='w-px h-full bg-gray-300'></div>
                        
                        {/* ECONOMY LOAD */}
                        <div className='min-w-37.5 flex  pr-4'>
                            <CapacitYProgress booked={item.eco_booked} capacity={item.eco_capacity} />
                        </div>

                        <div className='w-px h-full bg-gray-300'></div>
                        
                        {/* PRE-ECONOMY LOAD */}
                        <div className='min-w-37.5 flex  pr-4'>
                            <CapacitYProgress booked={item.pre_eco_booked} capacity={item.pre_eco_capacity} />
                        </div>

                        <div className='w-px h-full bg-gray-300'></div>
                        
                        {/* BUSINESS LOAD */}
                        <div className='min-w-37.5 flex  pr-4'>
                            <CapacitYProgress booked={item.biz_booked} capacity={item.biz_capacity} />
                        </div>

                        <div className='w-px h-full bg-gray-300'></div>
                        
                        {/* FIRST CLASS LOAD */}
                        <div className='min-w-37.5 flex  pr-4'>
                            <CapacitYProgress booked={item.first_class_booked} capacity={item.first_class_capacity} />
                        </div>

                        <div className='w-px h-full bg-gray-300'></div>
                        
                        {/* ACTIONS */}
                        <div className='min-w-37.5 flex  pl-5 gap-3 text-gray-400'>
                            <button onClick={()=> dispatch(updateFlightOpen(item))} className="hover:text-gray-900 transition-colors">
                                <Pencil size={18} />
                            </button>
                            <button onClick={() => dispatch(openFlightData(item))} className="hover:text-gray-900 transition-colors">
                                <FileText size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                </>
            )}
        </div>
        
        {/* Pagination / Footer space */}
        <div className='w-full flex justify-between items-center  h-[15%]'>
            <h2 className='text-xl uppercase font-bold tracking-wider text-gray-500'>showing {activeFlights?.length} of {flightData?.length} active flights</h2>
            <div className='flex gap-5'>
                <button onClick={() => dispatch(paginationPrev())} disabled={pagination.currentPage === 1} className={`${pagination.currentPage === 1? "hidden":"block"} text-xl text-white font-semibold bg-gray-500 h-12 w-25 rounded-md hover:bg-gray-900 transition-colors duration-500`}>Prev</button>
                <button onClick={() => dispatch(paginationNext())} className='text-xl text-white font-semibold bg-red-700 h-12 w-25 rounded-md hover:bg-red-900 transition-colors duration-500'>Next</button>
            </div>
        </div>
    </div>
  )
}

export default ActiveFlights