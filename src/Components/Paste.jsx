import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePastes, fetchPastes } from '../Reducer/pasteSlice';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import './Paste.css';
import Edit from '../assets/Edit.png';
import View from '../assets/View.png';
import Delete from '../assets/Delete.png';
import Copy from '../assets/Copy.png';
// import Share from '../assets/Share.png'
import DateIcon from '../assets/Date.png'; // Rename Date to DateIcon to avoid confusion with the Date object

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading,setLoading]=useState(false);
  useEffect(() => {
    if (pastes.length===0 && loading===false) { 
        dispatch(fetchPastes());
        setLoading(true);
    }else setLoading(false);
}, [dispatch, pastes.length]);
  
  const filteredData = pastes.filter((paste) => paste.title.toLowerCase().includes(searchTerm.toLowerCase()));

  async function handleDelete(pasteId) {
    dispatch(deletePastes(pasteId));
  }

  function handleCopy(paste) {
    navigator.clipboard.writeText(paste.content);
    toast.success("Copied to Clipboard");
  }



  return (
    <div id='allPaste-container'>
      <input
        id='search'
        placeholder='Search here . . .'
        type='search'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h3>All Pastes</h3>

      {filteredData.length === 0 ? (
        <div id='No-Data'>No Data Found</div>
      ) : (
        <div>
          {filteredData.map((paste) => (
            <div
              id='pastes-box'
              key={paste?._id}
            >
              <NavLink id='view-box' to={`/home/pastes/${paste?._id}`} >
                <div id='paste-title'>
                  {paste.title}
                </div>

                {/* <div id='paste-Content'>
                  {paste.content}
                </div> */}
                <textarea id='paste-Content'
                  disabled
                  defaultValue={paste.content}
                />
              </NavLink>

              <div id='view-btn'>
                <button className='btns'>
                  <NavLink to={`/home/?pasteId=${paste?._id}`}><img src={Edit} alt="Edit" /></NavLink>
                </button>
                <button className='btns'>
                  <NavLink to={`/home/pastes/${paste?._id}`}><img src={View} alt="View" /></NavLink>
                </button>
                <button className='btns' onClick={() => handleDelete(paste?._id)}><img src={Delete} alt="Delete" /></button>
                <button id='copy' className='btns' onClick={() => handleCopy(paste)}><img src={Copy} alt="Copy" /></button>

                {/* <button id='share' className='btns' > <img src={Share} alt="Share" /></button> */}
              </div>
              <div id='time'><img src={DateIcon} alt="Date" />{paste.createdAt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Paste;
