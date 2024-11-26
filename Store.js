import { configureStore } from '@reduxjs/toolkit'
import assetReducer from './redux/reducers/assetReducer'
import authReducer from './redux/reducers/authReducer'
import locationReducer from './redux/reducers/locationReducer'
import workOrderReducer from './redux/reducers/workOrderReducer'
import workorderSlice from './redux/reducers/workorderSlice'
import contactSlice from './redux/contactSlice'

export default configureStore({
    reducer: {
        locations: locationReducer,
        // assets:locationReducer
        assets: assetReducer,
        auth: authReducer,
        workOrders: workOrderReducer,
        contacts: contactSlice,
    },
})