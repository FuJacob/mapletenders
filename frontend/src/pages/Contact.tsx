import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Lightning,
  Phone,
  EnvelopeSimple,
  MapPin,
  ChatCircle,
  CheckCircle,
  Clock,
  Users,
  Headset,
  Calendar,
  ArrowRight,
  Leaf,
} from "@phosphor-icons/react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call us",
      description: "Speak with our team directly",
      contact: "+1 (416) 555-0123",
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call now",
    },
    {
      icon: <EnvelopeSimple className="w-6 h-6" />,
      title: "Email us",
      description: "We'll respond within 4 hours",
      contact: "hello@mapletenders.com",
      availability: "24/7 support",
      action: "Send email",
    },
    {
      icon: <ChatCircle className="w-6 h-6" />,
      title: "Live chat",
      description: "Get instant help from our team",
      contact: "Available in-app",
      availability: "Mon-Fri 9AM-9PM EST",
      action: "Start chat",
    },
  ];

  const supportTopics = [
    {
      icon: <Lightning className="w-5 h-5 text-accent" />,
      title: "Product Demo",
      description: "See Mapletenders in action with a personalized demo",
      cta: "Book demo",
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Enterprise Sales",
      description: "Custom solutions for large organizations",
      cta: "Contact sales",
    },
    {
      icon: <Headset className="w-5 h-5 text-success" />,
      title: "Technical Support",
      description: "Get help with your account or technical issues",
      cta: "Get support",
    },
    {
      icon: <Calendar className="w-5 h-5 text-secondary" />,
      title: "Training & Onboarding",
      description:
        "Learn how to maximize your procurement success with Mapletenders",
      cta: "Schedule training",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-text mb-4">
              Message sent successfully!
            </h1>
            <p className="text-text-muted mb-8">
              Thanks for reaching out. We'll get back to you within 4 hours
              during business hours.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    company: "",
                    subject: "",
                    message: "",
                    inquiryType: "general",
                  });
                }}
                className="px-6 py-3 border border-border text-text rounded-lg hover:bg-surface transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-surface overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-maple/10 text-maple border border-maple/20 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-3 h-3" />
              Canadian support team
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">
              Get in touch with Mapletenders
            </h1>
            <p className="text-xl text-text-muted mb-12 max-w-3xl mx-auto">
              Have questions about winning government contracts? Our Canadian
              team is here to help you succeed in procurement.
            </p>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-surface-warm rounded-xl border border-border-warm">
                <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="font-semibold text-text">4 hour response</div>
                <div className="text-sm text-text-muted">
                  for sales inquiries
                </div>
              </div>
              <div className="text-center p-4 bg-surface-warm rounded-xl border border-border-warm">
                <Users className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="font-semibold text-text">500+ businesses</div>
                <div className="text-sm text-text-muted">
                  trust Mapletenders
                </div>
              </div>
              <div className="text-center p-4 bg-surface-warm rounded-xl border border-border-warm">
                <CheckCircle className="w-8 h-8 text-maple mx-auto mb-2" />
                <div className="font-semibold text-text">Canadian focused</div>
                <div className="text-sm text-text-muted">support team</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-text">
            Choose how you'd like to connect
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-background rounded-xl p-6 border border-border text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  {method.title}
                </h3>
                <p className="text-text-light text-sm mb-3">
                  {method.description}
                </p>
                <div className="font-medium text-text mb-1">
                  {method.contact}
                </div>
                <div className="text-xs text-text-light mb-4">
                  {method.availability}
                </div>
                <button className="text-primary text-sm font-medium hover:text-primary-dark flex items-center gap-1 mx-auto">
                  {method.action}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Topics */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-text">
            What can we help you with?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-surface rounded-lg p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  {topic.icon}
                  <h3 className="font-semibold text-text">{topic.title}</h3>
                </div>
                <p className="text-text-light text-sm mb-4">
                  {topic.description}
                </p>
                <button className="text-primary text-sm font-medium hover:text-primary-dark">
                  {topic.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text">
                Send us a message
              </h2>
              <p className="text-text-light mb-8">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Full name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-text placeholder-text-light"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Email address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-text placeholder-text-light"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Company Inc."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-text placeholder-text-light"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiryType"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Inquiry type
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-text"
                  >
                    <option value="general">General inquiry</option>
                    <option value="sales">Sales & pricing</option>
                    <option value="support">Technical support</option>
                    <option value="demo">Product demo</option>
                    <option value="partnership">Partnership</option>
                    <option value="media">Media & press</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-text placeholder-text-light"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about what you need..."
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-text placeholder-text-light resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Lightning className="w-4 h-4 animate-pulse" />
                      Sending message...
                    </>
                  ) : (
                    <>
                      <EnvelopeSimple className="w-4 h-4" />
                      Send message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-background rounded-xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-text">
                Other ways to reach us
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium text-text">Our office</div>
                    <div className="text-text-light text-sm">
                      123 King Street West
                      <br />
                      Toronto, ON M5H 3T9
                      <br />
                      Canada
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium text-text">Business hours</div>
                    <div className="text-text-light text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                      <br />
                      Saturday - Sunday: Closed
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Headset className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <div className="font-medium text-text">
                      Emergency support
                    </div>
                    <div className="text-text-light text-sm">
                      For critical issues affecting your business,
                      <br />
                      call +1 (416) 555-0199
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-sm text-text-light">
                  <strong className="text-text">Response times:</strong>
                  <br />
                  • General inquiries: 24 hours
                  <br />
                  • Sales questions: 4 hours
                  <br />
                  • Technical support: 2 hours
                  <br />• Emergency issues: 30 minutes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-text">
            Looking for quick answers?
          </h2>
          <p className="text-text-light mb-6">
            Check out our frequently asked questions for instant help.
          </p>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text rounded-lg hover:bg-surface transition-colors"
          >
            View FAQ
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
