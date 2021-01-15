import React from "react";
import {shallow} from "enzyme";
import App from "../App";
import NavBar from '../components/navigation/NavBar';
import Dashboard from '../components/Dashboard';
import toJson from "enzyme-to-json";

/* 
    Unit test for App Component to check that the component renders properly
    and has correct children components as well.
*/
describe("App renders properly with correct children", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<App />);
      });
    it("Test Case 2 ~ renders a snapshot correctly", () => {
        const tree = shallow(<App />);
        expect(toJson(tree)).toMatchSnapshot();
      });
    it("Test Case 3 ~ consists of dashboard and navbar", () => {
          const wrapper = shallow(<App />);
          expect(wrapper.containsMatchingElement(<Dashboard />)).toEqual(true);
          expect(wrapper.containsMatchingElement(<NavBar />)).toEqual(true);
      });
})