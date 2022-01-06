import React from "react";
import App from ".components/App";
import Book from ".components/book";
import Packages from ".components/Packages";
import HotDeals from ".components/hotdeals";
import PlannedTrips from ".components/plannedTrips";
import Login from ".components/login";
import Register from ".components/Register";
import { shallow } from "enzyme";


describe("Login Component", () => {

  test("Test suit for US01 - Validation for Phone number 1", () => {
    const wrapper = shallow(<Login />);
    wrapper.find("InputText[name='contactNo']").setProps({ value: 9600334455 });
    expect(wrapper.state().loginform.contactNo).toBe(9600334455);
  });
  test("Test suit for US01 - Validation for Phone number 2", () => {
    const wrapper = shallow(<Login />);
    wrapper.find("InputText[name='contactNo']").setProps({ value: 960033445 });
    expect(wrapper.state().loginform.contactNo).not.toBe(960033445);
  });
  test("Test suit for US01 - Validation for Password 1", () => {
    const wrapper = shallow(<Login />);
    wrapper.find("InputText[name='password']").setProps({ value: "Bala@123" });
    expect(wrapper.state().loginform.password).toBe("Bala@123");
  });
  test("Test suit for US01 - Validation for Password 2", () => {
    const wrapper = shallow(<Login />);
    wrapper.find("InputText[name='password']").setProps({ value: "Bala123" });
    expect(wrapper.state().loginform.password).not.toBe("Bala123");
  });
  test("Test suit for US01 - input fields(2 inputs and 2 buttons)", () => {
    const wrapper = shallow(<Login />);
    let inputs = wrapper.find("InputText").length + wrapper.find("button").length
    expect(inputs).toBe(4);
  });
});


describe("Register Component", () => {
  test("Test suit for US02 - Validation for User name 1", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='name']").setProps({ value: "John" });
    expect(wrapper.state().registerForm.name).toBe("John");
  });
  test("Test suit for US02 - Validation for User name 2", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='name']").setProps({ value: "John123" });
    expect(wrapper.state().registerForm.name).not.toBe("John123");
  });

  test("Test suit for US02 - Validation for Email Id 1", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='emailId']").setProps({ value: "john@infy.com" });
    expect(wrapper.state().registerForm.emailId).toBe("john@infy.com");
  });
  test("Test suit for US02 - Validation for Email Id 2", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='emailId']").setProps({ value: "john_infy.com" });
    expect(wrapper.state().registerForm.emailId).not.toBe("john_infy.com");
  });
  test("Test suit for US02 - Validation for Phone number 1", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='contactNo']").setProps({ value: 9600334455 });
    expect(wrapper.state().registerForm.contactNo).toBe(9600334455);
  });
  test("Test suit for US02 - Validation for Phone number 2", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='contactNo']").setProps({ value: 960033445 });
    expect(wrapper.state().registerForm.contactNo).not.toBe(960033445);
  });
  test("Test suit for US02 - Validation for Password 1", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='password']").setProps({ value: "Bala@123" });
    expect(wrapper.state().registerForm.password).toBe("Bala@123");
  });
  test("Test suit for US02 - Validation for Password 2", () => {
    const wrapper = shallow(<Register />);
    wrapper.find("InputText[name='password']").setProps({ value: "Bala123" });
    expect(wrapper.state().registerForm.password).not.toBe("Bala123");
  });
  test("Test suit for US02 - input fields(4 inputs and 1 buttons)", () => {
    const wrapper = shallow(<Register />);
    let inputs = wrapper.find("InputText").length + wrapper.find("button").length
    expect(inputs).toBe(5);
  });

});


describe("Hot Deals Component", () => {
  test("Test suit for US03 - show side bar", () => {
    const wrapper = shallow(<HotDeals />);
    wrapper.find("button[label='hotDealsViewDetails']").simulate("click")
    expect(wrapper.state().showItinerary).toBeTruthy();
  });
  test("Test suit for US03 - Validate for username 1", () => {
    const wrapper = shallow(<HotDeals />);
    wrapper.find("InputText[name='noOfPersons']").setProps({ value: 2 });
    expect(wrapper.state().bookingForm.noOfPersons).toBe(2);
  });
  test("Test suit for US03 - Validate for username 2", () => {
    const wrapper = shallow(<HotDeals />);
    wrapper.find("InputText[name='noOfPersons']").setProps({ value: 12 });
    expect(wrapper.state().bookingForm.noOfPersons).not.toBe(2);
  });
  test("Test suit for US03 - Validate for date 1", () => {
    const wrapper = shallow(<HotDeals />);
    wrapper.find("InputText[name='date']").setProps({ value: new Date() });
    expect(wrapper.state().bookingForm.date).toBeTruthy();
  });
  test("Test suit for US03 - Validate for date 2", () => {
    const wrapper = shallow(<HotDeals />);
    wrapper.find("InputText[name='date']").setProps({ value: new Date("02-15-2018") });
    expect(wrapper.state().bookingForm.date).toBeFalsy();
  });
  test("Test suit for US03 - total charge calculation", () => {
    const wrapper = shallow(<HotDeals />);
    wrapper.setState({
      noOfPersons: 2, date: new Date("2018-12-16"), deal: {
        noOfNights: 7.0,
        flightCharges: 500,
        chargesPerPerson: 2499.0,
      }
    });
    wrapper.find("button[name='buttonCalc']").simulate('click');
    expect(wrapper.state().totalCharges).toBe(5998);
  });

});



describe("Packages Component", () => {
  test("Test suit for US04 - show side bar", () => {
    const wrapper = shallow(<Packages />);
    wrapper.find("button[label='packageViewDetails']").simulate("click")
    expect(wrapper.state().showItinerary).toBeTruthy();
  });
  test("Test suit for US04 - Validate for username 1", () => {
    const wrapper = shallow(<Packages />);
    wrapper.find("InputText[name='noOfPersons']").setProps({ value: 2 });
    expect(wrapper.state().bookingForm.noOfPersons).toBe(2);
  });
  test("Test suit for US04 - Validate for username 2", () => {
    const wrapper = shallow(<Packages />);
    wrapper.find("InputText[name='noOfPersons']").setProps({ value: 12 });
    expect(wrapper.state().bookingForm.noOfPersons).not.toBe(2);
  });
  test("Test suit for US04 - Validate for date", () => {
    const wrapper = shallow(<Packages />);
    wrapper.find("InputText[name='date']").setProps({ value: new Date() });
    expect(wrapper.state().bookingForm.date).toBeTruthy();
  });
  test("Test suit for US04 - Validate for username 2", () => {
    const wrapper = shallow(<Packages />);
    wrapper.find("InputText[name='date']").setProps({ value: new Date("02-15-2018") });
    expect(wrapper.state().bookingForm.date).toBeFalsy();
  });
  test("Test suit for US04 - total charge calculation", () => {
    const wrapper = shallow(<Packages />);
    wrapper.setState({
      noOfPersons: 2,
      date: new Date("2018-12-16"), deal: {
        noOfNights: 7.0,
        flightCharges: 500,
        chargesPerPerson: 2499.0,
      }
    });
    wrapper.find("button[name='buttonCalc']").simulate('click');
    expect(wrapper.state().totalCharges).toBe(5998);
  });

});



describe("Book Component", () => {
  test("Test suit for US05 - show side bar", () => {
    const wrapper = shallow(<Book />);
    wrapper.find("button[label='hotDealsViewDetails']").simulate("click")
    expect(wrapper.state().showItinerary).toBeTruthy();
  });
  test("Test suit for US05 - Validate for username 1", () => {
    const wrapper = shallow(<Book />);
    wrapper.find("InputText[name='noOfPersons']").setProps({ value: 2 });
    expect(wrapper.state().bookingForm.noOfPersons).toBe(2);
  });
  test("Test suit for US05 - Validate for username 2", () => {
    const wrapper = shallow(<Book />);
    wrapper.find("InputText[name='noOfPersons']").setProps({ value: 12 });
    expect(wrapper.state().bookingForm.noOfPersons).not.toBe(2);
  });
  test("Test suit for US05 - Validate for date", () => {
    const wrapper = shallow(<Book />);
    wrapper.find("InputText[name='date']").setProps({ value: new Date() });
    expect(wrapper.state().bookingForm.date).toBeTruthy();
  });
  test("Test suit for US05 - Validate for username 2", () => {
    const wrapper = shallow(<Book />);
    wrapper.find("InputText[name='date']").setProps({ value: new Date("02-15-2018") });
    expect(wrapper.state().bookingForm.date).toBeFalsy();
  });
  test("Test suit for US05 - total charge calculation", () => {
    const wrapper = shallow(<Book />);
    wrapper.setState({
      noOfPersons: 2,
      date: new Date("2018-12-16"), deal: {
        noOfNights: 7.0,
        flightCharges: 500,
        chargesPerPerson: 2499.0,
      }
    });
    wrapper.find("button[name='buttonCalc']").simulate('click');
    expect(wrapper.state().totalCharges).toBe(5998);
  });

});

describe("Planned Trips Component", () => {

  test("Test suit for US06 - fetching details", () => {
    const wrapper = shallow(<PlannedTrips />);
    wrapper.instance().fetchBooking();
    expect(wrapper.state().showStatus).toBeTruthy();
  });
  test("Test suit for US07 - Dialog box appears", () => {
    const wrapper = shallow(<PlannedTrips />);
    wrapper.setState({ visible: false });
    wrapper.find("button[name='deleteButton']").simulate('click');
    expect(wrapper.state().visible).toBeTruthy();
  });

  test("Test suit for US07 - Confirm Cancellation", () => {
    const wrapper = shallow(<PlannedTrips />);
    wrapper.find("button[name='confirmButton']").simulate('click');
    expect(wrapper.state().visible).toBeTruthy();
  });
});


describe("App Component", () => {
  test("Test suit for US08 - Rendering test", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state().dialog_visible).toBeFalsy();
  });
  test("Test suit for US08 - logout button", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ logged_out: false });
    wrapper.find("button[name='logout']").simulate("click");
    expect(wrapper.state().logged_out).toBeTruthy();
  });
  test("Test suit for US08 - logut confirmation", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ dialog_visible: false });
    wrapper.find("Link[name='confirmLogout']").simulate("click");
    expect(wrapper.state().dialog_visible).toBeFalsy();
  });
  test("Test suit for US08 - App has a Navbar", () => {
    const wrapper = shallow(<CreateBooking />);
    expect(wrapper.find("nav")).toHaveLength(1);
  });

});

