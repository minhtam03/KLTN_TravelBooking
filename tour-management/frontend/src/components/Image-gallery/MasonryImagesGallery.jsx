import React, { useEffect, useState } from 'react'
import galleryImages from './galleryImages'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { BASE_URL } from '../../utils/config'
import './MasonryImagesGallery.css';

const MasonryImagesGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tours`);
        const result = await res.json();
        if (res.ok && result.data) {
          const tourPhotos = result.data
            .map(tour => tour.photo)
            .filter(Boolean)
            .slice(0, 9);
          setImages(tourPhotos);
        }
      } catch (err) {
        console.error('Failed to fetch tour images', err);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="image-grid">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Tour ${index}`}
          className="image-item"
        />
      ))}
    </div>
  );
};

export default MasonryImagesGallery;