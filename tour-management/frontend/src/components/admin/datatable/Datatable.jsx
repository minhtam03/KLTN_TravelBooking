// import React from 'react'
// import { Link, useLocation } from "react-router-dom";

// import { DataGrid } from '@mui/x-data-grid';
// import "./datatable.scss"
// const columns = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     {
//         field: 'firstName',
//         headerName: 'First name',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'lastName',
//         headerName: 'Last name',
//         width: 150,
//         editable: true,
//     },
//     {
//         field: 'age',
//         headerName: 'Age',
//         type: 'number',
//         width: 110,
//         editable: true,
//     },
//     {
//         field: 'fullName',
//         headerName: 'Full name',
//         description: 'This column has a value getter and is not sortable.',
//         sortable: false,
//         width: 160,
//         valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//     },
//     {
//         field: 'status',
//         headerName: 'Status',
//         description: 'This column has',
//         sortable: false,
//         width: 160,
//     },
// ];

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 16 },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// const actionColumn = [
//     {
//         field: "action",
//         headerName: "Action",
//         width: 200,
//         renderCell: (params) => {
//             return (
//                 <div className="cellAction">
//                     <Link to="/users/test" style={{ textDecoration: "none" }}>
//                         <div className="viewButton">View</div>
//                     </Link>
//                     <div
//                         className="deleteButton"
//                     // onClick={() => handleDelete(params.row._id)}
//                     >
//                         Delete
//                     </div>
//                 </div>
//             );
//         },
//     },
// ];

// const Datatable = () => {
//     return (
//         <div className='datatable'>
//             <div className="datatableTitle">

//                 <Link to="/admin/users/new" className="link">
//                     Add New
//                 </Link>
//             </div>
//             <DataGrid
//                 className="datagrid"
//                 rows={rows}
//                 columns={columns.concat(actionColumn)}
//                 initialState={{
//                     pagination: {
//                         paginationModel: {
//                             pageSize: 5,
//                         },
//                     },
//                 }}
//                 pageSizeOptions={[5]}
//                 checkboxSelection
//                 disableRowSelectionOnClick
//             />
//         </div>
//     )
// }

// export default Datatable


import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import './datatable.scss'

// Giả sử bạn có BASE_URL dùng chung
import { BASE_URL } from '../../../utils/config'

const columns = [
    { field: '_id', headerName: 'ID', width: 120 },
    {
        field: 'username',
        headerName: 'User Name',
        width: 150,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 200,
    },
    {
        field: 'role',
        headerName: 'Role',
        width: 100,
    },
]

const actionColumn = [
    {
        field: 'action',
        headerName: 'Action',
        width: 200,
        renderCell: (params) => {
            return (
                <div className="cellAction">
                    <Link to={`/admin/users/${params.row._id}`} style={{ textDecoration: 'none' }}>
                        <div className="viewButton">View</div>
                    </Link>
                    <div className="deleteButton">
                        Delete
                    </div>
                </div>
            )
        },
    },
]

const Datatable = () => {
    const [rows, setRows] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${BASE_URL}/users`, {
                    method: 'GET',
                    credentials: 'include',

                })
                if (!res.ok) {
                    throw new Error('Failed to fetch users')
                }
                const result = await res.json()
                setRows(result.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className='datatable'>
            <div className="datatableTitle">
                <Link to="/admin/users/new" className="link">
                    Add New
                </Link>
            </div>

            <DataGrid
                className="datagrid"
                rows={rows}
                columns={columns.concat(actionColumn)}
                getRowId={(row) => row._id}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 8,
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
