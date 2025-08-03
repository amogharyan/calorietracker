import React from "react";
import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";

const mockUser = {
  name: "Ishrith Gowda",
  email: "ishrith@example.com",
  joinedDate: "2025-06-01",
};

test("renders UserProfile with correct user info", () => {
  render(<UserProfile user={mockUser} />);

  expect(screen.getByText(/ishrith gowda/i)).toBeInTheDocument();
  expect(screen.getByText(/email: ishrith@example.com/i)).toBeInTheDocument();
  expect(screen.getByText(/joined: 2025-06-01/i)).toBeInTheDocument();
});
