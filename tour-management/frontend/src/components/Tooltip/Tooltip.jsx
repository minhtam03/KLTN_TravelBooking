import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

const CustomTooltip = ({ title, image, details, price }) => (
    <Tooltip
        title={
            <Box sx={{ p: 2, maxWidth: 320, borderRadius: 2, bgcolor: 'white', boxShadow: '0px 0px 0px rgb(255, 255, 255)' }}>
                {image && (
                    <Box
                        component="img"
                        src={image}
                        alt={title}
                        sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 1 }}
                    />
                )}
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
                    {title}
                </Typography>
                {details.map((detail, index) => (
                    <Typography key={index} variant="body2" sx={{ mt: 0.5, color: 'text.secondary', whiteSpace: 'pre-line' }}>
                        {detail}
                    </Typography>
                ))}
            </Box>
        }
        placement="right"
        arrow
    >
        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{title} - ${price} </span>
    </Tooltip>
);

export default CustomTooltip;

