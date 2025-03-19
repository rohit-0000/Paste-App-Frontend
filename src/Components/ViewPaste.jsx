import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './ViewPaste.css'
import { NavLink } from 'react-router-dom'

import copy from '../assets/copy.png'
import { fetchPastes } from '../Reducer/pasteSlice';
  const ViewPaste = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [paste, setPaste] = useState(null);
  const allPastes = useSelector((state) => state.paste.pastes);
  const textareaRef = useRef(null);
  const lineNumberRef = useRef(null);

  const handleScroll = (e) => {
    const otherDiv = e.target === textareaRef.current ? lineNumberRef.current : textareaRef.current;
    otherDiv.scrollTop = e.target.scrollTop;
  };

  useEffect(() => {
    const lineNumbers = lineNumberRef.current;
    const textarea = textareaRef.current;
    if (!lineNumbers || !textarea) return; 
    const updateLineNumbers = () => {
      const numberOfLines = textarea.value.split('\n').length;
      let lineNumbersHTML = '';

      for (let i = 0; i < numberOfLines; i++) {
        lineNumbersHTML += `<span>${i + 1}</span>`;
      }

      lineNumbers.innerHTML = lineNumbersHTML;
    };


    textarea.addEventListener('scroll', handleScroll);
    lineNumbers.addEventListener('scroll', handleScroll);
    updateLineNumbers();

    return () => {
      textarea.removeEventListener('scroll', handleScroll);
      lineNumbers.removeEventListener('scroll', handleScroll);
    };
  }, [paste]);

  useEffect(() => {
    dispatch(fetchPastes());
  }, [dispatch])


  useEffect(() => {
    const foundPaste = allPastes.find((p) => p._id === id);
    setPaste(foundPaste);
    setLoading(false);
  }, [allPastes, id]);


  function handleCopy(paste) {
    navigator.clipboard.writeText(paste.content);
    toast.success("Copied to Clipboard");
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!paste) {
    return <div>Paste not found</div>;
  }
  return (
    <div id="view-Paste-container">
      <div id='view-paste-title'>
        <input id='title-input'
          type='text'
          disabled
          defaultValue={paste.title}
        />

        <NavLink id='Create-new' to="/home">Create New</NavLink>
      </div>

      <div id='content'>
        <div id='Copy-areah'>
          <div id='temph'>
            <span id='red' ></span>
            <span id='yellow'></span>
            <span id='green'></span>
          </div>
          <button id='copy-btnh' onClick={() => handleCopy(paste)}><img src={copy} /></button>
        </div>


        <div id="text-area-Container">
          <div id="line-number" ref={lineNumberRef}></div>
          <textarea
            ref={textareaRef}
            id='content-input1'
            value={paste.content}
            disabled
          />
        </div>
      </div>
    </div>
  )
}

export default ViewPaste