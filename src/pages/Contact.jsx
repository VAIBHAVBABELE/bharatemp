import { useEffect } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
    <div className="px-4 md:px-20 flex flex-col md:flex-row items-center gap-20 my-10 md:my-10 font-montserrat">
      <div className="w-full md:w-[45%] flex flex-col gap-4 bg-[#f9f9f9] rounded-3xl p-4 md:p-10 text-[#1e3473]">
        <h1 className="text-2xl md:text-4xl font-bold">Leave a Message For Us</h1>
        <p className="text-[#f7941d] text-sm md:text-base">
        Navigating Taxes, Maximizing Savings – Your Trusted Taxation Partner. Simplify compliance, focus on growth with us!
        </p>
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-between">
              <div className="w-full md:w-1/2 flex flex-col gap-1 md:gap-3">
              <label className="font-semibold">First Name</label>
              <input
                type="text"
                placeholder="Ex. Jatin"
                className="border p-2 pl-4 rounded-3xl"
              />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-1 md:gap-3">
                <label className="font-semibold">Last Name</label>
              <input
                type="text"
                placeholder="Ex. Sharma"
                className="border p-2 pl-4 rounded-3xl"
              />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-between">
              <div className="w-full md:w-1/2 flex flex-col gap-1 md:gap-3">
                <label className="font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="Ex. Hello@email"
                className="border p-2 pl-4 rounded-3xl"
              />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-1 md:gap-3">
                <label className="font-semibold">Subject</label>
              <input
                type="text"
                placeholder="-- subject --"
                className="border p-2 pl-4 rounded-3xl"
              />
              </div>
            </div>
            <div className="flex flex-col gap-1 md:gap-3">
              <label className="font-semibold">Message</label>
            <textarea
              name=""
              id=""
              cols="30"
              rows="5"
              placeholder="Your Message"
              className="border p-4 rounded-[20px] resize-none"
            ></textarea>
            </div>
            <button
              type="submit"
              className="bg-main uppercase text-white py-3 rounded-3xl w-full md:w-[250px] mt-6"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
      <div className="w-full md:w-[50%] flex flex-col items-center md:items-start gap-8">
        <div className="bg-[#cdd4f1] text-main font-bold flex justify-center items-center py-2 w-[250px] rounded-3xl">Stay tuned with us</div>
        <h1 className="text-2xl md:text-5xl text-center md:text-start font-bold md:leading-[50px] text-[#1e3473]">Keep Connected & Lets Get In Touch With Our Team</h1>
        <p className="text-[#f7941d] text-center md:text-start">Maximize Your Tax Savings with Expert Guidance from TaxRishi – Your Trusted Partner in Tax Solutions.</p>
        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
            <span className="flex-shrink-0">
                <MdLocationOn className="w-8 h-8 text-[#1e3473]" />
            </span>
            <span className="flex flex-col items-center md:items-start gap-2 font-semibold">
                <p className="text-base md:text-xl text-[#1e3473]">Our Head Office</p>
                <p className="text-[#f7941d] text-base text-center md:text-start "> Office No. 102, Shree Mahaveer Arcade, First Floor, C-19, Sector-15, Adjoing SBI Bank, Near Atal Chowk, Vasundhara, Ghaziabad - 201012 (U.P.)</p>
            </span>
        </div>
        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
            <span>
                <MdEmail className="w-8 h-8 text-[#1e3473]" />
            </span>
            <span className="flex flex-col items-center md:items-start gap-2 font-semibold">
                <p className="text-base md:text-xl text-[#1e3473]">Email Address</p>
                <p className="text-[#f7941d] text-base text-center md:text-start ">Support@bharatronix.com</p>
            </span>
        </div>
        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
            <span>
                <MdPhone className="w-8 h-8 text-[#1e3473]" />
            </span>
            <span className="flex flex-col items-center md:items-start gap-2 font-semibold">
                <p className="text-base md:text-xl text-[#1e3473]">Telephone</p>
                <p className="text-[#f7941d] text-base text-center md:text-start ">(+91) 79827 48787</p>
            </span>
        </div>
      </div>
    </div>
    {/* <div className="px-4 md:px-20 py-10 mb-10">
      <div className="px-20 bg-[#c4c4c4] rounded-3xl  w-full h-[250px]"></div>
    </div> */}
    </>
  );
};

export default Contact;