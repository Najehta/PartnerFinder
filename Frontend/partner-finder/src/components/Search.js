
import React from 'react';
import './Components.css';
import {Button} from '@material-ui/core';
import MultiSelect from "react-multi-select-component";
import { useState }  from "react";
import Divider from '@material-ui/core/Divider';
import ResultsTable from "./ResultsTable";
import {Calls_columns} from '../utils';
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

//import Checkbox from '@material-ui/core/Checkbox';
//import FormControlLabel from '@material-ui/core/FormControlLabel';

const Search = (props) => {
  const classes = useStyles();

  //MultiSelect parameters
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
  
    const [selectedOrganization, setselectedOrganization] = useState([]);
    const [state, setState] = React.useState({
      loading: false,
      firstLoading: true,
  
    });
    const handleChoose = (event) => {
      setselectedOrganization(event);
      console.log(selectedOrganization, event, "EVENT");
      //props.setState({ ...props.state, selectedOrganization: event });
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
      //     return valuçe.label;
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

    //variables for the table
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

 
  
  return (
  <div className='SearchCom'>
      <div className='SearchTitle'>
          <h1>Search For Calls</h1>
      </div>
      <div className='searchMultiSelect'>
      <h1 id="textFontFamily" style={{ color: "#02203c" }}>
              Organizations
            </h1>
            <FormControl  id="text_select">
              <MultiSelect
                options={options}
                styles={customStyles}
                value={selectedOrganization}
                onChange={handleChoose}
                focusSearchOnOpen={true}
                className="select"
                labelledBy={"Select"}
              />
            </FormControl>
      </div>
      <div className='aorMultiSelect'>
      <h1 id="textFontFamily" style={{ color: "#02203c" }}>
              Area of research
            </h1>
            <FormControl  id="text_select">
              <MultiSelect
                options={options}
                styles={customStyles}
                value={selectedOrganization}
                onChange={handleChoose}
                focusSearchOnOpen={true}
                className="select"
                labelledBy={"Select"}
              />
            </FormControl>
      </div>
      <div className='searchButton'>
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
          {state && !state.loading && <span>Search</span>}
        </Button>


      </div>
     
      <div className="ResultTable">
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
