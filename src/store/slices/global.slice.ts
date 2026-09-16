import { FlightSearchType } from "@/services/validation/flightSearch.validation";
import { PassengerSchema } from "@/services/validation/passenger.validation";
import { FlightFormValues } from "@/typescript/interfaces/selecctedFlight.interface";
import { UserDataType } from "@/typescript/interfaces/userData.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

export interface Pagination {
  currentPage: number;
  limitPerPage: number;
}

export interface GlobalState {
  authTabChanger: "login" | "signup";
  formStep: number;
  profileData: z.input<(typeof UserDataType)[]>;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  addFlightDilog: boolean;
  pagination: Pagination;
  isUpdateMode: boolean;
  selectedFlight: FlightFormValues | null;
  viewFlightData: boolean;
  trip: "one-way" | "round-trip";
  flightSearchData: FlightSearchType | string;
  selectionPhase: "outbound" | "return" | "complete";
  selectedOutboundFlight: FlightFormValues | null,
  selectedReturnFlight: FlightFormValues | null,
  passengerData: z.input<typeof PassengerSchema> | null,
  selectedSeats: any | null;
  upgradeSeat: string | null;
}

const initialState: GlobalState = {
  authTabChanger: "login",
  formStep: 1,
  profileData: [],
  isLoggedIn: false,
  isAuthLoading: true,
  addFlightDilog: false,
  pagination: {
    currentPage: 1,
    limitPerPage: 7,
  },
  isUpdateMode: false,
  selectedFlight: null,
  viewFlightData: false,
  trip: "one-way",
  flightSearchData: "",
  selectionPhase: "outbound", 
  selectedOutboundFlight: null,
  selectedReturnFlight: null,
  passengerData: null,
  selectedSeats: null,
  upgradeSeat: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    logIn: (state, actions) => {
      state.authTabChanger = actions.payload;
    },
    signUp: (state, actions) => {
      state.authTabChanger = actions.payload;
    },
    nextStep: (state) => {
      state.formStep += 1;
    },
    prevStep: (state) => {
      state.formStep -= 1;
    },
    stepReseter: (state) => {
      state.formStep = 1;
    },
    setAuthStatus: (state, actions: PayloadAction<boolean>) => {
      state.isLoggedIn = actions.payload;
      state.isAuthLoading = false;
    },
    addFlightOpen: (state) => {
      state.addFlightDilog = true;
    },
    addFlightClose: (state) => {
      state.addFlightDilog = false;
      state.isUpdateMode = false;
      state.selectedFlight = null;
      state.viewFlightData = false;
    },
    paginationNext: (state) => {
      state.pagination.currentPage += 1;
    },
    paginationPrev: (state) => {
      state.pagination.currentPage -= 1;
    },
    updateFlightOpen: (state, actions) => {
      state.addFlightDilog = true;
      state.isUpdateMode = true;
      state.selectedFlight = actions.payload;
    },
    openFlightData: (state, actions) => {
      ((state.viewFlightData = true), (state.selectedFlight = actions.payload));
    },
    tripChanger: (state, actions) => {
      state.trip = actions.payload;
    },
    fSearchData: (state, actions) => {
         console.log("payload data", actions.payload);
      state.flightSearchData = actions.payload;
   
    },
    setOutboundFlight: (state, action) => {
    state.selectedOutboundFlight = action.payload;
    state.selectionPhase = "return";
  },
  setReturnFlight: (state, action) => {
    state.selectedReturnFlight = action.payload;
    state.selectionPhase = "complete";
  },
  resetSelection: (state) => {
    state.selectionPhase = "outbound";
    state.selectedOutboundFlight = null;
    state.selectedReturnFlight = null;
  },
  setPassengers: (state,action) => {
    state.passengerData = action.payload;
  },
  setSeats: (state,action) => {
    state.selectedSeats = action.payload;
  },
  setUpgradeSeat: (state, action) => {
  state.upgradeSeat = action.payload;
  },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const {
  logIn,
  signUp,
  nextStep,
  prevStep,
  stepReseter,
  setAuthStatus,
  addFlightOpen,
  addFlightClose,
  paginationNext,
  paginationPrev,
  updateFlightOpen,
  openFlightData,
  tripChanger,
  fSearchData,
  setOutboundFlight,
  setReturnFlight,
  resetSelection,
  setPassengers,
  setSeats,
  setUpgradeSeat,
} = globalSlice.actions;
export default globalSlice.reducer;
