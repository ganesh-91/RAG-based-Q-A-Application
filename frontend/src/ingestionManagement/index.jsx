import React, { useEffect, useState } from "react";
import axios from "axios";
import ListComponent from "../component/table/listComponent";

export const IngestionManagement = () => {
  const [ingestion, setIngestion] = useState([]);
  const headers = [
    "id",
    "fileName",
    "filePath",
    "ingestionDate",
    "ingestionCompleted",
  ];

  useEffect(() => {
    fetchIngestion();
  }, []);

  const fetchIngestion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/ingestion",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIngestion(response.data);
    } catch (error) {
      alert("Error triggering ingestion: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Ingestion Management</h1>
      <ListComponent
        items={ingestion}
        title={"ingestion"}
        headers={headers}
        addEntityCb={() => {}}
      />
    </div>
  );
};

export default IngestionManagement;
