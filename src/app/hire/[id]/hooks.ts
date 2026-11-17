import { useState, useEffect, useMemo, useRef } from "react";
import { mockFreelancers } from "@/lib/searchData";
import { Freelancer, ProjectForm } from "./types";

export const useFreelancer = (freelancerId: number) => {
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundFreelancer = mockFreelancers.find(
        (f) => f.id === freelancerId
      );
      setFreelancer(foundFreelancer || null);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [freelancerId]);

  return { freelancer, isLoading };
};

const durationHours = {
  "1-2 weeks": 40,
  "2-4 weeks": 80,
  "1-2 months": 160,
  "2-3 months": 240,
  "3+ months": 320,
};

const complexityMultipliers = {
  simple: 0.8,
  medium: 1.0,
  complex: 1.5,
  "very-complex": 2.0,
};

const teamMultipliers = {
  "1": 1.0,
  "2-3": 1.3,
  "4-5": 1.6,
  "6+": 2.0,
};

export const useProjectCalculator = (
  form: ProjectForm,
  freelancer: Freelancer | null
) => {
  // El costo es un valor derivado: useMemo en lugar de setState en useEffect.
  const estimatedCost = useMemo(() => {
    if (!freelancer) return 0;

    const baseHours =
      durationHours[form.duration as keyof typeof durationHours] || 80;
    const complexityMultiplier =
      complexityMultipliers[
        form.complexity as keyof typeof complexityMultipliers
      ] || 1.0;
    const teamMultiplier =
      teamMultipliers[form.teamSize as keyof typeof teamMultipliers] || 1.0;

    let totalCost =
      baseHours * freelancer.hourlyRate * complexityMultiplier * teamMultiplier;
    totalCost = Math.max(totalCost, 2800);

    return Math.round(totalCost);
  }, [freelancer, form.duration, form.complexity, form.teamSize]);

  // La animación es un efecto de "sistema externo" (timers): los setState
  // ocurren en callbacks asíncronos, no sincrónicos en el cuerpo del effect.
  const [calculatorAnimation, setCalculatorAnimation] = useState(false);
  const prevCostRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevCostRef.current === estimatedCost) return;
    prevCostRef.current = estimatedCost;

    const show = setTimeout(() => setCalculatorAnimation(true), 0);
    const hide = setTimeout(() => setCalculatorAnimation(false), 500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [estimatedCost]);

  return { estimatedCost, calculatorAnimation };
};
