import React from "react";

import styles from "./BreadCrumbs.module.scss";

/**
 * BreadCrumbs component renders a breadcrumb navigation element.
 *
 * @component
 * @example
 * const links = [
 *   { value: 'home', label: 'Home' },
 *   { value: 'products', label: 'Products' },
 *   { value: 'item', label: 'Item', static: true }
 * ];
 * function handleClick(event, value) {
 *   console.log(`Breadcrumb clicked: ${value}`);
 * }
 *
 * return (
 *   <BreadCrumbs
 *     className="custom-class"
 *     links={links}
 *     onClick={handleClick}
 *   />
 * );
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.style - Component style.
 * @param {string} [props.className=""] - Additional class name for the breadcrumb container.
 * @param {Array} [props.links=[]] - Array of link objects representing each breadcrumb.
 * @param {string} props.links[].value - Unique identifier for the breadcrumb.
 * @param {string} props.links[].label - Display text for the breadcrumb.
 * @param {boolean} [props.links[].static=false] - If true, the breadcrumb is not clickable.
 * @param {function} props.onClick - Callback function triggered when a clickable breadcrumb is clicked.
 *
 * @returns {React.ReactElement} The rendered breadcrumb navigation.
 */
function BreadCrumbs({ className = "", style = {}, links = [], onClick }) {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      {links.map((item, i) => (
        <React.Fragment key={item.value}>
          <span
            className={`${styles.item} ${item.static ? "" : styles.link}`}
            onClick={(e) => (item.static ? "" : onClick(e, item.value))}
          >
            {item.label?.length > 40
              ? item.label.slice(0, 38) + "..."
              : item.label}
          </span>
          {i === links.length - 1 ? (
            ""
          ) : (
            <span className={styles.item}>{">"}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default BreadCrumbs;
