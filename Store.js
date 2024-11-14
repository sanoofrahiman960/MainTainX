import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './Reducer/counterSlice.js'

export default configureStore({
    reducer: {
        counter: counterReducer,
    },
})