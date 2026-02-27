import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from "react";

const PrivacyPolicy = () => 
{
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
  <>
    <Navbar />
    <main className="min-h-[60vh] flex flex-col items-center py-10 px-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div className="max-w-4xl w-full bg-white p-6 md:p-10 rounded-xl shadow-md text-gray-800 leading-relaxed space-y-6">
        <h1 className="text-4xl font-bold mb-6 text-blue-600 text-center">Privacy Policy</h1>
        
        <p>
          This Privacy Policy applies to the website <a href="https://homewala.com" className="text-blue-600 font-semibold underline" target="_blank" rel="noopener noreferrer">homewala.com</a>.
        </p>

        <p>
          <a href="https://homewala.com" className="text-blue-600 font-semibold underline" target="_blank" rel="noopener noreferrer">homewala.com</a> recognises the importance of maintaining your privacy. We value your privacy and appreciate your trust in us. This Policy describes how we treat user information we collect on homewala.com and other offline sources. This Privacy Policy applies to current and former visitors to our website and to our online customers. By visiting and/or using our website, you agree to this Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">Information We Collect</h2>
        
        <h3 className="text-xl font-semibold text-blue-500">Contact Information</h3>
        <p>We might collect your name, mail ID and mobile number.</p>

        <h3 className="text-xl font-semibold text-blue-500">Payment and Billing Information</h3>
        <p>
          We might collect your name and mobile number. We NEVER collect your credit card number or credit card expiry date or other details pertaining to your credit card on our website. Credit card information will be obtained and processed by our online payment partner CC Avenue.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Information You Post</h3>
        <p>
          We collect information you post in a public space on our website or on a third-party social media site belonging to homewala.com.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">How We Collect Information</h2>
        
        <h3 className="text-xl font-semibold text-blue-500">We collect information directly from you</h3>
        <p>
          We collect information directly from you when you post a listing / contact owners. We also collect information if you post a comment on our website or ask us a question through phone or email.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">We collect information from you passively</h3>
        <p>
          We use tracking tools like Google Analytics, Google Webmaster for collecting information about your usage of our website.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">We get information about you from third parties</h3>
        <p>
          For example, if you use an integrated social media feature on our websites. The third-party social media site will give us certain information about you. This could include your name and email address.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">Use of Your Personal Information</h2>
        <ul className="ml-6 space-y-2">
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information to contact you:</strong> We might use the information you provide to contact you for confirmation of a purchase on our website or for other promotional purposes.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information to respond to your requests or questions:</strong> We might use your information to confirm your registration for an event or contest.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information to improve our products and services:</strong> We might use your information to customize your experience with us. This could include displaying content based upon your preferences.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information to look at site trends and customer interests:</strong> We may use your information to make our website and products better. We may combine information we get from you with information about you we get from third parties.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information for security purposes:</strong> We may use information to protect our company, our customers, or our websites.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information for marketing purposes:</strong> We might send you information about special promotions or offers. We might also tell you about new features or products. These might be our own offers or products, or third-party offers or products we think you might find interesting. Or, for example, if you buy tickets from us we'll enroll you in our newsletter.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information to send you transactional communications:</strong> We might send you emails or SMS about your account or a ticket purchase.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We use information as otherwise permitted by law.</strong>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-600">Sharing of Information with Third Parties</h2>
        <ul className="ml-6 space-y-2">
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We may share information if we think we have to in order to comply with the law or to protect ourselves:</strong> We will share information to respond to a court order or subpoena. We may also share it if a government agency or investigatory body requests. Or, we might also share information when we are investigating potential fraud.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We may share information with any successor to all or part of our business:</strong> For example, if part of our business is sold we may give our customer list as part of that transaction.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            <strong>We may share information with prospective tenants and house owners:</strong> For example, if the tenant is interested in your property we will help him to connect with you by sharing your contact number submitted to us. We charge a little premium for this service.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-600">Third-party Sites</h2>
        <p>
          If you click on one of the links to third-party websites, you may be taken to websites we do not control. This policy does not apply to the privacy practices of those websites. Read the privacy policy of other websites carefully. We are not responsible for these third-party sites.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">Grievance Officer</h2>
        <p>
          In accordance with Information Technology Act 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below:
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <p>
            <strong>Mr. Balaji Adarsh</strong><br />
            No.78/10, Old State Bank colony, West Tambaram, Chennai, Tamil Nadu 600045<br />
            Email: <a href="mailto:info@homewala.com" className="text-blue-600 underline">info@homewala.com</a>
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Updates to This Policy</h2>
        <p>
          This Privacy Policy was last updated on <strong>01.06.2025</strong>. From time to time we may change our privacy practices. We will notify you of any material changes to this policy as required by law. We will also post an updated copy on our website. Please check our site periodically for updates.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">Jurisdiction</h2>
        <p>
          If you choose to visit the website, your visit and any dispute over privacy is subject to this Policy and the website's terms of use. In addition to the foregoing, any disputes arising under this Policy shall be governed by the laws of India.
        </p>
      </div>
    </main>
    <Footer />
  </>
)};

export default PrivacyPolicy;