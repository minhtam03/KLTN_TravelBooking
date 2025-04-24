import React from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Navbar from "../../../components/admin/navbar/Navbar";
import Widget from "../../../components/admin/widget/Widget";
import BookingTable from "../../../components/admin/table/BookingTable";

import { Box, Typography, Paper } from "@mui/material";

const HomeAdmin = () => {
    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar cố định */}
            <Sidebar />

            {/* Nội dung chính */}
            <Box sx={{ ml: "240px", flexGrow: 1 }}>
                <Navbar />

                {/* Widget Section */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 8,
                        p: 3,
                        flexWrap: "wrap",
                    }}
                >
                    <Widget type="user" />
                    <Widget type="tour" />
                    <Widget type="hotel" />
                    <Widget type="flight" />
                </Box>

                {/* Charts Section (bỏ comment nếu dùng) */}
                {/* <Box
          sx={{
            display: "flex",
            gap: 6,
            px: 3,
            pb: 3,
          }}
        >
          <Featured />
          <Chart title="Last 6 Months (Total Revenue)" aspect={2 / 1} data={revenueData} />
        </Box> */}

                {/* Table Section */}
                <Paper
                    elevation={3}
                    sx={{
                        m: 3,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Typography variant="h5" fontWeight={700}>
                        All Transactions
                    </Typography>
                    <BookingTable />
                </Paper>
            </Box>
        </Box>
    );
};

export default HomeAdmin;
