import React, { useEffect } from 'react';

const ReturnPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl font-bold text-[#1E3473] mb-8">Return/Replacement and Refund Policy</h1>
                
                <p className="text-gray-700 mb-8">
                    At BharatroniX, we are committed to delivering high-quality products with a smooth and transparent after-sales experience. If you are not entirely satisfied with your purchase, we're here to help with clear return and refund policies outlined below.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Return Eligibility</h2>
                    <p className="text-gray-700 mb-4">You may request a return or replacement within 7 days of delivery under the following conditions:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>You received a damaged, defective, or non-functional product.</li>
                        <li>There is physical damage or in-transit damage to the item.</li>
                        <li>You received a product with missing items/accessories.</li>
                        <li>The product received has a broken seal, is incomplete, or significantly differs from its description on our website.</li>
                        <li>The product is empty or partially packed.</li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                        Note: For any such cases, a return request must be initiated within 48 hours of delivery, along with a video clip and clear images of the product, packaging, and invoice.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Non-Returnable Products</h2>
                    <p className="text-gray-700 mb-4">The following products cannot be returned or exchanged:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>Items marked as "Non-returnable" on the product page (e.g., batteries, power adapters, soldering tools, safety equipment, tyres, electronics, etc.).</li>
                        <li>Products that have been used, damaged due to misuse, or tampered with.</li>
                        <li>Combo offers cannot be returned partially.</li>
                        <li>Products purchased under flash deals or clearance sales.</li>
                        <li>Products missing the original packaging, accessories, invoice, or branding labels.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Important Conditions</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>Products must be returned in unused condition, with all original accessories, manuals, and manufacturer packaging.</li>
                        <li>Items with tampered or missing holograms will not qualify for a return or refund.</li>
                        <li>The invoice must be included in the return package.</li>
                        <li>No returns are accepted for cases where the product is "no longer needed."</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Quality Check Process</h2>
                    <p className="text-gray-700 mb-4">Once we receive your return, our quality inspection team will examine the item(s) within 2 working days. If the item qualifies under the return policy:</p>
                    <ul className="space-y-3 text-gray-700">
                        <li>A replacement will be credited within 7–10 working days.</li>
                        <li>Replacement product will be delivered in 7 days.</li>
                        <li>If the returned item fails our quality checks or appears used/tampered, it will be returned to you. In such cases, re-shipping charges will apply.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Refund Terms</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>Refunds will be issued to the original payment method only (UPI, card, NetBanking, etc.).</li>
                        <li>A 5% deduction will apply on prepaid order refunds to cover payment gateway and processing fees.</li>
                        <li>Alternatively, customers can opt for a BharatroniX store credit to avoid the 5% deduction.</li>
                        <li>Once the refund is approved it will take 7 business days to credit to your bank account.
In cancellation policy make this word as credited</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Warranty & Functional Defects</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>All products come with a standard 10-day warranty from the date of shipment (unless otherwise stated).</li>
                        <li>For functional defects, please report the issue with clear photos/videos, order number, and details at{' '}
                            <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                                support@bharatronix.com
                            </a>{' '}
                            within the warranty period.
                        </li>
                        <li>Upon confirmation, a replacement or repair will be offered. If the product is found to be non-defective, shipping charges for return and re-delivery must be borne by the customer.</li>
                        <li>Warranty is void if the product shows signs of misuse, soldering, static discharge, unauthorized repair, or physical damage.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Return Pickup & Shipping</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>In serviceable locations, we will arrange a pickup within 2–3 business days after return approval.</li>
                        <li>In areas not covered by our logistics partner, customers must ship the product back to us via India Post. Valid courier slip and bank details must be submitted for shipping charge reimbursement (where applicable).</li>
                    </ul>
                    <p className="text-gray-700 mt-4">Bank details required:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>Account Number</li>
                        <li>Account Holder's Name</li>
                        <li>IFSC Code</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Unboxing Requirement</h2>
                    <p className="text-gray-700">
                        In case of damaged/missing product claims, an unboxing video showing the seal, packaging, and contents must be provided when initiating the return request.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Final Authority</h2>
                    <p className="text-gray-700">
                        BharatroniX reserves the right to make the final decision on all return and refund requests based on our internal evaluation of the issue.
                    </p>
                    <p className="text-gray-700 mt-4">
                        BharatroniX is a registered brand of Anantakarma Technologies Private Limited.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about our Return, Replacement and Refund Policy, please contact us at{' '}
                        <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                            support@bharatronix.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ReturnPolicy; 