import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import './datatable.scss'
import { BASE_URL } from '../../../utils/config'
import useFetch from '../../../hooks/useFetch'

const columnsConfig = {
    users: [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'username', headerName: 'User Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 },
    ],
    tours: [
        { field: '_id', headerName: 'ID', width: 120 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'price', headerName: 'Price ($)', width: 120 },
    ],
    hotels: [
        { field: '_id', headerName: 'ID', width: 120 },
        { field: 'name', headerName: 'Hotel Name', width: 200 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'rating', headerName: 'Rating', width: 100 },
    ],
}


const Datatable = ({ columns }) => {
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const [rows, setRows] = useState([])
    const [page, setPage] = useState(0);
    // const { data: rows, loading, error } = useFetch(`${BASE_URL}/${path}`)


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to delete");
            }

            setRows((prevRows) => prevRows.filter((row) => row._id !== id));

            await new Promise(resolve => setTimeout(resolve, 100));

            // alert("User deleted successfully!");

        } catch (error) {
            console.error(error);
            alert("Error deleting");
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/${path}`, {
                    method: 'GET',
                    credentials: 'include',

                })
                if (!res.ok) {
                    throw new Error('Failed to fetch data')
                }
                const result = await res.json()
                setRows(result.data)
                setPage(0);
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [path])

    const actionColumn = [
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/admin/${path}/${params.row._id}`} style={{ textDecoration: 'none' }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div className="deleteButton"
                            onClick={() => handleDelete(params.row._id)}
                        >
                            Delete
                        </div>
                    </div>
                )
            },
        },
    ]


    return (
        <div className='datatable'>
            <div className="datatableTitle">
                <Link to={`/admin/${path}/new`} className="link">
                    Add new {path}
                </Link>
            </div>

            <DataGrid
                key={path}
                className="datagrid"
                rows={rows}
                // columns={(columnsConfig[path] || []).concat(actionColumn)}
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
            />
        </div>
    )
}

export default Datatable
