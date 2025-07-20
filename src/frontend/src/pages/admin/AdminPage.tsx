import React from "react";
import S3ConfigPanel from "../../components/admin/S3ConfigPanel";
import S3TestPanel from "../../components/admin/S3TestPanel";

const AdminPage: React.FC = () => {
  return (
    <section className="admin-section">
      <div className="admin-container">
        <header className="admin-header">
          <h1>Admin Panel</h1>
          <p>Configure system settings and storage options</p>
        </header>

        <main className="admin-content">
          <S3ConfigPanel />
          <S3TestPanel />
        </main>
      </div>
    </section>
  );
};

export default AdminPage;
