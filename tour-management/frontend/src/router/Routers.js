import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import Tours from '../pages/Tours'
import TourDetails from '../pages/TourDetails'
import Login from '../pages/Login'
import Register from '../pages/Register'
import SearchResultList from '../pages/SearchResultList'
import About from '../pages/About'
import Flights from '../pages/Flights'
import Stays from '../pages/Stays'
import Blog from '../pages/Blog'
import ThankYou from '../pages/ThankYou'
import BookingHistory from '../pages/BookingHistory'
import Suggestion from '../pages/Suggestion'
import SearchResultListHotel from '../pages/SearchResultListHotel'
import HotelDetails from '../pages/HotelDetails'
import BookingDetail from '../pages/BookingDetail'

import AdminLayout from '../components/Layout/AdminLayout'
import HomeAdmin from '../pages/admin/home/HomeAdmin'
import New from '../pages/admin/new/New'
import List from '../pages/admin/list/List'
import Single from '../pages/admin/single/Single'
import Edit from '../pages/admin/edit/Edit'
import { userInputs, tourInputs } from '../resource/formSource'
import { userColumns, tourColumns, hotelColumns } from '../resource/datatableSource'

const Routers = () => {
  return (
    <Routes>
      {/* Routes dành cho user */}
      <Route path='/' element={<Navigate to="/home" />} />
      <Route path='/home' element={<Home />} />
      <Route path='/tours' element={<Tours />} />
      <Route path='/tours/:id' element={<TourDetails />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/tours/search' element={<SearchResultList />} />
      <Route path='/about' element={<About />} />
      <Route path='/flights' element={<Flights />} />
      <Route path='/stays' element={<Stays />} />
      <Route path='/Blog' element={<Blog />} />
      <Route path='/thank-you' element={<ThankYou />} />
      <Route path='/history' element={<BookingHistory />} />
      <Route path='/suggestion' element={<Suggestion />} />
      <Route path='/hotels' element={<SearchResultListHotel />} />
      <Route path='/hotels/single' element={<HotelDetails />} />
      <Route path='/history/:bookingId' element={<BookingDetail />} />

      {/* Routes dành cho admin */}
      <Route path='/admin/' element={<HomeAdmin />} />
      <Route path='/admin/home' element={<HomeAdmin />} />

      <Route path='/admin/users'>
        <Route index element={<List columns={userColumns} />} />
        <Route path=':id' element={<Single />} />
        <Route path='new' element={<New inputs={userInputs} title="Add New User" />} />
        <Route path=":id/edit" element={<Edit inputs={userInputs} title="Edit User" />} />

      </Route>

      <Route path='/admin/tours'>
        <Route index element={<List columns={tourColumns} />} />
        <Route path=':id' element={<Single />} />
        <Route path='new' element={<New inputs={tourInputs} title="Add New Tour" />} />
        <Route path=":id/edit" element={<Edit inputs={tourInputs} title="Edit Tour" />} />

      </Route>


    </Routes>
  )
}

export default Routers