import React from 'react'
import "./list.scss"

import Sidebar from "../../../components/admin/sidebar/Sidebar"
import Navbar from "../../../components/admin/navbar/Navbar"
import Datatable from "../../../components/admin/datatable/Datatable"

const List = ({ columns }) => {
    return (
        <>
            <div className="list">
                <Sidebar />
                <div className="listContainer">
                    <Navbar />
                    <Datatable columns={columns} />
                </div>
            </div>
        </>
    )
}

export default List