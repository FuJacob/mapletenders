import {
  MapPin,
  Clock,
  CurrencyDollarIcon,
  Users,
  Code,
  Envelope,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { SEOHead } from "../components/ui/SEOHead";

export default function Careers() {
  const handleApply = () => {
    window.location.href =
      "mailto:careers@mapletenders.ca?subject=Application for Software Engineer Position&body=Hello Mapletenders Team,%0D%0A%0D%0AI am interested in applying for the Software Engineer position. Please find my application details below.%0D%0A%0D%0ABest regards,";
  };

  return (
    <>
      <SEOHead
        title="Careers at Mapletenders - Join Canada's Leading Procurement Team"
        description="Join Mapletenders and help build Canada's premier procurement intelligence platform. We're hiring Software Engineers at $100,000 CAD in Toronto. Work with cutting-edge AI technology and help Canadian businesses win government contracts."
        canonicalUrl="https://mapletenders.ca/careers"
        keywords="mapletenders careers, software engineer jobs toronto, canadian tech jobs, procurement platform jobs, AI developer positions, $100k developer jobs canada"
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-surface to-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-text mb-6">
            Join the Team Building Canada's
            <span className="text-primary"> Premier Procurement Platform</span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            Help us revolutionize how Canadian businesses discover and win
            government contracts. We're looking for passionate developers to
            join our growing team.
          </p>
        </div>
      </section>

      {/* Job Listing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
            {/* Job Header */}
            <div className="border-b border-border pb-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-text mb-3">
                    Software Engineer
                  </h2>
                  <div className="flex items-center gap-6 text-text-muted">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>Toronto, ON (Hybrid)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5" />
                      <span>$100,000 CAD</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleApply}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center gap-2"
                >
                  Apply Now
                  <Envelope className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-text mb-4">
                  About the Role
                </h3>
                <p className="text-text-muted leading-relaxed">
                  We're seeking a talented Software Engineer to join our team
                  and help build the next generation of procurement intelligence
                  tools. You'll work on cutting-edge features including
                  AI-powered tender matching, advanced search capabilities, and
                  data visualization tools that help Canadian businesses win
                  more government contracts.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-text mb-4">
                  What You'll Do
                </h3>
                <ul className="space-y-3">
                  {[
                    "Develop and maintain our React/TypeScript frontend applications",
                    "Build robust backend APIs using Node.js and Express",
                    "Work with modern databases (PostgreSQL/Supabase) and implement efficient data queries",
                    "Integrate AI/ML services for intelligent tender matching and analysis",
                    "Collaborate with our design team to implement beautiful, intuitive user interfaces",
                    "Optimize application performance and ensure scalability",
                    "Participate in code reviews and maintain high code quality standards",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-text mb-4">
                  What We're Looking For
                </h3>
                <ul className="space-y-3">
                  {[
                    "3+ years of experience in full-stack development",
                    "Strong proficiency in React, TypeScript, and modern JavaScript",
                    "Experience with Node.js, Express, and REST API development",
                    "Familiarity with PostgreSQL or similar relational databases",
                    "Understanding of modern development tools (Git, npm/yarn, webpack)",
                    "Experience with cloud platforms (AWS, Vercel, or similar)",
                    "Strong problem-solving skills and attention to detail",
                    "Excellent communication and collaboration abilities",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-text mb-4">
                  Nice to Have
                </h3>
                <ul className="space-y-3">
                  {[
                    "Experience with AI/ML integration and API usage",
                    "Knowledge of data visualization libraries (D3.js, Chart.js)",
                    "Familiarity with government procurement processes",
                    "Experience with Stripe or other payment processing systems",
                    "Understanding of web scraping and data processing",
                    "Background in B2B SaaS product development",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-text mb-4">
                  What We Offer
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {[
                      "Competitive salary: $100,000 CAD",
                      "Comprehensive health and dental benefits",
                      "Flexible hybrid work arrangement",
                      "Professional development budget",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-maple mt-0.5 flex-shrink-0" />
                        <span className="text-text-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      "Equity participation in company growth",
                      "Modern tech stack and tools",
                      "Collaborative, innovative team culture",
                      "Opportunity to shape Canada's procurement landscape",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-maple mt-0.5 flex-shrink-0" />
                        <span className="text-text-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="border-t border-border pt-8 mt-8 text-center">
              <h3 className="text-xl font-semibold text-text mb-4">
                Ready to Apply?
              </h3>
              <p className="text-text-muted mb-6">
                Send us your resume and a brief cover letter explaining why
                you'd be a great fit for our team.
              </p>
              <button
                onClick={handleApply}
                className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-semibold text-lg flex items-center gap-3 mx-auto"
              >
                <Envelope className="w-6 h-6" />
                Apply via Email
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-sm text-text-light mt-4">
                Email:{" "}
                <span className="text-primary font-medium">
                  careers@mapletenders.ca
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="py-16 bg-surface-warm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Why Join Mapletenders?
            </h2>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              We're building something meaningful – a platform that helps
              Canadian businesses grow by connecting them with government
              opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                Modern Tech Stack
              </h3>
              <p className="text-text-muted">
                Work with cutting-edge technologies including React, TypeScript,
                Node.js, and AI/ML integrations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                Collaborative Team
              </h3>
              <p className="text-text-muted">
                Join a passionate team that values innovation, quality, and
                continuous learning.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                Canadian Impact
              </h3>
              <p className="text-text-muted">
                Make a real difference by helping Canadian businesses succeed in
                government procurement.
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
