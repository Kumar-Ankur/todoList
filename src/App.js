import React, { Component } from "react";
import "./App.css";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import Dialog from "material-ui/Dialog";
import { Link } from "react-router-dom";
import store from "store";

const styles = {
  title: {
    cursor: "pointer"
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false, isLoggedIn: false };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    let localDataCheck = store.get("user");
    if (localDataCheck) {
      console.log(localDataCheck);
      this.setState({ isLoggedIn: true });
    }
  }

  handleLogout = () => {
    store.remove("user");
    this.setState({ isLoggedIn: false });
  };
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const buttonStyle = {
      backgroundColor: "transparent",
      color: "white"
    };

    const actions = [
      <FlatButton label="OK" primary={true} onClick={this.handleClose} />
    ];

    const rightButtons = (
      <div>
        <FlatButton
          label="Contact us"
          style={buttonStyle}
          onClick={this.handleOpen}
        />

        <Dialog
          title="Contact Us"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <div>
            <p>
              Need personal assistance? Give us a call at 1800-XXX-XXXX(Toll
              Free)
            </p>
            <p>
              {" "}
              Drop a mail at{" "}
              <a href="mailto:admin@tdl.com?subject=Need Some Assistance">
                support@tdl.com{" "}
              </a>
            </p>
          </div>
        </Dialog>

        <Link to="/Login">
          <FlatButton label="Login" style={buttonStyle} />
        </Link>
        <Link to="/Register">
          <FlatButton label="Create a Free Account" style={buttonStyle} />
        </Link>
      </div>
    );

    const rightButtonsLogOut = (
      <div>
        <FlatButton
          label="Contact us"
          style={buttonStyle}
          onClick={this.handleOpen}
        />

        <Dialog
          title="Contact Us"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <div>
            <p>
              Need personal assistance? Give us a call at 1800-XXX-XXXX(Toll
              Free)
            </p>
            <p>
              {" "}
              Drop a mail at{" "}
              <a href="mailto:admin@tdl.com?subject=Need Some Assistance">
                support@tdl.com{" "}
              </a>
            </p>
          </div>
        </Dialog>

        <Link to="/">
          <FlatButton
            label="Logout"
            style={buttonStyle}
            onClick={this.handleLogout}
          />
        </Link>
      </div>
    );

    return (
      <div className="bodyStyle">
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <AppBar
            title={<span style={styles.title}>TDL</span>}
            iconElementRight={
              this.state.isLoggedIn ? rightButtonsLogOut : rightButtons
            }
          />
        </MuiThemeProvider>
        <div className="headerStyle">
          <h1 className="h1Style">“DON'T REMEMBER WHAT TO DO NEXT ? LEAVE THAT TO US !!!!!"</h1>
          <span className="subHeader">
            TDL is a innovative platform to-do list app for your browser, that
            remind you to complete your task within time.
          </span>
          <br />
          {this.state.isLoggedIn ? (
            <Link to="/todolist">
              <button className="btn btn-primary buttonStyle">
                Visit Profile
              </button>
            </Link>
          ) : (
            <Link to="/Login">
              <button className="btn btn-primary buttonStyle">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default App;
