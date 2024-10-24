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
              item.jsx
            ) : (
              <p
                className="text"
                style={{ lineHeight: "1.5", color: "var(--var-color-label)" }}
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
