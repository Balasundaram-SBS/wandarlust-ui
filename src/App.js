import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";

import { Dialog } from 'primereact/dialog';

import Register from './components/Register';
import Login from './components/login';
import Home from './components/home';
import Book from './components/book'
// import StaticPackage from './components/static-packages';
import PlannedTrips from './components/plannedTrips';
import Packages from './components/packages';
import HotDeals from './components/hotdeals';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_userId: sessionStorage.getItem('userId'),
      logged_userName: sessionStorage.getItem('userName'),
      dialog_visible: false,
      logged_out: false
    }
  }

  onClick = (event) => {
    this.setState({ dialog_visible: true })
  }

  onHide = (event) => {
    this.setState({ dialog_visible: false });
  }

  logout = () => {
    
    console.log(this.state.dialog_visible);
    this.setState({ dialog_visible: false });
    sessionStorage.clear();
    //window.location.reload();
    window.location.href = window.location.origin + "/wandarlust-ui";
    this.setState({ logged_out: true });
  }

  confirm_logout = () => {
    this.setState({ dialog_visible: true });
  }

  render() {

    const footer = (
      <div>
        <button name="continue" id="continue" className="btn btn-primary" icon="pi pi-check" onClick={this.onHide} >CONTINUE EXPLORING</button>
        <button name="logout" id="logout" icon="pi pi-times" onClick={this.logout} className="btn btn-secondary" >LOGOUT</button>
      </div>
    );

    return (
      <div>
        <Router>
          <div className="App">
            <nav className="navbar fixed-top navbar-expand-md bg-dark navbar-dark">

              {!this.state.logged_userId ?
                <div className="navbar-header">
                  <Link
                    className="navbar-brand textHover"
                    onClick={
                      () => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: 'smooth'
                        })
                      }}
                    to="/home">Start Wandering</Link>
                </div> :
                <div className="navbar-header">
                  <Link
                    className="navbar-brand textHover"
                    onClick={
                      () => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: 'smooth'
                        })
                      }}
                    to={"/home/" + this.state.logged_userId}>Start Wandering</Link>
                </div>}

              <ul className="navbar-nav ml-auto">

                {this.state.logged_userId ?
                  <li className="nav-item">
                    <Link
                      className="nav-link textHover"
                      onClick={
                        () => {
                          window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                          })
                        }}
                      to={"/home/" + this.state.logged_userId} >Welcome {this.state.logged_userName}</Link>
                  </li> : null}

                <li className="nav-item">
                  <Link
                    className="nav-link textHover"
                    onClick={
                      () => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: 'smooth'
                        })
                      }}
                    to="/packages">Hot Deals </Link>
                </li>

                {this.state.logged_userId ?
                  <li className="nav-item">
                    <Link
                      className="nav-link textHover"
                      onClick={
                        () => {
                          window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                          })
                        }}
                      to={"/viewBookings/" + this.state.logged_userId}>Planned Trips</Link>
                  </li> :
                  <li className="nav-item">
                    <Link
                      onClick={
                        () => {
                          window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                          })
                        }}
                      className="nav-link textHover"
                      to="/viewBookings/">Planned Trips</Link>
                  </li>
                }

                {!this.state.logged_userId ?
                  <li className="nav-item">
                    <Link className="nav-link textHover" to="/login"> Login</Link>
                  </li> : null}

                {this.state.logged_userId ?
                  <li className="nav-item">
                    <Link name='confirmLogout' className="nav-link textHover" onClick={this.confirm_logout} to="/home" >Log Out</Link>
                  </li> : null}
              </ul>

            </nav>

            {this.state.logged_out ? (<Redirect to="/home" />) : null}

            <div className="content-section implementation">
              <Dialog
                header="Confirmation"
                visible={this.state.dialog_visible}
                style={{ width: '50vw' }}
                footer={footer}
                onHide={this.onHide}
              >
                Are you sure you want to logout?
            </Dialog>
            </div>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/home" component={Home}></Route>
              <Route exact path="/home/:userId" component={Home}></Route>
              <Route exact path="/register" component={Register}></Route>
              <Route exact path="/packages" component={HotDeals}></Route>{/* Only HotDeals*/}
              <Route exact path="/packages/:destination" component={Packages}></Route>{/* Destinations with search*/}
              <Route exact path="/book/:dealId" component={Book}></Route>
              <Route exact path="/viewBookings/:userId" component={PlannedTrips}></Route>
              <Route exact path="/viewBookings" component={PlannedTrips}></Route>
              <Route path="*" render={() => <Redirect to="/home" />}></Route>
            </Switch>
          </div>
        </Router>
        <footer className="bg-black text-center fixed-bottom text-white-50">
          Copyright &copy; www.eta.wanderlust.com 2018
    </footer>
      </div>
    );
  }
}

export default App;
