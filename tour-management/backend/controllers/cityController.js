import City from "../models/City.js";
import axios from 'axios';


export const importCity = async (req, res) => {
    try {
        const response = await axios.get('https://mixivivu.com/api/cities/get-list?size=150')
        const cities = response.data.result.data || [];
        const savedCities = [];

        for (const city of cities) {
            if (!city._id || !city.name) continue; // Bỏ qua nếu không có name

            try {
                const savedCity = await City.updateOne(
                    { cityId: city._id }, // Kiểm tra theo cityId
                    { cityId: city._id, name: city.name }, // Dữ liệu mới
                    { upsert: true }
                );
                savedCities.push(city.name);
            } catch (e) {
                console.error('Error saving city:', city.name, e.message);
            }
        }

        res.status(200).json({ message: 'Imported cities successfully', count: savedCities.length, cities: savedCities });

    } catch (error) {
        console.error('Error importing cities:', error.message);
        res.status(500).json({ error: 'Failed to import cities' });
    }
}