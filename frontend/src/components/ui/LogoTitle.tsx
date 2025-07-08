export function LogoTitle({ size = "text-2xl" }: { size?: string }) {
  const sizeMap: Record<string, string> = {
    "text-sm": "w-4 h-4",
    "text-base": "w-5 h-5",
    "text-lg": "w-6 h-6",
    "text-xl": "w-7 h-7",
    "text-2xl": "w-8 h-8",
    "text-3xl": "w-9 h-9",
    "text-4xl": "w-10 h-10",
  };

  const iconSize = sizeMap[size] || "w-12 h-12";

  return (
    <div className="flex items-center gap-2">
      <img src="logo.svg" className={iconSize} />
      <p className={`font-bold text-primary ${size}`}>
        <span className="font-light"> maple</span>Bids
      </p>
    </div>
  );
}
