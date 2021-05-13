import React from "react";
import "./Components.css";
import { Button } from "@material-ui/core";
import MultiSelect from "react-multi-select-component";
import { useState } from "react";
import ResultsTable from "./ResultsTable";
import {
  BSF_columns,
  ISF_columns,
  MST_columns,
  INNOVATION_columns,
  BACKEND_URL,
} from "../utils";
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
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Msgtoshow } from "./Msgtoshow";
import moment from "moment";
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

  const [msgState, setMsgState] = React.useState({
    title: "",
    body: "",
    visible: false,
  });
  //MultiSelect parameters
  const options = [
    { label: "BSF", value: "BSF" },
    { label: "ISF", value: "ISF" },
    { label: "Ministry Of Science And Technology", value: "MST" },
    { label: "Innovation Israel", value: "INNOVATION" },
  ];
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderBottom: "1px dotted pink",
      color: "white",
      fontSize: "13px",
    }),
    placeholder: (styles) => ({ ...styles, color: "white", fontSize: "13px" }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      color: "white",
      fontSize: "13px",
    }),

    option: (styles) => ({
      ...styles,
      color: "white",
      backgroundColor: "white",
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "#f1f3f5",
        color: "black",
        fontSize: "13px",
      },
    }),
    singleValue: (styles) => ({ ...styles, color: "white", fontSize: "13px" }),
  };
  /////input
  const [selectedOrganization, setselectedOrganization] = useState([]);
  const [tags, setTags] = React.useState([]);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  ////////////////
  const [state, setState] = React.useState({
    loading: false,
    firstLoading: true,
  });
  const handleChoose = (event) => {
    setselectedOrganization(event);
    console.log(selectedOrganization, event, "EVENT");
    //props.setState({ ...props.state, selectedOrganization: event });
  };
  // search methods

  const searchProposalCalls = () => {
    // if (formValidation()) {
    //   setMsgState({
    //     title: "Error",
    //     body: "Please fill the tag field",
    //     visible: true,
    //   });
    // }

    let orgToSearch = selectedOrganization.map((value) => {
      return value.value;
    });
    //what to do with date
    //how to check if the input zero
    callsSearch(orgToSearch, tags, startDate, endDate);
  };

  ///////////
  const formValidation = () => {
    let res = {};
    let check = false;

    if (tags.length === 0 || tags === undefined || tags === null) {
      res = { ...res, tags: true };
      setFormState(res);
      check = true;
    } else {
      res = { ...res, tags: false };
    }
    setFormState(res);
    return check;
  };

  const callsSearch = (organization, tags, startDate, endDate) => {
    setState({ ...state, loading: true });
    tags = tags.map((tag) => tag.text);
    let url = new URL(BACKEND_URL + "proposal/call_search/");
    let params = {
      data: JSON.stringify({
        organizations: organization,
        tags: tags,
        start_date: startDate,
        end_date: endDate,
      }),
    };
    //searchParams?
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((resp) => {
        console.log("RESP", resp);
        if ("error" in resp) {
          setMsgState({
            title: "Failed",
            body: "Error while searching for organizations",
            visible: true,
          });
          setState({ ...state, loading: false });
          setData({ BFS: [], ISF: [], MST: [], INNOVATION: [] });
          // props.setState({ ...props.state, data: { EU: [], B2MATCH: [] } });
        } else {
          setState({ ...state, loading: false });
          // resp["BSF"] = resp["BSF"].map((val) => {
          //   // return {
          //   //   ...val,
          //   //   consorsiumRoles: val.consorsiumRoles ? "Coordinator" : "Regular",
          //   // };
          // });
          setData(resp);
          // props.setState({ ...props.state, data: { ...resp } });
          // if (resp.BSF.length === 0 && resp.ISF.length === 0) {
          //   setMsgState({
          //     title: "Success",
          //     body: "We didn't find any relevant results",
          //     visible: true,
          //   });
          // }
        }
      })
      .catch((error) => {
        setData({ BFS: [], ISF: [], MST: [], INNOVATION: [] });
        // props.setState({ ...props.state, data: { EU: [], B2MATCH: [] } });
        setMsgState({
          title: "Failed",
          body: "Error while searching for organizations",
          visible: true,
        });
        setState({ ...state, loading: false });
      });
  };

  //variables for the table
  const [data, setData] = useState({
    BSF: [],
    ISF: [],
    MST: [],
    INNOVATION: [],
  });
  //tags consts------------------

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

  const dragTag = (tag, currPos, newPos) => {};

  //date

  const handleStartDateChange = (date) => {
    setStartDate(moment(date).format("DD/MM/YYYY"));
  };

  const handleEndDateChange = (date) => {
    setEndDate(moment(date).format("DD/MM/YYYY"));
  };

  return (
    <div className="SearchCom">
      <div className="SearchTitle">
        <h1>Search For Calls</h1>
      </div>
      <div className="searchMultiSelect">
        <h2 id="textFontFamily">Organizations</h2>
        <FormControl id="text_select">
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
      <div className="Tags">
        <h2>Tags</h2>
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

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="startDate">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </div>

        <div className="endDate">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </div>
      </MuiPickersUtilsProvider>

      <div className="searchButton">
        <Button
          color="primary"
          round
          variant="contained"
          id="BackgroundColor"
          onClick={() => searchProposalCalls()}
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
        <div className="BsfTable">
          {data && data.BSF.length === 0 ? null : (
            <ResultsTable title={"BSF"} columns={BSF_columns} data={data.BSF} />
          )}
        </div>
        <div className="ISFTable">
          {data && data.ISF.length === 0 ? null : (
            <ResultsTable title={"ISF"} columns={ISF_columns} data={data.ISF} />
          )}
        </div>
        <div className="MSTTable">
          {data && data.MST.length === 0 ? null : (
            <ResultsTable
              title={"Ministry Of Science And Technology"}
              columns={MST_columns}
              data={data.MST}
            />
          )}
        </div>
        <div className="INNOVATIONTable">
          {data && data.INNOVATION.length === 0 ? null : (
            <ResultsTable
              title={"Innovation Israel"}
              columns={INNOVATION_columns}
              data={data.INNOVATION}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
