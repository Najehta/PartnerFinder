
import React from 'react';
import './Components.css';
import {Button} from '@material-ui/core';
import MultiSelect from "react-multi-select-component";
import { useState }  from "react";
import Divider from '@material-ui/core/Divider';


const Getcalls = () => {
    const options = [
      { label: "BSF", value: "BSF" },
      { label: "ISF", value: "ISF" },
      { label: "MSF", value: "MSF" },
      { label: "Innovation Isreal", value: "Innovation Isreal" }
    ];
  
    const [selected, setSelected] = useState([]);
  
  return (
  <div className='component1'>
      <div className='title1'>
          <h1>Get calls from:</h1>
          <h5 className='select1'>Select an organization,then press Update now</h5>
      </div>
      <div className='choose1'>
      <pre>{JSON.stringify(selected)}</pre>
      <MultiSelect 
        options={options}
        selected={selected}
        onChange={setSelected}
        focusSearchOnOpen={true}
        labelledBy={"Select"}
      />
      </div>
      <div className='button1'>
          <Button variant="contained" className='tbutton' >Update Now</Button>

      </div>
      <Divider variant="middle" className='divider1'></Divider>
  </div>
  );
};


export default Getcalls;
