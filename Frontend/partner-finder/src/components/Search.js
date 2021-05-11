
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
import { WithContext as ReactTags } from "react-tag-input";
import Typography from "@material-ui/core/Typography";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
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
    //   let OrganizationToSearch = selectedOrganization.map((value) => {
    //     return valuçe.label;})
      // if (formValidation()) {
        
      //   setMsgState({
      //     title: "Error",
      //     body: "Please fill the tag field",
      //     visible: true,
      //   });
      // } else {
      //   let selectedOrganization = selectedOrganization.map((value) => {
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
    //   callsSearch(OrganizationToSearch);
     };

    // const calsSearch = (organization) => {
    //   setState({ ...state, loading: true });
    //   tags = tags.map((tag) => tag.text);
    //   let url = new URL(BACKEND_URL + "generic_search/");
    //   let params = { data: JSON.stringify({ tags: tags, countries: countries, types: type, role: role }) };
    //   Object.keys(params).forEach((key) =>
    //     url.searchParams.append(key, params[key])
    //   );
    //   fetch(url, {
    //     method: "GET",
    //   })
    //     .then((res) => res.json())
    //     .then((resp) => {
    //       if ("error" in resp) {
    //         setMsgState({
    //           title: "Failed",
    //           body: "Error while searching for organizations",
    //           visible: true,
    //         });
    //         setState({ ...state, loading: false });
    //         setData({ EU: [], B2MATCH: [] });
    //         props.setState({ ...props.state, data: { EU: [], B2MATCH: [] } });
    //       } else {
    //         setState({ ...state, loading: false });
    //         resp['EU'] = resp['EU'].map(val => {
    //           return { ...val, 'consorsiumRoles': val.consorsiumRoles ? 'Coordinator' : 'Regular' }
    //         })
    //         setData(resp);
    //         props.setState({ ...props.state, data: { ...resp } });
    //         if(resp.EU.length === 0 && resp.B2MATCH.length === 0){
    //           setMsgState({
    //             title: "Success",
    //             body: "We didn't find any relevant results",
    //             visible: true,
    //           });
    //         }
    //         else{
    //           if (resp.EU.length === 0){
    //             setMsgState({
    //               title: "Success",
    //               body: "We didn't find any relevant organizations from EU",
    //               visible: true,
    //             });
    //           }
    //           if (resp.B2MATCH.length === 0){
    //             setMsgState({
    //               title: "Success",
    //               body: "We didn't find any relevant participants from B2match",
    //               visible: true,
    //             });
    //           }
    //         }
           
    //       }
    //     })
    //     .catch((error) => {
    //       setData({ EU: [], B2MATCH: [] });
    //       props.setState({ ...props.state, data: { EU: [], B2MATCH: [] } });
    //       setMsgState({
    //         title: "Failed",
    //         body: "Error while searching for organizations",
    //         visible: true,
    //       });
    //       setState({ ...state, loading: false });
    //     });
    // };

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
  //tags consts------------------
const [tags, setTags] = React.useState([]);
const [formState, setFormState] = React.useState({
  tags: false,
});
const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];
/**
   * function for adding a new tag
   * @param {String} tag the tag that the user inserts
   */
 const addTag = (tag) => {
  setTags([...tags, tag]);
  // props.setState({ ...props.state, tags: [...props.state.tags, tag] });
};


/**
 * function that sets the value of the tag that the user filled
 * @param {event} event 
 */
const changeTagInput = (event) => {
  if (event.length !== 0) {
    setFormState({ ...formState, tags: false });
  }
};
/**
 * function for deleting the tag that has been inserted
 * @param {int} idx index of the tag we want to delete
 */
const deleteTag = (idx) => {
  let newTags = tags.filter((val, i) => i !== idx);
  setTags(newTags);
  // props.setState({ ...props.state, tags: [...newTags] });
};

const dragTag = (tag, currPos, newPos) => { };

//date 

const [selectedStartDate, setSelectedStartDate] = React.useState();

const handleStartDateChange = (date) => {
  setSelectedStartDate(date);
};

const [selectedEndDate, setselectedEndDate] = React.useState();

const handleEndDateChange = (date) => {
  setselectedEndDate(date);
};
  
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
      <h1>
              Tags
            </h1>
            <ReactTags
              tags={tags}
              handleDelete={deleteTag}
              handleAddition={addTag}
              handleDrag={dragTag}
              delimiters={delimiters}
              handleInputChange={changeTagInput}
            />

            {formState && formState.tags ? (
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                style={{ color: "red", fontWeight: "bold" }}
              >
                Enter at least one tag
              </Typography>
            ) : null}
      
      </div>
      <div className="Date">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Start Date"
          value={selectedStartDate}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
          <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="End Date"
          value={selectedEndDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </Grid>
    </MuiPickersUtilsProvider>
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
