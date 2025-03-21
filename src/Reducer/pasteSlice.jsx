import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from 'axios';


const initialState = {
    pastes: [],
    user:{},
    loading:false,
};

const API_URL = import.meta.env.VITE_API_URL;
//get all pastes
export const fetchPastes = createAsyncThunk(
    'paste/fetchPastes',
    
        async () => {
            const token = localStorage.getItem('token');
            try{
            const response = await axios.get(`${API_URL}/paste`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            return response.data;
        }
        catch(error){
            throw error;
        }
    }
);

export const fetchUser =createAsyncThunk('paste/fetchUser',async ()=>{
    const token=localStorage.getItem('token');
    const response=await axios.get(`${API_URL}/user/detail`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data;
});

export const addPaste = createAsyncThunk('paste/addPaste',
    async (paste) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/paste`, paste, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );
        
        return response.data;
    }
)



export const updatePaste = createAsyncThunk('paste/updatePaste', async (paste) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/paste/${paste._id}`, paste, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
})

export const updateUser=createAsyncThunk('paste/updateUser',async(user)=>{
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/user`, user, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
})

export const deletePastes = createAsyncThunk('paste/deletePaste', async (pasteId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/paste/id/${pasteId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return pasteId;
})



export const pasteSlice = createSlice({
    name: 'paste',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPastes.fulfilled, (state, action) => {
                state.loading=false;
                state.pastes = action.payload;
                // console.error(action.payload);
            })
            .addCase(fetchPastes.pending,(state,action)=>{
                state.loading=true;
            })
            .addCase(fetchPastes.rejected,(state,action)=>{
                state.loading=false;
            })
            .addCase(addPaste.fulfilled,(state,action)=>{
                // state.pastes.push(action.payload);
                toast.success("Paste Created Sucessfully ");
            })
            .addCase(updatePaste.fulfilled,(state,action)=>{
                // state.pastes = action.payload;
                toast.success("Paste updated");
            })
            .addCase(updateUser.fulfilled,(state,action)=>{
                toast.success("User Updated");
            })
            .addCase(deletePastes.fulfilled,(state,action)=>{
                const index=state.pastes.findIndex((item)=> item._id===action.payload);
                if(index>=0){
                    state.pastes.splice(index,1);
                    toast.success("Paste deleted");
                }
            })
            .addCase(fetchUser.fulfilled,(state,action)=>{
                state.user=action.payload;
                state.loading=false;
            }).addCase(fetchUser.pending,(state,action)=>{
                state.loading=true;
            })
            .addCase(fetchUser.rejected,(state,action)=>{
                state.loading=false;
            })
    }
})

export default pasteSlice.reducer;