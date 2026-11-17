"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      variant="outline"
      className="fixed bottom-6 right-20 z-50 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity"
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
