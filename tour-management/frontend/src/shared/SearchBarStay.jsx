import React from 'react'
import { Container } from 'reactstrap'
import { faBed } from "@fortawesome/free-solid-svg-icons/faBed";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons/faCalendarDays";
import { faPerson } from "@fortawesome/free-solid-svg-icons/faPerson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useContext, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import './search-bar-stay.css'
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const SearchBarStay = () => {
  const [destination, setDestination] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // const [openDate, setOpenDate] = useState(false);
  // const [dates, setDates] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  // const [openOptions, setOpenOptions] = useState(false);
  // const [options, setOptions] = useState({
  //   adult: 1,
  //   children: 0,
  //   room: 1,
  // });

  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);


  // const handleOption = (name, operation) => {
  //   setOptions((prev) => {
  //     return {
  //       ...prev,
  //       [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
  //     };
  //   });
  // };

  // const { dispatch } = useContext(SearchContext);

  // const handleSearch = () => {
  //   // dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
  //   navigate("/hotels", { state: { destination, dates, options } });
  // };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/hotels/search/getHotelBySearch`, {
        params: {
          location: destination,
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 9999
        }
      });

      navigate("/stays/search", {
        state: {
          data: res.data.data,
          destination,
          minPrice,
          maxPrice
        }
      });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="headerSearch">
      <div className="headerSearchItem">
        <FontAwesomeIcon icon={faBed} className="headerIcon" />
        <input
          type="text"
          placeholder="Where are you going?"
          className="headerSearchInput"
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className="headerSearchItem">
        <FontAwesomeIcon icon={faDollarSign} className="headerIcon" />
        <input
          type="number"
          placeholder="Min price"
          className="headerSearchInput"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div className="headerSearchItem">
        <FontAwesomeIcon icon={faDollarSign} className="headerIcon" />
        <input
          type="number"
          placeholder="Max price"
          className="headerSearchInput"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* <div className="headerSearchItem">
        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
        <span
          onClick={() => setOpenDate(!openDate)}
          className="headerSearchText"
        >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
          dates[0].endDate,
          "MM/dd/yyyy"
        )}`}</span>
        {openDate && (
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDates([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dates}
            className="date"
            minDate={new Date()}
          />
        )}
      </div> */}

      {/* <div className="headerSearchItem">
        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
        <div className="dateInputs">
          <input
            type="date"
            value={format(dates[0].startDate, "yyyy-MM-dd")}
            onChange={(e) =>
              setDates([
                {
                  ...dates[0],
                  startDate: new Date(e.target.value),
                },
              ])
            }
            className="dateInput"
          />
          <span style={{ margin: '0 5px' }}>to</span>
          <input
            type="date"
            value={format(dates[0].endDate, "yyyy-MM-dd")}
            onChange={(e) =>
              setDates([
                {
                  ...dates[0],
                  endDate: new Date(e.target.value),
                },
              ])
            }
            className="dateInput"
          />
        </div>
      </div>
      <div className="headerSearchItem">
        <FontAwesomeIcon icon={faPerson} className="headerIcon" />
        <span
          onClick={() => setOpenOptions(!openOptions)}
          className="headerSearchText"
        >{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span>
        {openOptions && (
          <div className="options">
            <div className="optionItem">
              <span className="optionText">Adult</span>
              <div className="optionCounter">
                <button
                  disabled={options.adult <= 1}
                  className="optionCounterButton"
                  onClick={() => handleOption("adult", "d")}
                >
                  -
                </button>
                <span className="optionCounterNumber">
                  {options.adult}
                </span>
                <button
                  className="optionCounterButton"
                  onClick={() => handleOption("adult", "i")}
                >
                  +
                </button>
              </div>
            </div>
            <div className="optionItem">
              <span className="optionText">Children</span>
              <div className="optionCounter">
                <button
                  disabled={options.children <= 0}
                  className="optionCounterButton"
                  onClick={() => handleOption("children", "d")}
                >
                  -
                </button>
                <span className="optionCounterNumber">
                  {options.children}
                </span>
                <button
                  className="optionCounterButton"
                  onClick={() => handleOption("children", "i")}
                >
                  +
                </button>
              </div>
            </div>
            <div className="optionItem">
              <span className="optionText">Room</span>
              <div className="optionCounter">
                <button
                  disabled={options.room <= 1}
                  className="optionCounterButton"
                  onClick={() => handleOption("room", "d")}
                >
                  -
                </button>
                <span className="optionCounterNumber">
                  {options.room}
                </span>
                <button
                  className="optionCounterButton"
                  onClick={() => handleOption("room", "i")}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div> */}
      <div className="headerSearchItem">
        <button className="headerBtn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  )

}

export default SearchBarStay