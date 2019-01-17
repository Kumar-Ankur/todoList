import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import images from "./images/ankur.JPG";
import "./App.css";
import { List, ListItem } from "material-ui/List";
import Dialog from "material-ui/Dialog";
import { Link } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionGrade from "material-ui/svg-icons/action/alarm";
import AddInbox from "material-ui/svg-icons/action/alarm-add";
import store from "store";
import Contact from "material-ui/svg-icons/action/perm-phone-msg";
import Home from "material-ui/svg-icons/action/home";
import SignOut from "material-ui/svg-icons/action/dashboard";
import TextField from "material-ui/TextField";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";

const style = {
  margin: 15
};

class setting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      data: [],
      value: 1,
      name: "",
      email: "",
      password: "",
      Contact: "",
      id: "",
      isDisabled: true,
      isEdit: true,
      errorText: "",
      errorText: "",
      confirmErrorText: "",
      genderValue: "",
      message: "",
      emailError: ""
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.emailValidator = this.emailValidator.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleEditClick = e => {
    e.preventDefault();
    this.setState({ isDisabled: false, isEdit: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogout() {
    store.remove("user");
  }

  componentWillMount() {
    var email = store.get("user");
    fetch(`/login/${email}`)
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({
          name: res.name,
          email: res.email,
          password: res.password,
          contact: res.contact,
          genderValue: res.gender,
          id: res._id
        });
        console.log(this.state.genderValue);
        if(this.state.genderValue === 'Male'){
          this.setState({ value : 2});
        }
        else if(this.state.genderValue === 'Female'){
          this.setState({ value : 3});
        }
        else{
          this.setState({ value : 4});
        }
      });
  }

  emailValidator(event) {
    var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (event.target.value.match(pattern)) {
      this.setState({ email: event.target.value, emailError: "" });
    } else {
      this.setState({
        email: event.target.value,
        emailError: "Please enter Valid email address"
      });
    }
  }

  updateTextField(event, value) {
    if (value.length === 10) {
      this.setState({ contact: event.target.value, errorText: "" });
    } else {
      this.setState({
        contact: event.target.value,
        errorText: "Please enter only 10 digits mobile number"
      });
    }
  }

  handleSaveClick = event => {
    event.preventDefault();
    var payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      contact: this.state.contact,
      gender: this.state.genderValue
    };

    fetch(`/login/${this.state.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => {
      console.log(res);
      var email = store.get("user");
      fetch(`
/login/${email}`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          this.setState({
            name: res.name,
            email: res.email,
            password: res.password,
            contact: res.contact,
            genderValue: res.gender,
            id: res._id
          });
        });
      this.setState({
        isEdit: true,
        isDisabled: true,
        message: "Profile has been Updated Successfully"
      });
      var self = this;
      setTimeout(function() {
        self.setState({ message: " " });
      }, 5000);
    });
  };

  render() {
    const textStyle = {
      width: 400
    };

    const dropdownStyle = {
      width: 450
    };

    const rightButtons = (
      <div>
        <a href="#">
          <img src={images} className="avatarStyle" />
        </a>
      </div>
    );

    const actions = [
      <FlatButton label="OK" primary={true} onClick={this.handleClose} />
    ];

    const isdisable =
      this.state.name !== "" &&
      this.state.email !== "" &&
      this.state.password !== "" &&
      this.state.contact !== "" &&
      this.state.errorText === "" &&
      this.state.confirmErrorText === "";
    //   this.state.index !== 1;

    const button = this.state.isEdit ? (
      <RaisedButton
        label="Edit"
        primary={true}
        style={style}
        onClick={event => this.handleEditClick(event)}
      />
    ) : (
      <RaisedButton
        label="Save"
        secondary={true}
        disabled={!isdisable}
        style={style}
        onClick={event => this.handleSaveClick(event)}
      />
    );
    return (
      <div>
        <MuiThemeProvider>
          <AppBar title="Setting" />
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
                  <Link to="/todolist">
                    <ListItem primaryText="Add Task" leftIcon={<AddInbox />} />
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
                <form className="settingStyle">
                  <p className="messStyle">{this.state.message}</p>
                  <TextField
                    hintText="Enter your  Name"
                    floatingLabelText=" Name"
                    style={textStyle}
                    disabled={this.state.isDisabled}
                    value={this.state.name}
                    onChange={(event, newValue) =>
                      this.setState({ name: newValue })
                    }
                  />
                  <br />
                  <TextField
                    hintText="Enter your Email"
                    type="email"
                    floatingLabelText="Email"
                    style={textStyle}
                    disabled={this.state.isDisabled}
                    value={this.state.email}
                    errorText={this.state.emailError}
                    onChange={event => this.emailValidator(event)}
                  />
                  <br />
                  <TextField
                    hintText="Enter your Password"
                    floatingLabelText="Password"
                    style={textStyle}
                    disabled={this.state.isDisabled}
                    value={this.state.password}
                    onChange={(event, newValue) =>
                      this.setState({ password: newValue })
                    }
                  />

                  <br />
                  <TextField
                    type="number"
                    hintText="Enter your Mobile Number"
                    floatingLabelText="Mobile Number"
                    style={textStyle}
                    disabled={this.state.isDisabled}
                    value={this.state.contact}
                    errorText={this.state.errorText}
                    onChange={(event, v) => this.updateTextField(event, v)}
                  />
                  <br />
                  <DropDownMenu
                    value={this.state.value}
                    style={dropdownStyle}
                    disabled={true}
                    autoWidth={false}
                  >
                    <MenuItem value={1} primaryText="Select Gender" />
                    <MenuItem value={2} primaryText="Male" />
                    <MenuItem value={3} primaryText="Female" />
                    <MenuItem value={4} primaryText="Decline to designate" />
                  </DropDownMenu>
                  <br />

                  <br />
                  {button}
                </form>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default setting;
