// import mongoose from 'mongoose';

// const flightV2Schema = new mongoose.Schema({

//     flightNumber: String,
//     airline: String,
//     departTime: Date,
//     landingTime: Date,
//     fromPlace: String,
//     toPlace: String,
//     fromPlaceCode: String,
//     toPlaceCode: String,
//     ticketType: String,
//     aircraftStr: String,
//     totalPrice: Number,
//     createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('FlightV2', flightV2Schema);


import mongoose from 'mongoose';

const flightV2Schema = new mongoose.Schema({
    id: { type: String, unique: true },         // ID chuyến bay từ API
    flightNumber: String,                       // Mã chuyến bay (VD: VN 210)
    airline: String,                            // Tên hãng bay

    fromPlace: String,                          // Thành phố đi (VD: Hồ Chí Minh)
    fromPlaceCode: String,                      // Mã sân bay đi (VD: SGN)
    toPlace: String,                            // Thành phố đến
    toPlaceCode: String,                        // Mã sân bay đến (VD: HAN)

    ticketType: String,                         // Loại vé (VD: Eco (S))
    aircraftStr: String,                        // Loại máy bay (VD: Airbus A321)
    totalPrice: Number,                         // Tổng giá vé đã gồm thuế/phí

    departTime: Date,                           // Thời gian khởi hành dạng ISO
    landingTime: Date,                          // Thời gian đến dạng ISO

    departDate: String,                         // Ngày đi: YYYY-MM-DD
    departTimeStr: String,                      // Giờ đi: HH:mm
    landingDate: String,                        // Ngày đến
    landingTimeStr: String,                     // Giờ đến

    isReturn: { type: Boolean, default: false },// true nếu là chuyến khứ hồi

    createdAt: { type: Date, default: Date.now } // Thời điểm lưu vào DB
});

export default mongoose.model('FlightV2', flightV2Schema);
