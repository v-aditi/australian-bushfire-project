import React from "react";
import { shallow} from "enzyme";
import DropdownMenu from "../components/DropdownMenu";
import Select from '@material-ui/core/Select';
import toJson from "enzyme-to-json";

/* 
    Unit test for DropdownMenu Component to check that the component renders properly
    and has correct children components as well.
*/
describe("Dropdown menu renders properly with correct children", () => {
    it("Test Case 1 ~ renders without crashing", () => {
        shallow(<DropdownMenu />);
      });
    it("Test Case 2 ~ has a select component", () => {
        const wrapper = shallow(<DropdownMenu />);
        expect(wrapper.containsMatchingElement(Select)).toEqual(true);
    });
    it("Test Case 3 ~ renders a snapshot correctly", () => {
        const tree = shallow(<DropdownMenu/>);
        expect(toJson(tree)).toMatchSnapshot();
      });
})

/* 
    Unit test for DropdownMenu Component to check location updated properly.
*/
describe("Dropdown menu updates Drought Factor correctly", () => {
    it ("Test Case 4 ~ calls event handler handleChange()", () => {
        const mockCallbackFunction = jest.fn();         // create mock callback function
        const wrapper = shallow(<DropdownMenu parentCallback = {mockCallbackFunction}/>);

        // simulate user changing selected location
        wrapper.find(Select).simulate('change', {target: {value: 'mockLocation'}});
        expect(wrapper.instance().state.location).toEqual('mockLocation');
    })
})