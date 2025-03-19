import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { addPaste, fetchPastes, updatePaste } from '../Reducer/pasteSlice';

import './Home.css'
import toast from 'react-hot-toast';
import copy from '../assets/copy.png'
const Home = () => {
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const pasteId = searchParams.get("pasteId");
    
    const dispatch = useDispatch();

    const textareaRef=useRef(null);
    const lineNumberRef=useRef(null);

    const handleScroll = (e) => {
        const otherDiv = e.target === textareaRef.current ? lineNumberRef.current : textareaRef.current;
        otherDiv.scrollTop = e.target.scrollTop;
      };
     useEffect(() => {
            const lineNumbers = lineNumberRef.current;
            const textarea = textareaRef.current;
    
            const updateLineNumbers = () => {
                const numberOfLines = textarea.value.split('\n').length;
                let lineNumbersHTML = '';
                
                for (let i = 0; i < numberOfLines; i++) {
                    lineNumbersHTML += `<span>${i + 1}</span>`;
                }
            
                lineNumbers.innerHTML = lineNumbersHTML;
            };
            
    
            textarea.addEventListener('input', updateLineNumbers);
            textarea.addEventListener('scroll',handleScroll);
            lineNumbers.addEventListener('scroll',handleScroll);
            updateLineNumbers();
    
            return () => {
                textarea.removeEventListener('input', updateLineNumbers);
                textarea.removeEventListener('scroll',handleScroll);
            lineNumbers.removeEventListener('scroll',handleScroll);
            };
        },);

    const allPastes = useSelector((state) => state.paste.pastes);
    useEffect(() => {
        dispatch(fetchPastes());
    }, [dispatch]);
    useEffect(() => {
        if (pasteId) {
            const paste = allPastes.find((p) => p._id === pasteId);
            if (paste) {
                setTitle(paste.title);
                setValue(paste.content);
            } else {
                setTitle('');
                setValue('');
            }
        } else {
            setTitle('');
            setValue('');
        }
    }, [pasteId, allPastes]);


    function creatPaste() {
        if (title != '' || value != '') {
            const paste = {
                title: title,
                content: value,
                // _id: pasteId || Date.now().toString(36),
                _id: pasteId || `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`,

                createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
            }

            if (pasteId) {
                //update
                dispatch(updatePaste(paste)).then(() => {
                    dispatch(fetchPastes());
                });

            } else {
                //create
                dispatch(addPaste(paste)).then(() => {
                    dispatch(fetchPastes());
                });
            }
            //after creation or updation
            setTitle('');
            setValue('');
            setSearchParams({});
        } else {
            toast.error('Write Something .. ');
        }

    }
    function handleCopy() {
        navigator.clipboard.writeText(value);
        toast.success("Copied to Clipboard");
    }
    return (
        <div id="home-container">
            <div id='title'>
                <input id='title-input-home'
                    required
                    type='text'
                    placeholder='Enter title here'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <button id='submit-btn' onClick={creatPaste}>
                    {
                        pasteId ? 'Update Paste' : 'Create Paste'
                    }
                </button>
            </div>
            <div id='content'>
                <div id='Copy-areah'>
                    <div id='temph'>
                        <span id='red' ></span>
                        <span id='yellow'></span>
                        <span id='green'></span>
                    </div>
                    <button id='copy-btnh' onClick={handleCopy}><img src={copy} />
                    </button>
                </div>

                <div id="text-area-Container">
                    <div id="line-number" ref={lineNumberRef}></div>
                    <textarea
                    ref={textareaRef}
                        id='content-input1'
                        value={value}
                        placeholder='Enter content here'
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home

