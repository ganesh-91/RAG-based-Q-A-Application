import React from "react";
import { Upload, LogOut } from "lucide-react";
import AiIcon from "../component/aiIcon";
import UserIcon from "../component/userIcon";
import DocsIcon from "../component/docsIcon";
import IngestionIcon from "../component/ingestionIcon";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

export const Sidebar = ({ user, onLogout }) => {
  return (
    <div className="w-72 bg-gray-50 p-6 border-r border-gray-200 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menu:</h2>
      </div>
      <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
        <p className="text-sm font-medium text-gray-900">{user?.email}</p>
        <p className="text-xs text-gray-500">Logged in</p>
      </div>

      <nav>
        <ul>
          <li className="mb-2 ">
            <Link
              to="/dashboard/chat"
              className="p-3 bg-white rounded-lg shadow-sm flex w-full items-center justify-center"
            >
              <div class="text mr-3 mt-1.5 font-semibold text-zinc-950 ">
                <AiIcon />
              </div>
              <p class="mr-auto text-sm font-semibold text-zinc-950">
                AI Chat
              </p>
            </Link>
          </li>

          <li className="mb-2 ">
            <Link
              to="/dashboard/user-management"
              className="p-3 bg-white rounded-lg shadow-sm flex w-full items-center justify-center"
            >
              <div class="text mr-3 mt-1.5 font-semibold text-zinc-950 ">
                <UserIcon />
              </div>
              <p class="mr-auto text-sm font-semibold text-zinc-950">
                User Management
              </p>
            </Link>
          </li>

          <li className="mb-2 ">
            <Link
              to="/dashboard/document-management"
              className="p-3 bg-white rounded-lg shadow-sm flex w-full items-center justify-center"
            >
              <div class="text mr-3 mt-1.5 font-semibold text-zinc-950 ">
                <DocsIcon />
              </div>
              <p class="mr-auto text-sm font-semibold text-zinc-950">
                Document Management
              </p>
            </Link>
          </li>

          <li className="mb-2 ">
            <Link
              to="/dashboard/ingestion-management"
              className="p-3 bg-white rounded-lg shadow-sm flex w-full items-center justify-center"
            >
              <div class="text mr-3 mt-1.5 font-semibold text-zinc-950 ">
                <IngestionIcon />
              </div>
              <p class="mr-auto text-sm font-semibold text-zinc-950">
                Ingestion Management
              </p>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
