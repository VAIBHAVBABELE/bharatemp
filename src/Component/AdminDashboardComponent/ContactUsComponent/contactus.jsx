import React, { useState, useEffect } from "react";

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const rowsPerPage = 5;

  useEffect(() => {
    // Mock data – replace with API call
    const data = [
      {
        id: 1,
        firstName: "Jatin",
        lastName: "Sharma",
        email: "hello@email.com",
        subject: "Regarding Taxation Help",
        message:
          "Hello Team, I need some help regarding taxation and compliance. Please guide me with the process in detail.",
      },
      {
        id: 2,
        firstName: "Ravi",
        lastName: "Kumar",
        email: "ravi@example.com",
        subject: "Savings Query",
        message: "Can you suggest how to maximize savings legally while filing taxes?",
      },
    ];
    setContacts(data);
  }, []);

  // Filter
  const filtered = contacts.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="p-4 w-full">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Contact Us Submissions</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 border rounded px-2 py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">First Name</th>
                <th className="p-2 border">Last Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{c.firstName}</td>
                  <td className="p-2 border">{c.lastName}</td>
                  <td className="p-2 border">{c.email}</td>
                  <td className="p-2 border">{c.subject}</td>
                  <td className="p-2 border">
                    {c.message.length > 50
                      ? c.message.substring(0, 50) + "..."
                      : c.message}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                      onClick={() => setSelectedMessage(c)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span className="px-2 self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for full message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h3 className="text-lg font-bold mb-2">Full Message</h3>
            <p><strong>Name:</strong> {selectedMessage.firstName} {selectedMessage.lastName}</p>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Subject:</strong> {selectedMessage.subject}</p>
            <p className="mt-2"><strong>Message:</strong><br />{selectedMessage.message}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
