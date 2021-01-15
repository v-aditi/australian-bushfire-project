import React from "react";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import DroughtFactor from "../components/DroughtFactor";
import {Slider} from '@material-ui/core';

/* 
    Unit test for DroughtFactor Component to check that the component renders properly
    and has correct children components as well.
*/
describe("DroughtFactor renders properly", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<DroughtFactor/>);
      });
      it("Test Case 2 ~ renders a snapshot correctly", () => {
        const tree = shallow(<DroughtFactor/>);
        expect(toJson(tree)).toMatchSnapshot();
      });
})

/* 
    Unit test for DroughtFactor Component to check drought factor updated properly.
*/
describe("DroughtFactor updates location correctly", () => {
  it ("Test Case 3 ~ calls event handler handleChange()", () => {
      const mockCallbackFunction = jest.fn();         // create mock callback function
      const wrapper = shallow(<DroughtFactor parentCallback2 = {mockCallbackFunction}/>);

      // simulate user changing selected location
      wrapper.find(Slider).invoke('onChange')(0,'mockFactor');
      expect(wrapper.instance().state.droughtFactor).toEqual('mockFactor');
  })
})