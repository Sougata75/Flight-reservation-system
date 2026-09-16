import { Aircraft } from "@/typescript/interfaces/aircraftConfig.interface";

export const aircraftConfigs: Aircraft[] = [
  {
    model: "Airbus A350-900",
    tail_number: "VT-JRA",
    manufacturer: "Airbus",
    total_seats: 316,
    classes: {
      business: {
        seat_count: 28,
        layout: "1-2-1 staggered",
        pitch: "48 inches"
      },
      premium_economy: {
        seat_count: 24,
        layout: "2-4-2",
        pitch: "38 inches"
      },
      economy: {
        seat_count: 264,
        layout: "3-3-3",
        pitch: "31 inches"
      }
    },
    active_route: {
      origin: "DEL",
      destination: "JFK",
      route_type: "Long-haul International"
    }
  },
  {
    model: "Boeing 777-300ER",
    tail_number: "VT-ALN", 
    manufacturer: "Boeing",
    total_seats: 342,
    classes: {
      first: {
        seat_count: 4,
        layout: "1-2-1",
        pitch: "80 inches"
      },
      business: {
        seat_count: 35,
        layout: "2-3-2",
        pitch: "76 inches"
      },
      economy: {
        seat_count: 303,
        layout: "3-3-3",
        pitch: "33 inches"
      }
    },
    active_route: {
      origin: "YVR",
      destination: "DEL",
      route_type: "Long-haul International"
    }
  },
  {
    model: "Airbus A320neo",
    tail_number: "VT-EXO",
    manufacturer: "Airbus",
    total_seats: 162,
    classes: {
      business: {
        seat_count: 12,
        layout: "2-2",
        pitch: "36 inches"
      },
      economy: {
        seat_count: 150,
        layout: "3-3",
        pitch: "30 inches"
      }
    },
    active_route: {
      origin: "DEL",
      destination: "HYD",
      route_type: "Domestic"
    }
  },
  {
    model: "Airbus A350-900",
    tail_number: "VT-JRA",
    manufacturer: "Airbus",
    total_seats: 316,
    classes: {
      business: {
        seat_count: 28,
        layout: "1-2-1 staggered",
        pitch: "48 inches"
      },
      premium_economy: {
        seat_count: 24,
        layout: "2-4-2",
        pitch: "38 inches"
      },
      economy: {
        seat_count: 264,
        layout: "3-3-3",
        pitch: "31 inches"
      }
    },
    active_route: {
      origin: "JKF",
      destination: "DEL",
      route_type: "Long-haul International"
    }
  },
  {
    model: "Boeing 777-300ER",
    tail_number: "VT-ALN", 
    manufacturer: "Boeing",
    total_seats: 342,
    classes: {
      first: {
        seat_count: 4,
        layout: "1-2-1",
        pitch: "80 inches"
      },
      business: {
        seat_count: 35,
        layout: "2-3-2",
        pitch: "76 inches"
      },
      economy: {
        seat_count: 303,
        layout: "3-3-3",
        pitch: "33 inches"
      }
    },
    active_route: {
      origin: "DEL",
      destination: "YVR",
      route_type: "Long-haul International"
    }
  },
  {
    model: "Airbus A320neo",
    tail_number: "VT-EXO",
    manufacturer: "Airbus",
    total_seats: 162,
    classes: {
      business: {
        seat_count: 12,
        layout: "2-2",
        pitch: "36 inches"
      },
      economy: {
        seat_count: 150,
        layout: "3-3",
        pitch: "30 inches"
      }
    },
    active_route: {
      origin: "HYD",
      destination: "DEL",
      route_type: "Domestic"
    }
  }
];

export const serviceType: string[] = ["Daily Service","Seasonal","Charter"]