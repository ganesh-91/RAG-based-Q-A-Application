import React, { useEffect, useState } from "react";
import axios from "axios";
import TableRow from "./tableRow";
import Pagination from "./pagination";

export const ListComponent = ({ items, title, headers, addEntityCb = () => { }, actionCb = () => { }, isDocumentPage = false }) => {
  return (
    <div class="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
      <div class="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
        <div class="flex items-center justify-between ">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">{title} List</h3>
          </div>
          <div class="flex flex-col gap-2 shrink-0 sm:flex-row">
            <button
              class="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => {
                addEntityCb();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                stroke-width="2"
                class="w-4 h-4"
              >
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
              </svg>
              Add {title}
            </button>
          </div>
        </div>
      </div>
      <div class="p-0 overflow-scroll">
        <table class="w-full mt-4 text-left table-auto min-w-max">
          <thead>
            <tr>
              {headers.map((header) => (
                <th class="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p class="uppercase flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    {header}
                  </p>
                </th>
              ))}

              <th class="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                <p class="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500"></p>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr>
                {headers.map((header) => (
                  <td class="p-4 border-b border-slate-200 max-w-40">
                    <div class="flex flex-col overflow-hidden">
                      <p class="text-sm font-semibold text-slate-700">
                        {
                          typeof item[header] === 'boolean'
                            ? (item[header] ? 'Completed' : 'In Progress')
                            : item[header]
                        }

                      </p>
                    </div>
                  </td>
                ))}
                {isDocumentPage && <td class="p-4 border-b border-slate-200">
                  <button
                    onClick={() => actionCb(item)}
                    class="border-red-500 border text-red-500 p-2 select-none rounded text-center align-middle font-sans text-xs font-medium uppercase  transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                  >
                    Ingest
                  </button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </div>
  );
};

export default ListComponent;
