import React from "react";
import "./Components.css";
import { Button } from "@material-ui/core";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core/";
import { Msgtoshow } from "./Msgtoshow";
import { BACKEND_URL } from "../utils";
import { BeatLoader } from "react-spinners";
/**
 * in this component we will realize the updates for the database
 * we will wend successful for the user if the system start to update the desirable database
 * and an error in fall cases
 */
const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    fontSize: 30,
  },
}));
const Getcalls = (props) => {
  // Intialize all the data for this component
  const classes = useStyles();

  const [state, setState] = React.useState({
    EU: "",
    Technion: "",
    BSF: "",
    INNOVATION: "",
    ISF: "",
    MST: "",
    firstLoading: true,
  });
  /**if the component in the first loading  we will check if there data saved in the main scene to this component and show it
   * data like reselts table inputs from the user using the Properties and local state
   */
  if (state.firstLoading) {
    setState({ ...props.updateState });
  }
  /**
   * request to the data base to update BSF database
   */
  const updateBsf = () => {
    setState({ ...state, loading: false });

    let params = {
      data: JSON.stringify({
        organizations: ["BSF"],
      }),
    };
    let url = new URL(BACKEND_URL + "update/call_update/");
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
            body: "Error while updating BSF  data.",
            visible: true,
          });
        } else {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Success",
            body: "BSF data has been updated successfully.",
            visible: true,
          });
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        setMsgState({
          title: "Failed",
          body: "Error while updating BSF data",
          visible: true,
        });
      });
  };
  /**
   * request to the data base to update ISF database
   */
  const updateIsf = () => {
    setState({ ...state, loading: false });

    let params = {
      data: JSON.stringify({
        organizations: ["ISF"],
      }),
    };

    let url = new URL(BACKEND_URL + "update/call_update/");

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
            body: "Error while updating ISF data.",
            visible: true,
          });
        } else {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Success",
            body: "ISF data has been updated successfully.",
            visible: true,
          });
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        setMsgState({
          title: "Failed",
          body: "Error while updating ISF data",
          visible: true,
        });
      });
  };
  /**
   * request to the data base to update Ministry of science database
   */
  const updateMst = () => {
    setState({ ...state, loading: false });

    let params = {
      data: JSON.stringify({
        organizations: ["MST"],
      }),
    };

    let url = new URL(BACKEND_URL + "update/call_update/");

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
            body: "Error while updating Ministry of science and technology data.",
            visible: true,
          });
        } else {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Success",
            body: "Ministry of Science and Technology data has been updated successfully.",
            visible: true,
          });
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        setMsgState({
          title: "Failed",
          body: "Error while updating Ministry of Science and Technology data",
          visible: true,
        });
      });
  };
  /**
   * request to the data base to update Innovation Israel database
   */
  const updateInnovation = () => {
    setState({ ...state, loading: false });

    let params = {
      data: JSON.stringify({
        organizations: ["INNOVATION"],
      }),
    };

    let url = new URL(BACKEND_URL + "update/call_update/");

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
            body: "Error while updating Innovation Israel data.",
            visible: true,
          });
        } else {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Success",
            body: "Innovation Israel data has been updated successfully.",
            visible: true,
          });
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        setMsgState({
          title: "Failed",
          body: "Error while updating Innovation Israel data",
          visible: true,
        });
      });
  };
  /**
   * request to the data base to update Technion database
   */
  const updateTechnion = () => {
    setState({ ...state, loading: false });

    let params = {
      data: JSON.stringify({
        organizations: ["Technion"],
      }),
    };

    let url = new URL(BACKEND_URL + "update/call_update/");

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
            body: "Error while updating the Others via Technion data.",
            visible: true,
          });
        } else {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Success",
            body: "Others via Technion data has been updated successfully.",
            visible: true,
          });
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        setMsgState({
          title: "Failed",
          body: "Error while updating Others via Technion data",
          visible: true,
        });
      });
  };
  /**
   * request to the data base to update EU database
   */
  const updateEu = () => {
    setState({ ...state, loading: false });

    let params = {
      data: JSON.stringify({
        organizations: ["EU"],
      }),
    };

    let url = new URL(BACKEND_URL + "update/call_update/");

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
            body: "Error while updating EU data.",
            visible: true,
          });
        } else {
          setState({ ...state, loading: false });
          setMsgState({
            title: "Success",
            body: "EU data has been updated successfully.",
            visible: true,
          });
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        setMsgState({
          title: "Failed",
          body: "Error while updating EU data",
          visible: true,
        });
      });
  };

  const [msgState, setMsgState] = React.useState({
    title: "",
    body: "",
    visible: false,
  });

  return (
    <React.Fragment>
      <Msgtoshow
        {...msgState}
        handleClose={() => setMsgState({ ...msgState, visible: false })}
      />
      <div className="getCalls">
        <h1 style={{ fontSize: "2.7vw" }}>Updates</h1>
        <div className="UpdateParent">
          <div className="BsfUpdate">
            <h2 style={{ fontSize: "1.8vw" }}>BSF</h2>
            <h3
              style={{
                display: "inline-block",
                "margin-left": "2.9vw",
                fontSize: "1.4vw",
              }}
            >
              Last Update :
            </h3>
            <h3
              style={{
                display: "inline-block",
                fontSize: "1vw",
                marginLeft: "1vw",
              }}
            >
              {state.BSF}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateBsf()}
              disabled={state.loading}
              style={{
                "margin-left": "2.9vw",
                "margin-top": "20px",
                display: "block",
              }}
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
              {state && !state.loading && <span>Update Now</span>}
            </Button>
          </div>
          <div className="IsfUpdate">
            <h2 style={{ fontSize: "1.8vw" }}>ISF</h2>
            <h3
              style={{
                display: "inline-block",
                "margin-left": "2.9vw",
                fontSize: "1.4vw",
              }}
            >
              Last Update :
            </h3>
            <h3
              style={{
                display: "inline-block",
                fontSize: "1vw",
                marginLeft: "1vw",
              }}
            >
              {state.ISF}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateIsf()}
              disabled={state.loading}
              style={{
                "margin-left": "2.9vw",
                "margin-top": "20px",
                display: "block",
              }}
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
              {state && !state.loading && <span>Update Now</span>}
            </Button>
          </div>
          <div className="MstUpdate">
            <h2 style={{ fontSize: "1.8vw" }}>
              Ministry Of Science And Technology
            </h2>
            <h3
              style={{
                display: "inline-block",
                "margin-left": "2.9vw",
                fontSize: "1.4vw",
              }}
            >
              Last Update :
            </h3>
            <h3
              style={{
                display: "inline-block",
                fontSize: "1vw",
                marginLeft: "1vw",
              }}
            >
              {state.MST}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateMst()}
              disabled={state.loading}
              style={{
                "margin-left": "2.9vw",
                "margin-top": "20px",
                display: "block",
              }}
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
              {state && !state.loading && <span>Update Now</span>}
            </Button>
          </div>
          <div className="InnovationUpdate">
            <h2 style={{ fontSize: "1.8vw" }}>Innovation Israel</h2>
            <h3
              style={{
                display: "inline-block",
                "margin-left": "2.9vw",
                fontSize: "1.4vw",
              }}
            >
              Last Update :
            </h3>
            <h3
              style={{
                display: "inline-block",
                fontSize: "1vw",
                marginLeft: "1vw",
              }}
            >
              {state.INNOVATION}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateInnovation()}
              disabled={state.loading}
              style={{
                "margin-left": "2.9vw",
                "margin-top": "20px",
                display: "block",
              }}
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
              {state && !state.loading && <span>Update Now</span>}
            </Button>
          </div>
          <div className="TechnionUpdate">
            <h2 style={{ fontSize: "1.8vw" }}>Others Via Technion</h2>
            <h3
              style={{
                display: "inline-block",
                "margin-left": "2.9vw",
                fontSize: "1.4vw",
              }}
            >
              Last Update :
            </h3>
            <h3
              style={{
                display: "inline-block",
                fontSize: "1vw",
                marginLeft: "1vw",
              }}
            >
              {state.Technion}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateTechnion()}
              disabled={state.loading}
              style={{
                "margin-left": "2.9vw",
                "margin-top": "20px",
                display: "block",
              }}
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
              {state && !state.loading && <span>Update Now</span>}
            </Button>
          </div>
          <div className="EuUpdate">
            <h2 style={{ fontSize: "1.8vw" }}>EU</h2>
            <h3
              style={{
                display: "inline-block",
                "margin-left": "2.9vw",
                fontSize: "1.4vw",
              }}
            >
              Last Update :
            </h3>
            <h3
              style={{
                display: "inline-block",
                fontSize: "1vw",
                marginLeft: "1vw",
              }}
            >
              {state.EU}
            </h3>
            <Button
              color="primary"
              round
              variant="contained"
              id="BackgroundColor"
              onClick={() => updateEu()}
              disabled={state.loading}
              style={{
                "margin-left": "2.9vw",
                "margin-top": "20px",
                display: "block",
              }}
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
              {state && !state.loading && <span>Update Now</span>}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Getcalls;
