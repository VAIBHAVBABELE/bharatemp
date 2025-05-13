// Mock product data for testing the UI without a backend

import image1 from '../assets/homepage1.png';
import image2 from '../assets/homepage2.png';
import image3 from '../assets/homepage3.png';
import image4 from '../assets/homepage4.png';
import image5 from '../assets/homepage5.png';
import image6 from '../assets/homepage6.png';

export const mockProducts = [
  {
    _id: 'prod1',
    name: "Mark 34",
    brand: "Battery",
    category: "Battery",
    price: 4029.5,
    oldPrice: 8029.5,
    description: "High-performance drone battery with extended flight time. Compatible with DJI Mini series drones.",
    specifications: {
      capacity: "5000mAh",
      weight: "198g",
      chargingTime: "1.5 hours"
    },
    stock: 15,
    rating: 4.5,
    reviewCount: 23,
    image: image1,
  },
  {
    _id: 'prod2',
    name: "RedBoard Plus",
    brand: "Spark Fun",
    category: "Electronics",
    price: 73529.5,
    oldPrice: 85029.5,
    description: "Advanced flight controller board with integrated GPS and telemetry system.",
    specifications: {
      processor: "32-bit ARM Cortex",
      connections: "USB, UART, I2C",
      memory: "256KB Flash"
    },
    stock: 8,
    rating: 4,
    reviewCount: 15,
    image: image2,
  },
  {
    _id: 'prod3',
    name: "Distance Sensor",
    brand: "Ultrasonic",
    category: "Sensors",
    price: 3529.5,
    oldPrice: 6029.5,
    description: "High-precision ultrasonic distance sensor for obstacle avoidance systems.",
    specifications: {
      range: "2cm-400cm",
      accuracy: "±1cm",
      operatingVoltage: "3.3V-5V"
    },
    stock: 24,
    rating: 3.5,
    reviewCount: 12,
    image: image3,
  },
  {
    _id: 'prod4',
    name: "Flight Controller",
    brand: "APM 2.8",
    category: "Electronics",
    price: 25529.5,
    oldPrice: 36029.5,
    description: "Professional-grade flight controller with multiple flight modes and autonomous capabilities.",
    specifications: {
      processor: "16MHz ATmega2560",
      sensors: "Accelerometer, Barometer, Compass",
      interfaces: "USB, UART, SPI"
    },
    stock: 5,
    rating: 5,
    reviewCount: 18,
    image: image4,
  },
  {
    _id: 'prod5',
    name: "BLDC Motor",
    brand: "1800 KV",
    category: "Propellers",
    price: 6529.5,
    oldPrice: 9029.5,
    description: "High-efficiency brushless DC motor designed for drones requiring exceptional performance.",
    specifications: {
      kv: "1800",
      powerOutput: "220W",
      weight: "50g"
    },
    stock: 30,
    rating: 4,
    reviewCount: 20,
    image: image5,
  },
  {
    _id: 'prod6',
    name: "Flight Controller",
    brand: "APM 3.1",
    category: "Electronics",
    price: 52529.5,
    oldPrice: 68029.5,
    description: "Next-generation flight controller with enhanced processing power and stability features.",
    specifications: {
      processor: "180MHz ARM Cortex-M4",
      memory: "1MB Flash",
      interfaces: "USB, CAN, UART"
    },
    stock: 3,
    rating: 4.5,
    reviewCount: 25,
    image: image6,
  },
  {
    _id: 'prod7',
    name: "Carbon Fiber Props",
    brand: "AeroTech",
    category: "Propellers",
    price: 2999.5,
    oldPrice: 4500.5,
    description: "Lightweight carbon fiber propellers designed for maximum thrust and efficiency.",
    specifications: {
      size: "10x4.5 inches",
      material: "Carbon Fiber",
      weight: "8g each"
    },
    stock: 42,
    rating: 4.8,
    reviewCount: 32,
    image: image3,
  },
  {
    _id: 'prod8',
    name: "GPS Module",
    brand: "NavSys",
    category: "Electronics",
    price: 8999.5,
    oldPrice: 12500.5,
    description: "High-precision GPS module with integrated compass for accurate positioning.",
    specifications: {
      accuracy: "±2.5m",
      updateRate: "10Hz",
      interface: "UART"
    },
    stock: 15,
    rating: 4.2,
    reviewCount: 19,
    image: image4,
  }
]; 