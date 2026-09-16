import {configureStore} from "@reduxjs/toolkit"
import globalReducer from "@/store/slices/global.slice"

const store = configureStore({
    reducer: {
        global: globalReducer
    },
});

export default store;