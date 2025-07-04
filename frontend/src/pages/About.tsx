import { Link } from "react-router-dom";
import {
  Lightning,
  Target,
  Users,
  Shield,
  TrendUp,
  CheckCircle,
  Crown,
  MapPin,
  Clock,
  Star,
  Robot,
  ChartBar,
} from "@phosphor-icons/react";
import { Header } from "../components/layout";

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      background: "Former Director of Procurement at Innovation, Science and Economic Development Canada",
      expertise: "Government procurement, AI strategy",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder", 
      background: "Ex-Senior Engineer at Shopify, ML specialist",
      expertise: "Machine learning, search algorithms, platform architecture",
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of AI",
      background: "PhD in Computer Science from University of Toronto",
      expertise: "Natural language processing, contract analysis",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to democratize government contract discovery"
    },
    {
      year: "2024", 
      title: "AI Engine Launched",
      description: "Deployed proprietary AI that understands tender requirements like a human"
    },
    {
      year: "2024",
      title: "1,000+ Users",
      description: "Reached our first thousand users across Canada"
    },
    {
      year: "2025",
      title: "Series A Funding",
      description: "$5M raised to expand across North America"
    },
  ];

  const stats = [
    {
      icon: <Lightning className="w-8 h-8 text-accent" />,
      number: "50,000+",
      label: "Tenders Indexed",
      description: "Comprehensive coverage of Canadian government opportunities"
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      number: "98%",
      label: "Search Accuracy",
      description: "AI-powered matching that actually understands your needs"
    },
    {
      icon: <Users className="w-8 h-8 text-success" />,
      number: "5,000+",
      label: "Active Users",
      description: "Businesses of all sizes winning contracts daily"
    },
    {
      icon: <TrendUp className="w-8 h-8 text-secondary" />,
      number: "$2.8B",
      label: "Contract Value",
      description: "Total value of opportunities discovered through Procuroo"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-text">
            We're democratizing government contracts
          </h1>
          <p className="text-xl text-text-light mb-8 max-w-3xl mx-auto">
            Procuroo was born from a simple frustration: why should finding government 
            opportunities be so hard? We're building AI that makes contract discovery 
            as easy as asking a question.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-text-light">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Founded in Toronto, Canada
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Established 2023
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              5,000+ users
            </span>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text">Our Mission</h2>
              <p className="text-lg text-text-light mb-6">
                Every business should have equal access to government opportunities. 
                We're eliminating the barriers that prevent small and medium businesses 
                from competing for public contracts.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1" />
                  <div>
                    <div className="font-semibold text-text">Transparency</div>
                    <div className="text-sm text-text-light">Making government procurement accessible to everyone</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1" />
                  <div>
                    <div className="font-semibold text-text">Innovation</div>
                    <div className="text-sm text-text-light">Using AI to solve real problems in procurement</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-1" />
                  <div>
                    <div className="font-semibold text-text">Impact</div>
                    <div className="text-sm text-text-light">Helping businesses grow through government contracts</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-2xl p-8 border border-border">
              <div className="text-center">
                <Robot className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4 text-text">Our Vision</h3>
                <p className="text-text-light">
                  A world where AI makes government procurement so intuitive that 
                  finding the right opportunity is as natural as having a conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-text">
            By the numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-text mb-2">{stat.number}</div>
                <div className="font-semibold text-text mb-2">{stat.label}</div>
                <div className="text-sm text-text-light">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-text">Meet the team</h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              We're a team of procurement experts, AI researchers, and engineers 
              who've experienced the pain of government contract discovery firsthand.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-background rounded-xl p-6 border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-1">{member.name}</h3>
                <div className="text-primary text-sm font-medium mb-3">{member.role}</div>
                <p className="text-sm text-text-light mb-3">{member.background}</p>
                <div className="text-xs text-text-light">
                  <strong>Expertise:</strong> {member.expertise}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-text">
            Our journey
          </h2>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{milestone.year}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text mb-2">{milestone.title}</h3>
                  <p className="text-text-light">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-text">
            Recognition & Awards
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 border border-border">
              <Star className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-text mb-2">TechStars Toronto 2024</h3>
              <p className="text-sm text-text-light">Selected for the prestigious accelerator program</p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border border-border">
              <ChartBar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-text mb-2">Product Hunt #3</h3>
              <p className="text-sm text-text-light">Featured as Product of the Day</p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border border-border">
              <Shield className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold text-text mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-text-light">Enterprise-grade security certification</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-text">
            Join us in transforming procurement
          </h2>
          <p className="text-lg text-text-light mb-8">
            Whether you're a business looking for opportunities or want to join our team, 
            we'd love to hear from you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/sign-up"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Lightning className="w-4 h-4" />
              Start Your Free Trial
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-border text-text rounded-lg hover:bg-surface transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>© 2025 Procuroo</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:underline text-text-light">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline text-text-light">
              Terms
            </Link>
            <Link to="/contact" className="hover:underline text-text-light">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
