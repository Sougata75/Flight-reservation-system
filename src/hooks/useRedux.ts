import { AppDispatch, RootState } from "@/typescript/types/redux.type";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector:  TypedUseSelectorHook<RootState> = useSelector;
