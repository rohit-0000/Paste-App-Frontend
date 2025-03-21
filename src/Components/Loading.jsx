import React from 'react'
import './Loading.css'
const Loading = () => {
  return (
    <div className="Loading-container">
      <div id="Animation-container">
          <div id="circles">
            <div id="circle1" className="circle"></div>
            <div id="circle2" className="circle"></div>
            <div id="circle3" className="circle"></div>
          </div>
          <div id="Shadows">
            <div id="shadow1" className="shadow"></div>
            <div id="shadow2" className="shadow"></div>
            <div id="shadow3" className="shadow"></div>
          </div>
      </div>
      <p>Loading . . .</p>
    </div>
  )
}

export default Loading