import React from 'react';
import './Components.css';
import MultiSelect from "react-multi-select-component";
import { useState }  from "react";
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const Alert = (props) => {
    const options = [
      { label: "BSF", value: "BSF" },
      { label: "ISF", value: "ISF" },
      { label: "MSF", value: "MSF" },
      { label: "Innovation Isreal", value: "Innovation Isreal" }
    ];
    const customStyles = {
      menu: (provided, state) => ({
        ...provided,
        backgroundColor: "#02203c",
        borderBottom: '1px dotted pink',
        color: "white",
        fontSize: "13px",
      }),
      placeholder: styles => ({ ...styles, color: "white", fontSize: "13px", }),
      control: styles => ({ ...styles, backgroundColor: '#02203c', color: "white", fontSize: "13px", }),
    
      option: styles => ({
        ...styles, color: "white", backgroundColor: "#02203c", fontSize: "13px", '&:hover': {
          backgroundColor: "#f1f3f5",
          color: "black",
          fontSize: "13px",
        },
      }),
      singleValue: styles => ({ ...styles, color: "white", fontSize: "13px" })
    }
  
    const [selected, setSelected] = useState([]);
    
    const [state, setState] = React.useState({
      loading: false,
      firstLoading: true,
  
    });
    const handleChoose = (event) => {
      setSelected(event);
     // props.setState({ ...props.state, selected: event });
    };

    const classes = useStyles();
  return (
  <div className='Alerts'>
      <div className='title'>
          <h1>Alert Subcription</h1>
          <h5 >Enter your email to receive updates</h5>
      </div>
      <div className='email'>
      <form className={classes.root} noValidate autoComplete="off">
      <TextField id="standard-basic" label="Email" />
    
    </form>
      </div>
      <div className='emailMultiSelect'>
      <h1 id="textFontFamily" style={{ color: "#02203c" }}>
              Organizations
            </h1>
            <FormControl  id="text_select">
              <MultiSelect
                options={options}
                styles={customStyles}
                value={selected}
                onChange={handleChoose}
                focusSearchOnOpen={true}
                className="select"
                labelledBy={"Select"}
              />
            </FormControl>

      </div>
      {/* <Divider variant="middle" className='AlertDivider'></Divider> */}
  </div>
  );
};


export default Alert;