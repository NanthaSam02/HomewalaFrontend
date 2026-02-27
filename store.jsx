import { configureStore } from '@reduxjs/toolkit'
import BasicSlice from './src/features/BasicSlice'

const store = configureStore({
    reducer: {
        basic: BasicSlice,

    },
})

export default store