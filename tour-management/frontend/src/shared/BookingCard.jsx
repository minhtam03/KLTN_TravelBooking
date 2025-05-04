import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Icon,
  Divider
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import defaultImg from "../assets/images/tour-img04.jpg";

import vietnamAirlinesLogo from '../assets/images/vnairline.jpg';
import vietjetLogo from '../assets/images/vietjet.jpg';
import bambooLogo from '../assets/images/bamboo.jpg';


const getAirlineLogo = (airline) => {
  switch (airline) {
    case 'VietnamAirlines':
      return vietnamAirlinesLogo;
    case 'VietJetAir':
      return vietjetLogo;
    case 'BambooAirways':
      return bambooLogo;
    default:
      return 'https://www.libertytravel.com/sites/default/files/styles/full_size/public/flight-hero.jpg?itok=LKyRwKDq';
  }
};


const BookingCard = ({ booking, type }) => {
  const navigate = useNavigate();
  const { _id, createdAt, paymentStatus } = booking;
  const serviceFee = 0;

  let itemId, itemName, photo, unitPrice, quantity, date, dateLabel, qtyLabel;

  if (type === "tour") {
    itemId = booking.tourId;
    itemName = booking.tourName;
    photo = itemId?.photo || defaultImg;
    unitPrice = itemId?.price || 0;
    quantity = booking.guestSize;
    date = booking.bookAt;
    dateLabel = "Tour Date";
    qtyLabel = "Guests";
  } else if (type === "hotel") {
    itemId = booking.hotelId;
    itemName = booking.hotelName;
    photo = itemId?.photo || defaultImg;
    unitPrice = itemId?.pricePerNight || 0;
    quantity = booking.nights;
    date = booking.bookAt;
    dateLabel = "Check-in";
    qtyLabel = "Nights";
  } else if (type === "flight") {
    itemId = booking.flightId;
    itemName = itemId ? `${itemId.airline} - ${itemId.flightNumber}` : "Flight";
    photo = getAirlineLogo(booking.flightId?.airline)
    unitPrice = booking.flightId?.totalPriceUSD || 0;
    quantity = booking.guestSize;
    date = itemId?.departDate;
    dateLabel = "Departure";
    qtyLabel = "Passengers";
  }

  const totalPrice = unitPrice * quantity + serviceFee;

  const handleClick = () => {
    navigate(`/booking/${type}/${_id}`);
  };

  return (
    <Card
      data-testid="booking-card"
      onClick={handleClick}
      sx={{
        border: '1px solid #ddd',
        borderRadius: 2,
        transition: 'transform 0.3s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={photo}
        alt={itemName}
        onError={(e) => { e.target.src = defaultImg }}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography
          variant="h6"
          noWrap
          sx={{ mb: 1, fontWeight: 'bold', height: 50 }}
        >
          {itemName || "Unknown"}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarMonthIcon fontSize="small" sx={{ color: 'grey.600' }} />
          <Typography variant="body2">{dateLabel}: {date ? new Date(date).toLocaleDateString() : "Unknown Date"}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PersonIcon fontSize="small" sx={{ color: 'grey.600' }} />
          <Typography variant="body2">{qtyLabel}: {quantity}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AttachMoneyIcon fontSize="small" sx={{ color: 'grey.600' }} />
          <Typography variant="body2">Total: ${totalPrice}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'grey.600' }} />
          <Typography variant="body2">Status: {paymentStatus}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingCard;


