export const removeVietnameseTones = (str) => {
    return str.normalize('NFD') // chuyển các ký tự có dấu thành dạng tổ hợp (letter + diacritic)
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu tổ hợp
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/ +/g, ' ') // loại bỏ khoảng trắng dư
        .trim();
};
