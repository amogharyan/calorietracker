import React from "react";
import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";

const mockUser = {
  name: "sample name",
  email: "sample@email.com",
  joinedDate: "01-01-2001",
};

test("renders UserProfile with correct user info", () => {
  render(<UserProfile user={mockUser} />);

  expect(screen.getByText(/sample name/i)).toBeInTheDocument();
  expect(screen.getByText(/email: sample@email.com/i)).toBeInTheDocument();
  expect(screen.getByText(/joined: 01-01-2001/i)).toBeInTheDocument();
});