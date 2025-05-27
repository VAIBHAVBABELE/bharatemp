import map from '../../assets/map.png'
const OnlinePresenceSection = () => {
  return (
    <div className="bg-[#1E3473] lg:h-[488px] h-auto text-white rounded-xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={map} // Replace with actual path to your image
          alt="India Map"
          className="max-w-full h-auto object-contain"
        />
      </div>

      {/* Right Content */}
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="md:text-2xl lg:text-3xl  xl:text-[57px] font-bold">Our Online presence</h2>
       <div className='w-full md:w-[75%] text-[#E1E3EB] md:text-[19px] text-[12px]'>
        <p className=" ">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 
          Velit officia consequat duis enim velit mollit. 
        </p>
        <p className=" ">
          Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non 
          deserunt ullamco est sit aliqua dolor do amet sint. Velit officia 
          consequat duis enim velit mollit.
        </p>
       </div>
        <button className="bg-[#F7941D]  text-white font-semibold py-3 px-8 rounded-full mt-4">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default OnlinePresenceSection;
