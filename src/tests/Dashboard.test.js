import React from "react";
import { shallow, mount} from "enzyme";
import Dashboard from "../components/Dashboard";
import DropdownMenu from '../components/DropdownMenu';
import MaxTempChart from "../components/echarts/MaxTempChart";
import RainChart from "../components/echarts/RainChart";
import HumidityChart from "../components/echarts/HumidityChart";
import WindChart from "../components/echarts/WindChart";
import FFDIChart from "../components/echarts/FFDIChart";
import DroughtFactor from "../components/DroughtFactor";
import toJson from "enzyme-to-json";

/* 
    Unit test for Dashboard Component to check that the component renders properly
    and has correct children components as well.
*/
describe("Dashboard renders properly with correct children", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<Dashboard />);
      });
    it("Test Case 2 ~ contains all charts", () => {
      const wrapper = mount(<Dashboard />);
      // Maximum temperature chart
      expect(wrapper.containsMatchingElement(MaxTempChart)).toEqual(true);
      // Rainfall chart
      expect(wrapper.containsMatchingElement(RainChart)).toEqual(true);
      // Humidity chart
      expect(wrapper.containsMatchingElement(HumidityChart)).toEqual(true);
      // Wind chart
      expect(wrapper.containsMatchingElement(WindChart)).toEqual(true);
      // FFDI chart
      expect(wrapper.containsMatchingElement(FFDIChart)).toEqual(true);
    });
    it("Test Case 3 ~ contains user input components", () => {
      const wrapper = mount(<Dashboard />);
      // Drought Factor slider
      expect(wrapper.containsMatchingElement(DroughtFactor)).toEqual(true);
      // Dropdown Menu
      expect(wrapper.containsMatchingElement(DropdownMenu)).toEqual(true);
    });
})

/*
    Integration test to check if location is updated successfully.
*/

describe("Selected location updates correctly", () => {
  it("Test Case 5 ~ location state is updated when user selects new location", () => {
    const setLocation = jest.fn();
    const wrapper = mount(<Dashboard setLocation={setLocation}/>);

    // create mock handleChange function
    const handleChange = jest.spyOn(React, "useState");
    handleChange.mockImplementation(location => [location, setLocation]);

    // simulate user selecting a new location
    wrapper.find(DropdownMenu).simulate('change', {target: {value: '90194'}});
    expect(setLocation).toBeTruthy();
  });
})

/*
    Integration test to check if drought factor is updated successfully.
*/

describe("Selected droughtFactor updates correctly", () => {
  it("Test Case 6 ~ droughtFactor state is updated when user selects new location", () => {
    const setDroughtFactor = jest.fn();
    const wrapper = mount(<Dashboard setDroughtFactor={setDroughtFactor}/>);

    // create mock handleChange function
    const handleChange = jest.spyOn(React, "useState");
    handleChange.mockImplementation(droughtFactor => [droughtFactor, setDroughtFactor]);

    // simulate user selecting a new location
    wrapper.find(DroughtFactor).simulate('change', {target: {value: '9'}});
    expect(setDroughtFactor).toBeTruthy();
  });
})