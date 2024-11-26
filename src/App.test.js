import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App.js";
import axios from "axios";

jest.mock("axios");

test("renders App without crashing", () => {
  render(<App />);
});

test("renders no data available message when there is no data", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<App />);

  await waitFor(() => screen.getByText("No data available"));

  expect(screen.getByText("No data available")).toBeInTheDocument();
});

test("handles pagination correctly with a single page of data", async () => {
  axios.get.mockResolvedValueOnce({
    data: [{ "s.no": 1, "percentage.funded": 50, "amt.pledged": 500 }],
  });

  render(<App />);

  await waitFor(() => screen.getByText("Percentage Funded Table"));

  const prevButton = screen.getByText("Previous");
  const nextButton = screen.getByText("Next");

  expect(prevButton).toBeDisabled();
  expect(nextButton).toBeEnabled();
});

test("renders table data correctly", async () => {
  render(<App />);

  expect(screen.getByTestId("Slno")).toHaveTextContent("Sr.No");
  expect(screen.getByTestId("percentage")).toHaveTextContent(
    "Percentage Funded"
  );
  expect(screen.getByTestId("amt")).toHaveTextContent("Amount Pledged");
});

test("renders  mock data with pagnation", async () => {
  const mockData = [
    { "s.no": "1", "percentage.funded": "50", "amt.pledged": "500" },
    { "s.no": "2", "percentage.funded": "60", "amt.pledged": "600" },
    { "s.no": "3", "percentage.funded": "70", "amt.pledged": "700" },
    { "s.no": "4", "percentage.funded": "80", "amt.pledged": "800" },
    { "s.no": "5", "percentage.funded": "90", "amt.pledged": "900" },
    { "s.no": "6", "percentage.funded": "90", "amt.pledged": "900" },
    { "s.no": "7", "percentage.funded": "90", "amt.pledged": "900" },
    { "s.no": "8", "percentage.funded": "90", "amt.pledged": "900" },
  ];

  axios.get.mockResolvedValue({ data: mockData });

  render(<App />);

  await waitFor(() => screen.getByText("1"));

  const pageText = screen.getByText("Page 1 of 2");
  expect(pageText).toBeInTheDocument();

  const nextButton = screen.getByText("Next");
  fireEvent.click(nextButton);

  await waitFor(() => screen.getByText("Page 2 of 2"));

  expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
});

test("renders FatchApi component with mock data", async () => {
  const mockData = [
    {
      "s.no": "1",
      "percentage.funded": "50",
      "amt.pledged": "500",
    },
    {
      "s.no": "2",
      "percentage.funded": "60",
      "amt.pledged": "600",
    },
  ];

  axios.get.mockResolvedValue({ data: mockData });

  render(<App />);

  const firstRow = await screen.findByText("1");
  const secondRow = await screen.findByText("2");

  expect(firstRow).toBeInTheDocument();
  expect(screen.getByText("50")).toBeInTheDocument();
  expect(screen.getByText("500")).toBeInTheDocument();

  expect(secondRow).toBeInTheDocument();
  expect(screen.getByText("60")).toBeInTheDocument();
  expect(screen.getByText("600")).toBeInTheDocument();
});

test("renders error message when API call fails", async () => {
  axios.get.mockRejectedValue(new Error("Failed to load data"));

  render(<App />);

  const errorMessage = await screen.findByText(
    /Failed to load data. Please try again later./i
  );
  expect(errorMessage).toBeInTheDocument();
});

test("handles pagination correctly with more than one page", async () => {
  render(<App />);

  await waitFor(() => screen.getByText("Percentage Funded Table"));

  const prevButton = screen.getByText("Previous");
  const nextButton = screen.getByText("Next");

  expect(prevButton).toBeDisabled();
  expect(nextButton).toBeEnabled();

  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
  });
});

test("pagination buttons are disabled when there is only one page", async () => {
  render(<App />);

  await waitFor(() => screen.getByText("Percentage Funded Table"));

  const prevButton = screen.getByText("Previous");
  const nextButton = screen.getByText("Next");

  expect(prevButton).toBeDisabled();
  expect(nextButton).toBeEnabled();

  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
  });
});
