import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const SubCategories = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || "Development Board");

  // Using the same subcategories data from Navbar
  const subcategories = {
    "Development Board": Array.from({ length: 20 }, (_, i) => ({
      name: `Development Board ${i + 1}`,
      description: `Description for board ${i + 1}`,
      image: `https://picsum.photos/300/200?random=${i + 1}`
    })),
    "Sensors": Array.from({ length: 20 }, (_, i) => ({
      name: `Sensor ${i + 1}`,
      description: `Description for sensor ${i + 1}`,
      image: `https://picsum.photos/300/200?random=${20 + i + 1}`
    })),
    "Motors and Drivers": Array.from({ length: 20 }, (_, i) => ({
      name: `Motor ${i + 1}`,
      description: `Description for motor ${i + 1}`,
      image: `https://picsum.photos/300/200?random=${40 + i + 1}`
    })),
    "Battery": Array.from({ length: 20 }, (_, i) => ({
      name: `Battery ${i + 1}`,
      description: `Description for battery ${i + 1}`,
      image: `https://picsum.photos/300/200?random=${60 + i + 1}`
    })),
    "3D Printer": Array.from({ length: 20 }, (_, i) => ({
      name: `3D Printer Part ${i + 1}`,
      description: `Description for part ${i + 1}`,
      image: `https://picsum.photos/300/200?random=${80 + i + 1}`
    })),
    "Drone Parts": Array.from({ length: 20 }, (_, i) => ({
      name: `Drone Part ${i + 1}`,
      description: `Description for part ${i + 1}`,
      image: `https://picsum.photos/300/200?random=${100 + i + 1}`
    }))
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>
        
        <div className="flex gap-8">
          {/* Left Sidebar - Categories */}
          <div className="w-1/4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              {Object.keys(subcategories).map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
                    activeCategory === category 
                      ? 'bg-[#F7941D] text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Subcategories Grid */}
          <div className="w-3/4">
            <div className="bg-white">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{activeCategory}</h2>
              <div className="grid grid-cols-4 gap-6">
                {subcategories[activeCategory]?.map((subcat, index) => (
                  <Link 
                    key={index}
                    to={`/allproducts?category=${activeCategory}&subcategory=${subcat.name.toLowerCase()}`}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img 
                        src={subcat.image}
                        alt={subcat.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-white font-medium">{subcat.name}</h3>
                        <p className="text-gray-200 text-sm">{subcat.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategories; 