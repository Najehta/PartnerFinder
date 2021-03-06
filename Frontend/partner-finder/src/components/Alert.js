import React from "react";
import "./Components.css";
import MultiSelect from "react-multi-select-component";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { BACKEND_URL } from "../utils";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core/";
import { BeatLoader } from "react-spinners";
import { Button } from "@material-ui/core";
import { Msgtoshow } from "./Msgtoshow";
import { MultiSelectOptions } from "../utils";

/**Describe for this component
 * this component realize receive alerts from our website that sent every week
 * automatically you can do sucribe to receive alersts
 * and unsubscribe to hide the alerts
 *
 */
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const Alert = (props) => {
  const [msgState, setMsgState] = React.useState({
    title: "",
    body: "",
    visible: false,
  });
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
  // a const that needed to send the state of the selected organiztions in the Multiselect to the backend.
  const [selectedOrganization, setSelectedOrganization] = useState([]);
  /*
Initialization for all the data that will used in this component.
The general state for this page if we in loading this mean that we still in process from the backend. 
.*/
  const [state, setState] = React.useState({
    loading: false,
    firstLoading: true,
    email: "",
  });
  // save the event (the change)that the user do in our variables
  const handleChoose = (event) => {
    setSelectedOrganization(event);
  };
  const classes = useStyles();
  //Save the email input from the user and process it to check if the input is legal email
  const handleInputChange = (event) => {
    let newState = { ...state };
    newState[event.target.id] = event.target.value;
    setState(newState);
    let newFormState = { ...formState };
    if (
      event.target.id !== "email" &&
      (event.target.value > 1 || event.target.value < 0)
    ) {
      newFormState[event.target.id] = true;
    } else {
      newFormState[event.target.id] = false;
    }
    setFormState(newFormState);
  };

  const [formState, setFormState] = React.useState({
    email: false,
  });
  /**
   * Method that do subscribe for the input email sent an request to the backend to add the email to
   * the data base to receive alerts
   */
  const subscribe = () => {
    if (
      selectedOrganization.length === 0 ||
      selectedOrganization === undefined ||
      selectedOrganization === null
    ) {
      setMsgState({
        title: "Error",
        body: "Please choose an organization",
        visible: true,
      });
    } else if (formValidation()) {
      setMsgState({
        title: "Failed",
        body: "Invalid Email",
        visible: true,
      });
    } else {
      setState({ ...state, loading: true });
      let organizations = selectedOrganization.map((value) => {
        return value.value;
      });
      console.log("Email", state.email);
      let email = state.email;
      let params = {
        data: JSON.stringify({
          email: email,
          organizations: organizations,
        }),
      };
      console.log("params:", params);

      let url = new URL(BACKEND_URL + "EmailSubscription/set_emails/");

      //searchParams?
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      fetch(url, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((resp) => {
          if ("Error" in resp) {
            setState({ ...state, loading: false });
            setMsgState({
              title: "Failed",
              body: "The email is already subscribed",
              visible: true,
            });
          } else {
            setState({ ...state, loading: false });
            setMsgState({
              title: "Success",
              body: "You have successfully subscribed",
              visible: true,
            });
          }
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Failed",
            body: "Error while adding the email",
            visible: true,
          });
        });
    }
  };
  /**
   * check if the email in the legal form for example : input@input.input
   */
  const formValidation = () => {
    if (
      !state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ||
      state.email === ""
    ) {
      return true;
    }
    return false;
  };

  /**
   * Method that do unsubscribe for the input email sent an request to the backend to remove the email from
   * the data base to hide alerts
   */
  const unsubscribe = () => {
    if (formValidation()) {
      setMsgState({
        title: "Failed",
        body: "Invalid Email",
        visible: true,
      });
    } else {
      setState({ ...state, loading: true });
      let organizations = selectedOrganization.map((value) => {
        return value.value;
      });

      let params = {
        data: JSON.stringify({
          email: state.email,
          organizations: organizations,
        }),
      };
      let url = new URL(BACKEND_URL + "EmailSubscription/delete_email/");
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      fetch(url, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((resp) => {
          if ("Error" in resp) {
            setState({ ...state, loading: false });
            setMsgState({
              title: "Error",
              body: "This email did not subscribed yet",
              visible: true,
            });
          } else {
            setState({ ...state, loading: false });
            setMsgState({
              title: "Success",
              body: "Unsubscribed successfully",
              visible: true,
            });
          }
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Failed",
            body: "Error while unsubscribe the email",
            visible: true,
          });
        });
    }
  };

  return (
    <React.Fragment>
      <Msgtoshow
        {...msgState}
        handleClose={() => setMsgState({ ...msgState, visible: false })}
      />

      <h1 style={{ textAlign: "center", fontSize: "50px", marginTop: "30px" }}>
        Alert Subscription
      </h1>

      <div className="Alerts">
        <div className="email">
          <h2 className="test">Email</h2>
          <TextField
            id="email"
            style={{
              borderRadius: "3px",
              width: "95%",
              height: "100px",
              backgroundColor: "white",
            }}
            onChange={handleInputChange}
            className={Alert.textField}
            value={state.email}
            error={formState.email}
            autoComplete="email"
            margin="normal"
            variant="outlined"
          />
        </div>
        <div className="emailMultiSelect">
          <h2 id="textFontFamily" style={{ color: "black" }}>
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

        <div className="subButton">
          <Button
            color="primary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => subscribe()}
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
            {state && !state.loading && <span>Subscribe</span>}
          </Button>

          <Button
            color="secondary"
            round
            variant="contained"
            id="BackgroundColor"
            onClick={() => unsubscribe()}
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
            {state && !state.loading && <span>Unsubscribe</span>}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Alert;
