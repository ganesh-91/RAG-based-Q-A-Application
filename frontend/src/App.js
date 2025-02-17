import React from "react";

import "./App.css";
import { LoginComponent } from "./auth";
import QAInterface from "./chat";
import DocumentManagement from "./documentManagement";
import IngestionManagement from "./ingestionManagement";
import { ProtectedRoute } from "./protectedRoute";
import UserManagement from "./userManagement";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./layout";
import { AuthProvider } from "./context/auth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route element={<Layout />}>
            <Route path="/dashboard">
              <Route index element={<QAInterface />} />
              <Route path="chat" element={<QAInterface />} />
              <Route
                path="user-management"
                element={
                  <ProtectedRoute role="ADMIN">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="document-management"
                element={
                  <ProtectedRoute role="ADMIN">
                    <DocumentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ingestion-management"
                element={
                  <ProtectedRoute role="ADMIN">
                    <IngestionManagement />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<div>not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
