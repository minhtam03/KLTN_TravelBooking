// import React from 'react'
// import { Container, Row, Col, Button } from 'reactstrap'
// import { Link } from 'react-router-dom'
// import '../styles/thank-you.css'

// const ThankYou = () => {
//   return (
//     <section>
//         <Container>
//             <Row>
//                 <Col lg='12' className='pt-5 text-center'>
//                     <div className="thank__you">
//                         <span><i class="ri-checkbox-circle-line"></i></span>
//                         <h1 className="mb-3 fw-semibold">Thank You</h1>
//                         <h3 className='mb-4'>Your tour is booked.</h3>

//                         <Button className="btn primary__btn w-25">
//                             <Link to="/home">Back to Home</Link>
//                         </Button>
//                     </div>
//                 </Col>
//             </Row>
//         </Container>
//     </section>
//   )
// }

// export default ThankYou

import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import "../styles/thank-you.css";

const ThankYou = () => {
    const navigate = useNavigate();

    // Hàm cập nhật trạng thái thanh toán sau khi Stripe redirect
    const handlePaymentSuccess = async (transactionId) => {
        try {
            const res = await fetch(`${BASE_URL}/payments/update-payment-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ transactionId }),
            });

            const result = await res.json();

            if (!res.ok) {
                return alert("Failed to update payment status: " + result.message);
            }

        } catch (error) {
            console.error("Error updating payment status:", error);
            alert("Something went wrong. Please contact support.");
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const transactionId = params.get("session_id"); // Stripe trả về session_id

        if (transactionId) {
            handlePaymentSuccess(transactionId);
        }
    }, []);

    return (
        <section>
            <Container>
                <Row>
                    <Col lg="12" className="pt-5 text-center">
                        <div className="thank__you">
                            <span><i className="ri-checkbox-circle-line"></i></span>
                            <h1>Thank You</h1>
                            <h3 className="mb-4">Your booking is booked.</h3>

                            <Button className="btn primary__btn w-25">
                                <Link to="/home">Back to Home</Link>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ThankYou;
