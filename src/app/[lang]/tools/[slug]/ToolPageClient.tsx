"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getToolBySlug } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

// Tool component imports — English
import SpringGardenPlanner from "@/components/tools/en/spring-garden-planner";
import LawnCareEstimator from "@/components/tools/en/lawn-care-estimator";
import SpringCleaningChecklist from "@/components/tools/en/spring-cleaning-checklist";
import DeclutterPlanGenerator from "@/components/tools/en/declutter-plan-generator";
import AllergySeasonPrep from "@/components/tools/en/allergy-season-prep";
import CouchTo5KPlan from "@/components/tools/en/couch-to-5k-plan";
import OutdoorWorkoutGenerator from "@/components/tools/en/outdoor-workout-generator";
import CapsuleWardrobeBuilder from "@/components/tools/en/capsule-wardrobe-builder";
import SpringMealPrepPlanner from "@/components/tools/en/spring-meal-prep-planner";
import SpringPetCareChecklist from "@/components/tools/en/spring-pet-care-checklist";

// Tool component imports — Korean
import KrGardenPlanner from "@/components/tools/ko/kr-spring-garden-planner-v2";
import KrLawnCareEstimator from "@/components/tools/ko/kr-lawn-care-estimator";
import KrSpringCleaning from "@/components/tools/ko/kr-spring-cleaning-checklist";
import KrDeclutterPlan from "@/components/tools/ko/kr-declutter-plan";
import KrAllergyPrep from "@/components/tools/ko/kr-allergy-prep";
import KrCouchTo5K from "@/components/tools/ko/kr-couch-to-5k";
import KrOutdoorWorkout from "@/components/tools/ko/kr-outdoor-workout";
import KrCapsuleWardrobe from "@/components/tools/ko/kr-capsule-wardrobe";
import KrMealPrep from "@/components/tools/ko/kr-meal-prep";
import KrPetCare from "@/components/tools/ko/kr-pet-care";

const componentMap: Record<string, Record<string, React.ComponentType>> = {
  en: {
    "garden-planner": SpringGardenPlanner,
    "lawn-care": LawnCareEstimator,
    "spring-cleaning": SpringCleaningChecklist,
    "declutter-plan": DeclutterPlanGenerator,
    "allergy-prep": AllergySeasonPrep,
    "couch-to-5k": CouchTo5KPlan,
    "outdoor-workout": OutdoorWorkoutGenerator,
    "capsule-wardrobe": CapsuleWardrobeBuilder,
    "meal-prep": SpringMealPrepPlanner,
    "pet-care": SpringPetCareChecklist,
  },
  ko: {
    "garden-planner": KrGardenPlanner,
    "lawn-care": KrLawnCareEstimator,
    "spring-cleaning": KrSpringCleaning,
    "declutter-plan": KrDeclutterPlan,
    "allergy-prep": KrAllergyPrep,
    "couch-to-5k": KrCouchTo5K,
    "outdoor-workout": KrOutdoorWorkout,
    "capsule-wardrobe": KrCapsuleWardrobe,
    "meal-prep": KrMealPrep,
    "pet-care": KrPetCare,
  },
};

export default function ToolPageClient() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const slug = params.slug as string;
  const dict = getDictionary(lang);
  const tool = getToolBySlug(slug);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center spring-gradient">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === "ko" ? "도구를 찾을 수 없습니다" : "Tool not found"}
          </h1>
          <Link
            href={`/${lang}`}
            className="text-spring-green-600 hover:underline"
          >
            {lang === "ko" ? "홈으로 돌아가기" : "Go back home"}
          </Link>
        </div>
      </div>
    );
  }

  const ToolComponent = componentMap[lang]?.[slug];

  if (!ToolComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center spring-gradient">
        <div className="text-center">
          <p className="text-6xl mb-4">🚧</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === "ko" ? "준비 중입니다" : "Coming Soon"}
          </h1>
          <p className="text-gray-500 mb-4">{tool[lang].name}</p>
          <Link
            href={`/${lang}`}
            className="text-spring-green-600 hover:underline"
          >
            {lang === "ko" ? "홈으로 돌아가기" : "Go back home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={`/${lang}`} className="hover:text-spring-green-600 transition-colors">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <Link href={`/${lang}#tools`} className="hover:text-spring-green-600 transition-colors">
              {dict.nav.tools}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{tool[lang].name}</span>
          </nav>
        </div>
      </div>

      {/* Tool Component */}
      <ToolComponent />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: 22,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.3s, transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
