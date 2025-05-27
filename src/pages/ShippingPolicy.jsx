import React, { useEffect } from 'react';

const ShippingPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl font-bold text-[#1E3473] mb-8">Shipping & Delivery Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Order Processing</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>We strive to dispatch all orders within 24 hours, with most orders shipped the same day, Monday through Saturday (excluding public holidays).</li>
                        <li>Orders placed on Sundays or public holidays will be processed on the next working day.</li>
                        <li>Same-day dispatch is available for orders placed before 1:30 PM on working days.</li>
                        <li>For expedited shipping via our Courier partners, orders placed before 2:00 PM will be picked up the same day (subject to courier availability).</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Estimated Delivery Time</h2>
                    <p className="text-gray-700 mb-4">
                        While most shipments are delivered within 2–5 business days across India, delivery timelines may vary depending on:
                    </p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>Your location,</li>
                        <li>Courier routing and logistics,</li>
                        <li>External factors such as weather or regional restrictions.</li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                        Note: We advise placing orders in advance to avoid last-minute delays, especially during festivals or public holidays.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Split Shipments</h2>
                    <p className="text-gray-700">
                        We aim to ship all items in a single order together. However, in some cases, due to product availability or warehouse logistics, we may ship items separately. You will be informed in such instances.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Tracking Your Order</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>Once your order is dispatched, you will receive an email/SMS with tracking details.</li>
                        <li>You can also track your shipment using the "Track Your Order" section on our website.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">In Case of Damaged or Tampered Delivery</h2>
                    <p className="text-gray-700 mb-4">If you receive a shipment that appears damaged, tampered with, or improperly sealed, please:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>Refuse to accept the delivery, and</li>
                        <li>Immediately contact our Customer Support at{' '}
                            <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                                support@bharatronix.com
                            </a>
                            , mentioning your Order Reference Number.
                        </li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                        We will investigate the issue and arrange a replacement or refund as applicable.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Our Shipping Partners</h2>
                    <p className="text-gray-700 mb-4">
                        We currently ship through leading courier services provider "iThink Logistics"
                    </p>
                    <p className="text-gray-700">
                        For remote or uncovered locations, we may consider EMS Speed Post upon special request. However, we cannot guarantee acceptance, as EMS has restrictions based on parcel content inspection and acceptance at local post offices.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Shipping Documentation</h2>
                    <p className="text-gray-700">
                        As per Indian tax regulations, all shipments, including gifts, will be accompanied by a tax invoice mentioning the product price.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about our Shipping & Delivery Policy, please contact us at{' '}
                        <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                            support@bharatronix.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ShippingPolicy; 