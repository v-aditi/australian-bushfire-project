import React from "react";
import { shallow} from "enzyme";
import toJson from "enzyme-to-json";
import HumidityChart from "../components/echarts/HumidityChart";

/* 
    Unit test for HumidityChart Component to check that the component renders properly
    and has correct children components as well.
*/
describe("Humidity Chart renders properly with correct children", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<HumidityChart />);
      });
      it("Test Case 2 ~ renders a snapshot correctly", () => {
        const tree = shallow(<HumidityChart/>);
        expect(toJson(tree)).toMatchSnapshot();
      });
})

/* 
    Unit Tests to see if data fetched properly when location is updated.
*/
describe("Humidity Chart updates when location is changed", () => {
    it("Test Case 2 ~ fetches Humidity data when location updated", () => {

        // create mock data for fetch API
        const mockResponse = {
            dates: ['2020-01-01', '2020-01-02', '2020-01-03'],
            temp_location: ['40', '32', '59']
        }
        // create mock fetch
        const mockJsonPromise = Promise.resolve(mockResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
          });
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
        
        const wrapper = shallow(<HumidityChart />);
        wrapper.setProps({selectedLocation: 'test'}); // update location

        // check if fetch called properly
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/humidity/<test>');

        global.fetch.mockClear();
    })

})