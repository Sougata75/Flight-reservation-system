export default interface CabinDetails {
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
