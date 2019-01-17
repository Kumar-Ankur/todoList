import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import images from "./images/ankur.JPG";
import "./App.css";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import DatePicker from "material-ui/DatePicker";
import { List, ListItem } from "material-ui/List";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionGrade from "material-ui/svg-icons/action/alarm";
import ContentSend from "material-ui/svg-icons/action/settings";
import SignOut from "material-ui/svg-icons/action/dashboard";
import Home from "material-ui/svg-icons/action/home";
import Contact from "material-ui/svg-icons/action/perm-phone-msg";
import store from "store";
import moment from "moment";
import { setTimeout } from "timers";
import Dialog from "material-ui/Dialog";
import { Link } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";

const style = {
  marginLeft: 120,
  marginTop: 50
};

class todoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      category: "",
      description: "",
      email: "",
      priority: "",
      date: moment(new Date()).format("MM-DD-YYYY"),
      message: "",
      open: false,
      disableYearSelection: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogout() {
    store.remove("user");
  }

  componentWillMount() {
    let email = store.get("user");
    let BaseUrl = `/login/${email}`;
    fetch(BaseUrl)
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({ name: res.name, email: res.email });
      });
  }

  handleClick(e) {
    e.preventDefault();
    var payload = {
      category: this.state.category,
      email: this.state.email,
      description: this.state.description,
      priority: this.state.priority,
      date: this.state.date,
      progress: 0
    };

    fetch("/profile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            category: "",
            email: "",
            description: "",
            priority: "",
            date: new Date(),
            message: "Task has been added Successfully. Check your Inbox"
          });
          var self = this;
          setTimeout(function() {
            self.setState({
              message: ""
            });
          }, 5000);
          console.log("inserted");
        } else {
          console.log("error in insertion");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    const textStyle = {
      width: 400
    };

    const actions = [
      <FlatButton label="OK" primary={true} onClick={this.handleClose} />
    ];

    const isDisabled =
      this.state.category !== "" &&
      this.state.description !== "" &&
      this.state.priority !== "" &&
      this.state.date !== "";

    const rightButtons = (
      <div>
        <a href="#">
          <img src={images} className="avatarStyle" />
        </a>
      </div>
    );
    return (
      <div>
        <MuiThemeProvider>
          <AppBar title="Profile"/>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 listStyle">
                <List>
                  <Link to="/inbox">
                    <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
                  </Link>
                  <Link to="/task">
                    <ListItem
                      primaryText="Next 7 Days Task"
                      leftIcon={<ActionGrade />}
                    />
                  </Link>
                  <Link to="/setting">
                    <ListItem
                      primaryText="Settings"
                      leftIcon={<ContentSend />}
                    />
                  </Link>
                  <ListItem
                    primaryText="Contact Us"
                    leftIcon={<Contact />}
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
                        Need personal assistance? Give us a call at
                        1800-XXX-XXXX(Toll Free)
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
                    <ListItem
                      primaryText="Sign Out"
                      leftIcon={<SignOut />}
                      onClick={this.handleLogout}
                    />
                  </Link>
                  <Link to="/">
                    <ListItem primaryText="Home" leftIcon={<Home />} />
                  </Link>
                </List>
              </div>
              <div className="col-md-9">
                <h1 className="headerStyle1">Welcome {this.state.name}</h1>
                <form className="formStyle1">
                  <p className="messStyle">{this.state.message}</p>
                  <TextField
                    hintText="eg. Work, Movie to Watch, Personal, Others"
                    floatingLabelText="Task Category"
                    style={textStyle}
                    onChange={(event, newValue) =>
                      this.setState({ category: newValue })
                    }
                    value={this.state.category}
                  />
                  <br />
                  <TextField
                    hintText="Task Description"
                    floatingLabelText="Task description"
                    style={textStyle}
                    multiLine={true}
                    onChange={(event, value) =>
                      this.setState({ description: value })
                    }
                    value={this.state.description}
                  />
                  <br />
                  <TextField
                    hintText="High, Medium, Low"
                    floatingLabelText="Priority"
                    style={textStyle}
                    onChange={(event, newPriority) =>
                      this.setState({ priority: newPriority })
                    }
                    value={this.state.priority}
                  />
                  <br />
                  <br />
                  <DatePicker
                    textFieldStyle={{ width: "43%" }}
                    hintText="Task Date"
                    minDate={new Date()}
                    formatDate={date => moment(date).format("MM/DD/YYYY")}
                    value={new Date(this.state.date)}
                    onChange={(event, newDate) => {
                      this.setState({
                        date: moment(newDate).format("MM/DD/YYYY")
                      });
                    }}
                  />

                  <RaisedButton
                    label="Add Task"
                    primary={true}
                    disabled={!isDisabled}
                    style={style}
                    onClick={event => this.handleClick(event)}
                  />
                </form>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default todoList;
