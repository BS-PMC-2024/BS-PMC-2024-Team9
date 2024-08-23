import React from 'react';
import { render , screen  } from "@testing-library/react";
import Home from '../src/components/Home';
import { useSelector } from 'react-redux'

jest.mock('react-redux');

describe("Login Component",() => {

    it("render Home Component",() => {
        useSelector.mockImplementation((cb) => cb({user:{name:'hai'}}));
        const { container } = render(<Home />);
     
        const title = container.querySelector("#h2_test");
     
        expect(screen.getByText('Trading View')).toBeDefined();
     })
})
