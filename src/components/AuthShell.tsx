import React from "react";

interface AuthShellProps {
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children }) => (
  <div
    className="min-h-screen bg-bg flex items-center justify-center p-4 relative"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
        radial-gradient(circle at 15% 10%, rgba(245,166,35,0.07), transparent 40%),
        radial-gradient(circle at 85% 90%, rgba(42,217,197,0.05), transparent 45%)
      `,
      backgroundSize: "42px 42px, 42px 42px, 100% 100%, 100% 100%",
    }}
  >
    <div
      role="main"
      className="relative w-full max-w-[960px] overflow-hidden rounded-2xl shadow-2xl border border-panel-line bg-panel grid grid-cols-1 md:grid-cols-2 animate-fade-in-up"
    >
      {children}
    </div>
  </div>
);
