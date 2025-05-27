import image7 from '../../assets/homepage7.png'
import image8 from '../../assets/homepage8.png'
import image9 from '../../assets/homepage9.png'
import image12 from '../../assets/image12.png'

const categories = [
  {
    title: "Development Boards",
    items: ["Raspberry Pie 5", "Raspberry Pie 4", "Raspberry Pie 3", "Raspberry Pie Parts"],
  },
  {
    title: "Raspberry pie",
    items: ["Raspberry Pie 5", "Raspberry Pie 4", "Raspberry Pie 3", "Raspberry Pie Parts"],
  },
  {
    title: "Drones",
    items: ["Dji Phantom", "Baya kuta", "Go hero"],
  },
];

const products = [
  {
    title: "3d Printer",
    category: "Parts",
    image: "/3d-printer.png",
  },
  {
    title: "Raspberry Pie",
    category: "Parts",
    image: "/raspberry.png",
  },
  {
    title: "Drones",
    category: "Parts",
    image: "/drone.png",
  },
  {
    title: "Drones",
    category: "Parts",
    image: "/drone.png",
  },
  // repeat or map more
];

export default function CategoryGrid() {
  return (
    <section className="bg-white px-4 py-8 ">
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6 md:col-span-1">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <h3 className="text-sm text-[16px] font-semibold text-white bg-[#1E3473] px-6 py-3 w-full rounded-4xl mb-2 inline-block">
                {cat.title}
              </h3>
              <ul className="space-y-1 pl-2">
                {cat.items.map((item, i) => (
                  <li key={i} className="text-[#000000] text-[16px] flex justify-between ">
                    {item} <span className="text-[#000000]">24</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* card1 */}
            <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  justify-between relative">
                                 <div >
                                     <p className="text-blue-900 font-bold lg:text-[34.83px] lg:py-2 pt-6 md:px-0 text-2xl">3d Printer</p>
                                    <p className="text-sm text-[#f7941d] mb-2 py-2">Parts</p>
                                     <button className="bg-[#f7941d] text-white px-3  py-2 text-sm rounded-full">
                                         Discover Now
                                     </button>
                                </div>
                                 <img
                                     src={ image8}
                                     className="lg:w-56 w-32 h-auto object-contain absolute -right-2 bottom-0" />
                             </div>
     {/* card2 */}

       <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  justify-between relative">
                                 <div >
                                     <p className="text-blue-900 font-bold lg:text-[34.83px] lg:py-2 pt-6 md:px-0 text-2xl">Rasberry Pie</p>
                                    <p className="text-sm text-[#f7941d] mb-2 py-2">Parts</p>
                                     <button className="bg-[#f7941d] text-white px-3  py-2 text-sm rounded-full">
                                         Discover Now
                                     </button>
                                </div>
                                 <img
                                     src={ image12}
                                     className="lg:w-56 w-32 h-auto object-contain absolute -right-2 bottom-0" />
                             </div>
     {/* card3 */}
         <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex items-center gap-6 h-[186px]  justify-between relative">
                             <div>
                                 <button className="bg-[#1E3473] text-white px-3 text-center text-[16px] py-2 rounded-full mb-1">
                                     Discover Now
                                 </button>
                                 <p className="text-sm text-[#f7941d] ">Parts</p>
                                 <p className="text-[#1E3473] font-bold md:text-[34.83px] text-2xl">Drone BB-3</p>
                             </div>
                             <img
                                 src={image9}
                                 alt="Drone"
                                 className="md:w-56 w-32 h-auto object-contain absolute -right-4 md:-top-16 -top-8  "
                             />
                         </div>
     


     <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  justify-between relative">
                                 <div >
                                     <p className="text-blue-900 font-bold lg:text-[34.83px] lg:py-2 pt-6 md:px-0 text-2xl">3d Printer</p>
                                    <p className="text-sm text-[#f7941d] mb-2 py-2">Parts</p>
                                     <button className="bg-[#f7941d] text-white px-3  py-2 text-sm rounded-full">
                                         Discover Now
                                     </button>
                                </div>
                                 <img
                                     src={ image8}
                                     className="lg:w-56 w-32 h-auto object-contain absolute -right-2 bottom-0" />
                             </div>
     {/* card2 */}

       <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  justify-between relative">
                                 <div >
                                     <p className="text-blue-900 font-bold lg:text-[34.83px] lg:py-2 pt-6 md:px-0 text-2xl">Rasberry Pie</p>
                                    <p className="text-sm text-[#f7941d] mb-2 py-2">Parts</p>
                                     <button className="bg-[#f7941d] text-white px-3  py-2 text-sm rounded-full">
                                         Discover Now
                                     </button>
                                </div>
                                 <img
                                     src={ image12}
                                     className="lg:w-56 w-32 h-auto object-contain absolute -right-2 bottom-0" />
                             </div>
     {/* card3 */}
         <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex items-center gap-6 h-[186px]  justify-between relative">
                             <div>
                                 <button className="bg-[#1E3473] text-white px-3 text-center text-[16px] py-2 rounded-full mb-1">
                                     Discover Now
                                 </button>
                                 <p className="text-sm text-[#f7941d] ">Parts</p>
                                 <p className="text-[#1E3473] font-bold md:text-[34.83px] text-2xl">Drone BB-3</p>
                             </div>
                             <img
                                 src={image9}
                                 alt="Drone"
                                 className="md:w-56 w-32 h-auto object-contain absolute -right-4 md:-top-16 -top-8  "
                             />
                         </div>
       
       <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  justify-between relative">
                                 <div >
                                     <p className="text-blue-900 font-bold lg:text-[34.83px] lg:py-2 pt-6 md:px-0 text-2xl">3d Printer</p>
                                    <p className="text-sm text-[#f7941d] mb-2 py-2">Parts</p>
                                     <button className="bg-[#f7941d] text-white px-3  py-2 text-sm rounded-full">
                                         Discover Now
                                     </button>
                                </div>
                                 <img
                                     src={ image8}
                                     className="lg:w-56 w-32 h-auto object-contain absolute -right-2 bottom-0" />
                             </div>
     {/* card2 */}

       <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  justify-between relative">
                                 <div >
                                     <p className="text-blue-900 font-bold lg:text-[34.83px] lg:py-2 pt-6 md:px-0 text-2xl">Rasberry Pie</p>
                                    <p className="text-sm text-[#f7941d] mb-2 py-2">Parts</p>
                                     <button className="bg-[#f7941d] text-white px-3  py-2 text-sm rounded-full">
                                         Discover Now
                                     </button>
                                </div>
                                 <img
                                     src={ image12}
                                     className="lg:w-56 w-32 h-auto object-contain absolute -right-2 bottom-0" />
                             </div>
     {/* card3 */}
         <div className="bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex items-center gap-6 h-[186px]  justify-between relative">
                             <div>
                                 <button className="bg-[#1E3473] text-white px-3 text-center text-[16px] py-2 rounded-full mb-1">
                                     Discover Now
                                 </button>
                                 <p className="text-sm text-[#f7941d] ">Parts</p>
                                 <p className="text-[#1E3473] font-bold md:text-[34.83px] text-2xl">Drone BB-3</p>
                             </div>
                             <img
                                 src={image9}
                                 alt="Drone"
                                 className="md:w-56 w-32 h-auto object-contain absolute -right-4 md:-top-16 -top-8  "
                             />
                         </div>
       
       
        </div>
      </div>
    </section>
  );
}
400