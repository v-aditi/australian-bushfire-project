import React from "react";
import { shallow} from "enzyme";
import toJson from "enzyme-to-json";
import MaxTempChart from "../components/echarts/MaxTempChart";

/* 
    Unit test for MaxTempChart Component to check that the component renders properly
    and has correct children components as well.
*/
describe("MaxTemp Chart renders properly with correct children", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<MaxTempChart />);
    });
      it("Test Case 2 ~ renders a snapshot correctly", () => {
        const tree = shallow(<MaxTempChart />);
        expect(toJson(tree)).toMatchSnapshot();
    });
})

/* 
    Unit Test to see if data fetched properly when location is updated.
*/
describe("Fire Danger Zone updated properly and data fetched", () => {
    it("Test Case 3 ~ fetches Temperature data when location updated", () => {

        // create mock data for fetch API
        const mockResponse = {
            dates: ['2020-01-01', '2020-01-02', '2020-01-03'],
            temp_location: ['23.5', '26.2', '20.1']
        }
        // create mock fetch
        const mockJsonPromise = Promise.resolve(mockResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
          });
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
        
        const wrapper = shallow(<MaxTempChart />);
        wrapper.setProps({selectedLocation: 'test'});  // update location

        // check if fetch called properly
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/temperature/<test>');

        global.fetch.mockClear();
    })

})


