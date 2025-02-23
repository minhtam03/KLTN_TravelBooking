import { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '../utils/config';

const useReview = (tourId, user, title, reviews, setReviews) => {
    const reviewMsgRef = useRef('');
    const [tourRating, setTourRating] = useState(null);
    const [summary, setSummary] = useState('');

    // Fetch review summary
    const fetchSummary = async () => {
        try {
            const res = await fetch(`${BASE_URL}/review/summary/${tourId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await res.json();

            if (result.success) {
                setSummary(result.summary);
            } else {
                setSummary('Không thể tải tóm tắt đánh giá.');
            }
        } catch (error) {
            console.error("Lỗi khi lấy tóm tắt đánh giá:", error);
            setSummary('Không thể tải tóm tắt đánh giá.');
        }
    };

    useEffect(() => {
        if (tourId) {
            fetchSummary();
        }
    }, [tourId]);

    // Submit review
    const submitReview = async (e) => {
        e.preventDefault();
        const reviewText = reviewMsgRef.current.value;

        if (!user) {
            alert('Please sign in');
            return;
        }

        try {
            // Kiểm tra xem user đã đặt tour chưa
            const resBookings = await fetch(`${BASE_URL}/booking/booking-history/all`, {
                method: 'GET',
                credentials: 'include',
            });
            const resultBooking = await resBookings.json();

            if (!resultBooking.success) {
                alert(resultBooking.message);
                return;
            }

            const bookings = resultBooking.data;
            if (!Array.isArray(bookings)) {
                alert('Lỗi khi lấy danh sách đặt tour.');
                return;
            }

            const tourBooked = bookings.some((booking) => booking.tourName === title);
            if (!tourBooked) {
                alert('Bạn chưa đặt tour này.');
                return;
            }

            // Gửi review mới
            const reviewObj = {
                username: user?.username,
                reviewText,
                rating: tourRating,
            };

            const res = await fetch(`${BASE_URL}/review/${tourId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(reviewObj),
            });

            const result = await res.json();
            if (!res.ok) {
                alert(result.message);
                return;
            }

            // Cập nhật danh sách reviews
            const newReview = {
                username: user.username,
                reviewText,
                rating: tourRating,
                createdAt: new Date().toISOString(),
            };

            setReviews([...reviews, newReview]);
            reviewMsgRef.current.value = '';
            setTourRating(null);

            // Cập nhật lại summary
            fetchSummary();
        } catch (err) {
            alert(err.message);
        }
    };

    return {
        reviewMsgRef,
        tourRating,
        setTourRating,
        summary,
        submitReview,
    };
};

export default useReview;
