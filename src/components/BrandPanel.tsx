import React from "react";
import { LightningIcon, CheckIcon } from "../svg/index";
import { APP_TITLE, APP_VERSION } from "../lib/config";

const FEATURES = [
  { label: "Inloggen met Google of e-mail", tag: "oauth" },
  { label: "Profielfoto uploaden", tag: "storage" },
  { label: "Wachtwoord herstellen", tag: "reset" },
];

const TAGS = ["React", "Firebase", "Tailwind CSS"];

export const BrandPanel: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between p-6 sm:p-10 brand-bg border-b border-panel-line md:border-b-0 md:border-r">
      <div>
        <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center bg-linear-to-br from-amber to-amber-dark text-on-amber animate-pulse-glow">
          <LightningIcon className="w-6 h-6" />
        </div>

        <span className="block mt-8 font-mono text-xs tracking-[0.2em] text-amber">
          {`// ${APP_VERSION}`}
        </span>

        <p className="mt-3 font-display text-3xl font-bold tracking-tight text-text">
          {APP_TITLE}
        </p>
        <p className="mt-3 text-muted leading-relaxed">
          Een moderne authenticatie-demo, gebouwd met React, Firebase en
          Tailwind CSS.
        </p>
      </div>

      <div>
        <ul className="space-y-4">
          {FEATURES.map((feature) => (
            <li key={feature.tag} className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm text-text">
                <span className="w-6 h-6 rounded-md bg-amber/15 text-amber flex items-center justify-center shrink-0">
                  <CheckIcon className="w-3.5 h-3.5" />
                </span>
                {feature.label}
              </span>
              <span className="font-mono text-xs text-muted-dim">
                {feature.tag}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-10 pt-6 border-t border-panel-line font-mono text-xs text-muted-dim hidden sm:block">
          {TAGS.join(" · ")}
        </p>
      </div>
    </div>
  );
};
