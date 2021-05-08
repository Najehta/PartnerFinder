
import React from 'react';
import './Components.css';
import {Button} from '@material-ui/core';
import MultiSelect from "react-multi-select-component";
import { useState }  from "react";
import Divider from '@material-ui/core/Divider';
import ResultsTable from "./ResultsTable";
import {Calls_columns} from '../utils';

//import Checkbox from '@material-ui/core/Checkbox';
//import FormControlLabel from '@material-ui/core/FormControlLabel';

const Search = () => {
    const options = [
      { label: "BSF", value: "BSF" },
      { label: "ISF", value: "ISF" },
      { label: "MSF", value: "MSF" },
      { label: "Innovation Isreal", value: "Innovation Isreal" }
    ];
    const [data, setData] = useState( [
      {
          "CallID": 0,
          "organizationName": "NSF-BSF",
          "deadlineDate": "2021-07-20",
          "information": "Deadline for NSF-BSF program in Science of Learning and Augmented Intelligence (NSF deadline is Jul. 14)",
          "areaOfResearch": "Science of Learning and Augmented Intelligence",
          "link": "https://www.bsf.org.il/calendar/"
      },
      {
          "CallID": 2,
          "organizationName": "NSF-BSF",
          "deadlineDate": "2021-07-21",
          "information": "Deadline for NSF-BSF program in Developmental Sciences (NSF deadline is Jul. 15)",
          "areaOfResearch": "Developmental Sciences",
          "link": "https://www.bsf.org.il/calendar/"
      },
      {
          "CallID": 5,
          "organizationName": "NSF-BSF",
          "deadlineDate": "2021-08-22",
          "information": "Deadline for NSF-BSF program in Ocean Sciences (NSF deadline is Aug. 16)",
          "areaOfResearch": "Ocean Sciences",
          "link": "https://www.bsf.org.il/calendar/"
      },
      {
          "CallID": 7,
          "organizationName": "NSF-BSF",
          "deadlineDate": "2021-08-24",
          "information": "Deadline for NSF-BSF program in Decision, Risk and Management Sciences (NSF deadline is Aug. 18)",
          "areaOfResearch": "Decision, Risk and Management Sciences",
          "link": "https://www.bsf.org.il/calendar/"
      }
  ]);
    const [selected, setSelected] = useState([]);
  
  return (
  <div className='component3'>
      <div className='title1'>
          <h1>Search For Calls</h1>
      </div>
      <div className='choose3'>
      <pre>{JSON.stringify(selected)}</pre>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={setSelected}
        labelledBy={"Select"}
      />
      </div>
      <div className='choose4'>
      <pre>{JSON.stringify(selected)}</pre>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={setSelected}
        labelledBy={"Select"}
      />
      </div>
      <div className='buttonSearch'>
          <Button variant="contained" className='tbutton' >Search</Button>

      </div>
     
      <div style={{ "margin-top": "2px" }}>
        {data && data.length === 0 ? null : (
          <ResultsTable
            title={"Proposal Calls"}
            columns={Calls_columns}
            data={data}
          />
        )}
      </div>
  </div>
  );
};


export default Search;
