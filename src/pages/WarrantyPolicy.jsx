import React, { useEffect } from 'react';

const WarrantyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl font-bold text-[#1E3473] mb-8">Warranty and Liability Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Warranty Coverage</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>All items are delivered with standard warranty (unless otherwise specified in the product page) to protect the customers from any manufacturing defect.</li>
                        <li>If you have any problems with your order, please notify us within this duration from date of shipment of any defective product.</li>
                        <li>You agree to pay for the return shipping on exchanges and returns, and we will reimburse this cost upon verification of a defect with the product.</li>
                        <li>We will replace or repair the damaged products at free of cost with shipping prepaid by us.</li>
                        <li>In case we do not have the product in stock to provide replacement, we will issue 100% refund.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Warranty Exclusions</h2>
                    <p className="text-gray-700 mb-4">No warranty will apply if the Product has been subject to:</p>
                    <ul className="list-disc pl-8 space-y-2 text-gray-700">
                        <li>Misuse</li>
                        <li>Static discharge</li>
                        <li>Neglect</li>
                        <li>Accident</li>
                        <li>Modification</li>
                        <li>Soldering or alterations of any kind</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Exchange Process</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>For products that need to be exchanged, please first send photos of the damaged products to us.</li>
                        <li>We will assess the damages and determine the best way to handle the exchange or return.</li>
                        <li>If the particular item is not in stock for replacement, we will provide a full refund.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Intellectual Property</h2>
                    
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#1E3473] mb-3">1. Ownership of Content</h3>
                        <p className="text-gray-700">
                            All content on this website, including but not limited to text, graphics, logos, images, product descriptions, audio clips, digital downloads, data compilations, and software, is the property of BharatroniX or its content suppliers, and is protected by applicable intellectual property laws, including copyright, trademark, and design laws.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#1E3473] mb-3">2. Trademarks</h3>
                        <p className="text-gray-700">
                            All trademarks, service marks, logos, and trade names displayed on this site are the registered and/or unregistered trademarks of BharatroniX or third parties. Nothing in this website grants you any right or license to use any trademark without the prior written permission of the respective owner.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#1E3473] mb-3">3. Infringement Complaints</h3>
                        <p className="text-gray-700 mb-4">
                            We respect the intellectual property rights of others. If you believe that your work has been copied or used in a way that constitutes copyright or trademark infringement, please notify us by sending the following information to{' '}
                            <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                                support@bharatronix.com
                            </a>:
                        </p>
                        <ul className="list-disc pl-8 space-y-2 text-gray-700">
                            <li>A description of the copyrighted work or trademark that you claim has been infringed</li>
                            <li>The URL or product listing where the alleged infringement occurs</li>
                            <li>Your contact information (name, address, phone number, and email)</li>
                            <li>A statement that you have a good-faith belief the use is not authorized by the rights owner</li>
                            <li>A statement, under penalty of perjury, that the information in your notice is accurate</li>
                            <li>Your electronic or physical signature</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            Upon receipt of a valid complaint, we will take appropriate action, which may include removing or disabling access to the allegedly infringing content.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#1E3473] mb-3">4. Limitations</h3>
                        <p className="text-gray-700">
                            This policy does not transfer any ownership rights. All rights not expressly granted herein are reserved by BharatroniX and its licensors.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Governing Law</h2>
                    <p className="text-gray-700">
                        These Terms are governed by and construed in accordance with the laws of Uttar Pradesh. Any disputes arising out of or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts located in Gautam Budh Nagar, Uttar Pradesh. By using our services, you agree to submit to the jurisdiction of these courts and waive any objections to such jurisdiction.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Contact Us</h2>
                    <p className="text-gray-700">For questions regarding this policy, contact us at:</p>
                    <ul className="mt-2 space-y-2 text-gray-700">
                        <li>Email:{' '}
                            <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                                support@bharatronix.com
                            </a>
                        </li>
                        <li>Address: Office/Business Address: - A 36, Sector-10, Noida, Gautam Budh Nagar, Uttar Pradesh 201301</li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                        BharatroniX is a registered brand of Anantakarma Technologies Private Limited.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default WarrantyPolicy; 