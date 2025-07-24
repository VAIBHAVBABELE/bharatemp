import Marquee from "react-fast-marquee";
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";
import img4 from "../../assets/4.png";
import img5 from "../../assets/5.png";
import img6 from "../../assets/6.png";
import img7 from "../../assets/7.png";
import img8 from "../../assets/8.png";
import img9 from "../../assets/9.png";
import img10 from "../../assets/10.png";
import img11 from "../../assets/11.png";
import img12 from "../../assets/12.png";
import img13 from "../../assets/13.png";
import img14 from "../../assets/14.png";
import img15 from "../../assets/15.png";
import img16 from "../../assets/16.jpg";

const brands = [
  { img: img1, alt: "Brand 1" },
  { img: img2, alt: "Brand 2" },
  { img: img3, alt: "Brand 3" },
   { img: img1, alt: "Brand 1" },
  { img: img2, alt: "Brand 2" },
  { img: img3, alt: "Brand 3" },
  { img: img4, alt: "Brand 4" },
  { img: img5, alt: "Brand 5" },
  { img: img6, alt: "Brand 6" },
  { img: img7, alt: "Brand 7" },
  { img: img8, alt: "Brand 8" },
  { img: img9, alt: "Brand 9" },
  { img: img10, alt: "Brand 10" },
  { img: img11, alt: "Brand 11" },
  { img: img12, alt: "Brand 12" },
  { img: img13, alt: "Brand 13" },
  { img: img14, alt: "Brand 14" },
  { img: img15, alt: "Brand 15" },
  { img: img16, alt: "Brand 16" },
];

export default function B2BIndustriesSection() {
  return (
    <div className="w-full h-auto bg-white text-center mb-10 overflow-hidden">
      <Marquee pauseOnHover gradient={false} speed={100}>
        <div className="flex gap-8 items-center py-4 w-full">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center mr-14"
            >
              <img
                src={brand.img}
                alt={brand.alt}
                className="h-40 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
