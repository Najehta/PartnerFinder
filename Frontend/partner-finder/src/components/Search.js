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
  EU_columns,
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
import { Msgtoshow } from "./Msgtoshow";
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
  /////consts for input intia

  const [state, setState] = React.useState({
    selectedOrganization: [],
    tags: [],
    startDate: new Date(),
    endDate: new Date(),
    status: { label: "Open", value: "Open" },
    data: { BSF: [], ISF: [], MST: [], INNOVATION: [], Technion: [], EU: [] },
    loading: false,
    firstLoading: true,
  });

  const [formState, setFormState] = React.useState({
    tags: false,
  });

  ////////////////
  //New props plan
  if (state.firstLoading) {
    setState({ ...props.searchState, firstLoading: false });
  }

  // search methods

  const searchProposalCalls = () => {
    let orgToSearch = state.selectedOrganization.map((value) => {
      return value.value;
    });

    callsSearch(orgToSearch, state.tags, state.startDate, state.endDate);
  };

  ///////////
  const formValidation = () => {
    let res = {};
    let check = false;

    if (
      state.tags.length === 0 ||
      state.tags === undefined ||
      state.tags === null
    ) {
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
        start_date: moment(startDate).format("DD/MM/YYYY"),
        end_date: moment(endDate).format("DD/MM/YYYY"),
        status: state.status.value,
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
        if ("error" in resp) {
          setMsgState({
            title: "Failed",
            body: "Error while searching for organizations",
            visible: true,
          });
          setState({
            ...state,
            data: {
              BFS: [],
              ISF: [],
              MST: [],
              INNOVATION: [],
              EU: [],
              Technion: [],
            },
            loading: false,
          });

          props.setSearchState({
            ...props.searchState,
            data: {
              BFS: [],
              ISF: [],
              MST: [],
              INNOVATION: [],
              EU: [],
              Technion: [],
            },
          });
        } else {
          setState({ ...state, data: resp, loading: false });

          props.setSearchState({ ...props.searchState, data: resp });
          if (
            resp.BSF.length === 0 &&
            resp.ISF.length === 0 &&
            resp.MST.length === 0 &&
            resp.Technion.length === 0 &&
            resp.EU.length === 0 &&
            resp.INNOVATION.length === 0
          ) {
            setMsgState({
              title: "Success",
              body: "We didn't find any relevant results",
              visible: true,
            });
          }
        }
      })
      .catch((error) => {
        // setState({
        //   ...state,
        //   data: {
        //     BFS: [],
        //     ISF: [],
        //     MST: [],
        //     INNOVATION: [],
        //     EU: [],
        //     Technion: [],
        //   },
        //   loading: false,
        // });
        // props.setSearchState({
        //   ...props.state,
        //   data: {
        //     BFS: [],
        //     ISF: [],
        //     MST: [],
        //     INNOVATION: [],
        //     EU: [],
        //     Technion: [],
        //   },
        // });
        setMsgState({
          title: "Failed",
          body: "Error while searching for organizations",
          visible: true,
        });
        setState({ ...state, loading: false });
      });
  };

  //tags consts------------------

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleChoose = (event) => {
    setState({ ...state, selectedOrganization: event });
    props.setSearchState({ ...props.searchState, selectedOrganization: event });
  };
  /**
   * function for adding a new tag
   * @param {String} tag the tag that the user inserts
   */
  const addTag = (tag) => {
    setState({ ...state, tags: [...state.tags, tag] });
    props.setSearchState({
      ...props.searchState,
      tags: [...state.tags, tag],
    });
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
    let newTags = state.tags.filter((val, i) => i !== idx);
    setState({ ...state, tags: newTags });
    props.setSearchState({ ...props.searchState, tags: newTags });
  };

  const dragTag = (tag, currPos, newPos) => {};

  //date

  const handleStartDateChange = (date) => {
    setState({ ...state, startDate: date });
    props.setSearchState({ ...props.searchState, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setState({ ...state, endDate: date });
    props.setSearchState({ ...props.searchState, endDate: date });
  };
  //open closed megration

  const handleChange = (event) => {
    setState({ ...state, status: event });
    props.setSearchState({ ...props.searchState, status: event });
  };

  return (
    <React.Fragment>
      <Msgtoshow
        {...msgState}
        handleClose={() => setMsgState({ ...msgState, visible: false })}
      />
      <h1 style={{ textAlign: "center", fontSize: "50px", marginTop: "30px" }}>
        Search For Calls
      </h1>

      <div className="SearchCom">
        <div className="searchMultiSelect">
          <h2 id="textFontFamily" className="textEdit">
            Organizations
          </h2>
          <FormControl id="text_select">
            <MultiSelect
              options={MultiSelectOptions}
              styles={customStyles}
              value={state.selectedOrganization}
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
            tags={state.tags}
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
              value={state.startDate}
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
              value={state.endDate}
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
              value={state.status}
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
          {state.data && state.data.EU.length === 0 ? null : (
            <ResultsTable
              title={"EU"}
              columns={EU_columns}
              data={state.data.EU}
            />
          )}
          {state.data && state.data.Technion.length === 0 ? null : (
            <ResultsTable
              title={"Technion"}
              columns={Technion_columns}
              data={state.data.Technion}
            />
          )}
          {state.data && state.data.BSF.length === 0 ? null : (
            <ResultsTable
              title={"BSF"}
              columns={BSF_columns}
              data={state.data.BSF}
            />
          )}
          {state.data && state.data.INNOVATION.length === 0 ? null : (
            <ResultsTable
              title={"Innovation Israel"}
              columns={INNOVATION_columns}
              data={state.data.INNOVATION}
            />
          )}
          {state.data && state.data.ISF.length === 0 ? null : (
            <ResultsTable
              title={"ISF"}
              columns={ISF_columns}
              data={state.data.ISF}
            />
          )}

          {state.data && state.data.MST.length === 0 ? null : (
            <ResultsTable
              title={"Ministry Of Science And Technology"}
              columns={MST_columns}
              data={state.data.MST}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Search;
