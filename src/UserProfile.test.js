// https://www.apollographql.com/docs/guides/testing-react-components.html
// https://reactjs.org/docs/test-renderer.html

import React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import UserProfile, { USER_PROFILE } from "./UserProfile";
import wait from "waait";
import TestRenderer from "react-test-renderer";

const mocks = [
  {
    request: {
      query: USER_PROFILE,
      variables: {
        id: "douglas"
      }
    },
    result: {
      data: {
        user: {
          first_name: "Douglas",
          last_name: "Smith",
          email: "douglas@smith.com"
        }
      }
    }
  },
  {
    request: {
      query: USER_PROFILE,
      variables: {
        id: "bob"
      }
    },
    error: new Error("No bob found")
  }
];

function setup(Component) {
  return TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      {Component}
    </MockedProvider>
  );
}

it("shows loading state", () => {
  // react-test-renderer
  const testRenderer = setup(<UserProfile id="douglas" />);
  // console.log('render all json: ', JSON.stringify(testRenderer.toJSON(), null, '  '));

  const actual = testRenderer.toJSON().children.join("");
  const expected = "Loading...";
  expect(actual).toBe(expected);
});

it("renders error", async () => {
  const testRenderer = setup(<UserProfile id="bob" />);
  await wait(0); // wait for response
  // console.log('render all json: ', JSON.stringify(testRenderer.toJSON(), null, '  '));

  const actual = testRenderer.toJSON().children.join("");
  const expected = "Network error: No bob found";
  expect(actual).toBe(expected);
});

it("renders name", async () => {
  const testRenderer = setup(<UserProfile id="douglas" />);
  await wait(0); // wait for response
  // console.log('render2 all json: ', JSON.stringify(testRenderer.toJSON(), null, '  '));
  const testInstance = testRenderer.root;
  const element = testInstance.findByProps({ className: "name" });

  const actual = element.children.join("");
  const expected = "Name: Douglas Smith";
  expect(actual).toBe(expected);
});

it("renders email", async () => {
  const testRenderer = setup(<UserProfile id="douglas" />);
  await wait(0); // wait for response
  // console.log('render2 all json: ', JSON.stringify(testRenderer.toJSON(), null, '  '));
  const testInstance = testRenderer.root;
  const element = testInstance.findByProps({ className: "email" });

  const actual = element.children.join("");
  const expected = "Email: douglas@smith.com";
  expect(actual).toBe(expected);
});
