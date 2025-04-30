import bcrypt from 'bcryptjs';
import User from '../models/User.js'

// create new User

export const createUser = async (req, res) => {
    // const newUser = new User(req.body)
    try {
        // hashing password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            role: req.body.role,
            photo: req.body.photo,
            phone: req.body.phone || "",
            address: req.body.address || "",
        })
        const savedUser = await newUser.save()

        res
            .status(200)
            .json({
                success: true,
                message: "Successfully created",
                data: savedUser,
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to create. Try again"
            })
    }
}

// update User
export const updateUser = async (req, res) => {

    const id = req.params.id;

    try {
        const updateData = { ...req.body };

        if (!updateData.password) {
            delete updateData.password;
        } else {

            const salt = bcrypt.genSaltSync(10);
            updateData.password = bcrypt.hashSync(updateData.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: updateData
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update",
        });
    }

}

// delete User
export const deleteUser = async (req, res) => {

    const id = req.params.id

    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete",
        })
    }
}

// getSingle User
export const getSingleUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findById(id)
        res.status(200).json({
            success: true,
            message: "Successful get single",
            data: user,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found",
        })
    }
}

// getAll User
export const getAllUser = async (req, res) => {


    try {
        const users = await User.find({})
        res.status(200).json({
            success: true,
            message: "Successful get all",
            data: users
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found"
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve profile", error: error.message });
    }
};


// export const updateProfile = async (req, res) => {
//     try {
//         const updateData = { ...req.body };

//         // Không cho phép cập nhật email
//         delete updateData.email;

//         // Kiểm tra mật khẩu hiện tại nếu người dùng muốn thay đổi mật khẩu
//         if (updateData.newPassword) {
//             // Lấy người dùng từ database
//             const user = await User.findById(req.user?.id);

//             // Kiểm tra xem mật khẩu hiện tại có đúng không
//             const isMatch = await bcrypt.compare(updateData.currentPassword, user.password);

//             if (!isMatch) {
//                 return res.status(400).json({ success: false, message: "Current password is incorrect" });
//             }

//             // Mã hóa mật khẩu mới nếu mật khẩu hiện tại đúng
//             const salt = bcrypt.genSaltSync(10);
//             updateData.password = bcrypt.hashSync(updateData.newPassword, salt); // Mã hóa mật khẩu mới
//             delete updateData.newPassword;  // Xóa trường newPassword sau khi đã thay đổi mật khẩu
//             delete updateData.currentPassword; // Xóa trường currentPassword sau khi đã xác nhận
//         } else {
//             delete updateData.password; // Nếu không có mật khẩu mới, xóa trường password
//         }

//         // Cập nhật thông tin người dùng
//         const updatedUser = await User.findByIdAndUpdate(
//             req.user?.id,
//             { $set: updateData },
//             { new: true }
//         ).select("-password"); // Đảm bảo không trả về mật khẩu trong kết quả

//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Profile updated successfully",
//             data: updatedUser,
//         });
//     } catch (error) {
//         console.error("Update Profile Error:", error.message); // Log lỗi chi tiết
//         res.status(500).json({
//             success: false,
//             message: "Failed to update profile",
//             error: error.message,
//         });
//     }
// };

export const updateProfile = async (req, res) => {
    try {
        const { username, phone, address, photo, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Cập nhật các thông tin cơ bản
        if (username) user.username = username;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (photo) user.photo = photo;

        // Nếu có yêu cầu đổi mật khẩu
        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Current password is incorrect" });
            }
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(newPassword, salt);
        }

        await user.save();

        // Ẩn trường password khi trả về
        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: userWithoutPassword,
        });
    } catch (error) {
        console.error("Update Profile Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};