"use client";

export default function DataTable({
  columns = [],
  rows = [],
  renderCell,
  mobileCardTitle,
  mobileCardLines,
}) {
  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3 text-left font-medium ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-slate-50"
              >
                {columns.map((col) => (
                  <td
                    key={`${row.id}-${col.key}`}
                    className={`p-3 ${col.className || ""}`}
                    style={{ overflow: "visible" }}   // ✅ CRITICAL FIX
                  >
                    {renderCell
                      ? renderCell(col.key, row)
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4"
          >
            <div className="font-semibold text-slate-900">
              {mobileCardTitle ? mobileCardTitle(row) : row.id}
            </div>

            <div className="mt-2 space-y-1 text-sm text-slate-700">
              {mobileCardLines &&
                mobileCardLines(row).map((line) => (
                  <div
                    key={line.label}
                    className="flex justify-between items-center gap-2"
                  >
                    <span className="text-slate-500">{line.label}</span>
                    <span>{line.value}</span>
                  </div>
                ))}
            </div>

            {/* MOBILE ACTIONS */}
            {renderCell && (
              <div className="mt-3">
                {renderCell("actions", row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}