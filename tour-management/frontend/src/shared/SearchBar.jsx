// // import React, {useRef} from 'react'
// // import './search-bar.css'
// // import {Col, Form, FormGroup } from 'reactstrap'
// // import { useNavigate } from 'react-router-dom'
// // import { BASE_URL } from '../utils/config'

// // const SearchBar = () => {
// //     const locationRef = useRef('')
// //     const distanceRef = useRef(0)
// //     const maxGroupSizeRef = useRef(0)
// //     const navigate = useNavigate()

// //     const searchHandler = async() => {
// //         const location = locationRef.current.value
// //         const distance = distanceRef.current.value
// //         const maxGroupSize = maxGroupSizeRef.current.value

// //         if (location === '' || distance === '' || maxGroupSize === '') {
// //             return alert("All fields are required!")
// //         }

// //         const res = await fetch(`${BASE_URL}/tours/search/getTourBySearch?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`)

// //             if (!res.ok) alert ('Something went wrong')

// //             const result = await res.json()

// //             navigate(`/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`,
// //                 {state: result.data})
// //         }

// //   return (
// //     <Col lg='12'>
// //         <div className='search__bar'>
// //             <Form className='d-flex align-items-center gap-4'>
// //                 <FormGroup className='d-flex gap-3 form__group form__group-fast'>
// //                     <span>
// //                         <i class='ri-map-pin-line'></i>
// //                     </span>
// //                     <div>
// //                         <h6>Location</h6>
// //                         <input type="text" placeholder='Where are you going' ref={locationRef}/>
// //                     </div>
// //                 </FormGroup>

// //                 <FormGroup className='d-flex gap-3 form__group form__group-fast'>
// //                     <span>
// //                         <i class="ri-map-pin-range-line"></i>
// //                     </span>
// //                     <div>
// //                         <h6>Distance</h6>
// //                         <input type="number" placeholder='Distance k/m' ref={distanceRef}/>
// //                     </div>
// //                 </FormGroup>

// //                 <FormGroup className='d-flex gap-3 form__group'>
// //                     <span>
// //                         <i class="ri-group-line"></i>
// //                     </span>
// //                     <div>
// //                         <h6>Max People</h6>
// //                         <input type="number" placeholder='0' ref={maxGroupSizeRef}/>
// //                     </div>
// //                 </FormGroup>

// //                 <span className="search__icon" type='submit' onClick={searchHandler}>
// //                     <i class="ri-search-line"></i>
// //                 </span>
// //             </Form>

// //         </div>
// //     </Col>
// //   )
// // }

// // export default SearchBar

// import React, { useRef } from 'react'
// import './search-bar.css'
// import { Col, Form, FormGroup } from 'reactstrap'
// import { useNavigate } from 'react-router-dom'
// import { BASE_URL } from '../utils/config'

// const SearchBar = () => {
//     const locationRef = useRef('')
//     const durationRef = useRef(0)
//     const maxGroupSizeRef = useRef(0)
//     const navigate = useNavigate()

//     const searchHandler = async () => {
//         const location = locationRef.current.value
//         const duration = durationRef.current.value
//         const maxGroupSize = maxGroupSizeRef.current.value

//         // if (location === '' || duration === '' || maxGroupSize === '') {
//         //     return alert("All fields are required!")
//         // }

//         if (!location && !duration && !maxGroupSize) {
//             return alert("Please enter at least one field to search!");
//         }

//         const res = await fetch(`${BASE_URL}/tours/search/getTourBySearch?city=${location}&duration=${duration}&maxGroupSize=${maxGroupSize}`)

//         if (!res.ok) alert('Something went wrong')

//         const result = await res.json()

//         navigate(`/tours/search?city=${location}&duration=${duration}&maxGroupSize=${maxGroupSize}`,
//             { state: result.data })
//     }

//     return (
//         <Col lg='12'>
//             <div className='search__bar'>
//                 <Form className='d-flex align-items-center gap-4'>
//                     <FormGroup className='d-flex gap-3 form__group form__group-fast'>
//                         <span>
//                             <i class='ri-map-pin-line'></i>
//                         </span>
//                         <div>
//                             <h6>Location</h6>
//                             <input type="text" placeholder='Where are you going' ref={locationRef} />
//                         </div>
//                     </FormGroup>

//                     <FormGroup className='d-flex gap-3 form__group form__group-fast'>
//                         <span>
//                             <i class="ri-map-pin-range-line"></i>
//                         </span>
//                         <div>
//                             <h6>Duration</h6>
//                             <input type="number" placeholder="Duration" ref={durationRef} />
//                         </div>
//                     </FormGroup>

//                     <FormGroup className='d-flex gap-3 form__group'>
//                         <span>
//                             <i class="ri-group-line"></i>
//                         </span>
//                         <div>
//                             <h6>Max People</h6>
//                             <input type="number" placeholder="Max people" ref={maxGroupSizeRef} />
//                         </div>
//                     </FormGroup>

//                     <span className="search__icon" type='submit' onClick={searchHandler}>
//                         <i class="ri-search-line"></i>
//                     </span>
//                 </Form>

//             </div>
//         </Col>
//     )
// }

// export default SearchBar


import React, { useState, useEffect } from 'react';
import './search-bar.css';
import { Col, Form, FormGroup } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../utils/config';

const SearchBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [locationInput, setLocationInput] = useState('');
    const [duration, setDuration] = useState('');
    const [maxGroupSize, setMaxGroupSize] = useState('');

    useEffect(() => {
        setLocationInput(searchParams.get("city") || '');
        setDuration(searchParams.get("duration") || '');
        setMaxGroupSize(searchParams.get("maxGroupSize") || '');
    }, [location.search]);

    const searchHandler = async () => {
        if (!locationInput && !duration && !maxGroupSize) {
            return alert("Please enter at least one field to search!");
        }

        const res = await fetch(`${BASE_URL}/tours/search/getTourBySearch?city=${locationInput}&duration=${duration}&maxGroupSize=${maxGroupSize}`);
        if (!res.ok) return alert('Something went wrong');
        const result = await res.json();

        navigate(`/tours/search?city=${locationInput}&duration=${duration}&maxGroupSize=${maxGroupSize}`,
            { state: result.data });
    };

    return (
        <Col lg='12'>
            <div className='search__bar'>
                <Form className='d-flex align-items-center gap-4'>
                    <FormGroup className='d-flex gap-3 form__group form__group-fast'>
                        <span><i className='ri-map-pin-line'></i></span>
                        <div>
                            <h6>Location</h6>
                            <input type="text" placeholder='Where are you going'
                                value={locationInput}
                                onChange={e => setLocationInput(e.target.value)} />
                        </div>
                    </FormGroup>

                    <FormGroup className='d-flex gap-3 form__group form__group-fast'>
                        <span><i className="ri-map-pin-range-line"></i></span>
                        <div>
                            <h6>Duration</h6>
                            <input type="number" placeholder="Duration"
                                value={duration}
                                onChange={e => setDuration(e.target.value)} />
                        </div>
                    </FormGroup>

                    <FormGroup className='d-flex gap-3 form__group'>
                        <span><i className="ri-group-line"></i></span>
                        <div>
                            <h6>Max People</h6>
                            <input type="number" placeholder="Max people"
                                value={maxGroupSize}
                                onChange={e => setMaxGroupSize(e.target.value)} />
                        </div>
                    </FormGroup>

                    <span className="search__icon" onClick={searchHandler}>
                        <i className="ri-search-line"></i>
                    </span>
                </Form>
            </div>
        </Col>
    );
};

export default SearchBar;
