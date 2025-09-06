import { SEOHead } from "../components/ui/SEOHead";

export default function Privacy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy - Mapletenders"
        description="Learn how Mapletenders protects your privacy and handles personal data. Our privacy policy covers data collection, usage, and security practices for our Canadian procurement intelligence platform."
        canonicalUrl="https://mapletenders.ca/privacy"
        noIndex={true}
      />
      <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-text mb-8">Privacy Policy</h1>
          <p className="text-text-muted mb-8">Last Updated: January 27, 2025</p>
          
          <div className="space-y-8 text-text">
            <p>
              Mapletenders Inc. ("Mapletenders," "we," "our," or "us") takes steps intended to meet privacy 
              principles and requirements with respect to personal information under applicable privacy legislation. 
              This Privacy Policy (the "Policy") applies to services offered by Mapletenders under the domain 
              and subdomains of www.mapletenders.ca (the "Site" and "Service"). Mapletenders cares about your 
              privacy and is committed to protecting it by adhering to this Policy.
            </p>

            <p>
              This Policy describes the information that we collect from you as part of the normal operation 
              of our procurement intelligence services and what may happen to that information. For the purposes 
              of this Policy, personal information means information about an identifiable individual.
            </p>

            <p>
              By accepting this Policy, you expressly consent to the collection, use and disclosure of your 
              personal information in accordance with this Policy.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Collection and Use of Personal Information</h2>
              
              <p className="mb-4">
                In order to use certain features of our Service, we may request that you provide certain 
                personal information. We only collect personal information that is necessary to provide you 
                with our procurement intelligence services. Where possible, we indicate which fields are 
                required and which fields are optional.
              </p>

              <ul className="space-y-4 mb-6">
                <li>
                  <strong>Account Creation and Subscription:</strong> If you wish to create an account and/or 
                  subscribe to our Service, we may collect your name, business email address, phone number, 
                  company name, industry information, and other details about your organization. This information 
                  is used to facilitate the procurement intelligence services you request, customize your 
                  experience with relevant tender opportunities, and provide customer support.
                </li>
                
                <li>
                  <strong>Payment Processing:</strong> If you make a payment through our Service, we will 
                  collect the information necessary to process the payment through our third-party payment 
                  processor, Stripe. This includes your name, credit card information, and billing address.
                </li>
                
                <li>
                  <strong>Contact and Support:</strong> If you use the contact feature on our Site or contact 
                  our support team, we may collect your name, email address, phone number, job title, and 
                  other information about your company. We use this information to respond to your request 
                  or provide customer support.
                </li>
                
                <li>
                  <strong>Marketing Communications:</strong> If you subscribe to our newsletter or marketing 
                  communications, we will collect your name and email address to send you updates about 
                  procurement opportunities, platform features, and industry insights. You may unsubscribe 
                  at any time using the "Unsubscribe" link in our emails.
                </li>
                
                <li>
                  <strong>Website Analytics:</strong> When you visit our Site, we may collect information 
                  about your visit through cookies and similar technologies, including your IP address, 
                  browser type, pages visited, time spent on pages, and referring URLs.
                </li>
              </ul>

              <p>
                We may also use the personal information we collect to communicate with you about products 
                and services, conduct and process transactions, meet legal and regulatory requirements, 
                improve our Service, and detect and prevent fraud and other criminal activity.
              </p>

              <p>
                Unless otherwise permitted or required by applicable laws or regulations, we will retain 
                your personal information only as long as necessary to fulfill the purposes for which it 
                was collected, including for legal, accounting, or auditing requirements. <strong>Mapletenders 
                does not sell your information to third parties.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Collection and Use of Business Data</h2>
              
              <p className="mb-4">
                Our Service involves analyzing publicly available government procurement data, tender notices, 
                and related information to provide intelligence and insights to our clients. This procurement 
                data is sourced from public government databases and websites and does not contain personal 
                information about individuals.
              </p>

              <p>
                We may use aggregated and non-identifiable usage data to improve and enhance our Service, 
                develop new features, and provide better procurement intelligence to our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclosure of Personal Information</h2>
              
              <p className="mb-4">
                Mapletenders will only disclose your personal information with your consent or if it has 
                legal authority to do so, such as in the following contexts:
              </p>

              <ul className="space-y-4 mb-6">
                <li>
                  <strong>Service Providers:</strong> Mapletenders may transfer personal information to 
                  third-party service providers that perform services on our behalf, such as payment processing 
                  (Stripe), email marketing, customer support, data hosting, and analytics services.
                </li>
                
                <li>
                  <strong>Business Transactions:</strong> We may use and disclose personal information in 
                  the context of a business transaction, such as a merger, acquisition, or sale of assets. 
                  Any successor entity would be required to honor the commitments made in this Privacy Policy.
                </li>
                
                <li>
                  <strong>Legal Requirements:</strong> Mapletenders may disclose personal information as 
                  necessary to meet legal, regulatory, or security requirements, respond to lawful requests 
                  from government authorities, or protect the rights and safety of Mapletenders, our users, 
                  or others.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">International Storage and Transfer of Personal Information</h2>
              
              <p className="mb-4">
                In order for us to provide our procurement intelligence services, personal information may 
                be processed by us or our third-party service providers on servers located outside of Canada, 
                including in the United States, for the purposes described in this Policy. The privacy laws 
                in such jurisdictions may differ from Canadian privacy laws.
              </p>

              <p>
                By submitting your personal information or using our Service, you consent to such transfer 
                and storage. If you would like more information about our policies regarding international 
                data transfers, please contact us using the information in the "Contact Us" section.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies and Other Tracking Technologies</h2>
              
              <p className="mb-4">
                When you visit our Site, we use cookies and similar technologies to collect information 
                about your visit, remember your preferences, and improve your experience. The information 
                collected includes your IP address, browser type, pages visited, time spent on pages, 
                referring URLs, and other usage data.
              </p>

              <p className="mb-4">
                We use this information for internal research, analytics, to enhance our Service, and to 
                provide better procurement intelligence. We may use both session cookies (which expire 
                when you close your browser) and persistent cookies (which remain on your device until deleted).
              </p>

              <p className="mb-4">
                We also use Google Analytics to better understand how users interact with our Site. Google 
                Analytics uses cookies to collect information such as pages visited, user interactions, 
                and demographic information. Please see{" "}
                <a href="http://www.google.com/policies/privacy/partners/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Google's Privacy Policy
                </a>{" "}
                for information about how Google Analytics uses this information.
              </p>

              <p>
                You can manage your cookie preferences through your browser settings. You can set your 
                browser to refuse cookies or delete certain cookies. Note that disabling cookies may 
                affect the functionality of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Links to Other Sites</h2>
              
              <p>
                Our Service may contain links to other websites, including government procurement portals 
                and third-party services. We are not responsible for the privacy practices of these other 
                websites. We encourage you to read the privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Security</h2>
              
              <p className="mb-4">
                We take reasonable steps to protect the personal information in our custody using physical, 
                electronic, and procedural security measures, including encryption and secure data storage, 
                that are appropriate for the nature and sensitivity of the information.
              </p>

              <p className="mb-4">
                We limit access to personal information to authorized employees and contractors who need 
                access to perform their duties and provide our Service. All employees and contractors are 
                required to maintain the confidentiality of personal information.
              </p>

              <p>
                If you have chosen a password to access your account, you are responsible for keeping this 
                password confidential. Please note that no security measures can provide absolute security, 
                and we cannot guarantee the security of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Accessing, Correcting, and Deleting Personal Information</h2>
              
              <p className="mb-4">
                It is important that the personal information we hold about you is accurate and up to date. 
                By law, you have the right to request access to and/or correction of the personal information 
                we hold about you.
              </p>

              <p className="mb-4">
                If you wish to review, verify, correct, or request deletion of your personal information, 
                you may contact us at{" "}
                <a href="mailto:privacy@mapletenders.ca" className="text-primary hover:underline">
                  privacy@mapletenders.ca
                </a>. We may ask you to verify your identity before providing access to your information.
              </p>

              <p>
                In some cases, applicable law may require us to refuse access to some or all of your personal 
                information, or we may have destroyed, erased, or anonymized information in accordance with 
                our legal obligations and privacy practices. If you request deletion of certain information, 
                we may not be able to provide you with certain services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy Rights for Residents of Certain Jurisdictions</h2>
              
              <p className="mb-4">
                Depending on your location, you may have additional privacy rights under applicable law, 
                such as:
              </p>

              <ul className="space-y-2 mb-4">
                <li>• The right to request disclosure of what personal information is collected and how it is used</li>
                <li>• The right to request correction or deletion of your personal information</li>
                <li>• The right to opt out of certain uses of your personal information</li>
                <li>• The right to non-discrimination for exercising your privacy rights</li>
              </ul>

              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@mapletenders.ca" className="text-primary hover:underline">
                  privacy@mapletenders.ca
                </a>. We will respond to your request in accordance with applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy Changes</h2>
              
              <p>
                This Policy is effective as of the last updated date above and may be revised from time to time. 
                If we intend to use or disclose personal information for purposes materially different than 
                those described in this Policy, we will make reasonable efforts to notify you, including by 
                posting the revised Policy on our Site. Your continued use of our Service following any changes 
                constitutes your acceptance of such changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              
              <p className="mb-4">
                If you have any questions or concerns about this Policy, or if you wish to make a complaint 
                about our privacy practices, please contact our Privacy Officer at:
              </p>

              <div className="bg-surface border border-border rounded-lg p-6">
                <p className="mb-2">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@mapletenders.ca" className="text-primary hover:underline">
                    privacy@mapletenders.ca
                  </a>
                </p>
                <p className="mb-2">
                  <strong>General Inquiries:</strong>{" "}
                  <a href="mailto:info@mapletenders.ca" className="text-primary hover:underline">
                    info@mapletenders.ca
                  </a>
                </p>
                <p>
                  <strong>Company:</strong> Mapletenders Inc.<br />
                  <strong>Website:</strong>{" "}
                  <a href="https://www.mapletenders.ca" className="text-primary hover:underline">
                    www.mapletenders.ca
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}