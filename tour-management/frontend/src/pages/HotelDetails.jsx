import '../styles/hotel-details.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleArrowLeft,
    faCircleArrowRight,
    faCircleXmark,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HotelDetails = () => {
    const handleClick = () => {
        // if (user) {
        //   setOpenModal(true);
        // } else {
        //   navigate("/login");
        // }
    };

    const [slideNumber, setSlideNumber] = useState(0)
    const [open, setOpen] = useState(false)

    const photos = [
        {
            src: "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc="
        },
        {
            src: "https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI="
        },
        {
            src: "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc="
        },
        {
            src: "https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI="
        },
        {
            src: "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc="
        },
        {
            src: "https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI="
        },
    ]

    const handleOpen = (i) => {
        setSlideNumber(i);
        setOpen(true);
    };

    const handleMove = (direction) => {
        let newSlideNumber;

        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
        } else {
            newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
        }

        setSlideNumber(newSlideNumber);
    };

    return (
        <>
            <div className="hotelContainer">
                {open && (
                    <div className="slider">
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            className="close"
                            onClick={() => setOpen(false)}
                        />
                        <FontAwesomeIcon
                            icon={faCircleArrowLeft}
                            className="arrow"
                            onClick={() => handleMove("l")}
                        />
                        <div className="sliderWrapper">
                            <img
                                src={photos[slideNumber].src}
                                alt=""
                                className="sliderImg"
                            />
                        </div>
                        <FontAwesomeIcon
                            icon={faCircleArrowRight}
                            className="arrow"
                            onClick={() => handleMove("r")}
                        />
                    </div>
                )}

                <div className="hotelWrapper">
                    <button className="bookNow">Reserve or Book Now!</button>
                    <h1 className="hotelTitle">Grand hotel</h1>
                    <div className="hotelAddress">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>Nguyen Chi Thanh, Ha Noi, Viet Nam</span>
                    </div>
                    <span className="hotelDistance">
                        Excellent location – 500 m from center
                    </span>
                    <span className="hotelPriceHighlight">
                        Book a stay over $100 at this property and get a
                        free airport taxi
                    </span>
                    <div className="hotelImages">

                        {photos.map((photo, i) => (
                            <div className="hotelImgWrapper">
                                <img
                                    onClick={() => handleOpen(i)}
                                    src={photo.src}
                                    alt=""
                                    className="hotelImg"
                                />
                            </div>
                        ))}


                        {/* {data.photos?.map((photo, i) => (
                            <div className="hotelImgWrapper" key={i}>
                                <img
                                    onClick={() => handleOpen(i)}
                                    src={photo}
                                    alt=""
                                    className="hotelImg"
                                />
                            </div>
                        ))} */}
                    </div>
                    <div className="hotelDetails">
                        <div className="hotelDetailsTexts">
                            <h1 className="hotelTitle">Hotel Name</h1>
                            <p className="hotelDesc">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet inventore quasi numquam magni adipisci voluptatibus eius reprehenderit vero velit veniam libero rem quos voluptate est odit, aliquid deserunt! Nam, itaque.</p>
                        </div>
                        <div className="hotelDetailsPrice">
                            <h1>Perfect for a 5-night stay!</h1>
                            <span>
                                Located in the real heart of Krakow, this property has an
                                excellent location score of 9.8!
                            </span>
                            <h2>
                                <b>$10</b> (5{" "}
                                nights)
                            </h2>
                            <button onClick={handleClick}>Reserve or Book Now!</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HotelDetails