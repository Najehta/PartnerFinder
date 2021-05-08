import React from 'react';
import './Components.css';
import MultiSelect from "react-multi-select-component";
import { useState }  from "react";
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const Alert = () => {
    const options = [
      { label: "BSF", value: "BSF" },
      { label: "ISF", value: "ISF" },
      { label: "MSF", value: "MSF" },
      { label: "Innovation Isreal", value: "Innovation Isreal" }
    ];
  
    const [selected, setSelected] = useState([]);
    const classes = useStyles();
  return (
  <div className='component1'>
      <div className='title'>
          <h1>Alert Subcription</h1>
          <h5 className='select1'>Enter your email to receive updates</h5>
      </div>
      <div className='email'>
      <form className={classes.root} noValidate autoComplete="off">
      <TextField id="standard-basic" label="Email" />
    
    </form>
      </div>
      <div className='choice2'>
      <pre>{JSON.stringify(selected)}</pre>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={setSelected}
        labelledBy={"Select"}
      />

      </div>
      <Divider variant="middle" className='divider2'></Divider>
  </div>
  );
};


export default Alert;