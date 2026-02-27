import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from "react";

const TermsAndConditions = () => 
{
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
  <>
    <Navbar />
    <main className="min-h-[60vh] flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <div className="max-w-4xl w-full bg-white p-6 md:p-10 rounded-xl shadow-md text-gray-800 leading-relaxed space-y-6">
        <h1 className="text-4xl font-bold mb-6 text-blue-600 text-center">TERMS OF SERVICE</h1>

        <p><strong className="text-blue-600">LAST REVISION:</strong> 01.06.2025</p>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <p className="font-semibold text-blue-800">
            PLEASE READ THIS TERMS OF SERVICE AGREEMENT CAREFULLY. BY USING THIS WEBSITE OR ORDERING PRODUCTS FROM THIS WEBSITE YOU AGREE TO BE BOUND BY ALL OF THE TERMS AND CONDITIONS OF THIS AGREEMENT.
          </p>
        </div>

        <p>
          This Terms of Service Agreement (the "Agreement") governs your use of this website, <a href="https://homewala.com" className="text-blue-600 font-semibold underline" target="_blank" rel="noopener noreferrer">homewala.com</a> (the "Website"), Homewala.com's offer of products for purchase on this Website, or your purchase of products available on this Website. This Agreement includes, and incorporates by this reference, the policies and guidelines referenced below.
        </p>

        <p>
          Homewala.com reserves the right to change or revise the terms and conditions of this Agreement at any time by posting any changes or a revised Agreement on this Website. Homewala.com will alert you that changes or revisions have been made by indicating on the top of this Agreement the date it was last revised. The changed or revised Agreement will be effective immediately after it is posted on this Website. Your use of the Website following the posting of any such changes or of a revised Agreement will constitute your acceptance of any such changes or revisions.
        </p>

        <p>
          Homewala.com encourages you to review this Agreement whenever you visit the Website to make sure that you understand the terms and conditions governing use of the Website. This Agreement does not alter in any way the terms or conditions of any other written agreement you may have with Homewala.com for other products or services. If you do not agree to this Agreement (including any referenced policies or guidelines), please immediately terminate your use of the Website.
        </p>

        <p>
          <em>If you would like to print this Agreement, please click the print button on your browser toolbar.</em>
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">I. PRODUCTS</h2>
        
        <h3 className="text-xl font-semibold text-blue-500">Terms of Offer</h3>
        <p>
          This Website offers for sale certain products (the "Products"). By placing an order for Products through this Website, you agree to the terms set forth in this Agreement.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Customer Solicitation</h3>
        <p>
          Unless you notify our third-party call center reps or direct Homewala.com sales reps, while they are calling you, of your desire to opt out from further direct company communications and solicitations, you are agreeing to continue to receive further emails and call solicitations from Homewala.com and its designated in-house or third-party call team(s).
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Opt Out Procedure</h3>
        <p>We provide 3 easy ways to opt out from future solicitations:</p>
        <ul className="ml-6 space-y-2">
          <li className="relative pl-6 before:content-['1.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            You may use the opt-out link found in any email solicitation you receive.
          </li>
          <li className="relative pl-6 before:content-['2.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            You may email your opt-out request to: <a href="mailto:info@homewala.com" className="text-blue-600 underline">info@homewala.com</a>
          </li>
          <li className="relative pl-6 before:content-['3.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            You may send a written request to:<br />
            No.78/10, Old State Bank colony, West Tambaram,<br />
            Chennai, Tamil Nadu 600045
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-500">Proprietary Rights</h3>
        <p>
          Homewala.com has proprietary rights and trade secrets in the Products. You may not copy, reproduce, resell, or redistribute any Product manufactured and/or distributed by Homewala.com. Homewala.com also has rights to all trademarks and trade dress and specific layouts of this webpage, including calls to action, text placement, images, and other information.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Sales Tax</h3>
        <p>
          If you purchase any Products, you will be responsible for paying any applicable sales tax.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">II. WEBSITE</h2>
        
        <h3 className="text-xl font-semibold text-blue-500">Content; Intellectual Property; Third-Party Links</h3>
        <p>
          In addition to making Products available, this Website also offers information and marketing materials. This Website may also offer information through links to third-party websites. Homewala.com does not always create or curate the information offered; instead, it may be sourced externally. Any original content is protected by applicable copyright, trademark, and other laws.
        </p>
        <p>
          Unauthorized use of the Website content may violate such laws. You agree to use the Website for personal, non-commercial use only. Any links to third-party websites are provided as a convenience. Homewala.com is not responsible for third-party website content.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Use of Website</h3>
        <p>You agree not to:</p>
        <ul className="ml-6 space-y-2">
          <li className="relative pl-6 before:content-['1.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Use the Website for unlawful purposes.
          </li>
          <li className="relative pl-6 before:content-['2.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Violate intellectual property laws.
          </li>
          <li className="relative pl-6 before:content-['3.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Interfere with others' Website use.
          </li>
          <li className="relative pl-6 before:content-['4.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Transmit spam or chain letters.
          </li>
          <li className="relative pl-6 before:content-['5.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Harass or harm users.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-500">License</h3>
        <p>
          You are granted a limited, non-transferable license to use the Website content for non-commercial use. You may not modify, reproduce, or distribute without permission.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Posting</h3>
        <p>
          By posting content, you grant Homewala.com a worldwide, royalty-free license to use, copy, distribute, and display that content. Homewala.com is not responsible for user-generated content and may remove objectionable content at its discretion.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">III. DISCLAIMER OF WARRANTIES</h2>
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
          <p className="font-semibold text-yellow-800">
            YOUR USE OF THIS WEBSITE AND/OR PRODUCTS IS AT YOUR OWN RISK. THE WEBSITE AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE".
          </p>
        </div>
        <p>
          Homewala.com DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p><strong>NO GUARANTEE IS GIVEN THAT:</strong></p>
        <ul className="ml-6 space-y-2">
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            WEBSITE INFORMATION IS ACCURATE OR COMPLETE.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            LINKS TO THIRD PARTIES ARE RELIABLE.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            DEFECTS WILL BE CORRECTED.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            PRODUCTS WILL MEET YOUR EXPECTATIONS.
          </li>
        </ul>
        <p><em>SOME JURISDICTIONS MAY NOT ALLOW THESE LIMITATIONS.</em></p>

        <h2 className="text-2xl font-semibold text-blue-600">IV. LIMITATION OF LIABILITY</h2>
        <p>
          Homewala.com's total liability is limited to the amount you paid, excluding shipping and handling. Homewala.com will not be liable for:
        </p>
        <ul className="ml-6 space-y-2">
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            Any damages from use or inability to use the Website or Products.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            Costs for substitute products.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            Lost profits or data.
          </li>
          <li className="relative pl-6 before:content-['●'] before:absolute before:left-0 before:text-blue-600">
            Claims arising from website use or product purchase.
          </li>
        </ul>
        <p><em>Some jurisdictions may limit or not allow exclusion of certain liabilities.</em></p>

        <h2 className="text-2xl font-semibold text-blue-600">V. INDEMNIFICATION</h2>
        <p>
          You agree to indemnify and hold harmless Homewala.com, its employees, agents, and affiliates from claims arising from:
        </p>
        <ul className="ml-6 space-y-2">
          <li className="relative pl-6 before:content-['1.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Breach of this Agreement.
          </li>
          <li className="relative pl-6 before:content-['2.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Use or misuse of Website or Products.
          </li>
          <li className="relative pl-6 before:content-['3.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Violation of any third-party rights or applicable laws.
          </li>
          <li className="relative pl-6 before:content-['4.'] before:absolute before:left-0 before:text-blue-600 before:font-semibold">
            Content you provide to the Website.
          </li>
        </ul>
        <p>
          Homewala.com may request written assurances from you and may participate in your defense.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">VI. PRIVACY</h2>
        <p>
          Please refer to Homewala.com's Privacy Policy, incorporated herein by reference, for information on how we collect, use, and protect your data.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">VII. AGREEMENT TO BE BOUND</h2>
        <p>
          By using the Website or purchasing Products, you confirm that you have read, understood, and agreed to all terms in this Agreement.
        </p>
        <p>
          <strong>Note:</strong> User-submitted contact details may be used for transactional/promotional communication but will not be sold to third parties.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600">VIII. GENERAL</h2>
        
        <h3 className="text-xl font-semibold text-blue-500">Force Majeure</h3>
        <p>
          Homewala.com is not liable for delays due to natural disasters, war, terrorism, labor strikes, or other uncontrollable events.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Cessation of Operation</h3>
        <p>
          Homewala.com reserves the right to cease Website operations or product offerings at any time.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Entire Agreement</h3>
        <p>
          This document represents the entire agreement between you and Homewala.com.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Waiver & Severability</h3>
        <p>
          Failure to enforce any right is not a waiver. Invalid clauses will not affect the rest of the Agreement.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Governing Law</h3>
        <p>
          This Agreement is governed by laws of Tamil Nadu. All disputes will be resolved in courts located in Tamil Nadu.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Statute of Limitations</h3>
        <p>
          Claims must be filed within 1 year or be permanently barred.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">No Class Actions</h3>
        <p>
          You waive any right to participate in class action lawsuits related to this Agreement.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Termination</h3>
        <p>
          Homewala.com may terminate your access at its discretion for violating this Agreement.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Domestic Use</h3>
        <p>
          The Website is controlled from India. Use outside India is at your own risk.
        </p>

        <h3 className="text-xl font-semibold text-blue-500">Assignment</h3>
        <p>
          You may not assign this Agreement; Homewala.com may do so without notice.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mt-8">
          <p className="font-semibold text-blue-800 text-center">
            BY USING THIS WEBSITE OR ORDERING PRODUCTS FROM THIS WEBSITE, YOU AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>
)};

export default TermsAndConditions; 