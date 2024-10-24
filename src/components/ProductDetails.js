import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import ProductImageGallery from './ProductImageGallery';
import './ProductDetails.css';

const ProductDetails = () => {
  const [productData, setProductData] = useState(null); // Holds product data fetched from JSON
  const [selectedSize, setSelectedSize] = useState(''); // Tracks selected size
  const [selectedColor, setSelectedColor] = useState(''); // Tracks selected color
  const [images, setImages] = useState([]); // Stores images for selected size/color
  const [isExpanded, setIsExpanded] = useState(false); // Toggles feature list view

  // Handle toggle button click
  const toggleExpanded = () => setIsExpanded(!isExpanded); // Toggle 'Show More' functionality

  // Fetch product data from the JSON file on component mount
  useEffect(() => {
    fetch('/data/tote_bag.json')
      .then((response) => response.json())
      .then((data) => {
        setProductData(data); // Store the fetched product data
        const initialSize = Object.keys(data.sizes)[0]; // Default to the first available size
        const initialColor = Object.keys(data.sizes[initialSize].colors)[0]; // Default color
        setSelectedSize(initialSize);
        setSelectedColor(initialColor);
        setImages(data.sizes[initialSize].colors[initialColor]); // Load default images
      })
      .catch((error) => console.error('Error fetching product data:', error));
  }, []);

  // Update images when size or color changes
  useEffect(() => {
    if (productData) {
      setImages(productData.sizes[selectedSize].colors[selectedColor]);
    }
  }, [selectedSize, selectedColor, productData]); // Dependencies to trigger re-renders

  if (!productData) return <p>Loading...</p>; // Display loading message

  return (
    <div className="product-details-container">
      {/* Image Gallery */}
      <ProductImageGallery images={images} />

      <div className="product-info">
        <h1 className="product-name">{productData.name} {selectedSize}</h1>
        <p className="product-price">{productData.sizes[selectedSize].price}</p>
        <p className="product-description">
          {productData.description}
        </p>

        {/* Size Selector using Radix UI's Select component */}
        <div className="selector-group">
          <div className="selector">
            <label>Select Size:</label>
            <Select.Root onValueChange={setSelectedSize}>
              <Select.Trigger className="SelectTrigger">
                <Select.Value placeholder={selectedSize} />
                <Select.Icon className="SelectIcon">
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Content className="SelectContent">
                <Select.Viewport>
                  {Object.keys(productData.sizes).map((size) => (
                    <Select.Item key={size} value={size} className="SelectItem">
                      <Select.ItemText>{size}</Select.ItemText>
                      <Select.ItemIndicator className="SelectItemIndicator">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
          </div>

          {/* Color Selector */}
          <div className="selector">
            <label>Select Color: {selectedColor}</label>
            <div className="color-options">
              {Object.keys(productData.sizes[selectedSize].colors).map((color) => {
                const thumbnailImage = productData.sizes[selectedSize].colors[color][0];// Get first thumbnail
                // Encode the URL to handle spaces and special characters
                const encodedImageUrl = encodeURI(thumbnailImage);
                return (
                  <Button
                    key={color}
                    className={`color-button ${color === selectedColor ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color}`}
                    style={{
                      backgroundImage: thumbnailImage ? `url(${encodedImageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '40px',
                      height: '40px',
                      border: color === selectedColor ? '2px solid #ff6f00' : '1px solid #ddd',
                      borderRadius: '4px',
                      padding: 0,
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  ></Button>
                );
              })}
            </div>
          </div>
        </div>

        <Button className="add-to-cart-button">Add to Cart</Button>

        <h2 className="features-heading">Features</h2>
        <ul className={`feature-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {productData.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        {!isExpanded && <div className="fade-overlay"></div>}
        <Button className="toggle-button" onClick={toggleExpanded}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
