import React from "react";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import FFDIChart from "../components/echarts/FFDIChart";

/* 
    Unit test for FFDIChart Component to check that the component renders properly
    and has correct children components as well.
*/
describe("FFDI Chart renders properly", () => {
    it("Test Case 1 ~ Renders without crashing", () => {
        shallow(<FFDIChart />);
      });
      it("Test Case 2 ~ renders a snapshot correctly", () => {
        const tree = shallow(<FFDIChart />);
        expect(toJson(tree)).toMatchSnapshot();
      });
})


/* 
    Unit Tests to see if data fetched properly when location and drought factor is updated.
*/
describe("FFDI Chart updates when props are changed", () => {
    it("Test Case 3 ~ fetches FFDI data when location and drought factor updated", () => {
        // create mock data for fetch API
      const mockResponse = {
        dates: ['2020-01-01', '2020-01-02', '2020-01-03'],
        temp_location: ['40', '32', '59']
      }

      // create mock fetch API
      const mockJsonPromise = Promise.resolve(mockResponse);
      const mockFetchPromise = Promise.resolve({
          json: () => mockJsonPromise,
      });
      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

      const wrapper = shallow(<FFDIChart />);
      wrapper.setProps({selectedLocation: 'test',selectedFactor: 'factor'}); // update props
       
      // check if fetch called properly
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/FFDI/<test>/<factor>',{"mode":"cors"});
      
      global.fetch.mockClear();
    });
  })
  
