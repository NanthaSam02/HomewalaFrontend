import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from "react";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] flex flex-col items-center py-10 px-4 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Refund Policy</h1>
        <div className="max-w-4xl w-full bg-white p-6 md:p-10 rounded-xl shadow-md text-gray-800 leading-relaxed space-y-6">
          <h1 className="text-4xl font-bold mb-6 text-blue-600 text-center">Refund Policy</h1>

          <p>
            At <a href="https://homewala.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline">Homewala.com</a>, we strive to provide our users with the best experience when it comes to finding their dream homes. However, we understand that there may be instances where you might need to request a refund. Please read our refund policy carefully to understand your rights and responsibilities:
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">Return Policy for Listings</h2>
          <ul className="ml-6 space-y-2">
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Property listings purchased by agents or builders can be cancelled within 24 hours of purchase for a full refund. Request via your account manager or email <a href="mailto:Digital@homewala.com" className="text-blue-600 underline">Digital@homewala.com</a>.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Refunds may not be applicable beyond the 24-hour window.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              If Homewala.com removes a listing due to Terms & Conditions violation, a refund may be granted depending on the case.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-600">Subscription Services</h2>
          <ul className="ml-6 space-y-2">
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Premium services (like featured listings/ads) are eligible for full refund within 7 days of subscription start if unsatisfied.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Requests after 7 days are reviewed case-by-case and may receive a prorated refund.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-600">Transaction Fees</h2>
          <ul className="ml-6 space-y-2">
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Transaction fees (e.g., payment gateway charges) may apply for some services.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              These fees are non-refundable unless there was an error on Homewala.com's part.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-600">Disputes and Resolutions</h2>
          <ul className="ml-6 space-y-2">
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Think you're entitled to a refund? Contact support at <a href="mailto:info@homewala.com" className="text-blue-600 underline">info@homewala.com</a>.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Our team may ask for additional info to process your request.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Refunds are issued using the original payment method when possible.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-600">Exceptions</h2>
          <ul className="ml-6 space-y-2">
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Refunds may be refused in cases of abuse, fraud, or misuse.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Refund policies may differ for special promotions or partnerships — always check their specific terms.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-600">Changes to the Refund Policy</h2>
          <ul className="ml-6 space-y-2">
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Homewala.com reserves the right to update this refund policy anytime without prior notice.
            </li>
            <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
              Changes take effect immediately upon posting on our website.
            </li>
          </ul>

          <p>
            By using the services of <a href="https://homewala.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline">Homewala.com</a>, you agree to this refund policy. For questions or assistance, contact us at <a href="mailto:info@homewala.com" className="text-blue-600 underline">info@homewala.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RefundPolicy;