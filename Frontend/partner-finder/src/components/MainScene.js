import React from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core/";
import { BeatLoader } from "react-spinners";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import moment from "moment";
import { Msgtoshow } from "./Msgtoshow";
import { BACKEND_URL } from "../utils";
import Search from "./Search";
import GetAlerts from "./Alert";
import GetUpdates from "./Getcalls";
/**
 * build the main scene with all the components we build for search,alerts and updates
 */
function MainScene(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

MainScene.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  tabsText: {
    fontSize: "24px",
    fontWeight: "300",
  },
  indicator: { backgroundColor: "#ececec" },
}));

export default function NavTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [state, setState] = React.useState({
    firstLoading: true,
  });
  const [msgState, setMsgState] = React.useState({
    title: "",
    body: "",
    visible: false,
  });
  const changeDate = () => {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  };
  const [searchState, setSearchState] = React.useState({
    selectedOrganization: [],
    tags: [],
    startDate: new Date(),
    endDate: changeDate(),
    status: { label: "Open", value: "Open" },
    data: { BSF: [], ISF: [], MST: [], INNOVATION: [], Technion: [], EU: [] },
    loading: false,
  });
  const [updateState, setUpdateState] = React.useState({
    EU: "",
    Technion: "",
    BSF: "",
    INNOVATION: "",
    ISF: "",
    MST: "",
    firstLoading: true,
  });
  /**
   * if we in firstloading situation
   * send request to the database to get the last update time for the database and show it in updates component
   */
  if (updateState.firstLoading) {
    let url = new URL(BACKEND_URL + "updateTime/get_updateTime/");
    fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((resp) => {
        if ("error" in resp) {
          setMsgState({
            title: "Failed",
            body: "Error while getting updates settings",
            visible: true,
          });
          setUpdateState({
            EU: "",
            Technion: "",
            BSF: "",
            INNOVATION: "",
            ISF: "",
            MST: "",
            firstLoading: false,
          });
        } else {
          setUpdateState({
            EU: moment.unix(resp.EU).format("MMMM Do YYYY, h:mm:ss a"),

            Technion: moment
              .unix(resp.Technion)
              .format("MMMM Do YYYY, h:mm:ss a"),
            BSF: moment.unix(resp.BSF).format("MMMM Do YYYY, h:mm:ss a"),
            INNOVATION: moment
              .unix(resp.INNOVATION)
              .format("MMMM Do YYYY, h:mm:ss a"),
            ISF: moment.unix(resp.ISF).format("MMMM Do YYYY, h:mm:ss a"),
            MST: moment.unix(resp.MST).format("MMMM Do YYYY, h:mm:ss a"),
            firstLoading: false,
          });
        }
      })
      .catch((error) => {
        setMsgState({
          title: "Failed",
          body: "Error while getting updates settings",
          visible: true,
        });
        setUpdateState({
          EU: "",
          Technion: "",
          BSF: "",
          INNOVATION: "",
          ISF: "",
          MST: "",
          firstLoading: false,
        });
      });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (state.firstLoading) {
    if (updateState.firstLoading) {
      setState({ ...state, firstLoading: false });
    }
  }

  return (
    <div>
      {state.firstLoading ? (
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
      ) : (
        <div className={classes.root}>
          <Msgtoshow
            {...msgState}
            handleClose={() => setMsgState({ ...msgState, visible: false })}
          />
          <AppBar id="BackgroundColor" position="static">
            <Tabs
              classes={{
                indicator: classes.indicator,
              }}
              variant="fullWidth"
              value={value}
              onChange={handleChange}
            >
              <LinkTab
                label={
                  <span id="textFontFamily" className={classes.tabsText}>
                    Search
                  </span>
                }
                href="/search"
                {...a11yProps(0)}
              />
              <LinkTab
                label={
                  <span id="textFontFamily" className={classes.tabsText}>
                    Alerts
                  </span>
                }
                href="/settings"
                {...a11yProps(1)}
              />
              <LinkTab
                label={
                  <span id="textFontFamily" className={classes.tabsText}>
                    Updates
                  </span>
                }
                href="/updates"
                {...a11yProps(2)}
              />
            </Tabs>
          </AppBar>
          <MainScene value={value} index={0}>
            <Search searchState={searchState} setSearchState={setSearchState} />
          </MainScene>
          <MainScene value={value} index={1}>
            <GetAlerts />
          </MainScene>
          <MainScene value={value} index={2}>
            <GetUpdates updateState={updateState} />
          </MainScene>
        </div>
      )}
    </div>
  );
}
