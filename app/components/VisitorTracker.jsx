"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      let visitorId = localStorage.getItem("edpharma_visitor");

      if (!visitorId) {
        visitorId = "visitor_" + Date.now();

        localStorage.setItem("edpharma_visitor", visitorId);

        await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitorId }),
        });
      }
    };

    trackVisitor();
  }, []);

  return null;
}