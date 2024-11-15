import { renderToStaticMarkup } from "react-dom/server";

export const getTooltipAttributes = ({
  text = "",
  showDelay,
  hideDelay,
  className,
  textClassName = "",
  textStyle = {},
}) => {
  if (!text) return {};

  const p = (
    <p
      style={{
        color: "white",
        fontSize: "14px",
        minWidth: "20px",
        lineHeight: "1.7",
        maxWidth: "min(80vw, 440px)",
        ...textStyle,
      }}
      className={textClassName}
    >
      {text}
    </p>
  );
  const html = renderToStaticMarkup(p);

  const tooltipAttrs = {
    "data-tooltip-id": "global-tooltip",
    "data-tip": "",
    "data-for": "global-tooltip",
    "data-tooltip-html": html,
  };

  if (showDelay) tooltipAttrs["data-tooltip-delay-show"] = showDelay;
  if (hideDelay) tooltipAttrs["data-tooltip-delay-hide"] = hideDelay;
  if (className) tooltipAttrs["data-tooltip-class-name"] = className;

  return tooltipAttrs;
};
