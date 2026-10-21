"use client";

import { PhoneIcon, RadioIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { agencies, programs } from "@/data/constants";
import { hotlines } from "@/data/constants";
import { useI18n } from "@/lib/i18n";

const quickDials = hotlines
  .map((hotline) => ({
    agency: hotline.agency.split(" (")[0],
    number: hotline.numbers[0]?.label,
  }))
  .filter((entry) => entry.number);

const Ticker: FC = () => {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (quickDials.length === 0) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quickDials.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = quickDials[index];
  if (!current) return null;

  return (
    <div className="bg-blue-950 text-white py-1.5 print:hidden">
      <div className="container mx-auto px-4 flex justify-end">
        <div className="flex justify-end items-center w-full">
          {/* Rotating hotline quick-dial */}
          <div className="flex-1 overflow-hidden pr-4">
            <div className="relative h-6 flex items-center">
              <div
                className={`flex items-center transition-all duration-200 ${
                  isAnimating
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <div className="inline-flex items-center space-x-1.5">
                  <span className="text-accent-200">
                    <PhoneIcon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium">{current.agency}</span>
                  <span className="text-xs text-accent-100">{current.number}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Directory snapshot */}
          <div className="flex items-center space-x-6 pl-4 border-l border-accent-500">
            <span className="hidden sm:flex items-center space-x-2">
              <span className="text-xs font-medium text-accent-100">
                {t("navbar.browseAll")}
              </span>
              <span className="text-xs text-white">{programs.length}</span>
            </span>
            <span className="flex items-center space-x-2">
              <RadioIcon className="h-3 w-3 text-accent-100" />
              <span className="text-xs text-accent-100">
                {agencies.length} {t("filters.agency")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
