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
  Technion_columns,
  BACKEND_URL,
  MultiSelectOptions,
  statusOption,
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
import moment from "moment";
import Select from "react-select";
// ------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    fontSize: 30,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#283747",
      borderBottom: "1px dotted pink",
      color: "//#region ",
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
        backgroundColor: "//#endregion",
        color: "black",
        fontSize: "13px",
      },
    }),
    singleValue: (styles) => ({ ...styles, color: "white", fontSize: "13px" }),
  };
  /////input
  const [selectedOrganization, setselectedOrganization] = useState([]);
  const [tags, setTags] = React.useState([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  ////////////////
  const [state, setState] = React.useState({
    loading: false,
    firstLoading: true,
  });
  const handleChoose = (event) => {
    setselectedOrganization(event);

    //props.setState({ ...props.state, selectedOrganization: event });
  };
  // search methods

  const searchProposalCalls = () => {
    let orgToSearch = selectedOrganization.map((value) => {
      return value.value;
    });
    //what to do with date
    //how to check if the input zero
    // let tempStartDate=moment(start).format("DD/MM/YYYY")

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
    var g1 = new Date();
    let params = {
      data: JSON.stringify({
        organizations: organization,
        tags: tags,
        start_date: moment(startDate).format("DD/MM/YYYY"),
        end_date: moment(endDate).format("DD/MM/YYYY"),
        status: status.value,
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
          console.log("hi\n", resp.INNOVATION[0].information);
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
        // setData({ BFS: [], ISF: [], MST: [], INNOVATION: [] });
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
    Technion: [],
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
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  //open closed megration

  const [status, setStatus] = React.useState({
    label: "Status",
    value: "Open",
  });

  const handleChange = (event) => {
    setStatus(event);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Search For Calls</h1>

      <div className="SearchCom">
        <div className="searchMultiSelect">
          <h2 id="textFontFamily" className="textEdit">
            Organizations
          </h2>
          <FormControl id="text_select">
            <MultiSelect
              options={MultiSelectOptions}
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
          <h2 id="textFontFamily">Tags</h2>
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
        <div className="status">
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              native
              value={status}
              onChange={handleChange}
              options={statusOption}
            ></Select>
          </FormControl>
        </div>
        <div className="searchButton">
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => searchProposalCalls()}
            disabled={state.loading}
          >
            {state && state.loading && (
              <i className="fa fa-refresh fa-spin"></i>
            )}
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
          {data && data.BSF.length === 0 ? null : (
            <ResultsTable title={"BSF"} columns={BSF_columns} data={data.BSF} />
          )}

          {data && data.ISF.length === 0 ? null : (
            <ResultsTable title={"ISF"} columns={ISF_columns} data={data.ISF} />
          )}

          {data && data.MST.length === 0 ? null : (
            <ResultsTable
              title={"Ministry Of Science And Technology"}
              columns={MST_columns}
              data={data.MST}
            />
          )}

          {data && data.INNOVATION.length === 0 ? null : (
            <ResultsTable
              title={"Innovation Israel"}
              columns={INNOVATION_columns}
              data={data.INNOVATION}
            />
          )}

          {data && data.Technion.length === 0 ? null : (
            <ResultsTable
              title={"Technion"}
              columns={Technion_columns}
              data={data.Technion}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
