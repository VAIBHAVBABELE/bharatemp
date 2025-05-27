import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl font-bold text-[#1E3473] mb-8">Privacy Policy</h1>
                
                <section className="mb-8">
                    <p className="text-gray-700 mb-4">
                        Thank you for visiting BharatroniX.com. Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect the personal information you provide on our website. By using this site, you agree to the practices outlined in this policy. Please review it regularly, as updates may be made from time to time.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Note: This Privacy Policy applies solely to BharatroniX.com. If you navigate to third-party websites via our links, we recommend reviewing their respective privacy policies.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Collection of Information</h2>
                    <p className="text-gray-700 mb-4">
                        We collect personally identifiable information (PII) such as:
                    </p>
                    <ul className="list-disc pl-8 mb-4 text-gray-700">
                        <li>Name</li>
                        <li>Postal address</li>
                        <li>Email address</li>
                        <li>Mobile number</li>
                    </ul>
                    <p className="text-gray-700 mb-4">
                        This information is collected when you voluntarily submit it (e.g., during checkout, account registration, or contact forms). We use it solely to fulfill your specific request unless you authorize us to use it otherwise (e.g., subscribing to newsletters).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Cookies & Tracking Technology</h2>
                    <p className="text-gray-700 mb-4">
                        BharatroniX.com uses cookies and tracking technologies to enhance user experience, including:
                    </p>
                    <ul className="list-disc pl-8 mb-4 text-gray-700">
                        <li>Identifying browser type and operating system</li>
                        <li>Tracking site traffic and user behavior</li>
                        <li>Remembering your preferences for future visits</li>
                        <li>Customizing content and offerings</li>
                    </ul>
                    <p className="text-gray-700 mb-4">
                        Cookies do not collect personal data. However, if you have previously provided PII, cookies may associate that data with your browsing activity.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Aggregated data from cookies may be shared with third-party analytics services to help us improve our platform.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Sharing & Distribution of Information</h2>
                    <p className="text-gray-700 mb-4">
                        We may share your information with trusted third-party service providers for purposes such as:
                    </p>
                    <ul className="list-disc pl-8 mb-4 text-gray-700">
                        <li>Personalizing the website or mobile app experience</li>
                        <li>Conducting behavioral analytics</li>
                        <li>Processing orders and payments</li>
                        <li>Providing customer support</li>
                    </ul>
                    <p className="text-gray-700 mb-4">
                        Information that may be shared includes:
                    </p>
                    <ul className="list-disc pl-8 mb-4 text-gray-700">
                        <li>Your name, email address, and phone number</li>
                        <li>Device type, location, and network provider information</li>
                    </ul>
                    <p className="text-gray-700 mb-4">
                        We ensure that our partners adhere to strict confidentiality and data protection standards.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Data Security Commitment</h2>
                    <p className="text-gray-700 mb-4">
                        We are committed to securing your personal data. Access to your information is restricted to authorized employees, agents, or contractors who are bound by confidentiality agreements.
                    </p>
                    <p className="text-gray-700 mb-4">
                        We implement industry-standard security measures to prevent unauthorized access, misuse, or disclosure of your data.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#1E3473] mb-4">Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about our Privacy Policy, please contact us at{' '}
                        <a href="mailto:support@bharatronix.com" className="text-[#F7941D] hover:underline">
                            support@bharatronix.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy; 