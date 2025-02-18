import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ListComponent from "../component/table/listComponent";

export const DocumentManagement = () => {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const headers = ["title", "createdDate", "modifiedDate", "size"];

  const inputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/documents/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Error uploading file: " + error.response.data.message);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data);
    } catch (error) {
      alert("Error fetching documents: " + error.response.data.message);
    }
  };

  const addDocument = () => {
    inputRef.current.click();
  };

  const ingestDoc = async (item) => {
    const file = {
      fileName: item.title,
      filePath: item.filePath
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/documents/ingest", { file: file }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      alert("Error uploading file: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Document Management</h1>
      <form>
        <input
          type="file"
          id="file"
          ref={inputRef}
          className="hidden"
          onChange={handleUpload}
        />
      </form>
      <ListComponent
        items={documents}
        title={"Documents"}
        headers={headers}
        addEntityCb={() => addDocument()}
        actionCb={(item) => ingestDoc(item)}
        isDocumentPage={true}
      />
    </div>
  );
};

export default DocumentManagement;
