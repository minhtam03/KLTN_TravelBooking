// import "./chart.scss";
// import {
//     AreaChart,
//     Area,
//     XAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";

// const Chart = ({ aspect, title, data }) => {
//     return (
//         <div className="chart">
//             <div className="title">{title}</div>
//             <ResponsiveContainer width="100%" aspect={aspect}>
//                 <AreaChart
//                     width={730}
//                     height={250}
//                     data={data}
//                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                 >
//                     <defs>
//                         <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
//                             <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
//                         </linearGradient>
//                     </defs>
//                     <XAxis dataKey="name" stroke="gray" />
//                     <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
//                     <Tooltip />
//                     <Area
//                         type="monotone"
//                         dataKey="Total"
//                         stroke="#8884d8"
//                         fillOpacity={1}
//                         fill="url(#total)"
//                     />
//                 </AreaChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default Chart;


import { Box, Typography, useTheme } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const Chart = ({ aspect, title, data }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                padding: 2,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                }}
            >
                {title}
            </Typography>

            <ResponsiveContainer width="100%" aspect={aspect}>
                <BarChart
                    width={730}
                    height={250}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <Tooltip />
                    <Bar
                        dataKey="Total"
                        fill="rgba(204, 216, 224, 0.98)"
                        radius={[4, 4, 0, 0]}
                        activeBar={{ fill: "rgba(204, 216, 224, 0.98)" }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default Chart;
