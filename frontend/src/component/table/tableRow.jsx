import React from "react";
const TableRow = ({ user }) => {
  return (
    <tr>
      <td class="p-4 border-b border-slate-200">
        <div class="flex items-center gap-3">
          <div class="flex flex-col">
            <p class="text-sm font-semibold text-slate-700">{user.email}</p>
            <p class="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td class="p-4 border-b border-slate-200">
        <div class="flex flex-col">
          <p class="text-sm font-semibold text-slate-700">{user.role}</p>
        </div>
      </td>

      <td class="p-4 border-b border-slate-200">
        <button
          class="border-red-500 border text-red-500 p-2 select-none rounded text-center align-middle font-sans text-xs font-medium uppercase  transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
