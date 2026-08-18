import type { ReactNode } from "react";

const shapes: Record<string, ReactNode> = {
  home: <><path d="M4 11 12 4l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-6h4v6" /></>,
  inventory: <><path d="M12 3 20.5 7.5v9L12 21 3.5 16.5v-9Z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></>,
  customers: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20 4.5 15.5 9 14l4.5 1.5 1 4.5Z" /><circle cx="17" cy="9" r="2.2" /><path d="M14 20l.7-3.3L17 16l2.3.7.7 3.3" /></>,
  suppliers: <><rect x="2.5" y="7.5" width="10" height="8" rx="1" /><path d="M12.5 10h3.5l3 3.5v2.5h-6.5Z" /><circle cx="7" cy="18" r="1.6" /><circle cx="16.5" cy="18" r="1.6" /></>,
  orders: <><rect x="5" y="4" width="14" height="16" rx="1.6" /><rect x="9" y="2.5" width="6" height="3" rx="1" /><path d="M8 10h8M8 13.5h8M8 17h5" /></>,
  portal: <><path d="M3.5 9 5 4h14l1.5 5" /><path d="M3.5 9h17v10.5h-17Z" /><path d="M9.5 19.5v-5.5h5v5.5" /><path d="M7 9v1.5M12 9v1.5M17 9v1.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="7.5" /><path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3" /></>,
  spaces: <><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.4" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.4" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.4" /><rect x="13" y="13" width="7.5" height="7.5" rx="1.4" /></>,
  users: <><circle cx="12" cy="8" r="3.3" /><path d="M5 20 6 14.5 12 13l6 1.5 1 5.5Z" /></>,
  plans: <><path d="M12 3 21 8l-9 5-9-5Z" /><path d="M3 12l9 5 9-5" /><path d="M3 16l9 5 9-5" /></>,
  activity: <path d="M3 12h4l2-6 3 11 2-9 2 4h5" />,
  money: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14.5 12 8l3.5 6.5M9.8 12.3h4.4" /></>,
  profit: <><path d="M3 17 9 11 13 15 21 6" /><path d="M15 6h6v6" /></>,
  stock: <><rect x="4" y="4" width="16" height="4" rx="1" /><rect x="4" y="10" width="16" height="4" rx="1" /><rect x="4" y="16" width="10" height="4" rx="1" /></>,
  warning: <><path d="M12 3.5 21 20H3Z" /><path d="M12 9.5v4.5" /><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" /></>,
  storage: <><ellipse cx="12" cy="6" rx="7" ry="2.3" /><path d="M5 6v12M19 6v12" /><ellipse cx="12" cy="18" rx="7" ry="2.3" /></>,
  shield: <><path d="M12 3 19 6v6l-1 5-6 4.5-6-4.5-1-5V6Z" /><path d="m9 12 2 2 4-4.5" /></>,
  whatsapp: <><rect x="4.5" y="4.5" width="15" height="10.5" rx="2.5" /><path d="M8 15v3.5l4-3.5" /></>,
  copy: <><rect x="4" y="3.5" width="12.5" height="14" rx="1.8" /><rect x="7.5" y="7" width="12.5" height="14" rx="1.8" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5v17" /><path d="M5.5 7.5h13M5.5 16.5h13" /></>,
  check: <><circle cx="12" cy="12" r="8.5" /><path d="m8 12.3 2.6 2.6L16.5 9" /></>,
};

export function AppIcon({ name, className = "", label }: { name: string; className?: string; label?: string }) {
  const shape = shapes[name];
  if (!shape) {
    return <span className={`app-icon ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>{name.slice(0, 1).toUpperCase()}</span>;
  }
  return (
    <svg
      className={`app-icon ${className}`}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {shape}
    </svg>
  );
}
