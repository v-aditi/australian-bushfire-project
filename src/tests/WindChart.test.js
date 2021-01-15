import React from "react";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import WindChart from "../components/echarts/WindChart";

/* 
    Unit test for Wind Chart Component to check that the component renders properly
    and has correct children components as well.
*/
describe("Wind Chart renders properly ", () => {
    it("Test Case 1 ~ Renders without crashing", () => {
        shallow(<WindChart />);
      });
    it("Test Case 2 ~ Renders a snapshot correctly", () => {
    const tree = shallow(<WindChart />);
    expect(toJson(tree)).toMatchSnapshot();
    });
})


describe("Fire Danger Zone updated properly and data fetched", () => {
    it("Test Case 3 ~ fetches Wind Speed data when location updated", () => {

        // create mock data for fetch API
        const mockResponse = {
            dates: ['2020-01-01', '2020-01-02', '2020-01-03'],
            temp_location: ['23.5', '26.2', '20.1']
        }
        const mockJsonPromise = Promise.resolve(mockResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
          });
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
        
        const wrapper = shallow(<WindChart />);
        wrapper.setProps({selectedLocation: 'test'}); // updated location
        
        // check fetch is called properly
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/wind/<test>');

        global.fetch.mockClear();
    })})
