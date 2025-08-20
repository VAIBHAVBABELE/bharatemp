import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
      <Card className="shadow-md">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Contact Us Submissions</h2>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search by name, email, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-1/3"
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMessage(c)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <Button
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
            <span className="px-2 self-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal for full message */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Full Message</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <p><strong>Name:</strong> {selectedMessage.firstName} {selectedMessage.lastName}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Subject:</strong> {selectedMessage.subject}</p>
              <p className="mt-2"><strong>Message:</strong><br />{selectedMessage.message}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContactUs;
