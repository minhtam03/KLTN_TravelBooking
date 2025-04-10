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
import SearchResultListFlight from '../pages/SearchResultListFlight'
import HotelDetails from '../pages/HotelDetails'
import FlightDetails from '../pages/FlightDetails'
import BookingDetail from '../pages/BookingDetail'

import AdminLayout from '../components/Layout/AdminLayout'
import HomeAdmin from '../pages/admin/home/HomeAdmin'
import New from '../pages/admin/new/New'
import List from '../pages/admin/list/List'

import Single from '../pages/admin/single/Single'
import SingleTour from '../pages/admin/single-tour/SingleTour'
import SingleHotel from '../pages/admin/single-hotel/SingleHotel'
import SinglePost from '../pages/admin/single-post/SinglePost'
import SingleFlight from '../pages/admin/single-flight/SingleFlight'

import Edit from '../pages/admin/edit/Edit'
import { userInputs, tourInputs, postInputs, hotelInputs, flightInputs } from '../resource/formSource'
import { userColumns, tourColumns, hotelColumns, postColumns, flightColumns } from '../resource/datatableSource'

import PostDetail from '../pages/PostDetail'
import Profile from '../pages/Profile'

import GenericBookingDetail from '../pages/GenericBookingDetail'
import HotelBookingHistory from "../pages/HotelBookingHistory";
import TourBookingHistory from "../pages/TourBookingHistory";
import FlightBookingHistory from '../pages/FlightBookingHistory'


const Routers = () => {
  return (
    <Routes>
      {/* Routes dành cho user */}
      <Route path='/' element={<Navigate to="/home" />} />
      <Route path='/home' element={<Home />} />
      <Route path="/profile" element={<Profile />} />

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/about' element={<About />} />


      <Route path='/blog' element={<Blog />} />
      <Route path='/post/:id' element={<PostDetail />} />
      <Route path='/thank-you' element={<ThankYou />} />
      <Route path='/history' element={<BookingHistory />} />
      <Route path='/suggestion' element={<Suggestion />} />


      <Route path='/tours' element={<Tours />} />
      <Route path='/tours/:id' element={<TourDetails />} />
      <Route path='/tours/search' element={<SearchResultList />} />

      <Route path='/stays' element={<Stays />} />
      <Route path='/stays/:id' element={<HotelDetails />} />
      <Route path="/stays/search" element={<SearchResultListHotel />} />

      <Route path='/flights' element={<Flights />} />
      <Route path='/flights/:id' element={<FlightDetails />} />
      <Route path="/flights/search" element={<SearchResultListFlight />} />

      {/* <Route path='/history/:bookingId' element={<BookingDetail />} /> */}

      <Route path="/booking/tour/:bookingId" element={<GenericBookingDetail type="tour" />} />
      <Route path="/booking/hotel/:bookingId" element={<GenericBookingDetail type="hotel" />} />
      <Route path="/booking/flight/:bookingId" element={<GenericBookingDetail type="flight" />} />
      <Route path="/booking/hotel" element={<HotelBookingHistory />} />
      <Route path="/booking/tour" element={<TourBookingHistory />} />
      <Route path="/booking/flight" element={<FlightBookingHistory />} />




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
        <Route path=':id' element={<SingleTour />} />
        <Route path='new' element={<New inputs={tourInputs} title="Add New Tour" />} />
        <Route path=":id/edit" element={<Edit inputs={tourInputs} title="Edit Tour" />} />

      </Route>

      <Route path='/admin/hotels'>
        <Route index element={<List columns={hotelColumns} />} />
        <Route path=':id' element={<SingleHotel />} />
        <Route path='new' element={<New inputs={hotelInputs} title="Add New Hotel" />} />
        <Route path=':id/edit' element={<Edit inputs={hotelInputs} title="Edit Hotel" />} />
      </Route>

      <Route path='/admin/flights'>
        <Route index element={<List columns={flightColumns} />} />
        <Route path=':id' element={<SingleFlight />} />
        <Route path='new' element={<New inputs={flightInputs} title="Add New Flight" />} />
        <Route path=':id/edit' element={<Edit inputs={flightInputs} title="Edit Flight" />} />
      </Route>

      <Route path='/admin/posts'>
        <Route index element={<List columns={postColumns} />} />
        <Route path='new' element={<New inputs={postInputs} title="Add New Post" />} />
        <Route path=':id' element={<SinglePost />} />
        <Route path=':id/edit' element={<Edit inputs={postInputs} title="Edit Post" />} />
      </Route>


    </Routes>
  )
}

export default Routers