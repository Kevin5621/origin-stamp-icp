import React from "react";

interface TableColumn {
  key: string;
  label: string;
}

interface TableData {
  [key: string]: string | number;
}

interface DashboardTableProps {
  title: string;
  data: TableData[];
  columns: TableColumn[];
}

const DashboardTable: React.FC<DashboardTableProps> = ({
  title,
  data,
  columns,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="dashboard-table">
        <div className="dashboard-table__header">
          <h3 className="dashboard-table__title">{title}</h3>
        </div>
        <div className="dashboard-table__content">
          <div className="dashboard-empty">
            <div className="dashboard-empty__icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <h3 className="dashboard-empty__title">No data available</h3>
            <p className="dashboard-empty__description">
              There are no items to display
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-table">
      <div className="dashboard-table__header">
        <h3 className="dashboard-table__title">{title}</h3>
      </div>
      <div className="dashboard-table__content">
        <table className="dashboard-table__table">
          <thead className="dashboard-table__thead">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="dashboard-table__th">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="dashboard-table__tr">
                {columns.map((column) => (
                  <td key={column.key} className="dashboard-table__td">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
