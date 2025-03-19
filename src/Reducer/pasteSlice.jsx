import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from 'axios';


const initialState = {
    pastes: [],
    user:[],
};


//get all pastes
export const fetchPastes = createAsyncThunk(
    'paste/fetchPastes',
    async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/paste',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data;
    }
);

export const fetchUser =createAsyncThunk('paste/fetchUser',async ()=>{
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:8080/user/detail',
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
        const response = await axios.post('http://localhost:8080/paste', paste, {
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
    const response = await axios.put(`http://localhost:8080/paste/${paste._id}`, paste, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
})

export const updateUser=createAsyncThunk('paste/updateUser',async(user)=>{
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:8080/user`, user, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
})

export const deletePastes = createAsyncThunk('paste/deletePaste', async (pasteId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8080/paste/id/${pasteId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return pasteId;
})



// export const changeName=createAsyncThunk('user/changeName',async()=>{
//     const token=localStorage.getItem('token');
//     const response=await axios.put()
// })

export const pasteSlice = createSlice({
    name: 'paste',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPastes.fulfilled, (state, action) => {
                state.pastes = action.payload;
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
            })
    }
})

export default pasteSlice.reducer;