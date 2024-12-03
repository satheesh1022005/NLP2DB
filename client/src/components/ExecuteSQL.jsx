import React, { useState } from "react";
import axios from "axios";
import "./style.css";
const ExecuteSQL = ({ dbName }) => {
  const [sqlQuery, setSqlQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle SQL query input change
  const handleQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };

  // Handle SQL query execution
  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      alert("Please enter a valid SQL query.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:8080/execute-sql", {
        dbName,
        sqlQuery,
      });

      setResult(response.data.result);
    } catch (err) {
      setError(
        "Error executing SQL query: " + err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="execute-main">
      <h2>Execute SQL on Database: {dbName}</h2>
      <textarea
        value={sqlQuery}
        onChange={handleQueryChange}
        rows={5}
        cols={50}
        placeholder="Enter your SQL query here..."
      />
      <br />
      <button onClick={executeQuery} disabled={loading}>
        {loading ? "Executing..." : "Execute Query"}
      </button>

      {result && (
        <div>
          <h3>Query Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ color: "red" }}>
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default ExecuteSQL;
