import { configureStore } from '@reduxjs/toolkit'
import assetReducer from './redux/reducers/assetReducer'
import authReducer from './redux/reducers/authReducer'
import locationReducer from './redux/reducers/locationReducer'

export default configureStore({
    reducer: {
        locations: locationReducer,
        // assets:locationReducer
        assets: assetReducer,
        auth: authReducer,
    },
})