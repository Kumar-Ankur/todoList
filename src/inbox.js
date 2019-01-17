import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { List, ListItem } from "material-ui/List";
import "./App.css";
import images from "./images/ankur.JPG";
import store from "store";
import { Link } from "react-router-dom";
import ContentInbox from "material-ui/svg-icons/action/alarm-add";
import ActionGrade from "material-ui/svg-icons/action/alarm";
import ContentSend from "material-ui/svg-icons/action/settings";
import SignOut from "material-ui/svg-icons/action/dashboard";
import Home from "material-ui/svg-icons/action/home";
import Contact from "material-ui/svg-icons/action/perm-phone-msg";
import RaisedButton from "material-ui/RaisedButton";
import AutoComplete from "material-ui/AutoComplete";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import moment from "moment";
import TextField from "material-ui/TextField";
import CircularProgress from "material-ui/CircularProgress";
import DatePicker from "material-ui/DatePicker";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import { setTimeout } from "timers";

const style = {
  margin: 12
};

const rowStyle = {
  fontSize: 15,
  fontFamily: "Georgia"
};

const sortStyle = {
  marginLeft: 40
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      results: [],
      description1: [],
      category1: [],
      priority1: [],
      open: false,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      filters: { search: "", categories: [], priorities: [] },
      selectedRow: [],
      category: "",
      description: "",
      priority: "",
      date: "",
      id: "",
      message: "",
      errorProgress: "",
      progress: "",
      sortPreference: "taskAsc"
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleOpen1 = this.handleOpen1.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.editTask = this.editTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.setResults = this.setResults.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOpen2 = this.handleOpen2.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.taskSortAsc = this.taskSortAsc.bind(this);
    this.taskSortDsc = this.taskSortDsc.bind(this);
    this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
    this.handlePriorityFilter = this.handlePriorityFilter.bind(this);
    this.filteredData = this.filteredData.bind(this);
    this.filteredPriorityData = this.filteredPriorityData.bind(this);
  }

  handleOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  };

  handleLogout() {
    store.remove("user");
  }

  onRowSelection(key) {
    this.setState({
      category: this.state.results[key].category,
      description: this.state.results[key].description,
      priority: this.state.results[key].priority,
      date: this.state.results[key].date,
      progress: this.state.results[key].progress,
      id: this.state.results[key]._id
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleOpen1 = () => {
    this.setState({ open1: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClose1 = () => {
    this.setState({ open1: false });
  };

  deleteTask = () => {
    console.log("delete task");
    var payload = {
      category: this.state.category,
      description: this.state.description,
      priority: this.state.priority,
      date: this.state.date,
      progress: this.state.progress
    };
    console.log(payload);
    fetch(`/profile/${this.state.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => {
      console.log(res);
      let email = store.get("user");
      fetch(`/profile/${email}`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          this.setState(
            {
              data: res,
              description1: Object.keys(
                res
                  .map(data => {
                    return data.description;
                  })
                  .reduce((a, b) => {
                    a[b] = 0;
                    return a;
                  }, {})
              ),
              priority1: Object.keys(
                res
                  .map(data => {
                    return data.priority;
                  })
                  .reduce((a, b) => {
                    a[b] = 0;
                    return a;
                  }, {})
              ),
              category1: Object.keys(
                res
                  .map(data => {
                    return data.category;
                  })
                  .reduce((a, b) => {
                    a[b] = 0;
                    return a;
                  }, {})
              )
            },
            () => this.setResults()
          );
        });
      console.log(res);

      this.setState({
        message: "Task has been Deleted Successfully",
        open1: false
      });
      var self = this;
      setTimeout(function() {
        self.setState({ message: " " });
      }, 5000);
    });
  };

  editTask = () => {
    console.log("edit task");
    var payload = {
      category: this.state.category,
      description: this.state.description,
      priority: this.state.priority,
      date: this.state.date,
      progress: this.state.progress
    };
    fetch(`/profile/${this.state.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => {
      console.log(res);
      let email = store.get("user");
      fetch(`/profile/${email}`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          this.setState(
            {
              data: res,
              description1: Object.keys(
                res
                  .map(data => {
                    return data.description;
                  })
                  .reduce((a, b) => {
                    a[b] = 0;
                    return a;
                  }, {})
              ),
              priority1: Object.keys(
                res
                  .map(data => {
                    return data.priority;
                  })
                  .reduce((a, b) => {
                    a[b] = 0;
                    return a;
                  }, {})
              ),
              category1: Object.keys(
                res
                  .map(data => {
                    return data.category;
                  })
                  .reduce((a, b) => {
                    a[b] = 0;
                    return a;
                  }, {})
              )
            },
            () => this.setResults()
          );
        });
      this.setState({
        message: "Task has been Updated Successfully",
        open: false
      });
      var self = this;
      setTimeout(function() {
        self.setState({ message: " " });
      }, 5000);
    });
  };

  componentWillMount() {
    let email = store.get("user");
    fetch(`/profile/${email}`)
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({
          data: res,
          description1: Object.keys(
            res
              .map(data => {
                return data.description;
              })
              .reduce((a, b) => {
                a[b] = 0;
                return a;
              }, {})
          ),
          priority1: Object.keys(
            res
              .map(data => {
                return data.priority;
              })
              .reduce((a, b) => {
                a[b] = 0;
                return a;
              }, {})
          ),
          category1: Object.keys(
            res
              .map(data => {
                return data.category;
              })
              .reduce((a, b) => {
                a[b] = 0;
                return a;
              }, {})
          )
        });
        this.setResults();
      });
  }

  handleSearch(e) {
    this.setState(
      {
        filters: {
          ...this.state.filters,
          ...{ search: e }
        }
      },
      () => this.setResults()
    );
  }

  progressValidator(event, value) {
    if (value >= 0 && value <= 100) {
      this.setState({ progress: event.target.value, errorProgress: "" });
    } else {
      this.setState({ errorProgress: "Please enter value within 0-100" });
    }
  }
  setResults() {
    let results = [...this.state.data];
    let descFilter = this.state.filters.search;
    let categoryfilter1 = this.state.filters.categories;
    let priorityFilter1 = this.state.filters.priorities;
    results =
      descFilter.length === 0
        ? results
        : results.filter(result => {
            return result.description.includes(descFilter);
          });

    results =
      categoryfilter1.length === 0
        ? results
        : results.filter(
            result => categoryfilter1.indexOf(result.category) >= 0
          );

    results =
      priorityFilter1.length === 0
        ? results
        : results.filter(
            result => priorityFilter1.indexOf(result.priority) >= 0
          );

    switch (this.state.sortPreference) {
      case "taskAsc":
        results = this.taskSortAsc(results);
        break;

      case "taskDsc":
        results: this.taskSortDsc(results);
        break;
      default:
        results = this.taskSortAsc(results);
        break;
    }
    this.setState({ results });
  }

  handleSort(str) {
    this.setState({ sortPreference: str }, () => this.setResults());
  }

  taskSortAsc(results = []) {
    var taskSort = results.sort((a, b) => {
      return new Date(a["date"]) < new Date(b["date"]) ? -1 : 1;
    });
    return taskSort;
  }

  taskSortDsc(results = []) {
    var taskSort = results.sort((a, b) => {
      return new Date(a["date"]) > new Date(b["date"]) ? -1 : 1;
    });
    return taskSort;
  }

  handleCategoryFilter = () => {
    this.setState({ open3: !this.state.open3 });
  };

  filteredData = e => {
    let categoryfilter = [...this.state.filters.categories];
    let currentValue = e.target.value;
    let isActive = e.target.checked;
    let index = categoryfilter.indexOf(currentValue);

    categoryfilter =
      index < 0 && isActive === true
        ? [...categoryfilter, currentValue]
        : [
            ...categoryfilter.slice(0, index),
            ...categoryfilter.slice(index + 1)
          ];
    console.log(categoryfilter);
    this.setState(
      {
        filters: {
          ...this.state.filters,
          ...{ categories: categoryfilter }
        }
      },
      () => this.setResults()
    );
  };

  handlePriorityFilter = () => {
    this.setState({ open4: !this.state.open4 });
  };

  filteredPriorityData = e => {
    let priorityFilter = [...this.state.filters.priorities];
    let currentValue = e.target.value;
    let isActive = e.target.checked;
    let index = priorityFilter.indexOf(currentValue);

    priorityFilter =
      index < 0 && isActive === true
        ? [...priorityFilter, currentValue]
        : [
            ...priorityFilter.slice(0, index),
            ...priorityFilter.slice(index + 1)
          ];
    this.setState(
      {
        filters: {
          ...this.state.filters,
          ...{ priorities: priorityFilter }
        }
      },
      () => this.setResults()
    );
  };

  render() {
    const textStyle = {
      width: 400
    };

    const rightButtons = (
      <div>
        <a href="#">
          <img src={images} className="avatarStyle" />
        </a>
      </div>
    );
    const isDisabled =
      this.state.description !== 0 &&
      this.state.category !== 0 &&
      this.state.priority !== 0 &&
      this.state.date !== 0 &&
      this.state.errorProgress === "";

    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton
        label="Edit"
        primary={true}
        disabled={!isDisabled}
        onClick={this.editTask}
      />
    ];

    const contactActions = [
      <FlatButton label="OK" primary={true} onClick={this.handleClose2} />
    ];

    const deleteActions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose1} />,
      <FlatButton label="Delete" primary={true} onClick={this.deleteTask} />
    ];

    var renderData = this.state.results.map((data, key) => {
      return (
        <TableRow key={key}>
          <TableRowColumn style={rowStyle}>{data.category}</TableRowColumn>
          <TableRowColumn style={rowStyle}>{data.description}</TableRowColumn>
          <TableRowColumn style={rowStyle}>{data.priority}</TableRowColumn>
          <TableRowColumn style={rowStyle}>{data.date}</TableRowColumn>
          <TableRowColumn style={rowStyle}>
            <CircularProgress mode="determinate" value={data.progress} />
          </TableRowColumn>
          <TableRowColumn style={rowStyle}>
            {data.progress === 0
              ? "Not Started"
              : data.progress > 0 && data.progress <= 80
                ? "In Progress"
                : data.progress > 81 && data.progress <= 99
                  ? "Almost Done"
                  : "Completed"}
          </TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label="Edit Task"
              primary={true}
              style={style}
              onClick={this.handleOpen}
            />
            <Dialog
              title="Edit Task"
              actions={actions}
              modal={true}
              open={this.state.open}
            >
              <div>
                <form>
                  <TextField
                    hintText="eg. Work, Personal, Movie to Watch, Others"
                    floatingLabelText="Task Category"
                    style={textStyle}
                    multiLine={true}
                    onChange={(event, value) =>
                      this.setState({ category: value })
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
                  <TextField
                    type="number"
                    floatingLabelText="Progress"
                    style={textStyle}
                    errorText={this.state.errorProgress}
                    onChange={(event, v) => this.progressValidator(event, v)}
                    value={this.state.progress}
                  />
                  <br />
                  <DatePicker
                    textFieldStyle={{ width: "56%" }}
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
                </form>
              </div>
            </Dialog>
          </TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label="Delete Task"
              secondary={true}
              style={style}
              onClick={this.handleOpen1}
            />
            <Dialog
              title="Delete Confirmation"
              actions={deleteActions}
              modal={true}
              open={this.state.open1}
            >
              <div className="deleteStyle">
                Your Task will be Permanently Deleted !!!!
                <br />
                Are you Sure you want to Delete Task ??
              </div>
            </Dialog>
          </TableRowColumn>
        </TableRow>
      );
    });

    var filterCategoryCheckBox = this.state.category1.map((loc, key) => {
      return (
        <div key={key} className="form-style checkboxStyle">
          <input
            type="checkbox"
            name="category"
            checked={this.state.filters.categories.indexOf(loc) >= 0}
            onChange={e => this.filteredData.call(this, e)}
            value={loc}
          />
          &nbsp;&nbsp;{loc}
        </div>
      );
    });

    var filterPriorityCheckBox = this.state.priority1.map((loc, key) => {
      return (
        <div key={key} className="form-style checkboxStyle">
          <input
            type="checkbox"
            name="priority"
            checked={this.state.filters.priorities.indexOf(loc) >= 0}
            onChange={e => this.filteredPriorityData.call(this, e)}
            value={loc}
          />&nbsp;&nbsp;{loc}
        </div>
      );
    });

    return (
      <div>
        <MuiThemeProvider>
          <AppBar title="Inbox" />
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2 listStyle">
                <List>
                  <Link to="/todolist">
                    <ListItem
                      primaryText="Add Task"
                      leftIcon={<ContentInbox />}
                    />
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
                    onClick={this.handleOpen2}
                  />
                  <Dialog
                    title="Contact Us"
                    actions={contactActions}
                    modal={true}
                    open={this.state.open2}
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
              <div className="col-md-10 inboxStyle">
                <AutoComplete
                  hintText="Enter Task"
                  floatingLabelText="Search with Task Description..."
                  dataSource={this.state.description1}
                  openOnFocus={true}
                  fullWidth={true}
                  onNewRequest={value => this.handleSearch.call(this, value)}
                  onUpdateInput={value => this.handleSearch.call(this, value)}
                  filter={(searchText, key) => true}
                />
                <p className="messStyle">{this.state.message}</p>
                <div className="funcStyle">
                  <strong className="filterStyle">Sort By Task Date: </strong>
                  <RaisedButton
                    label="Ascending"
                    primary={true}
                    style={sortStyle}
                    onClick={() => this.handleSort.call(this, "taskAsc")}
                  />
                  <RaisedButton
                    label="Descending"
                    secondary={true}
                    style={sortStyle}
                    onClick={() => this.handleSort.call(this, "taskDsc")}
                  />
                  <strong className="filterStyle">Filter By: </strong>
                  <RaisedButton
                    label="Category"
                    primary={true}
                    style={sortStyle}
                    onClick={this.handleCategoryFilter}
                  />

                  <RaisedButton
                    label="Priority"
                    secondary={true}
                    style={sortStyle}
                    onClick={this.handlePriorityFilter}
                  />

                  {/* Drawer for Category filter */}
                  <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open3}
                    onRequestChange={open => this.setState({ open3: open })}
                  >
                    <MenuItem>{filterCategoryCheckBox}</MenuItem>
                  </Drawer>

                  {/* Drawer for Priority Filter */}

                  <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open4}
                    openSecondary={true}
                    onRequestChange={open => this.setState({ open4: open })}
                  >
                    <MenuItem>{filterPriorityCheckBox}</MenuItem>
                  </Drawer>
                </div>

                <div className="tableStyle">
                  <Table onRowSelection={this.onRowSelection}>
                    <TableHeader
                      displaySelectAll={false}
                      adjustForCheckbox={false}
                    >
                      <TableRow>
                        <TableHeaderColumn>CATEGORY</TableHeaderColumn>
                        <TableHeaderColumn>DESCRIPTION</TableHeaderColumn>
                        <TableHeaderColumn>PRIORITY</TableHeaderColumn>
                        <TableHeaderColumn>TASK DATE</TableHeaderColumn>
                        <TableHeaderColumn>PROGRESS</TableHeaderColumn>
                        <TableHeaderColumn>STATUS</TableHeaderColumn>
                        <TableHeaderColumn>EDIT</TableHeaderColumn>
                        <TableHeaderColumn>DELETE</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {renderData}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Index;
