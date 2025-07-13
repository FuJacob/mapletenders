export default function TrustStatsSection() {
  return (
    <section className="py-16 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-text mb-3">
            Trusted by Canadian contractors
          </h2>
          <p className="text-text-muted">
            Join businesses winning more government contracts with AI-powered intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-text mb-2">47,000+</div>
            <div className="text-sm text-text-muted">Active Tenders</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text mb-2">$3.2B</div>
            <div className="text-sm text-text-muted">Contract Value</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2,847</div>
            <div className="text-sm text-text-muted">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-success mb-2">95%</div>
            <div className="text-sm text-text-muted">Time Saved</div>
          </div>
        </div>
      </div>
    </section>
  );
}
