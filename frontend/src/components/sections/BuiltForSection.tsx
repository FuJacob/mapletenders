import { Users, Target, ChartBar, CheckCircle } from "@phosphor-icons/react";

export default function BuiltForSection() {
  return (
    <section className="min-h-screen flex items-center py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-32">
          <h2 className="text-7xl font-light mb-12 text-text leading-tight">
            Built for every type
            <br />
            <span className="text-primary font-bold">of business</span>
          </h2>
          <p className="text-3xl text-text-light max-w-4xl mx-auto">
            Whether you're a small business or enterprise organization
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          <div className="bg-background border border-border rounded-3xl p-16 text-center min-h-[600px] flex flex-col">
            <div className="flex justify-center mb-12">
              <Users className="w-24 h-24 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold mb-8 text-text">
              Small Businesses
            </h3>
            <p className="text-xl mb-12 text-text-light leading-relaxed flex-grow">
              Agile teams and growing companies competing for contracts under
              $100K
            </p>
            <ul className="text-xl space-y-6 text-left">
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Find niche opportunities others miss
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Compete on expertise, not resources
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Quick setup, immediate results
              </li>
            </ul>
          </div>

          <div className="bg-background border border-border rounded-3xl p-16 text-center min-h-[600px] flex flex-col">
            <div className="flex justify-center mb-12">
              <Target className="w-24 h-24 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold mb-8 text-text">
              Growing Companies
            </h3>
            <p className="text-xl mb-12 text-text-light leading-relaxed flex-grow">
              Established businesses ready to scale with larger government
              contracts
            </p>
            <ul className="text-xl space-y-6 text-left">
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Track multiple opportunities
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Team collaboration features
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Pipeline management tools
              </li>
            </ul>
          </div>

          <div className="bg-background border border-border rounded-3xl p-16 text-center min-h-[600px] flex flex-col">
            <div className="flex justify-center mb-12">
              <ChartBar className="w-24 h-24 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold mb-8 text-text">
              Enterprise Organizations
            </h3>
            <p className="text-xl mb-12 text-text-light leading-relaxed flex-grow">
              Large organizations managing complex procurement strategies
            </p>
            <ul className="text-xl space-y-6 text-left">
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Advanced analytics & reporting
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Multi-user access controls
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                Custom integrations available
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
