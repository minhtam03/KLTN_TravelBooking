// import React from 'react'
// import "./list.scss"

// import Sidebar from "../../../components/admin/sidebar/Sidebar"
// import Navbar from "../../../components/admin/navbar/Navbar"
// import Datatable from "../../../components/admin/datatable/Datatable"

// const List = ({ columns }) => {
//     return (
//         <>
//             <div className="list">
//                 <Sidebar />
//                 <div className="listContainer">
//                     <Navbar />
//                     <Datatable columns={columns} />
//                 </div>
//             </div>
//         </>
//     )
// }

// export default List

import React from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import Datatable from "../../../components/admin/datatable/Datatable";
import { Box } from "@mui/material";

const List = ({ columns }) => {
    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar cố định bên trái */}
            <Sidebar />

            {/* Nội dung chính, đẩy sang phải để tránh bị che */}
            <Box sx={{ ml: "240px", flexGrow: 1 }}>
                <Navbar />
                <Box sx={{ p: 3 }}>
                    <Datatable columns={columns} />
                </Box>
            </Box>
        </Box>
    );
};

export default List;
