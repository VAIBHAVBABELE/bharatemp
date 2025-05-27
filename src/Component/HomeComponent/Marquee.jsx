import Marquee from "react-fast-marquee";
import img1 from "../../assets/newlogo.png";
import img2 from "../../assets/newlogo2.png";
import img3 from "../../assets/newlogo3.png";

const brands = [
  { img: img1, alt: "Brand 1" },
  { img: img2, alt: "Brand 2" },
  { img: img3, alt: "Brand 3" },
   { img: img1, alt: "Brand 1" },
  { img: img2, alt: "Brand 2" },
  { img: img3, alt: "Brand 3" },
];

export default function B2BIndustriesSection() {
  return (
    <section className="px-4 md:px-8 lg:px-16 bg-white text-center">
      <Marquee pauseOnHover gradient={false} speed={50}>
        <div className="flex gap-8 items-center py-4 w-full">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center mr-8"
            >
              <img
                src={brand.img}
                alt={brand.alt}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
