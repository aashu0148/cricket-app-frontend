import React from "react";

import { FAQs } from "../LandingPage/landingCopy";

function FaqPage() {
  return (
    <div className={`page-container`}>
      <p className="heading-big">FAQs</p>

      <div className="flex-col-xs gap-md">
        {FAQs.map((item) => (
          <div className="flex-col-xs" key={item.question}>
            <p className="title">{item.question}</p>

            {item.jsx ? (
              <div style={{ color: "var(--var-color-label)" }}>{item.jsx}</div>
            ) : (
              <p
                className="text"
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5",
                  color: "var(--var-color-label)",
                }}
              >
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqPage;
