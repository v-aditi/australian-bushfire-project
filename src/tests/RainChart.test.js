import React from "react";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import RainChart from "../components/echarts/RainChart";

/* 
    Unit test for Rainfall Component to check that the component renders properly
    and has correct children components as well.
*/
describe("Rainfall Chart renders properly ", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<RainChart />);
      });
    it("Test Case 2 ~ renders a snapshot correctly", () => {
    const tree = shallow(<RainChart />);
    expect(toJson(tree)).toMatchSnapshot();
    });
})

describe("Fire Danger Zone updated properly and data fetched", () => {
    it("Test Case 3 ~ fetches Rainfall data when location updated", () => {

        // create mock data for fetch API
        const mockResponse = {
            dates: ['2020-01-01', '2020-01-02', '2020-01-03'],
            temp_location: ['23.5', '26.2', '20.1']
        }

        // create mock fetch API
        const mockJsonPromise = Promise.resolve(mockResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
          });
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
        
        const wrapper = shallow(<RainChart />);
        wrapper.setProps({selectedLocation: 'test'}); // location updated
        
        // check fetch API called properly
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/rainfall/<test>');

        global.fetch.mockClear();
    })})