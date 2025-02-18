import React from "react";

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            {/* Đây là nơi bạn có thể thêm sidebar nếu muốn */}
            {children}
        </div>
    );
};

export default AdminLayout;
