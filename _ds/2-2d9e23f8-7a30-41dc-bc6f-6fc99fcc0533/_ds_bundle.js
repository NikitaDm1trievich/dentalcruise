/* @ds-bundle: {"format":4,"namespace":"Ds2_2d9e23","components":[{"name":"AdvantageCarousel","sourcePath":"components/content/AdvantageCarousel.jsx"},{"name":"BrandsMarquee","sourcePath":"components/content/BrandsMarquee.jsx"},{"name":"ComparisonColumns","sourcePath":"components/content/ComparisonColumns.jsx"},{"name":"DoctorCard","sourcePath":"components/content/DoctorCard.jsx"},{"name":"FaqAccordion","sourcePath":"components/content/FaqAccordion.jsx"},{"name":"PlaceCard","sourcePath":"components/content/PlaceCard.jsx"},{"name":"PriceCompare","sourcePath":"components/content/PriceCompare.jsx"},{"name":"PromoBoard","sourcePath":"components/content/PromoBoard.jsx"},{"name":"ReviewsCard","sourcePath":"components/content/ReviewsCard.jsx"},{"name":"ServiceCard","sourcePath":"components/content/ServiceCard.jsx"},{"name":"ServiceFlipCard","sourcePath":"components/content/ServiceFlipCard.jsx"},{"name":"StaticMap","sourcePath":"components/content/StaticMap.jsx"},{"name":"TrustBar","sourcePath":"components/content/TrustBar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Reveal","sourcePath":"components/core/Reveal.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"AppointmentForm","sourcePath":"components/forms/AppointmentForm.jsx"},{"name":"AppointmentModal","sourcePath":"components/forms/AppointmentModal.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"OceanHero","sourcePath":"components/media/OceanHero.jsx"},{"name":"PhotoPlaceholder","sourcePath":"components/media/PhotoPlaceholder.jsx"},{"name":"WaveField","sourcePath":"components/media/WaveField.jsx"},{"name":"BurgerMenu","sourcePath":"components/navigation/BurgerMenu.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Header","sourcePath":"components/navigation/Header.jsx"},{"name":"Logo","sourcePath":"components/navigation/Logo.jsx"}],"sourceHashes":{"components/content/AdvantageCarousel.jsx":"b77fbe9f8d91","components/content/BrandsMarquee.jsx":"683e5bacb9c0","components/content/ComparisonColumns.jsx":"aa8ca5ff5bd1","components/content/DoctorCard.jsx":"5e1d7412cbf4","components/content/FaqAccordion.jsx":"9aa450429ac1","components/content/PlaceCard.jsx":"5aba9b8aa6c1","components/content/PriceCompare.jsx":"0e0f15b8ec6e","components/content/PromoBoard.jsx":"841a83d3d51b","components/content/ReviewsCard.jsx":"e8a6abd0603d","components/content/ServiceCard.jsx":"08063645cedc","components/content/ServiceFlipCard.jsx":"e77a61fd040b","components/content/StaticMap.jsx":"edb74d12f485","components/content/TrustBar.jsx":"a89564419533","components/core/Badge.jsx":"47b61b32b50f","components/core/Button.jsx":"caa84adb12f0","components/core/IconButton.jsx":"0b430cbff255","components/core/Reveal.jsx":"df7ba05da053","components/core/SectionHeading.jsx":"169b31c4ac79","components/forms/AppointmentForm.jsx":"256ef3ae13f6","components/forms/AppointmentModal.jsx":"84a3587a9772","components/forms/Checkbox.jsx":"44b3fcbfbd9c","components/forms/Input.jsx":"0cfa50b7540c","components/icons/Icon.jsx":"3b2f9c681f76","components/media/OceanHero.jsx":"e8de0f92fead","components/media/PhotoPlaceholder.jsx":"75a3cd58293f","components/media/WaveField.jsx":"e549f432fce1","components/navigation/BurgerMenu.jsx":"e0bd5d4349e3","components/navigation/Footer.jsx":"027ba29a0fd6","components/navigation/Header.jsx":"59045b3173b3","components/navigation/Logo.jsx":"5320a2771db9","ui_kits/landing/LandingPage.jsx":"a3dc1c9463ba","ui_kits/landing/SectionsA.jsx":"4adc01d56ae9","ui_kits/landing/SectionsB.jsx":"10e2f0a4d631"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.Ds2_2d9e23 = window.Ds2_2d9e23 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/BrandsMarquee.jsx
try { (() => {
function BrandsMarquee({
  eyebrow = 'Материалы и поставщики',
  brands = [],
  speed = 38,
  style
}) {
  const row = [...brands, ...brands];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes dc-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}'), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      textAlign: 'center'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
      WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: 'max-content',
      gap: 'clamp(32px,6vw,80px)',
      alignItems: 'center',
      animation: `dc-marquee ${speed}s linear infinite`
    }
  }, row.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    title: b.note || b.name,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(1.1rem,2.2vw,1.6rem)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-display)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      opacity: .78
    }
  }, b.logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: b.logoSrc,
    alt: b.name,
    style: {
      height: 34,
      width: 'auto'
    }
  }) : b.name)))));
}
Object.assign(__ds_scope, { BrandsMarquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/BrandsMarquee.jsx", error: String((e && e.message) || e) }); }

// components/content/PriceCompare.jsx
try { (() => {
function PriceCompare({
  label,
  marketLabel = 'В среднем по Москве',
  marketPrice,
  ourLabel = 'У нас',
  ourPrice,
  note,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      padding: 'var(--space-8)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-md)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "dc-eyebrow",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-muted)'
    }
  }, marketLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-h3)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-muted)',
      textDecoration: 'line-through',
      textDecorationThickness: '2px'
    }
  }, marketPrice)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-accent)'
    }
  }, ourLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-price)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      lineHeight: 1.05
    }
  }, ourPrice))), note && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      maxWidth: 'min(var(--measure),100%)'
    }
  }, note));
}
Object.assign(__ds_scope, { PriceCompare });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PriceCompare.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = 'quiet',
  children,
  style,
  ...rest
}) {
  const tones = {
    quiet: {
      background: 'var(--dc-sea-glass)',
      color: 'var(--text-strong)'
    },
    accent: {
      background: 'var(--cta-bg)',
      color: 'var(--cta-fg)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      boxShadow: 'inset 0 0 0 1px var(--line-strong)'
    },
    onDark: {
      background: 'rgba(255,255,255,.12)',
      color: 'var(--text-on-dark)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '7px 14px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      lineHeight: 1.2,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  lg: {
    padding: '18px 30px',
    fontSize: 'var(--type-body-lg)',
    minHeight: '56px'
  },
  md: {
    padding: '14px 24px',
    fontSize: 'var(--type-body)',
    minHeight: 'var(--tap-min)'
  },
  sm: {
    padding: '10px 18px',
    fontSize: 'var(--type-small)',
    minHeight: '40px'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  fullWidth = false,
  icon,
  iconRight,
  children,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-bold)',
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius-pill)',
    border: 'var(--border-width-strong) solid transparent',
    cursor: 'pointer',
    textDecoration: 'none',
    lineHeight: 1.1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out)',
    transform: p ? 'scale(.975)' : 'none',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: h ? 'var(--cta-bg-hover)' : 'var(--cta-bg)',
      color: 'var(--cta-fg)',
      boxShadow: h ? 'var(--shadow-cta)' : 'var(--shadow-sm)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: h ? 'var(--dc-depths)' : 'var(--line-strong)'
    },
    ghost: {
      background: h ? 'rgba(4,48,65,.06)' : 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'transparent'
    },
    onDark: {
      background: h ? 'rgba(255,255,255,.14)' : 'transparent',
      color: 'var(--text-on-dark)',
      borderColor: 'var(--line-on-dark)'
    },
    solidDark: {
      background: h ? 'var(--dc-depths-700)' : 'var(--dc-depths)',
      color: 'var(--text-on-dark)'
    }
  };
  const Tag = href ? 'a' : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false)
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  label,
  variant = 'light',
  size = 48,
  href,
  children,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const variants = {
    light: {
      background: h ? 'var(--dc-white)' : 'rgba(255,255,255,.72)',
      color: 'var(--text-strong)',
      border: '1px solid var(--line-hairline)'
    },
    accent: {
      background: h ? 'var(--cta-bg-hover)' : 'var(--cta-bg)',
      color: 'var(--cta-fg)',
      border: '1px solid transparent'
    },
    onDark: {
      background: h ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.08)',
      color: 'var(--text-on-dark)',
      border: '1px solid var(--line-on-dark)'
    },
    bare: {
      background: h ? 'rgba(4,48,65,.06)' : 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid transparent'
    }
  };
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    "aria-label": label,
    title: label,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      flex: '0 0 auto',
      transition: 'background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)',
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Reveal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Reveal({
  delay = 0,
  shift,
  as = 'div',
  children,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      threshold: .14,
      rootMargin: '0px 0px -8% 0px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    style: {
      minWidth: 0,
      opacity: seen ? 1 : 0,
      transform: seen ? 'none' : `translateY(${shift != null ? shift + 'px' : 'var(--reveal-shift)'})`,
      transition: `opacity var(--dur-slow) var(--ease-out) ${delay}ms, transform var(--dur-slow) var(--ease-out) ${delay}ms`,
      willChange: 'opacity,transform',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Reveal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Reveal.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  onDark = false,
  style,
  children
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      textAlign: align,
      justifyItems: align === 'center' ? 'center' : 'start',
      maxWidth: align === 'center' ? '860px' : 'none',
      marginInline: align === 'center' ? 'auto' : 0,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--type-display)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--text-on-dark)' : 'var(--text-strong)',
      margin: 0
    }
  }, title), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--type-lead)',
      lineHeight: 'var(--lh-body)',
      maxWidth: 'min(var(--measure),100%)',
      color: onDark ? 'var(--text-on-dark-muted)' : 'var(--text-body)'
    }
  }, lead), children);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  type = 'text',
  hint,
  id,
  style,
  ...rest
}) {
  const uid = React.useId();
  const fid = id || uid;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    type: type
  }, rest, {
    style: {
      minHeight: 'var(--tap-min)',
      padding: '12px 16px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-body)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-strong)',
      borderRadius: 'var(--radius-md)',
      outlineOffset: '2px',
      width: '100%'
    }
  })), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-small)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Renders a Lucide glyph from the Lucide UMD build (window.lucide).
   Load it once per page:
   <script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script>
   Brand-specific marks (logo, VK, Max) are SVG files in /assets, not Lucide. */
function Icon({
  name,
  size = 22,
  strokeWidth = 1.75,
  color = 'currentColor',
  style,
  ...rest
}) {
  const [, tick] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.lucide && window.lucide.icons) return;
    const t = setInterval(() => {
      if (window.lucide && window.lucide.icons) {
        clearInterval(t);
        tick();
      }
    }, 80);
    return () => clearInterval(t);
  }, []);
  const key = name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
  const lib = typeof window !== 'undefined' && window.lucide ? window.lucide.icons || window.lucide : null;
  const node = lib ? lib[key] : null;
  let raw = [];
  if (Array.isArray(node)) raw = Array.isArray(node[0]) ? node : Array.isArray(node[2]) ? node[2] : [];else if (node && Array.isArray(node.children)) raw = node.children;
  const children = raw.map(c => Array.isArray(c) ? {
    tag: c[0],
    attrs: c[1]
  } : {
    tag: c.tag,
    attrs: c.attrs
  }).filter(c => typeof c.tag === 'string');
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flex: '0 0 auto',
      display: 'block',
      ...style
    }
  }, rest), children.map((c, i) => React.createElement(c.tag, {
    key: i,
    ...(c.attrs || {})
  })));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/ComparisonColumns.jsx
try { (() => {
function ComparisonColumns({
  theirTitle = 'Обычная клиника',
  theirItems = [],
  ourTitle = 'Дентал Круиз',
  ourItems = [],
  style
}) {
  const col = (title, items, ours) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      alignContent: 'start',
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      minWidth: 0,
      background: ours ? 'var(--surface-card)' : 'var(--dc-seashell)',
      border: ours ? '2px solid var(--dc-turquoise)' : '1px solid var(--line-hairline)',
      color: 'var(--text-body)',
      boxShadow: ours ? 'var(--shadow-lg)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--type-h3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, items.map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      fontSize: 'var(--type-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ours ? 'check' : 'minus',
    size: 22,
    strokeWidth: 2.4,
    color: ours ? 'var(--dc-turquoise-ink)' : 'var(--text-muted)',
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("span", null, t)))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
      ...style
    }
  }, col(theirTitle, theirItems, false), col(ourTitle, ourItems, true));
}
Object.assign(__ds_scope, { ComparisonColumns });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ComparisonColumns.jsx", error: String((e && e.message) || e) }); }

// components/content/FaqAccordion.jsx
try { (() => {
function FaqAccordion({
  items = [],
  style
}) {
  const [open, setOpen] = React.useState(-1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      ...style
    }
  }, items.map((it, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'box-shadow var(--dur-mid) var(--ease-out)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      "aria-expanded": isOpen,
      style: {
        width: '100%',
        display: 'flex',
        gap: 'var(--space-4)',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'left',
        padding: 'var(--space-5) var(--space-6)',
        minHeight: 'var(--tap-min)',
        background: 'transparent',
        border: 0,
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--type-body-lg)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, /*#__PURE__*/React.createElement("span", null, it.q), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-down",
      size: 24,
      color: "var(--text-accent)",
      strokeWidth: 2.2,
      style: {
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform var(--dur-mid) var(--ease-out)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows var(--dur-mid) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        padding: '0 var(--space-6) var(--space-6)',
        color: 'var(--text-body)',
        maxWidth: 'min(var(--measure),100%)'
      }
    }, it.a))));
  }));
}
Object.assign(__ds_scope, { FaqAccordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FaqAccordion.jsx", error: String((e && e.message) || e) }); }

// components/content/PlaceCard.jsx
try { (() => {
function PlaceCard({
  name = 'Дентал Круиз',
  address = 'Москва, 4-я Магистральная, 5с1, 2 этаж',
  metro = '5 минут пешком от м. Полежаевская',
  schedule = 'Пн–Сб 10:00–22:00 · Вс — выходной',
  phone = '+7 925 577-76-77',
  phoneHref = 'tel:+79255777677',
  email = 'dental.cruise@inbox.ru',
  routeHref = 'https://yandex.ru/maps/org/dental_kruiz/154025048590/',
  style
}) {
  const row = (icon, main, sub) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22,
    color: "var(--text-accent)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: '2px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, main), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 'var(--type-small)'
    }
  }, sub)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      padding: 'var(--space-8)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      alignContent: 'start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--type-h3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)'
    }
  }, name), row('map-pin', address, metro), row('clock', schedule), row('mail', email), /*#__PURE__*/React.createElement("a", {
    href: phoneHref,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-h3)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      textDecoration: 'none'
    }
  }, phone), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 Max",
    href: "#max"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "message-circle",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 Telegram",
    href: "#tg"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "send",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    href: routeHref,
    icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "navigation",
      size: 18
    })
  }, "\u041A\u0430\u043A \u0434\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F")));
}
Object.assign(__ds_scope, { PlaceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PlaceCard.jsx", error: String((e && e.message) || e) }); }

// components/content/PromoBoard.jsx
try { (() => {
function PromoBoard({
  eyebrow = 'Акции месяца',
  title = 'Цены, которые видно сразу',
  items = [],
  note,
  ctaLabel = 'Записаться по акции',
  onCta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--dc-coral)',
      borderRadius: 'var(--radius-xl)',
      padding: 'clamp(24px,4vw,48px)',
      color: 'var(--text-on-coral)',
      boxShadow: '0 18px 44px rgba(224,58,58,.22)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.9)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-h2)',
      fontWeight: 'var(--fw-bold)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: 'var(--text-on-coral)',
      margin: 0
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))'
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.title,
    style: {
      minWidth: 0,
      display: 'grid',
      gap: 'var(--space-2)',
      alignContent: 'start',
      background: 'var(--dc-white)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-muted)'
    }
  }, it.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-price)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--dc-coral)',
      lineHeight: 1.05
    }
  }, it.price), it.was && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-muted)',
      textDecoration: 'line-through',
      textDecorationThickness: '2px'
    }
  }, it.was), it.note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-small)',
      color: 'var(--text-body)'
    }
  }, it.note)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-5)',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, note && /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '46ch',
      color: 'rgba(255,255,255,.94)',
      fontWeight: 'var(--fw-medium)'
    }
  }, note), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "lg",
    onClick: onCta,
    icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "phone",
      size: 20
    }),
    style: {
      background: 'var(--dc-white)',
      color: 'var(--dc-coral)',
      boxShadow: 'var(--shadow-md)'
    }
  }, ctaLabel))));
}
Object.assign(__ds_scope, { PromoBoard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PromoBoard.jsx", error: String((e && e.message) || e) }); }

// components/content/ReviewsCard.jsx
try { (() => {
function ReviewsCard({
  rating = 4.9,
  count,
  href = 'https://yandex.ru/maps/org/dental_kruiz/154025048590/',
  note = 'Мы не публикуем придуманные отзывы — читайте настоящие в карточке клиники на Яндекс Картах.',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      justifyItems: 'start',
      padding: 'var(--space-8)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-price)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      lineHeight: 1
    }
  }, rating.toString().replace('.', ',')), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 2
    },
    "aria-label": 'Рейтинг ' + rating + ' из 5'
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    key: i,
    name: "star",
    size: 24,
    strokeWidth: 1.5,
    color: i < Math.round(rating) ? 'var(--dc-turquoise)' : 'var(--dc-white-caps)',
    style: {
      fill: i < Math.round(rating) ? 'var(--dc-turquoise)' : 'transparent'
    }
  }))), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)'
    }
  }, count, " \u043E\u0442\u0437\u044B\u0432\u043E\u0432")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      maxWidth: 'min(var(--measure),100%)'
    }
  }, note), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    href: href,
    iconRight: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-up-right",
      size: 20
    })
  }, "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043E\u0442\u0437\u044B\u0432\u044B \u043D\u0430 \u042F\u043D\u0434\u0435\u043A\u0441 \u041A\u0430\u0440\u0442\u0430\u0445"));
}
Object.assign(__ds_scope, { ReviewsCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ReviewsCard.jsx", error: String((e && e.message) || e) }); }

// components/content/StaticMap.jsx
try { (() => {
/* Static, non-interactive map illustration drawn from the clinic's real coordinates
   (55.774426, 37.520284 — Khoroshyovsky district, Moscow). On the production site this
   block is replaced by the live Yandex Maps widget. */
function StaticMap({
  label = 'Дентал Круиз',
  caption = '4-я Магистральная, 5с1 · м. Полежаевская',
  href = 'https://yandex.ru/maps/org/dental_kruiz/154025048590/',
  ratio = '4 / 3',
  style
}) {
  const road = a => ({
    position: 'absolute',
    background: 'var(--dc-seashell)',
    ...a
  });
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      position: 'relative',
      display: 'block',
      aspectRatio: ratio,
      overflow: 'hidden',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--dc-breeze)',
      boxShadow: 'var(--shadow-md)',
      textDecoration: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: road({
      left: 0,
      right: 0,
      top: '38%',
      height: '6%',
      transform: 'rotate(-3deg)'
    })
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: road({
      left: 0,
      right: 0,
      top: '72%',
      height: '4%'
    })
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: road({
      top: 0,
      bottom: 0,
      left: '26%',
      width: '5%'
    })
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: road({
      top: 0,
      bottom: 0,
      left: '68%',
      width: '3%',
      transform: 'rotate(4deg)'
    })
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '6%',
      top: '8%',
      width: '16%',
      height: '22%',
      background: 'var(--dc-sea-glass)',
      borderRadius: 'var(--radius-sm)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '8%',
      bottom: '10%',
      width: '20%',
      height: '18%',
      background: 'var(--dc-sea-glass)',
      borderRadius: 'var(--radius-sm)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '34%',
      top: '44%',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: '8px 14px 8px 10px',
      background: 'var(--dc-depths)',
      color: 'var(--text-on-dark)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-lg)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 18,
    color: "var(--dc-turquoise)"
  }), label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 'var(--space-4) var(--space-5)',
      background: 'var(--glass-light)',
      backdropFilter: 'var(--blur-glass)',
      color: 'var(--text-strong)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, caption), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 18
  })));
}
Object.assign(__ds_scope, { StaticMap });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StaticMap.jsx", error: String((e && e.message) || e) }); }

// components/content/TrustBar.jsx
try { (() => {
function TrustBar({
  items = [],
  tone = 'light',
  style
}) {
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: dark ? 'var(--surface-dark)' : 'var(--surface-quiet)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-8)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))'
    }
  }, items.map(it => {
    const Tag = it.href ? 'a' : 'div';
    return /*#__PURE__*/React.createElement(Tag, {
      key: it.title,
      href: it.href,
      style: {
        minWidth: 0,
        display: 'grid',
        gap: 'var(--space-3)',
        alignContent: 'start',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        background: dark ? 'var(--surface-dark-lift)' : 'var(--surface-card)',
        border: '1px solid ' + (dark ? 'var(--line-on-dark)' : 'var(--line-hairline)'),
        boxShadow: dark ? 'none' : 'var(--shadow-sm)',
        textDecoration: 'none',
        color: dark ? 'var(--text-on-dark)' : 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon || 'shield-check',
      size: 30,
      strokeWidth: 1.6,
      color: dark ? 'var(--dc-turquoise)' : 'var(--text-accent)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--type-h4)',
        color: dark ? 'var(--text-on-dark)' : 'var(--text-strong)'
      }
    }, it.title), it.text && /*#__PURE__*/React.createElement("span", {
      style: {
        color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)',
        fontSize: 'var(--type-small)'
      }
    }, it.text));
  })));
}
Object.assign(__ds_scope, { TrustBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/TrustBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  onChange,
  id,
  style,
  ...rest
}) {
  const uid = React.useId();
  const fid = id || uid;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      cursor: 'pointer',
      fontSize: 'var(--type-small)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    type: "checkbox",
    checked: checked,
    onChange: onChange
  }, rest, {
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 26,
      height: 26,
      flex: '0 0 auto',
      display: 'grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-sm)',
      background: checked ? 'var(--cta-bg)' : 'var(--surface-card)',
      border: '2px solid ' + (checked ? 'var(--cta-bg)' : 'var(--line-strong)'),
      transition: 'background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out)'
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 18,
    color: "var(--cta-fg)",
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/AppointmentForm.jsx
try { (() => {
function AppointmentForm({
  onSubmitted,
  compact = false,
  style
}) {
  const [ok, setOk] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  if (sent) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      justifyItems: 'start',
      padding: 'var(--space-6)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-inset-line)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check-circle",
    size: 34,
    color: "var(--text-accent)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--type-h3)'
    }
  }, "\u0417\u0430\u044F\u0432\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)'
    }
  }, "\u041C\u044B \u043F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u043C \u0432\u0430\u043C \u0432 \u0440\u0430\u0431\u043E\u0447\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u0438 \u043F\u043E\u0434\u0431\u0435\u0440\u0451\u043C \u0443\u0434\u043E\u0431\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u043F\u0440\u0438\u0451\u043C\u0430."));
  return /*#__PURE__*/React.createElement("form", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      ...style
    },
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
      onSubmitted && onSubmitted();
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "\u0412\u0430\u0448\u0435 \u0438\u043C\u044F",
    name: "name",
    required: true,
    autoComplete: "name"
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "\u041A\u0430\u043A \u0441 \u0432\u0430\u043C\u0438 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F",
    name: "contact",
    type: "tel",
    required: true,
    hint: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0438\u043B\u0438 Max"
  }), !compact && /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "\u041A\u043E\u0433\u0434\u0430 \u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0435\u0442\u0435 \u043F\u0440\u0438\u0439\u0442\u0438",
    name: "date",
    type: "date"
  }), /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: ok,
    onChange: e => setOk(e.target.checked),
    required: true,
    label: "\u0421\u043E\u0433\u043B\u0430\u0441\u0435\u043D \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445"
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit",
    variant: "primary",
    size: "lg",
    fullWidth: true
  }, "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443"));
}
Object.assign(__ds_scope, { AppointmentForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/AppointmentForm.jsx", error: String((e && e.message) || e) }); }

// components/forms/AppointmentModal.jsx
try { (() => {
function AppointmentModal({
  open = false,
  onClose,
  title = 'Записаться на приём',
  note = 'Оставьте контакт — мы перезвоним и подберём удобное время.'
}) {
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": !open,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--gutter)',
      background: 'rgba(2,32,41,.62)',
      backdropFilter: 'blur(3px)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--dur-mid) var(--ease-out)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(520px,100%)',
      maxHeight: '90svh',
      overflowY: 'auto',
      background: 'var(--surface-page)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-8)',
      boxShadow: 'var(--shadow-lg)',
      transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(.98)',
      transition: 'transform var(--dur-mid) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--type-h2)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)'
    }
  }, note)), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    variant: "bare",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 24
  }))), /*#__PURE__*/React.createElement(__ds_scope.AppointmentForm, null)));
}
Object.assign(__ds_scope, { AppointmentModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/AppointmentModal.jsx", error: String((e && e.message) || e) }); }

// components/media/PhotoPlaceholder.jsx
try { (() => {
function PhotoPlaceholder({
  label = 'Здесь реальное фото',
  ratio = '4 / 3',
  src,
  alt = '',
  radius = 'var(--radius-xl)',
  tone = 'light',
  style
}) {
  const dark = tone === 'dark';
  if (src) return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      aspectRatio: ratio,
      objectFit: 'cover',
      borderRadius: radius,
      display: 'block',
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    role: "img",
    "aria-label": label,
    style: {
      width: '100%',
      aspectRatio: ratio,
      borderRadius: radius,
      display: 'grid',
      placeItems: 'center',
      gap: 'var(--space-3)',
      textAlign: 'center',
      padding: 'var(--space-6)',
      background: dark ? 'var(--grad-deep)' : 'var(--grad-shallow)',
      boxShadow: dark ? 'none' : 'var(--shadow-inset-line)',
      color: dark ? 'var(--text-on-dark)' : 'var(--text-strong)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "image",
    size: 30,
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      maxWidth: '24ch'
    }
  }, label));
}
Object.assign(__ds_scope, { PhotoPlaceholder });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/PhotoPlaceholder.jsx", error: String((e && e.message) || e) }); }

// components/content/AdvantageCarousel.jsx
try { (() => {
function AdvantageCarousel({
  slides = [],
  interval = 6000,
  imageSide = 'left',
  style
}) {
  const [i, setI] = React.useState(0);
  const n = slides.length;
  React.useEffect(() => {
    if (n < 2 || !interval) return;
    const t = setTimeout(() => setI(v => (v + 1) % n), interval);
    return () => clearTimeout(t);
  }, [i, n, interval]);
  const go = d => setI(v => (v + d + n) % n);
  const layer = (el, active) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: active ? 1 : 0,
      transition: 'opacity var(--dur-crossfade) var(--ease-out)',
      pointerEvents: active ? 'auto' : 'none'
    }
  }, el);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-8)',
      alignItems: 'center',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      order: imageSide === 'left' ? 0 : 1,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden'
    }
  }, slides.map((s, idx) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: idx
  }, layer(/*#__PURE__*/React.createElement(__ds_scope.PhotoPlaceholder, {
    label: s.photoLabel,
    src: s.photoSrc,
    alt: s.title,
    ratio: "4 / 3",
    radius: "var(--radius-xl)"
  }), idx === i)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      alignContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: 'clamp(220px,26vw,280px)'
    }
  }, slides.map((s, idx) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: idx
  }, layer(/*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-h2)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      lineHeight: 'var(--lh-display)'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--type-lead)',
      color: 'var(--text-body)',
      maxWidth: 'min(var(--measure),100%)'
    }
  }, s.text)), idx === i)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439 \u0441\u043B\u0430\u0439\u0434",
    onClick: () => go(-1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-left",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u043B\u0430\u0439\u0434",
    onClick: () => go(1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      fontSize: 'var(--type-body)'
    }
  }, i + 1, "/", n))));
}
Object.assign(__ds_scope, { AdvantageCarousel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/AdvantageCarousel.jsx", error: String((e && e.message) || e) }); }

// components/content/DoctorCard.jsx
try { (() => {
function DoctorCard({
  name,
  speciality,
  experience,
  note,
  photoLabel,
  photoSrc,
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      gap: 'var(--space-4)',
      height: '100%',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-md)',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PhotoPlaceholder, {
    label: photoLabel || 'Здесь фото врача',
    src: photoSrc,
    alt: name,
    ratio: "3 / 4",
    radius: "var(--radius-md)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--type-h4)',
      textTransform: 'none',
      letterSpacing: 0
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, speciality), experience && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 'var(--type-small)'
    }
  }, "\u0421\u0442\u0430\u0436 ", experience), note && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      fontSize: 'var(--type-small)'
    }
  }, note)));
}
Object.assign(__ds_scope, { DoctorCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/DoctorCard.jsx", error: String((e && e.message) || e) }); }

// components/content/ServiceCard.jsx
try { (() => {
function ServiceCard({
  title,
  price,
  priceNote,
  benefit,
  photoLabel,
  photoSrc,
  badge,
  href = '#gallery',
  cta = 'Смотреть работы',
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      height: '100%',
      minWidth: 0,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: h ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: h ? 'translateY(-4px)' : 'none',
      transition: 'box-shadow var(--dur-mid) var(--ease-out),transform var(--dur-mid) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PhotoPlaceholder, {
    label: photoLabel,
    src: photoSrc,
    alt: title,
    ratio: "4 / 3",
    radius: "0"
  }), badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "accent",
    style: {
      position: 'absolute',
      top: 'var(--space-4)',
      left: 'var(--space-4)'
    }
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      padding: 'var(--space-6)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--type-h3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-price)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      lineHeight: 1.1
    }
  }, price), priceNote && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-small)',
      color: 'var(--text-muted)'
    }
  }, priceNote)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)'
    }
  }, benefit), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    href: href,
    style: {
      justifySelf: 'start'
    }
  }, cta)));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/content/ServiceFlipCard.jsx
try { (() => {
/* Flip card adapted from Kokonut UI's "Card Flip" (kokonutui.com, MIT) —
   Tailwind classes replaced with the brand's inline tokens. */
function ServiceFlipCard({
  title,
  price,
  priceNote,
  benefit,
  features = [],
  photoLabel,
  photoSrc,
  badge,
  href = '#gallery',
  cta = 'Смотреть работы',
  height = 420,
  style
}) {
  const [flipped, setFlipped] = React.useState(false);
  const face = {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    background: 'var(--surface-card)',
    boxShadow: flipped ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
    transition: 'box-shadow var(--dur-mid) var(--ease-out)'
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setFlipped(true),
    onMouseLeave: () => setFlipped(false),
    onClick: () => setFlipped(v => !v),
    style: {
      position: 'relative',
      height,
      perspective: '2000px',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      width: '100%',
      transformStyle: 'preserve-3d',
      transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      transition: 'transform 560ms cubic-bezier(.77,0,.175,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...face,
      transform: 'rotateY(0deg)',
      display: 'grid',
      gridTemplateRows: '1fr auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PhotoPlaceholder, {
    label: photoLabel,
    src: photoSrc,
    alt: title,
    ratio: "4 / 3",
    radius: "0",
    style: {
      height: '100%',
      objectFit: 'cover'
    }
  }), badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "accent",
    style: {
      position: 'absolute',
      top: 'var(--space-4)',
      left: 'var(--space-4)'
    }
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      padding: 'var(--space-5) var(--space-6) var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--type-h3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-price)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      lineHeight: 1.05
    }
  }, price), priceNote && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-small)',
      color: 'var(--text-muted)'
    }
  }, priceNote), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 'var(--space-2)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-accent)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "repeat-2",
    size: 16
  }), "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u2014 \u043D\u0430\u0432\u0435\u0434\u0438\u0442\u0435"))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...face,
      transform: 'rotateY(180deg)',
      background: 'var(--grad-aqua)',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: 'var(--space-4)',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--type-h3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      fontSize: 'var(--type-small)'
    }
  }, benefit)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 'var(--space-3)',
      alignContent: 'start'
    }
  }, features.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      fontSize: 'var(--type-small)',
      color: 'var(--text-body)',
      transform: flipped ? 'translateX(0)' : 'translateX(-10px)',
      opacity: flipped ? 1 : 0,
      transition: `transform var(--dur-mid) var(--ease-out) ${i * 50 + 150}ms,opacity var(--dur-mid) var(--ease-out) ${i * 50 + 150}ms`
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16,
    strokeWidth: 2.6,
    color: "var(--text-accent)",
    style: {
      marginTop: 3
    }
  }), /*#__PURE__*/React.createElement("span", null, t)))), /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      minHeight: 'var(--tap-min)',
      padding: '0 var(--space-5)',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--cta-bg)',
      color: 'var(--cta-fg)',
      fontWeight: 'var(--fw-bold)',
      textDecoration: 'none'
    }
  }, cta, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 20
  })))));
}
Object.assign(__ds_scope, { ServiceFlipCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ServiceFlipCard.jsx", error: String((e && e.message) || e) }); }

// components/media/WaveField.jsx
try { (() => {
/* Three layered SVG wave bands drifting at different speeds — the brand's depth motif.
   Lightweight (no video) and safe on mobile. */
const PATHS = ['M0,60 C180,110 360,10 540,60 C720,110 900,10 1080,60 C1260,110 1440,10 1620,60 L1620,160 L0,160 Z', 'M0,80 C240,20 480,130 720,80 C960,30 1200,130 1440,80 C1560,55 1620,70 1620,70 L1620,160 L0,160 Z', 'M0,100 C200,150 400,60 600,100 C800,140 1000,60 1200,100 C1400,140 1520,80 1620,100 L1620,160 L0,160 Z'];
function WaveField({
  colors = ['rgba(194,204,196,.55)', 'rgba(143,162,172,.75)', 'var(--dc-depths)'],
  height = 180,
  speeds = ['var(--dur-wave-1)', 'var(--dur-wave-2)', 'var(--dur-wave-3)'],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      height,
      overflow: 'hidden',
      pointerEvents: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes dc-wave-drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(-180px,0,0)}}'), PATHS.map((d, i) => /*#__PURE__*/React.createElement("svg", {
    key: i,
    viewBox: "0 0 1620 160",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '112%',
      height: height * (0.72 + i * 0.14),
      animation: `dc-wave-drift ${speeds[i]} linear infinite alternate`,
      opacity: 1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: colors[i]
  }))));
}
Object.assign(__ds_scope, { WaveField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/WaveField.jsx", error: String((e && e.message) || e) }); }

// components/media/OceanHero.jsx
try { (() => {
function OceanHero({
  eyebrow = 'Центр стоматологии',
  slogan = 'Дентал Круиз — путешествие в мир прекрасных улыбок',
  videoSrc,
  poster,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "top",
    style: {
      position: 'relative',
      minHeight: '100svh',
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden',
      background: 'var(--grad-deep)',
      ...style
    }
  }, videoSrc ? /*#__PURE__*/React.createElement("video", {
    src: videoSrc,
    poster: poster,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-shallow)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg,rgba(4,48,65,.42) 0%,rgba(4,48,65,.28) 45%,rgba(4,48,65,.62) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2,
      padding: '0 var(--gutter)',
      textAlign: 'center',
      maxWidth: 'min(1000px,92vw)',
      marginInline: 'auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 'var(--space-4)',
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(0.9rem,1.4vw,1.0625rem)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: '#fff',
      textShadow: '0 2px 18px rgba(7,59,75,.6)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--type-hero)',
      lineHeight: 'var(--lh-tight)',
      letterSpacing: 'var(--ls-hero)',
      textTransform: 'uppercase',
      color: '#fff',
      textShadow: '0 4px 40px rgba(2,32,41,.55)',
      margin: 0,
      overflowWrap: 'break-word'
    }
  }, slogan), children), /*#__PURE__*/React.createElement(__ds_scope.WaveField, {
    height: 92,
    colors: ['rgba(255,255,255,.28)', 'rgba(255,255,255,.5)', 'var(--dc-white)'],
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -1,
      zIndex: 3,
      height: 92
    }
  }));
}
Object.assign(__ds_scope, { OceanHero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/OceanHero.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BurgerMenu.jsx
try { (() => {
const DEFAULT_LINKS = [{
  label: 'Услуги',
  href: '#services'
}, {
  label: 'Наши врачи',
  href: '#doctors'
}, {
  label: 'Цены',
  href: '#pricelist'
}, {
  label: 'О клинике',
  href: '#about'
}, {
  label: 'До/после',
  href: '#gallery'
}, {
  label: 'Отзывы',
  href: '#reviews'
}, {
  label: 'Контакты',
  href: '#contacts'
}];
function BurgerMenu({
  open = false,
  onClose,
  links = DEFAULT_LINKS,
  phone = '+7 925 577-76-77',
  phoneHref = 'tel:+79255777677',
  schedule = 'Пн–Сб 10:00–22:00 · Вс — выходной',
  address = 'Москва, 4-я Магистральная, 5с1, 2 этаж',
  email = 'dental.cruise@inbox.ru',
  route = '5 минут пешком от метро Полежаевская',
  routeHref = 'https://yandex.ru/maps/org/dental_kruiz/154025048590/',
  onBook
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    "aria-hidden": !open,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 70,
      background: 'rgba(4,48,65,.45)',
      backdropFilter: 'blur(2px)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--dur-mid) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "\u041C\u0435\u043D\u044E \u0441\u0430\u0439\u0442\u0430",
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 80,
      width: 'min(420px,92vw)',
      background: 'var(--surface-page)',
      boxShadow: 'var(--shadow-lg)',
      padding: 'var(--space-6)',
      overflowY: 'auto',
      display: 'grid',
      alignContent: 'start',
      gap: 'var(--space-6)',
      transform: open ? 'translateX(0)' : 'translateX(102%)',
      opacity: open ? 1 : 0,
      transition: 'transform var(--dur-mid) var(--ease-out),opacity var(--dur-mid) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E",
    variant: "bare",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 24
  }))), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 'var(--space-1)'
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.label
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href,
    onClick: onClose,
    style: {
      display: 'block',
      padding: '12px 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--type-h3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      color: 'var(--text-strong)',
      textDecoration: 'none',
      borderBottom: '1px solid var(--line-hairline)'
    }
  }, l.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "Max",
    href: "#max"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "message-circle",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u0412\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u0435",
    href: "#vk"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "send",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C",
    href: phoneHref,
    variant: "accent"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "phone",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: phoneHref,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-h3)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      textDecoration: 'none'
    }
  }, phone), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      fontSize: 'var(--type-body)'
    }
  }, schedule), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-body)',
      fontSize: 'var(--type-body)'
    }
  }, address), /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + email,
    style: {
      color: 'var(--text-accent)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, email), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 'var(--type-small)'
    }
  }, route), /*#__PURE__*/React.createElement("a", {
    href: routeHref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--text-accent)',
      fontWeight: 'var(--fw-bold)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 18
  }), "\u041A\u0430\u043A \u0434\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F?")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: () => {
      onClose && onClose();
      onBook && onBook();
    }
  }, "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043F\u0440\u0438\u0451\u043C")));
}
Object.assign(__ds_scope, { BurgerMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BurgerMenu.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Logo({
  src = '/assets/logo-dentalcruise.svg',
  height = 44,
  onDark = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src,
    alt: "\u0414\u0435\u043D\u0442\u0430\u043B \u041A\u0440\u0443\u0438\u0437",
    height: height,
    style: {
      height,
      width: 'auto',
      filter: onDark ? 'brightness(0) invert(1)' : 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Logo.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
const COLS = [{
  title: 'Страницы',
  links: ['Главная', 'Прайс-лист', 'О клинике', 'Врачи', 'Галерея работ']
}, {
  title: 'Информация',
  links: ['Отзывы', 'Контакты', 'Политика конфиденциальности', 'Согласие на обработку данных']
}];
function Footer({
  logoSrc,
  columns = COLS,
  phone = '+7 925 577-76-77',
  phoneHref = 'tel:+79255777677',
  address = 'Москва, 4-я Магистральная, 5с1, 2 этаж · м. Полежаевская',
  email = 'dental.cruise@inbox.ru',
  schedule = 'Пн–Сб 10:00–22:00 · Вс — выходной',
  year = 2026,
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-footer)',
      color: 'var(--text-on-dark)',
      padding: 'var(--section-y-tight) var(--gutter) var(--space-8)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'grid',
      gap: 'var(--space-12)',
      gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    src: logoSrc,
    onDark: true,
    height: 40
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-on-dark-muted)',
      fontSize: 'var(--type-body)',
      maxWidth: '32ch'
    }
  }, "\u0426\u0435\u043D\u0442\u0440 \u0441\u0442\u043E\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u0438 \u0441 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0439 \u0437\u0443\u0431\u043E\u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0435\u0439."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, [['ВКонтакте', 'send'], ['Max', 'message-circle']].map(([l, ic]) => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#social",
    "aria-label": l,
    style: {
      width: 44,
      height: 44,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--line-on-dark)',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 20
  }))))), columns.map(c => /*#__PURE__*/React.createElement("nav", {
    key: c.title,
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)'
    }
  }, c.title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#stub",
    style: {
      color: 'var(--text-on-dark)',
      textDecoration: 'none',
      fontSize: 'var(--type-body)'
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-eyebrow)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-on-dark-muted)'
    }
  }, "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B"), /*#__PURE__*/React.createElement("a", {
    href: phoneHref,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-h4)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-on-dark)',
      textDecoration: 'none'
    }
  }, phone), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-on-dark-muted)'
    }
  }, address), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-on-dark-muted)'
    }
  }, schedule), /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + email,
    style: {
      color: 'var(--text-on-dark)',
      fontSize: 'var(--type-body)'
    }
  }, email))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: 'var(--space-12) auto 0',
      paddingTop: 'var(--space-6)',
      borderTop: '1px solid var(--line-on-dark)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      justifyContent: 'space-between',
      color: 'var(--text-on-dark-muted)',
      fontSize: 'var(--type-small)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", year, " \u0414\u0435\u043D\u0442\u0430\u043B \u041A\u0440\u0443\u0438\u0437"), /*#__PURE__*/React.createElement("span", null, "\u041B\u0438\u0446\u0435\u043D\u0437\u0438\u044F \u043D\u0430 \u043E\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u043E\u0439 \u0434\u0435\u044F\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438")));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Header.jsx
try { (() => {
function Header({
  logoSrc,
  phone = '+7 925 577-76-77',
  phoneHref = 'tel:+79255777677',
  address = '4-я Магистральная, 5с1',
  schedule = 'пн–сб 10:00–22:00',
  maxHref = '#max',
  vkHref = '#vk',
  menuOpen = false,
  onMenuToggle,
  style
}) {
  const [compact, setCompact] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const bar = {
    height: 2,
    width: 22,
    background: 'var(--text-strong)',
    borderRadius: '2px',
    transition: 'transform var(--dur-mid) var(--ease-out),opacity var(--dur-fast) var(--ease-out)'
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'fixed',
      inset: '0 0 auto 0',
      zIndex: 60,
      padding: compact ? '8px var(--gutter)' : '16px var(--gutter)',
      background: compact ? 'var(--glass-light)' : 'transparent',
      backdropFilter: compact ? 'var(--blur-glass)' : 'none',
      WebkitBackdropFilter: compact ? 'var(--blur-glass)' : 'none',
      boxShadow: compact ? '0 1px 0 var(--line-hairline),var(--shadow-sm)' : 'none',
      transition: 'padding var(--dur-mid) var(--ease-out),background var(--dur-mid) var(--ease-out),box-shadow var(--dur-mid) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, '@media(min-width:900px){.dc-header-contacts{display:flex!important}}'), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    "aria-label": "\u0414\u0435\u043D\u0442\u0430\u043B \u041A\u0440\u0443\u0438\u0437 \u2014 \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E",
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    src: logoSrc,
    height: compact ? 34 : 44,
    style: {
      transition: 'height var(--dur-mid) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'none',
      gap: 'var(--space-6)',
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 0
    },
    className: "dc-header-contacts"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)',
      whiteSpace: 'nowrap'
    }
  }, address), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-small)',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, schedule)), /*#__PURE__*/React.createElement("a", {
    href: phoneHref,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--type-h4)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    }
  }, phone)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 Max",
    href: maxHref,
    size: 44
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "message-circle",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432\u043E \u0412\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u0435",
    href: vkHref,
    size: 44
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "send",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: 'Позвонить ' + phone,
    href: phoneHref,
    variant: "accent",
    size: 44
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "phone",
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onMenuToggle,
    "aria-label": menuOpen ? 'Закрыть меню' : 'Открыть меню',
    "aria-expanded": menuOpen,
    style: {
      width: 44,
      height: 44,
      display: 'grid',
      placeItems: 'center',
      gap: 0,
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--line-hairline)',
      background: 'rgba(255,255,255,.72)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 5,
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...bar,
      transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...bar,
      opacity: menuOpen ? 0 : 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...bar,
      transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'
    }
  }))))));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/LandingPage.jsx
try { (() => {
const NS = window.Ds2_2d9e23;
const {
  Header,
  BurgerMenu,
  Footer,
  AppointmentModal
} = NS;
function LandingPage() {
  const [menu, setMenu] = React.useState(false);
  const [book, setBook] = React.useState(false);
  const logo = '../../assets/logo-dentalcruise.svg';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    logoSrc: logo,
    menuOpen: menu,
    onMenuToggle: () => setMenu(v => !v)
  }), /*#__PURE__*/React.createElement(BurgerMenu, {
    open: menu,
    onClose: () => setMenu(false),
    onBook: () => setBook(true)
  }), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(window.HeroSection, null), /*#__PURE__*/React.createElement(window.PromoSection, {
    onBook: () => setBook(true)
  }), /*#__PURE__*/React.createElement(window.AdvantagesSection, null), /*#__PURE__*/React.createElement(window.ServicesSection, null), /*#__PURE__*/React.createElement(window.BrandsSection, null), /*#__PURE__*/React.createElement(window.WhyUsSection, null), /*#__PURE__*/React.createElement(window.AboutSection, null), /*#__PURE__*/React.createElement(window.DoctorsSection, null), /*#__PURE__*/React.createElement(window.FaqSection, null), /*#__PURE__*/React.createElement(window.ReviewsSection, null), /*#__PURE__*/React.createElement(window.TrustSection, null), /*#__PURE__*/React.createElement(window.ContactSection, {
    onBook: () => setBook(true)
  })), /*#__PURE__*/React.createElement(Footer, {
    logoSrc: logo
  }), /*#__PURE__*/React.createElement(AppointmentModal, {
    open: book,
    onClose: () => setBook(false)
  }));
}
Object.assign(window, {
  LandingPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/LandingPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/SectionsA.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const NS = window.Ds2_2d9e23;
const {
  Reveal,
  SectionHeading,
  Button,
  Badge,
  Icon,
  OceanHero,
  AdvantageCarousel,
  ComparisonColumns,
  PriceCompare,
  ServiceFlipCard,
  PhotoPlaceholder,
  PromoBoard,
  BrandsMarquee
} = NS;
const Section = ({
  id,
  children,
  bg,
  dark = false,
  tight = false,
  style
}) => /*#__PURE__*/React.createElement("section", {
  id: id,
  style: {
    background: bg || 'transparent',
    padding: `${tight ? 'var(--section-y-tight)' : 'var(--section-y)'} var(--gutter)`,
    ...style
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 'var(--container)',
    margin: '0 auto',
    display: 'grid',
    gap: 'var(--space-10)'
  }
}, children));
function HeroSection() {
  return /*#__PURE__*/React.createElement(OceanHero, {
    videoSrc: "../../assets/video/ocean-hero.mp4"
  });
}
function PromoSection({
  onBook
}) {
  if (!PromoBoard) return null;
  return /*#__PURE__*/React.createElement(Section, {
    id: "promo",
    tight: true
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(PromoBoard, {
    items: [{
      title: 'Коронка из циркония',
      price: '19 900 ₽',
      was: '26 000 ₽',
      note: 'Изготовление и установка'
    }, {
      title: 'Винир E-max, за зуб',
      price: '25 000 ₽',
      was: '40 000–80 000 ₽',
      note: 'Своя лаборатория'
    }, {
      title: 'Протезирование под ключ',
      price: 'от 65 000 ₽',
      note: 'Имплант Osstem + коронка'
    }],
    note: "\u0426\u0435\u043D\u044B \u043D\u0438\u0436\u0435 \u0440\u044B\u043D\u043A\u0430 \u043F\u043E\u0442\u043E\u043C\u0443, \u0447\u0442\u043E \u043A\u043E\u0440\u043E\u043D\u043A\u0438 \u0438 \u0432\u0438\u043D\u0438\u0440\u044B \u0434\u0435\u043B\u0430\u0435\u0442 \u043D\u0430\u0448\u0430 \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044F \u2014 \u0431\u0435\u0437 \u043D\u0430\u0446\u0435\u043D\u043A\u0438 \u043F\u043E\u0441\u0440\u0435\u0434\u043D\u0438\u043A\u0430.",
    onCta: onBook
  })));
}
function BrandsSection() {
  if (!BrandsMarquee) return null;
  return /*#__PURE__*/React.createElement(Section, {
    id: "brands",
    bg: "var(--surface-warm)",
    tight: true
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(BrandsMarquee, {
    eyebrow: "\u0420\u0430\u0431\u043E\u0442\u0430\u0435\u043C \u043D\u0430 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u0430\u0445 \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0445 \u043F\u043E\u0441\u0442\u0430\u0432\u0449\u0438\u043A\u043E\u0432",
    brands: [{
      name: 'ВладМиВа'
    }, {
      name: 'Стомадент'
    }, {
      name: 'Целит'
    }, {
      name: 'Радуга-Р'
    }, {
      name: 'ЭСТЕТ'
    }, {
      name: 'ДиаРси'
    }]
  })));
}
function AdvantagesSection() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "advantages"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u0414\u0435\u043D\u0442\u0430\u043B \u041A\u0440\u0443\u0438\u0437",
    title: "\u041F\u043E\u0447\u0435\u043C\u0443 \u043F\u0430\u0446\u0438\u0435\u043D\u0442\u044B \u0432\u044B\u0431\u0438\u0440\u0430\u044E\u0442 \u043D\u0430\u0441"
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement(AdvantageCarousel, {
    slides: [{
      title: 'Центр стоматологии с собственной лабораторией',
      text: 'Своя зуботехническая лаборатория работает с 2013 года — изготовлено более 10 000 коронок. Снимок, изготовление и правки происходят в одном месте.',
      photoLabel: 'Здесь фото зуботехнической лаборатории'
    }, {
      title: 'Опытные врачи',
      text: 'Ортопеды, имплантологи и зубные техники работают одной командой: врач и техник обсуждают вашу работу напрямую, без переписки с подрядчиком.',
      photoLabel: 'Здесь фото команды клиники'
    }]
  })));
}
function WhyUsSection() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "why",
    bg: "var(--grad-aqua)"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u041F\u043E\u0447\u0435\u043C\u0443 \u043C\u044B",
    title: "\u0421\u0432\u043E\u044F \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044F \u2014 \u0441\u0432\u043E\u044F \u0446\u0435\u043D\u0430",
    lead: "\u0411\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u043E \u043A\u043B\u0438\u043D\u0438\u043A \u0437\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u043A\u043E\u0440\u043E\u043D\u043A\u0438 \u0438 \u0432\u0438\u043D\u0438\u0440\u044B \u043D\u0430 \u0441\u0442\u043E\u0440\u043E\u043D\u0435. \u041C\u044B \u0434\u0435\u043B\u0430\u0435\u043C \u0438\u0445 \u0441\u0430\u043C\u0438 \u2014 \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043D\u0435\u0442 \u043D\u0430\u0446\u0435\u043D\u043A\u0438 \u043F\u043E\u0441\u0440\u0435\u0434\u043D\u0438\u043A\u0430 \u0438 \u0434\u043E\u043B\u0433\u043E\u0433\u043E \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement(ComparisonColumns, {
    theirItems: ['Заказывают коронки и виниры на стороне', 'Наценка посредника в каждой работе', 'Долгое ожидание изготовления', 'Правки — через лабораторию-подрядчика'],
    ourItems: ['Своя зуботехническая лаборатория с 2013 года', 'Честная цена без посредника', 'Готово быстро — техник рядом с врачом', 'Правки на месте, часто в тот же визит']
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 180
  }, /*#__PURE__*/React.createElement(PriceCompare, {
    label: "\u0412\u0438\u043D\u0438\u0440\u044B E-max, \u0437\u0430 \u0437\u0443\u0431",
    marketPrice: "40 000\u201380 000 \u20BD",
    ourPrice: "25 000 \u20BD",
    note: "\u0414\u0435\u0448\u0435\u0432\u043B\u0435 \u043D\u0435 \u0437\u0430 \u0441\u0447\u0451\u0442 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430, \u0430 \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043C\u0435\u0436\u0434\u0443 \u0432\u0430\u043C\u0438 \u0438 \u0442\u0435\u0445\u043D\u0438\u043A\u043E\u043C \u043D\u0438\u043A\u043E\u0433\u043E \u043D\u0435\u0442. \u0418\u043C\u043F\u043B\u0430\u043D\u0442\u044B Osstem \u0438 Astra Tech \u2014 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u0445 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439, \u0446\u0435\u043D\u0430 \u043D\u0430 \u0443\u0440\u043E\u0432\u043D\u0435 \u0440\u044B\u043D\u043A\u0430, \u0431\u0435\u0437 \u043D\u0430\u043A\u0440\u0443\u0442\u043E\u043A."
  })));
}
function ServicesSection() {
  const items = [{
    title: 'Виниры',
    price: 'от 25 000 ₽',
    priceNote: 'E-max, за зуб',
    benefit: 'Изготавливаем в своей лаборатории — дешевле рынка Москвы вдвое.',
    features: ['Слепок и примерка', 'Изготовление у нас в лаборатории', 'Подбор оттенка на месте', 'Правки в тот же визит'],
    photoLabel: 'Здесь фото работы: виниры E-max'
  }, {
    title: 'Коронки',
    price: 'от 19 900 ₽',
    priceNote: 'цирконий, по акции',
    badge: 'Акция',
    benefit: 'Снимок, изготовление и подгонка — в одном месте, без ожидания подрядчика.',
    features: ['Цирконий или металлокерамика', 'Изготовление 3–5 дней', 'Подгонка по прикусу', 'Гарантия с бесплатными правками'],
    photoLabel: 'Здесь фото работы: циркониевая коронка'
  }, {
    title: 'Протезирование под ключ',
    price: 'от 65 000 ₽',
    priceNote: 'имплант Osstem + коронка',
    benefit: 'Имплант — сертифицированная система, коронка — наша лаборатория.',
    features: ['Импланты Osstem и Astra Tech', 'Цена импланта — на уровне рынка', 'Коронка из своей лаборатории', 'План лечения с итоговой суммой'],
    photoLabel: 'Здесь фото работы: имплант с коронкой'
  }];
  return /*#__PURE__*/React.createElement(Section, {
    id: "services"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u0422\u043E\u043F \u0443\u0441\u043B\u0443\u0433",
    title: "\u0427\u0442\u043E \u0437\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u0447\u0430\u0449\u0435 \u0432\u0441\u0435\u0433\u043E",
    lead: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0443\u0441\u043B\u0443\u0433\u0443 \u2014 \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0433\u0430\u043B\u0435\u0440\u0435\u044F \u0440\u0430\u0431\u043E\u0442 \xAB\u0434\u043E/\u043F\u043E\u0441\u043B\u0435\xBB \u0441 \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u043C \u043F\u043E \u0442\u0438\u043F\u0443 \u0443\u0441\u043B\u0443\u0433\u0438."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      alignItems: 'start',
      gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))'
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: it.title,
    delay: i * 90
  }, ServiceFlipCard ? /*#__PURE__*/React.createElement(ServiceFlipCard, _extends({}, it, {
    height: 440
  })) : /*#__PURE__*/React.createElement(NS.ServiceCard, it)))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 280,
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    href: "#pricelist",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 20
    })
  }, "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043F\u043E\u043B\u043D\u044B\u0439 \u043F\u0440\u0430\u0439\u0441-\u043B\u0438\u0441\u0442")));
}
function AboutSection() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "about",
    bg: "var(--surface-cool)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-10)',
      alignItems: 'center',
      gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      justifyItems: 'start',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u041E \u043A\u043B\u0438\u043D\u0438\u043A\u0435",
    title: "\u041B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u044F \u0432\u043D\u0443\u0442\u0440\u0438 \u043A\u043B\u0438\u043D\u0438\u043A\u0438",
    lead: "\u0421 2013 \u0433\u043E\u0434\u0430 \u043D\u0430\u0448\u0438 \u0437\u0443\u0431\u043D\u044B\u0435 \u0442\u0435\u0445\u043D\u0438\u043A\u0438 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u0432 \u0442\u043E\u043C \u0436\u0435 \u0437\u0434\u0430\u043D\u0438\u0438, \u0447\u0442\u043E \u0438 \u0432\u0440\u0430\u0447\u0438. \u0411\u043E\u043B\u0435\u0435 10 000 \u0438\u0437\u0433\u043E\u0442\u043E\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u043A\u043E\u0440\u043E\u043D\u043E\u043A: \u043C\u044B \u0432\u0438\u0434\u0438\u043C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0441\u0432\u043E\u0438\u043C\u0438 \u0440\u0443\u043A\u0430\u043C\u0438 \u0438 \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u043C \u0437\u0430 \u043D\u0435\u0433\u043E \u0441\u0430\u043C\u0438."
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "quiet"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    color: "var(--text-accent)"
  }), "10 000+ \u043A\u043E\u0440\u043E\u043D\u043E\u043A \u0441 2013 \u0433\u043E\u0434\u0430"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    href: "#about-page"
  }, "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u043E \u043A\u043B\u0438\u043D\u0438\u043A\u0435"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120,
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(PhotoPlaceholder, {
    label: "\u0417\u0434\u0435\u0441\u044C \u0444\u043E\u0442\u043E \u0437\u0443\u0431\u043E\u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0446\u0435\u0445\u0430",
    ratio: "4 / 3"
  }))));
}
Object.assign(window, {
  Section,
  HeroSection,
  PromoSection,
  BrandsSection,
  AdvantagesSection,
  WhyUsSection,
  ServicesSection,
  AboutSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/SectionsA.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/SectionsB.jsx
try { (() => {
const NS = window.Ds2_2d9e23;
const {
  Reveal,
  SectionHeading,
  Button,
  Icon,
  DoctorCard,
  FaqAccordion,
  ReviewsCard,
  TrustBar,
  PlaceCard,
  StaticMap,
  WaveField
} = NS;
const Section = window.Section;
const DOCTORS = [{
  name: 'Врач-стоматолог',
  speciality: 'Ортопед, имплантолог',
  experience: '18 лет',
  note: 'Ведёт протезирование под ключ.'
}, {
  name: 'Врач-стоматолог',
  speciality: 'Терапевт',
  experience: '12 лет',
  note: 'Лечение под микроскопом.'
}, {
  name: 'Зубной техник',
  speciality: 'Керамист лаборатории',
  experience: '15 лет',
  note: 'Подбирает оттенок винира на месте.'
}, {
  name: 'Врач-стоматолог',
  speciality: 'Хирург',
  experience: '9 лет'
}];
function DoctorsSection() {
  return /*#__PURE__*/React.createElement("section", {
    id: "doctors",
    style: {
      position: 'relative',
      padding: 'var(--section-y) var(--gutter)',
      background: 'var(--grad-shallow)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(7,59,75,.16)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-small)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase'
    }
  }, "\u0417\u0434\u0435\u0441\u044C \u0441\u0432\u0435\u0442\u043B\u043E\u0435 \u0444\u043E\u0442\u043E \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043D\u0430 \u0444\u043E\u043D\u0435"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'grid',
      gap: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u0412\u0440\u0430\u0447\u0438",
    title: "\u041A\u043E\u043C\u0430\u043D\u0434\u0430, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0432\u043C\u0435\u0441\u0442\u0435",
    lead: "\u0412\u0440\u0430\u0447 \u0438 \u0442\u0435\u0445\u043D\u0438\u043A \u043E\u0431\u0441\u0443\u0436\u0434\u0430\u044E\u0442 \u0432\u0430\u0448\u0443 \u0440\u0430\u0431\u043E\u0442\u0443 \u043B\u0438\u0447\u043D\u043E \u2014 \u043D\u0435 \u0447\u0435\u0440\u0435\u0437 \u043F\u043E\u0441\u0440\u0435\u0434\u043D\u0438\u043A\u0430."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      overflowX: 'auto',
      alignItems: 'stretch',
      paddingBottom: 'var(--space-4)',
      scrollSnapType: 'x mandatory'
    }
  }, DOCTORS.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.speciality,
    style: {
      flex: '0 0 clamp(240px,74vw,300px)',
      scrollSnapAlign: 'start',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(DoctorCard, d))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 180,
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    href: "#doctors-page"
  }, "\u0412\u0441\u0435 \u0432\u0440\u0430\u0447\u0438"))));
}
function FaqSection() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "faq"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u0412\u043E\u043F\u0440\u043E\u0441\u044B",
    title: "\u0427\u0442\u043E \u0447\u0430\u0449\u0435 \u0432\u0441\u0435\u0433\u043E \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u044E\u0442"
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90
  }, /*#__PURE__*/React.createElement(FaqAccordion, {
    items: [{
      q: 'Больно ли это?',
      a: 'Все вмешательства проходят под анестезией — подбираем её индивидуально и проверяем действие до начала работы. Если вы боитесь стоматологов, скажите об этом на первом приёме: врач объяснит каждый шаг заранее.'
    }, {
      q: 'Сколько по времени займёт протезирование?',
      a: 'Ориентировочно 2–4 визита. Так как коронки изготавливает наша лаборатория в этом же здании, ожидание между этапами короче, чем при заказе на стороне, а правки делаются на месте.'
    }, {
      q: 'Что входит в цену, есть ли скрытые доплаты?',
      a: 'Цена в прайсе — за конкретную работу: например, коронка включает изготовление и установку. После осмотра врач составляет план лечения с итоговой суммой, и она не меняется по ходу без вашего согласия.'
    }, {
      q: 'Какая гарантия?',
      a: 'На работы нашей лаборатории даём гарантию и бесплатно исправляем недочёты в оговорённый срок. Поскольку техник работает здесь же, правка занимает визит, а не недели.'
    }, {
      q: 'Как записаться и что взять с собой?',
      a: 'Проще всего позвонить — администратор подберёт время. Можно оставить заявку в форме, мы перезвоним сами. Возьмите паспорт и, если есть, свежие снимки или выписки от других врачей.'
    }]
  })));
}
function ReviewsSection() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "reviews",
    bg: "var(--surface-warm)"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u041E\u0442\u0437\u044B\u0432\u044B",
    title: "\u041D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0435 \u043E\u0442\u0437\u044B\u0432\u044B, \u0430 \u043D\u0435 \u043D\u0430\u0448\u0438 \u0441\u043B\u043E\u0432\u0430"
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90,
    style: {
      maxWidth: '720px'
    }
  }, /*#__PURE__*/React.createElement(ReviewsCard, {
    rating: 4.9,
    count: 120
  })));
}
function TrustSection() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "trust",
    tight: true
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(TrustBar, {
    items: [{
      title: 'Яндекс Хорошее место',
      text: 'Отметка за высокие оценки пациентов',
      icon: 'award'
    }, {
      title: 'Лицензия на медицинскую деятельность',
      text: 'Нажмите, чтобы посмотреть документ',
      icon: 'file-text',
      href: '#license'
    }, {
      title: 'Рейтинг 4,9 на Яндекс Картах',
      text: 'Более 120 отзывов пациентов',
      icon: 'star'
    }]
  })));
}
function ContactSection({
  onBook
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "contacts",
    style: {
      background: 'var(--surface-cool)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(WaveField, {
    height: 110,
    colors: ['rgba(214,227,225,.45)', 'rgba(222,234,236,.75)', 'var(--surface-cool)'],
    style: {
      position: 'absolute',
      top: -109,
      left: 0,
      right: 0,
      height: 110
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--section-y) var(--gutter)',
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'grid',
      gap: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B",
    title: "\u041F\u0440\u0438\u0435\u0437\u0436\u0430\u0439\u0442\u0435 \u0438\u043B\u0438 \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u0435",
    lead: "5 \u043C\u0438\u043D\u0443\u0442 \u043F\u0435\u0448\u043A\u043E\u043C \u043E\u0442 \u043C\u0435\u0442\u0440\u043E \u041F\u043E\u043B\u0435\u0436\u0430\u0435\u0432\u0441\u043A\u0430\u044F: 4-\u044F \u041C\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u043B\u044C\u043D\u0430\u044F, 5\u04411, 2 \u044D\u0442\u0430\u0436. \u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u2014 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u043F\u043E\u0434\u0431\u0435\u0440\u0451\u0442 \u0432\u0440\u0435\u043C\u044F, \u0438\u043B\u0438 \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u044F\u0432\u043A\u0443, \u0438 \u043C\u044B \u043F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u043C \u0441\u0430\u043C\u0438."
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 90,
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onBook,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 20
    })
  }, "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043F\u0440\u0438\u0451\u043C")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    delay: 140,
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(PlaceCard, null)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 220,
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(StaticMap, null)))));
}
Object.assign(window, {
  DoctorsSection,
  FaqSection,
  ReviewsSection,
  TrustSection,
  ContactSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/SectionsB.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AdvantageCarousel = __ds_scope.AdvantageCarousel;

__ds_ns.BrandsMarquee = __ds_scope.BrandsMarquee;

__ds_ns.ComparisonColumns = __ds_scope.ComparisonColumns;

__ds_ns.DoctorCard = __ds_scope.DoctorCard;

__ds_ns.FaqAccordion = __ds_scope.FaqAccordion;

__ds_ns.PlaceCard = __ds_scope.PlaceCard;

__ds_ns.PriceCompare = __ds_scope.PriceCompare;

__ds_ns.PromoBoard = __ds_scope.PromoBoard;

__ds_ns.ReviewsCard = __ds_scope.ReviewsCard;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.ServiceFlipCard = __ds_scope.ServiceFlipCard;

__ds_ns.StaticMap = __ds_scope.StaticMap;

__ds_ns.TrustBar = __ds_scope.TrustBar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Reveal = __ds_scope.Reveal;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.AppointmentForm = __ds_scope.AppointmentForm;

__ds_ns.AppointmentModal = __ds_scope.AppointmentModal;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.OceanHero = __ds_scope.OceanHero;

__ds_ns.PhotoPlaceholder = __ds_scope.PhotoPlaceholder;

__ds_ns.WaveField = __ds_scope.WaveField;

__ds_ns.BurgerMenu = __ds_scope.BurgerMenu;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.Logo = __ds_scope.Logo;

})();
