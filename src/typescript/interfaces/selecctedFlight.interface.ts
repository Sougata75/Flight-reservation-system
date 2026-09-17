export interface CabinDetails {
  seat_count: number;
  layout: string;
  pitch: string;
}

export interface CabinClasses {
  first?: CabinDetails;
  business?: CabinDetails;
  premium_economy?: CabinDetails;
  economy?: CabinDetails;
}

export interface ActiveRoute {
  origin: string;
  destination: string;
  route_type: string;
}

export interface Aircraft {
  model: string;
  tail_number: string;
  manufacturer: string;
  total_seats: number;
  classes: CabinClasses;
  active_route: ActiveRoute;
}

export interface Schedule {
  departure_time: string;
  arrival_time: string;
}

export interface FlightFormValues {
  flight_number: string;
  service_type: string;
  status: string;
  base_price: number;
  aircraft_model: Aircraft;
  schedule: Schedule;
  id?: string;
  eco_booked?: number;
  eco_capacity?: number;
  pre_eco_booked?: number;
  pre_eco_capacity?: number;
  biz_booked?: number;
  biz_capacity?: number;
  first_class_booked?: number;
  first_class_capacity?: number;
}

export interface FlightUpdateValues extends FlightFormValues {
  status: string;
}