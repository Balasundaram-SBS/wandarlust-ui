import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { backendUrlUser, backendUrlBooking } from "../BackendURL";
import "bootstrap/dist/css/bootstrap.css";
import '../index.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';


class PlannedTrips extends Component {
  constructor(props) {
    super(props);
    this.showInfo = this.showInfo.bind(this);
    this.showError = this.showError.bind(this);
    this.state = {
      bookingData: [],
      bookingId: "",
      showStatus: false,
      errorMessage: "",
      successMessage: "",
      userId: null,
      visible: false,
      newObj: "",
      clickStatus: false
    };
  }

  fetchBooking = () => {

    let url = new URL(window.location)
    let userId = url.href.split("/")[4]
    this.setState({ userId: userId });

    this.setState({ errorMessage: "", bookingData: [], successMessage: '' });
    axios.get(backendUrlUser + '/getBookings/' + userId).then(response => {
      this.setState({ bookingData: response.data, errorMessage: '', successMessage: '' });
      this.setState({ showStatus: true });
    }).catch(error => {
      if (error.status == 404) {
        this.setState({ errorMessage: "", bookingData: [], successMessage: '' });
        this.setState({ showStatus: true })
      } else {
        this.setState({ errorMessage: '', bookingData: [], successMessage: '' });
        this.setState({ showStatus: true })
      }

    })
  }

  confirmCancellation = () => {
    this.setState({ showStatus: false });
    axios.delete(backendUrlBooking + '/cancelBooking/' + this.state.newObj.bookingId)
      .then(response => {
        this.fetchBooking()
        this.setState({ visible: false, viewDetails: false });
        this.setState({ showStatus: false, successMessage: 'Successfully deleted the booking with booking Id ' + this.state.newObj.bookingId, errorMessage: "" });
        this.showInfo();


      }).catch(error => {
        this.fetchBooking();
        this.setState({ visible: false, viewDetails: false });
        this.setState({ showStatus: false })
        this.setState({ errorMessage: 'Cancellation failed! Try again.', successMessage: '' });
      })
  }

  showInfo = () => {
    this.growl.show({ severity: 'info', summary: 'Cancellation successfull', detail: this.state.successMessage, life: 5000, closeable: true });
  }

  showError = () => {
    this.growl.show({ severity: 'error', summary: 'Process failed', detail: this.state.errorMessage, life: 5000, closeable: true });
  }

  componentDidMount = () => {

    this.fetchBooking();
  }


  showBooking = () => {

    let bookingArr = this.state.bookingData.map(obj => {
      return (<div className='row text-left' key={obj.bookingId} id={obj.bookingId}>
        <div className='card col-md-6 offset-3 shadow' >
          <div className='card-header'>
            <h5>
              <span className='badge badge-info'>Booking ID : {obj.bookingId}</span>
            </h5>
          </div>
          <div className='card-body' >
            <h4>{obj.destinationName}</h4>
            <div className='row'>

              <div className='col-md-8'>

                Trip starts on : {new Date(obj.checkInDate).toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" })}<br></br>
                Trip ends on : {new Date(obj.checkOutDate).toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" })}<br></br>
                Travellers : {obj.noOfPersons}

              </div>

              <div className='col-md-4'>
                Fare Details : $ {obj.totalCharges}
              </div>

            </div><br />
            <div className='card-footer'>
              <div className='row'>
                <div className="form-inline col-md-12">
                  <button name='deleteButton' type='button' className="btn btn-sm col-md-5 offset-7 btn-secondary" label="deleteBooking" onClick={(e) => { this.setState({ visible: true }); this.setState({ newObj: obj }) }} >Claim Refund</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>)
    })
    return bookingArr;
  }

  onHide = () => {
    this.setState({ visible: false });
  }

  render() {
    const footer = (
      <div>
        <button name='backButton' id='backButton' label="BACK" icon="pi pi-times" className='btn btn-primary' onClick={this.onHide} >BACK</button>
        <button name='confirmButton' id='confirmButton' className='btn btn-secondary' icon="pi pi-check" onClick={this.confirmCancellation} >CONFIRM CANCELLATION</button>
      </div>
    );

    return <React.Fragment>
      <Growl ref={(el) => this.growl = el} position="bottomleft" />
      {!this.state.showStatus ?
        <div className='viewBookings'><ProgressSpinner /></div>
        :
        <div className="animate-bottom">{!this.state.bookingData.length > 0 ?
          <div className="text-center viewBookings" style={{ textAlign: 'left' }}>
            <div>
              <h2>Sorry you haven't planned any trips with us yet</h2><br />
              <button className="btn btn-primary" name='startBooking' id='startBooking'
                onClick={() => { this.setState({ clickStatus: true }) }}>CLICK HERE TO START BOOKING</button>
            </div>

            {this.state.clickStatus ?
              (this.state.userId ?
                <Redirect to={'/home/' + this.state.userId} />
                :
                <Redirect to='/home' />)
              : null}
          </div>
          :
          (
            <div className='container-fluid viewBookings'>
              <div>
                {this.state.errorMessage.length > 0 ? this.showError() : null} {/* Error Message trigger*/}
                {this.state.successMessage.length > 0 ? this.showInfo() : null} {/* Error Message trigger*/}
                {this.showBooking()}

                <Dialog header="Confirm Cancellation" className='text-left'
                  footer={footer}
                  visible={this.state.visible}
                  style={{ width: '50vw' }}
                  modal={true}
                  onHide={() => this.setState({ visible: false })}>
                  <div className='text-danger font-weight-bold'>Are you sure you want to cancel your trip to {this.state.newObj.destinationName}?</div>
                  <div>Trip starts on : {new Date(this.state.newObj.checkInDate).toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" })}</div>
                  <div>Trip ends on : {new Date(this.state.newObj.checkOutDate).toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" })}</div>
                  <div>Refund Amount : Rs. {this.state.newObj.totalCharges}</div>

                </Dialog>
              </div>
            </div>)}</div>}
    </React.Fragment>


  }
}
export default PlannedTrips;
