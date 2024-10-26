// import jwt from 'jsonwebtoken'

// const verifyToken = (req, res, next) => {
//     const token = req.cookies.accessToken

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: "Authorization token is missing", 
//         })
//     }

//     // if token is exist then verify the token
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token", 
//             })
//         }

//         req.user = user
//         next()
//     })
// }

// export const verifyUser = (req, res, next) => {
//     verifyToken(req, res, next, () => {

//         if (req.user.id === req.params.id || req.user.role === 'admin') {
//             next()
//         }
//         else {
//             return res.status(401).json({
//                 success: false,
//                 message: "Access denied", 
//             })
//         }
//     })
// }

// export const verifyAdmin = (req, res, next) => {
//     verifyToken(req, res, next, () => {
//         if (req.user.role === 'admin') {
//             next()
//         }
//         else {
//             return res.status(401).json({
//                 success: false,
//                 message: "You are not authorize", 
//             })
//         }
//     })
// }

import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is missing", 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token", 
            });
        }

        req.user = user;
        next();
    });
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        // Chỉ cần đảm bảo người dùng đã xác thực
        if (req.user) {
            next(); // Người dùng đã xác thực
        } else {
            return res.status(401).json({
                success: false,
                message: "Access denied", 
            });
        }
    });
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "You are not authorized", 
            });
        }
    });
}
