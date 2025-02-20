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
import { userInputs } from '../resource/datatableSource'

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

      {/* <Route path='/admin/users' element={<List />} />
      <Route path='/admin/users/:id' element={<Single />} />
      <Route path='/admin/users/new' element={<New />} /> */}

      <Route path='/admin/users'>
        <Route index element={<List />} />
        <Route path=':id' element={<Single />} />
        <Route path='new' element={<New inputs={userInputs} title="Add New User" />} />

      </Route>


    </Routes>
  )
}

export default Routers