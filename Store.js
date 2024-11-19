import { configureStore } from '@reduxjs/toolkit'
import locationReducer from './redux/reducers/locationReducer'

export default configureStore({
    reducer: {
        locations: locationReducer,
        // assets:locationReducer
    },
})