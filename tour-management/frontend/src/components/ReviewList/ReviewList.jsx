import React from 'react';
import { ListGroup } from 'reactstrap';
import avatar from '../../assets/images/ava-1.jpg';

const ReviewList = ({ reviews }) => {
    return (
        <ListGroup className="user__reviews">
            {reviews?.map((review) => (
                <div className="review__item" key={review.createdAt}>
                    <img src={avatar} alt="" />
                    <div className="w-100">
                        <h5>{review.username}</h5>
                        <p>{new Date(review.createdAt).toLocaleDateString('en-US')}</p>
                        <span className="d-flex align-items-center">
                            {review.rating} <i className="ri-star-s-fill"></i>
                        </span>
                        <h6>{review.reviewText}</h6>
                    </div>
                </div>
            ))}
        </ListGroup>
    );
};

export default ReviewList;
