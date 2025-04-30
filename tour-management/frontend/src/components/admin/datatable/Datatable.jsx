import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Typography, Stack } from '@mui/material'
import { BASE_URL } from '../../../utils/config'
import { IconButton, Tooltip } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Datatable = ({ columns }) => {
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const [rows, setRows] = useState([])
    const [page, setPage] = useState(0)
    const [importing, setImporting] = useState(false);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete")

            setRows((prevRows) => prevRows.filter((row) => row._id !== id))

            await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
            console.error(error)
            alert("Error deleting")
        }
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch(`${BASE_URL}/${path}`, {
    //                 method: 'GET',
    //                 credentials: 'include',
    //             })
    //             if (!res.ok) throw new Error('Failed to fetch data')
    //             const result = await res.json()
    //             setRows(result.data)
    //             setPage(0)
    //         } catch (error) {
    //             console.error(error)
    //         }
    //     }

    //     fetchData()
    // }, [path])

    const fetchData = async () => {
        try {
            const res = await fetch(`${BASE_URL}/${path}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const result = await res.json();
            setRows(result.data);
            setPage(0);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [path]);


    const actionColumn = [
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Tooltip title="View">
                        <IconButton
                            color="info"
                            component={Link}
                            to={`/admin/${path}/${params.row._id}`}
                            size="small"
                        >
                            <VisibilityIcon sx={{ color: '#c7bed0' }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                        <IconButton
                            color="warning"
                            component={Link}
                            to={`/admin/${path}/${params.row._id}/edit`}
                            size="small"
                        >
                            <EditIcon sx={{ color: '#687581' }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton
                            color="error"
                            onClick={() => handleDelete(params.row._id)}
                            size="small"
                        >
                            <DeleteIcon sx={{ color: 'rgb(210, 101, 101)' }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )

        },
    ]

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={Link}
                    to={`/admin/${path}/new`}
                    sx={{
                        borderRadius: '50px',
                        backgroundColor: '#f5f0fa',
                        color: '#6b46c1',
                        textTransform: 'none',
                        boxShadow: 3,
                        fontSize: '1rem',
                        '&:hover': {
                            color: '#6b46c1',
                            backgroundColor: '#e4d8f4',
                            boxShadow: 4,
                        }
                    }}
                >
                    Add new {path.endsWith("s") ? path.slice(0, -1) : path}
                </Button>

                {path === 'hotels' && (
                    <Button
                        variant="contained"
                        startIcon={<ArrowUpwardIcon />}
                        disabled={importing}
                        onClick={async () => {
                            setImporting(true);
                            try {
                                // Gọi API import-hotels
                                const resImport = await fetch(`${BASE_URL}/hotels/import-hotels`, {
                                    method: 'GET',
                                    credentials: 'include',
                                });
                                if (!resImport.ok) throw new Error('Import hotels failed');

                                // Gọi tiếp API normalize-hotels
                                const resNormalize = await fetch(`${BASE_URL}/hotels/normalize-hotels`, {
                                    method: 'GET',
                                    credentials: 'include',
                                });
                                if (!resNormalize.ok) throw new Error('Normalize hotels failed');

                                // const res = await fetch(`${BASE_URL}/hotels`, {
                                //     method: 'GET',
                                //     credentials: 'include',
                                // });

                                // setRows(res.data.data); // Update lại bảng với dữ liệu mới
                                // setPage(0);

                                alert('Import and Normalize Hotels successfully!');
                                await fetchData();
                            } catch (error) {
                                console.error(error);
                                alert('Có lỗi xảy ra trong quá trình Import hoặc Normalize!');
                            } finally {
                                setImporting(false);
                            }
                        }}
                        sx={{
                            borderRadius: '50px',
                            backgroundColor: '#f5f0fa',
                            color: '#6b46c1',
                            textTransform: 'none',
                            boxShadow: 3,
                            fontSize: '1rem',
                            '&:hover': {
                                color: '#6b46c1',
                                backgroundColor: '#e4d8f4',
                                boxShadow: 4,
                            }
                        }}
                    >
                        {importing ? 'Importing...' : 'Import new data'}
                    </Button>
                )}

                {path === 'flights' && (
                    <Button
                        variant="contained"
                        startIcon={<ArrowUpwardIcon />}
                        disabled={importing}
                        onClick={async () => {
                            setImporting(true);
                            try {
                                // Gọi API import-hotels
                                const resImport = await fetch(`${BASE_URL}/flights/import-flights`, {
                                    method: 'POST',
                                    credentials: 'include',
                                });
                                if (!resImport.ok) throw new Error('Import flights failed');

                                // Gọi tiếp API normalize-hotels
                                const resNormalize = await fetch(`${BASE_URL}/flights/convert-prices`, {
                                    method: 'POST',
                                    credentials: 'include',
                                });
                                if (!resNormalize.ok) throw new Error('Normalize flights failed');

                                // const res = await fetch(`${BASE_URL}/hotels`, {
                                //     method: 'GET',
                                //     credentials: 'include',
                                // });

                                // setRows(res.data.data); // Update lại bảng với dữ liệu mới
                                // setPage(0);

                                alert('Import và Normalize Flights thành công!');
                            } catch (error) {
                                console.error(error);
                                alert('Có lỗi xảy ra trong quá trình Import hoặc Normalize!');
                            } finally {
                                setImporting(false);
                            }
                        }}
                        sx={{
                            borderRadius: '50px',
                            backgroundColor: '#f5f0fa',
                            color: '#6b46c1',
                            textTransform: 'none',
                            boxShadow: 3,
                            fontSize: '1rem',
                            '&:hover': {
                                color: '#6b46c1',
                                backgroundColor: '#e4d8f4',
                                boxShadow: 4,
                            }
                        }}
                    >
                        {importing ? 'Importing...' : 'Import new data'}
                    </Button>
                )}

            </Box>

            <DataGrid
                key={path}
                rows={rows}
                columns={columns.concat(actionColumn)}
                getRowId={(row) => row._id}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 8,
                            page: 0,
                        },
                    },
                }}
                pageSizeOptions={[8]}
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: 3,
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none', // Loại bỏ border khi focus
                    },
                    '& .MuiDataGrid-cell:focus-within': {
                        outline: 'none', // Khi có button hoặc input trong cell
                    },
                    '& .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell:focus-within': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-cell--editing': {
                        outline: 'none',
                        border: 'none',
                    }
                }}
            />
        </Box>
    )
}

export default Datatable
