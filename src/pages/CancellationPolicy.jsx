import React, { useEffect } from 'react';

const CancellationPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl font-bold text-[#1E3473] mb-8">Cancellation Policy</h1>
                
                <p className="text-gray-700 mb-8">
                    At BharatroniX, we aim to provide a seamless shopping experience with transparency and customer satisfaction at its core. Below are our terms regarding order cancellations and refunds:
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Order Cancellation by Customer</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>Orders can be cancelled only before they are shipped. Once dispatched, cancellation requests cannot be accepted.</li>
                        <li>If cancelled before dispatch, a 5% cancellation fee will be applied to cover payment processing charges. This amount will be deducted from the refund.</li>
                        <li>If the order has already been shipped, it may only be returned as per our return and refund policy—not cancelled.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Order Cancellation by BharatroniX</h2>
                    <p className="text-gray-700 mb-2">We reserve the right to cancel orders under the following circumstances:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>The product is out of stock or discontinued.</li>
                        <li>Incomplete or incorrect shipping address or contact details.</li>
                        <li>Delivery location falls in a non-serviceable or restricted zone.</li>
                        <li>The order is flagged for suspected fraud or misuse.</li>
                        <li>The customer violates purchase quantity limits (e.g., multiple orders using the same email, GST number, or contact details).</li>
                    </ul>
                    <p className="text-gray-700 mt-2">In such cases, a full refund will be issued with no cancellation fee.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Refund & Processing Time</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>Refunds for eligible cancellations will be credited within 5–7 business days of confirmation.</li>
                        <li>Refunds are applicable only for prepaid and NEFT transactions.</li>
                        <li>Refunds will be made to the original source of payment. No transaction IDs will be provided; however, a "Refund Confirmation Note" from the payment gateway can be issued upon request.</li>
                        <li>If you opt for store credit (gift card or wallet balance), the 5% cancellation fee will be waived.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Important Notes</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>For any return or warranty request, the product must be untampered. Items with damaged holograms, physical abuse, or modifications (e.g., soldered parts) are not eligible for cancellation or replacement.</li>
                        <li>Customers must inspect their package upon delivery and report any damage or missing items within 24 hours to the customer care or send an email along with supporting video clip and pictures, to{' '}
                            <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                                support@bharatronix.com
                            </a>.
                        </li>
                        <li>Final sale items such as batteries, power adapters, soldering tools, and similar components cannot be cancelled or returned, except in cases of verified shipping damage.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Final Authority</h2>
                    <p className="text-gray-700">
                        BharatroniX reserves the right to make the final decision on all cancellation and refund requests.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about our Cancellation Policy, please contact us at{' '}
                        <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                            support@bharatronix.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CancellationPolicy; 