import React from 'react';

const ReviewSummary = ({ summary }) => {
    if (!summary) return <p>Loading summary...</p>;

    const cleanedSummary = summary.replace(/\*/g, "").trim();
    const positive = cleanedSummary.match(/Positive Aspects:\s*(.*?)(?=Negative Aspects:|$)/s)?.[1]?.trim();
    const negative = cleanedSummary.match(/Negative Aspects:\s*(.*?)(?=General User Impressions:|$)/s)?.[1]?.trim();
    const impression = cleanedSummary.match(/General User Impressions:\s*(.*?)(?=$)/s)?.[1]?.trim();

    return (
        <div className="review__summary">
            <h5>Review Summary</h5>
            <div>
                <h6>Positive Reviews:</h6>
                <p>{positive || 'No positive reviews yet.'}</p>
            </div>
            <div>
                <h6>Negative Reviews:</h6>
                <p>{negative || 'No negative reviews yet.'}</p>
            </div>
            <div>
                <h6>Overall Impression:</h6>
                <p>{impression || 'No overall impression yet.'}</p>
            </div>
        </div>
    );
};

export default ReviewSummary;
