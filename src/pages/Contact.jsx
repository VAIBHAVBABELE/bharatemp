import { useEffect, useState } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await axios.post(`${backend}/admin/contact-us`, {
        firstName,
        lastName,
        email,
        subject,
        message,
      });
      if (response.data.status === "Success") {
        setSuccessMsg("Message sent successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMsg("Failed to send message.");
      }
    } catch (error) {
      setErrorMsg("Error sending message.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-20 px-4 my-10 md:px-20 md:flex-row md:my-10 font-montserrat">
        <div className="w-full md:w-[45%] flex flex-col gap-4 bg-[#f9f9f9] rounded-3xl p-4 md:p-10 text-[#1e3473]">
          <h1 className="text-2xl font-bold md:text-4xl">Leave a Message For Us</h1>
          <p className="text-[#f7941d] text-sm md:text-base">
            Navigating Taxes, Maximizing Savings – Your Trusted Taxation Partner. Simplify compliance, focus on growth with us!
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-10">
                <div className="flex flex-col w-full gap-1 md:w-1/2 md:gap-3">
                  <label className="font-semibold">First Name</label>
                  <input
                    type="text"
                    placeholder="Ex. Jatin"
                    className="p-2 pl-4 border rounded-3xl"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 md:w-1/2 md:gap-3">
                  <label className="font-semibold">Last Name</label>
                  <input
                    type="text"
                    placeholder="Ex. Sharma"
                    className="p-2 pl-4 border rounded-3xl"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-10">
                <div className="flex flex-col w-full gap-1 md:w-1/2 md:gap-3">
                  <label className="font-semibold">Email Address</label>
                  <input
                    type="email"
                    placeholder="Ex. Hello@email"
                    className="p-2 pl-4 border rounded-3xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 md:w-1/2 md:gap-3">
                  <label className="font-semibold">Subject</label>
                  <input
                    type="text"
                    placeholder="-- subject --"
                    className="p-2 pl-4 border rounded-3xl"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 md:gap-3">
                <label className="font-semibold">Message</label>
                <textarea
                  cols="30"
                  rows="5"
                  placeholder="Your Message"
                  className="border p-4 rounded-[20px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 rounded-3xl w-full md:w-[250px] mt-6 shadow-lg border-2 border-blue-700 transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {successMsg && (
                <div className="mt-2 text-green-600">{successMsg}</div>
              )}
              {errorMsg && (
                <div className="mt-2 text-red-600">{errorMsg}</div>
              )}
            </div>
          </form>
        </div>
        <div className="w-full md:w-[50%] flex flex-col items-center md:items-start gap-8">
          <div className="bg-[#cdd4f1] text-main font-bold flex justify-center items-center py-2 w-[250px] rounded-3xl">Stay tuned with us</div>
          <h1 className="text-2xl md:text-5xl text-center md:text-start font-bold md:leading-[50px] text-[#1e3473]">Keep Connected & Lets Get In Touch With Our Team</h1>
          <p className="text-[#f7941d] text-center md:text-start">Maximize Your Tax Savings with Expert Guidance from TaxRishi – Your Trusted Partner in Tax Solutions.</p>
          <div className="flex flex-col items-center gap-6 md:items-start md:flex-row">
              <span className="flex-shrink-0">
                  <MdLocationOn className="w-8 h-8 text-[#1e3473]" />
              </span>
              <span className="flex flex-col items-center gap-2 font-semibold md:items-start">
                  <p className="text-base md:text-xl text-[#1e3473]">Our Head Office</p>
                  <p className="text-[#f7941d] text-base text-center md:text-start "> Office No. 102, Shree Mahaveer Arcade, First Floor, C-19, Sector-15, Adjoing SBI Bank, Near Atal Chowk, Vasundhara, Ghaziabad - 201012 (U.P.)</p>
              </span>
          </div>
          <div className="flex flex-col items-center gap-6 md:items-start md:flex-row">
              <span>
                  <MdEmail className="w-8 h-8 text-[#1e3473]" />
              </span>
              <span className="flex flex-col items-center gap-2 font-semibold md:items-start">
                  <p className="text-base md:text-xl text-[#1e3473]">Email Address</p>
                  <p className="text-[#f7941d] text-base text-center md:text-start ">Support@bharatronix.com</p>
              </span>
          </div>
          <div className="flex flex-col items-center gap-6 md:items-start md:flex-row">
              <span>
                  <MdPhone className="w-8 h-8 text-[#1e3473]" />
              </span>
              <span className="flex flex-col items-center gap-2 font-semibold md:items-start">
                  <p className="text-base md:text-xl text-[#1e3473]">Telephone</p>
                  <p className="text-[#f7941d] text-base text-center md:text-start ">(+91) 79827 48787</p>
              </span>
          </div>
        </div>
      </div>
      {/* <div className="px-4 py-10 mb-10 md:px-20">
        <div className="px-20 bg-[#c4c4c4] rounded-3xl  w-full h-[250px]"></div>
      </div> */}
    </>
  );
};

export default Contact;