import image7 from '../../assets/homepage7.png'
import image8 from '../../assets/homepage8.png'
import image9 from '../../assets/homepage9.png'


const PromoSection = () => {
    return (
        <div className=" w-full    py-10   flex flex-col lg:flex-row gap-6 ">
            {/* Left Main Card */}
            <div className='md:w-1/2  w-full relative'>
                <div className="lg:col-span-1 bg-[#1e293b] rounded-2xl text-white flex  justify-between p-6 h-[390px] ">
                    <div className='md:w-1/2 w-full'>
                        <p className="text-[23.13px] mb-2">Rasberry Pie</p>
                        <h2 className="lg:text-[58.45px] md:text-[30px] text-2xl font-bold leading-tight mb-2">Case BB-3</h2>
                        <button className="bg-[#F7941D] text-[#000000] px-2 py-2 my-2 rounded-full font-semibold mb-4">
                            Discover Now
                        </button>
                        <p className="text-[12.49px] text-gray-300 py-2">BE THE FIRST TO OWN</p>
                        <p className="text-[17px] font-medium ">From</p>
                        <p className="text-[30px] font-medium"> ₹399</p>
                    </div>
                    <div className='w-full md:w-1/2 '>
                        <img 
                            src={image7}
                            alt="Case BB-3"
                            className='rotate-180 tranform scale-x-[-1] right-0 object-contain absolute bottom-0 md:w-[400px] w-[180px]  rounded-2xl'
                        />
                    </div>
                </div>
            </div>
            {/* Right Grid Cards */}
            <div className='md:w-1/2 w-full'>
                <div className=" grid md:grid-cols-2 grid-cols-1 gap-4 ">
                    {/* Card 1 */}
                    <div className=" w-full bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex   justify-between relative">
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

                    {/* Card 2 */}
                    <div className=" w-full bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex items-center gap-6 h-[186px]  justify-between relative">
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

                    {/* Card 3 (repeated like Card 2) */}
                    <div className=" w-full bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  items-center gap-6 h-[186px]  justify-between relative">
                        <div>
                            <button className="bg-[#1E3473] text-white px-3 py-2 text-[16px] rounded-full mb-1">
                                Discover Now
                            </button>
                            <p className="text-sm text-[#f7941d] py-2">Parts</p>
                            <p className="text-[#1E3473] font-bold md:text-[34.83px] py-2 text-2xl">Drone BB-3</p>
                        </div>
                        <img
                            src={image9}
                            alt="Drone"
                            className="md:w-40 w-28 h-auto object-contain absolute right-0 -top-8  "
                        />
                    </div>

                    {/* Card 4 (like Card 1) */}
                    <div className=" w-full bg-[#F6F6F6] rounded-2xl p-4 shadow-sm flex  justify-between relative">
                        <div >
                            <p className="text-blue-900 font-bold md:text-[34.83px] py-2 text-2xl">3d Printer</p>
                           <p className="text-sm text-[#f7941d] mb-2 py-2">Parts</p>
                            <button className="bg-[#f7941d] text-white px-3  py-2 text-[16px] rounded-full">
                                Discover Now
                            </button>
                       </div>
                        <img
                            src={ image8}
                            className="md:w-56 w-28 h-auto object-contain absolute -right-2 bottom-0" />
                    </div>
                </div>
            </div>
        </div>
       
    );
};

export default PromoSection;
