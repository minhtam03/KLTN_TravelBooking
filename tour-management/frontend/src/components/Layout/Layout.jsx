import React from 'react'
import { useLocation } from "react-router-dom";
import Header from '../Header/Header'
import Routers from '../../router/Routers'
import Footer from '../Footer/Footer'
import AdminLayout from './AdminLayout';

const Layout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return isAdmin ? (
    <AdminLayout>
      <Routers />
    </AdminLayout>
  ) : (
    <>
      <Header />
      <Routers />
      <Footer />
    </>
  );
}

export default Layout