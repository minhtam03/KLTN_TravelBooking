import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      enum: [
        'Ha Noi', 'Ho Chi Minh', 'Da Nang', 'Hai Phong', 'Can Tho',
        'Binh Duong', 'Bac Ninh', 'Vinh', 'Hue', 'Long An', 'Nghe An',
        'Bac Giang', 'Quang Ninh', 'Nam Dinh', 'Thanh Hoa', 'Quang Binh',
        'Son La', 'Tien Giang', 'Vinh Long', 'Dak Lak', 'Binh Thuan',
        'Quang Tri', 'Lam Dong', 'An Giang', 'Ninh Binh', 'Tay Ninh',
        'Ben Tre', 'Kien Giang', 'Dong Nai', 'Gia Lai', 'Bac Lieu',
        'Phu Tho', 'Ca Mau', 'Hau Giang', 'Binh Phuoc', 'Ha Giang',
        'Soc Trang', 'Dak Nong', 'Thanh Hoa', 'Lai Chau', 'Ha Tinh',
        'Khanh Hoa', 'Yen Bai', 'Quang Nam', 'Nghe An', 'Bac Kan',
        'Quang Ngai', 'Lang Son', 'Nam Dinh', 'Thai Nguyen', 'Hoa Binh',
        'Quang Binh', 'Tuyen Quang', 'Hien Giang', 'Long An', 'Lam Dong',
        'Sapa', 'Hung Yen', 'Bac Giang', 'Tuyen Quang', 'Quang Tri'
      ],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },

    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
