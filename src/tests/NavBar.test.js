import React from "react";
import { shallow} from "enzyme";
import NavBar from '../components/navigation/NavBar';
import toJson from "enzyme-to-json";

/* 
    Unit test for NavBar Component to check that the component renders properly
    and has correct children components as well.
*/
describe("NavBar renders properly with correct children", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<NavBar />);
      });
      it("Test Case 2 ~ renders a snapshot correctly", () => {
        const tree = shallow(<NavBar />);
        expect(toJson(tree)).toMatchSnapshot();
      });
      it("Test Case 3 ~ consists of a heading", () => {
        const wrapper = shallow(<NavBar />);
        expect(wrapper.text().includes('Bushfire Visualisation')).toBe(true); // check for heading
    })
})