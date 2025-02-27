import React from 'react'
import './homeAdmin.scss'

import Sidebar from '../../../components/admin/sidebar/Sidebar'
import Navbar from '../../../components/admin/navbar/Navbar'
import Widget from '../../../components/admin/widget/Widget'
import Chart from '../../../components/admin/chart/Chart'
import Table from '../../../components/admin/table/Table'
import Featured from '../../../components/admin/featured/Featured'


const HomeAdmin = () => {
    return (
        <>
            <div className="home">
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <div className="widgets">
                        <Widget type="user" />
                        <Widget type="order" />
                        <Widget type="earning" />
                        <Widget type="balance" />
                    </div>
                    <div className="charts">
                        <Featured />
                        <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
                    </div>
                    <div className="listContainer">
                        <div className="listTitle">Latest Transactions</div>
                        <Table />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeAdmin