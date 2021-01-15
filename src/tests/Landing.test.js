import React from "react";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import Landing from "../components/Landing";

/* 
    Unit test for Dashboard Component to check that the component renders properly
    and has correct children components as well.
*/
describe("Landing page renders properly with correct children", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<Landing />);
      });
      it("Test Case 2 ~ renders a snapshot correctly", () => {
        const tree = shallow(<Landing />);
        expect(toJson(tree)).toMatchSnapshot();
      });
})