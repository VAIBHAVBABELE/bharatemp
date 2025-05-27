import React, { useEffect } from 'react';

const OrdersAndPaymentPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl font-bold text-[#1E3473] mb-8">Orders and Payment Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">1. Order Placement</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>All orders placed through our website are subject to acceptance and availability.</li>
                        <li>Once you complete the checkout process, you will receive an order confirmation email. This does not constitute acceptance of your order, but rather confirms that we have received it.</li>
                        <li>We reserve the right to refuse or cancel any order for reasons including but not limited to: product availability, errors in product or pricing information, or suspected fraud.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">2. Order Processing</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>Orders are typically processed within 1–3 business days, excluding weekends and public holidays.</li>
                        <li>Once your order is shipped, you will receive a confirmation email with tracking information, if applicable.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">3. Pricing and Currency</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>All prices listed on our website are in Rupees and are inclusive/exclusive of applicable taxes, unless otherwise stated.</li>
                        <li>We reserve the right to change prices at any time without prior notice, but such changes will not affect orders that have already been confirmed.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">4. Accepted Payment Methods</h2>
                    <p className="text-gray-700 mb-2">We accept the following forms of payment:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>Credit Cards (Visa, MasterCard, Rupay)</li>
                        <li>Debit Cards</li>
                        <li>Net Banking</li>
                        <li>UPI</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">5. Payment Security</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>All payments made through our website are processed using secure and encrypted payment gateways.</li>
                        <li>We do not store your card or payment details on our servers.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">6. Order Modifications and Cancellations</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>If you need to modify or cancel your order, please contact us at{' '}
                            <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                                support@bharatronix.com
                            </a>
                            {' '}within 2 hours of placing it.
                        </li>
                        <li>Once the order has been processed or shipped, no changes or cancellations will be accepted.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">7. Failed or Declined Payments</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>If your payment fails or is declined, your order will not be processed.</li>
                        <li>You may attempt to place the order again using a different payment method.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">8. Refunds and Disputes</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>Any disputes related to payments must be reported within 7 days of the transaction.</li>
                        <li>Refunds, if applicable, will be processed in accordance with our Refund Policy.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about our Orders and Payment Policy, please contact us at{' '}
                        <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                            support@bharatronix.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default OrdersAndPaymentPolicy; 