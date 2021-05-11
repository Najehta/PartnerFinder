
import React from 'react';
import './Components.css';
import {Button} from '@material-ui/core';
import MultiSelect from "react-multi-select-component";
import { useState }  from "react";
import Divider from '@material-ui/core/Divider';
import FormControl from "@material-ui/core/FormControl";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core/";
import { BeatLoader } from "react-spinners";
//???
const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    fontSize: 30,
  },
}));
const Getcalls = (props) => {
  const classes = useStyles();

  //MultiSelect parameters definition
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
      //props.setState({ ...props.state, selected: event });
    };
    //Button consts
  
    const searchByOrg = () => {
      // if (formValidation()) {
      //   setMsgState({
      //     title: "Error",
      //     body: "Please fill the tag field",
      //     visible: true,
      //   });
      // } else {
      //   let countriesToSearch = countrySearched.map((value) => {
      //     return value.label;
      //   })
      //   let typeTosSearch = type.map((value) => {
      //     return value.label;
      //   })
      //   let roleToSearch = '';
      //   if (role !== '') {
      //     roleToSearch = role.label;
      //   }
      //   genericSearch(tags, countriesToSearch, typeTosSearch, roleToSearch);
      // }
    };
  
  return (
  <div className='getCalls'>
      <div className='getTitle'>
          <h1>Get calls from:</h1>
          <h5 >Select an organization,then press Update now</h5>
      </div>
      <div className='getCallsMultiSelect'>
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
      <div className='GetCallsButton'>
      <Button
          color="primary"
          round
          variant="contained"
          id="BackgroundColor"
          onClick={() => searchByOrg()}
          disabled={state.loading}
        >
          {state && state.loading && <i className="fa fa-refresh fa-spin"></i>}
          {state && state.loading && (
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={true}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle className={classes.title}>LOADING</DialogTitle>
              <DialogContent style={{ "margin-left": "17px" }}>
                <BeatLoader />
              </DialogContent>
            </Dialog>
          )}
          {state && !state.loading && <span>Update Now</span>}
        </Button>

      </div>
      {/* <Divider variant="middle" className='getDivider'></Divider> */}
  </div>
  );
};


export default Getcalls;
