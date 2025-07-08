import { LogoTitle } from "../components/ui/LogoTitle";

export default function Test() {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Logo Test Page</h1>
      <div className="space-y-4">
        <LogoTitle size="text-sm" />
        <LogoTitle size="text-base" />
        <LogoTitle size="text-lg" />
        <LogoTitle size="text-xl" />
        <LogoTitle size="text-2xl" />
        <LogoTitle size="text-3xl" />
        <LogoTitle size="text-4xl" />
      </div>
    </div>
  );
}
