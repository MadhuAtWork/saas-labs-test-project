import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const FatchApi = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const recordsPerPage = 5;

  const baseUrl = `https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json`;

  const getData = async () => {
    try {
      const response = await axios.get(baseUrl);
      setData(response?.data || []);
    } catch (error) {
      console.log("Error:", error);
      setError("Failed to load data. Please try again later.");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const totalPages = Math.ceil(data.length / recordsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentRecords = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tableDiv">
      <div className="Heading">Percentage Funded Table</div>
      <table aria-labelledby="fundedTable" role="table">
        <thead>
          <tr>
            <th data-testid="Slno" style={{ textAlign: "center" }} scope="col">
              Sr.No
            </th>
            <th
              data-testid="percentage"
              style={{ textAlign: "center" }}
              scope="col"
            >
              Percentage Funded
            </th>
            <th data-testid="amt" style={{ textAlign: "center" }} scope="col">
              Amount Pledged
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((row, index) => (
              <tr key={index} aria-rowindex={index + 1}>
                <td style={{ textAlign: "right" }}>{row["s.no"]}</td>
                <td style={{ textAlign: "right" }}>
                  {row["percentage.funded"]}
                </td>
                <td style={{ textAlign: "right" }}>{row["amt.pledged"]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        className="pagination"
        role="navigation"
        aria-label="Pagination Controls"
      >
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-disabled={currentPage === 1 ? "true" : "false"}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages > 0 ? totalPages : 1}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-disabled={currentPage === totalPages ? "true" : "false"}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FatchApi;
