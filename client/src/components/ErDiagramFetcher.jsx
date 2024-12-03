import React, { useEffect, useState } from "react";
import axios from "axios";
import MermaidERDiagram from "./MermaidERDiagram";
import "./style.css";

const ErDiagramFetcher = () => {
  const [erDiagram, setErDiagram] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  // Function to fetch the ER diagram
  const fetchErDiagram = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetch
    try {
      const data = await axios.post(
        "http://127.0.0.1:5000/generate-er-prompt",
        {
          requirement: input,
        }
      );
      console.log(data.data.er_model_prompt);
      const response = await axios.post("http://127.0.0.1:5000/generate-er", {
        description: data.data.er_model_prompt,
      });
      // Extract the ER diagram from response
      const jsonString = response.data.er_diagram.replace(/```json\n|```/g, "");
      const parsedDiagram = JSON.parse(jsonString); // Parse the cleaned JSON string
      setErDiagram(parsedDiagram); // Set the parsed ER diagram
    } catch (err) {
      // More informative error handling
      console.error("Error fetching ER diagram:", err);
      setError(err.response ? err.response.data : "Error fetching data");
      setErDiagram({}); // Reset ER diagram on error
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(erDiagram);
  return (
    <div>
      <h2 className="er-head">Generated ER Diagram</h2>
      <section className="chat-section">
        <input
          type="text"
          value={input}
          className="chat-input"
          placeholder="Describe your thoughts into ER Diagram"
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={fetchErDiagram} className="chat-button">
          Submit
        </button>
      </section>
      <button onClick={fetchErDiagram}>Submit</button>
      {erDiagram && erDiagram.entities && erDiagram.entities.length > 0 ? (
        <div>
          <MermaidERDiagram erObject={erDiagram} />
          {/* {erDiagram.entities.map((er, index) => (
                        <div key={index}>
                            <p>Entity Name: {er.name}</p>
                            <p>Primary Key: {er.primaryKey}</p>
                            <p>Attributes:</p>
                            <ul>
                                {er.attributes.map((attr, attrIndex) => (
                                    <li key={attrIndex}>{`${attr.name} (${attr.type})`}</li>
                                ))}
                            </ul>
                        </div>
                    ))} */}
        </div>
      ) : null}
    </div>
  );
};

export default ErDiagramFetcher;
