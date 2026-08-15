const symbols: Record<string, string> = {
  home: "⌂",
  inventory: "▦",
  customers: "♙",
  suppliers: "◇",
  orders: "▤",
  portal: "◉",
  settings: "⊙",
  spaces: "▦",
  users: "♙",
  plans: "▥",
  activity: "◎",
  money: "$",
  profit: "↗",
  stock: "▦",
  warning: "!",
  storage: "▤",
  shield: "✓",
};

export function AppIcon({ name, className = "", label }: { name: string; className?: string; label?: string }) {
  return <span className={`app-icon ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>{symbols[name] ?? name.slice(0, 1).toUpperCase()}</span>;
}
