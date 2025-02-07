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

const Routers = () => {
  return (
    <Routes>
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
    </Routes>
  )
}

export default Routers