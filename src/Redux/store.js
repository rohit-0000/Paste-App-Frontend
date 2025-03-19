import {configureStore} from '@reduxjs/toolkit'
import pasteReducer from '../Reducer/pasteSlice'

export const store=configureStore({
    reducer:{
        paste:pasteReducer,
    }
})