// SRM UI primitives — Button, Card, Badge, Input, KPI, Icon

const Icon = ({ name, size = 20, stroke = 1.5, style = {}, className = "" }) => {
  // Tiny inline icon registry using Lucide path data.
  const paths = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    chart:
      '<line x1="3" y1="3" x2="3" y2="21"/><line x1="3" y1="21" x2="21" y2="21"/><rect x="7" y="13" width="3" height="6"/><rect x="13" y="9" width="3" height="10"/>',
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.39.86.62 1.39.62H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    arrowRight: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    arrowUp: '<path d="M12 3v14"/><path d="m18 9-6-6-6 6"/><path d="M5 21h14"/>',
    arrowDown: '<path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>',
    alertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    building:
      '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>',
    receipt:
      '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    logout:
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    chevronDown: '<polyline points="6 9 12 15 18 9"/>',
    chevronRight: '<polyline points="9 6 15 12 9 18"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    helpCircle:
      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    moreVertical: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    calendar:
      '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  };
  const d = paths[name] || paths.helpCircle;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
};

const Button = ({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  children,
  onClick,
  disabled,
  style = {},
  type = "button",
  as: As = "button",
  ...rest
}) => {
  const base = {
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    border: "1px solid transparent",
    borderRadius: 999,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    lineHeight: 1,
    transition:
      "transform 200ms cubic-bezier(0.2,0,0,1), box-shadow 200ms cubic-bezier(0.2,0,0,1), background 200ms cubic-bezier(0.2,0,0,1), color 200ms cubic-bezier(0.2,0,0,1), border-color 200ms cubic-bezier(0.2,0,0,1)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    willChange: "transform, box-shadow",
  };
  const sizes = {
    sm: { padding: "7px 14px", fontSize: 12.5 },
    md: { padding: "11px 20px", fontSize: 14 },
    lg: { padding: "14px 26px", fontSize: 15 },
  };
  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "white",
      boxShadow: "0 1px 2px rgba(36,97,175,0.18), 0 2px 6px rgba(36,97,175,0.14)",
    },
    accent: {
      background: "var(--action-accent)",
      color: "white",
      boxShadow: "0 1px 2px rgba(212,82,0,0.18), 0 2px 6px rgba(212,82,0,0.14)",
    },
    secondary: { background: "white", color: "var(--fg-1)", borderColor: "var(--border-default)" },
    ghost: { background: "transparent", color: "var(--fg-brand)" },
    danger: {
      background: "var(--srm-danger-500)",
      color: "white",
      boxShadow: "0 1px 2px rgba(200,37,43,0.18), 0 2px 6px rgba(200,37,43,0.14)",
    },
    "ghost-neutral": { background: "transparent", color: "var(--fg-2)" },
  };
  const hoverShadows = {
    primary: "0 2px 4px rgba(36,97,175,0.20), 0 8px 18px rgba(36,97,175,0.28)",
    accent: "0 2px 4px rgba(212,82,0,0.20), 0 8px 18px rgba(212,82,0,0.28)",
    secondary: "0 2px 8px rgba(11,29,56,0.08)",
    danger: "0 2px 4px rgba(200,37,43,0.20), 0 8px 18px rgba(200,37,43,0.28)",
  };
  const disabledStyle = disabled
    ? { background: "var(--srm-neutral-100)", color: "var(--fg-disabled)", borderColor: "transparent", boxShadow: "none" }
    : {};

  return (
    <As
      type={type}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...disabledStyle, ...style }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.transform = "translateY(-1px)";
        if (variant === "primary") {
          el.style.background = "var(--action-primary-hover)";
          el.style.boxShadow = hoverShadows.primary;
        }
        if (variant === "accent") {
          el.style.background = "var(--action-accent-hover)";
          el.style.boxShadow = hoverShadows.accent;
        }
        if (variant === "secondary") {
          el.style.background = "var(--action-ghost-hover)";
          el.style.borderColor = "var(--border-strong)";
          el.style.boxShadow = hoverShadows.secondary;
        }
        if (variant === "ghost") {
          el.style.background = "var(--srm-blue-50)";
        }
        if (variant === "ghost-neutral") {
          el.style.background = "var(--action-ghost-hover)";
        }
        if (variant === "danger") {
          el.style.background = "var(--srm-danger-600)";
          el.style.boxShadow = hoverShadows.danger;
        }
        const arrow = el.querySelector("[data-btn-arrow]");
        if (arrow) arrow.style.transform = "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.background = variants[variant].background;
        el.style.boxShadow = variants[variant].boxShadow || "none";
        if (variant === "secondary") el.style.borderColor = "var(--border-default)";
        const arrow = el.querySelector("[data-btn-arrow]");
        if (arrow) arrow.style.transform = "translateX(0)";
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(0)";
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} stroke={1.8} />}
      {children}
      {iconRight && (
        <span data-btn-arrow style={{ display: "inline-flex", transition: "transform 220ms cubic-bezier(0.2,0,0,1)" }}>
          <Icon name={iconRight} size={size === "sm" ? 14 : 16} stroke={1.8} />
        </span>
      )}
    </As>
  );
};

const Card = ({ children, padding = 24, style = {}, ...rest }) => (
  <div
    style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding,
      boxShadow: "var(--shadow-sm)",
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

const Badge = ({ tone = "neutral", children, dot = true, style = {} }) => {
  const tones = {
    neutral: { bg: "var(--srm-neutral-50)", fg: "var(--fg-2)", dot: "var(--srm-neutral-400)" },
    info: { bg: "var(--srm-blue-50)", fg: "var(--srm-blue-700)", dot: "var(--srm-blue-500)" },
    success: { bg: "var(--srm-success-50)", fg: "var(--srm-success-700)", dot: "var(--srm-success-500)" },
    warning: { bg: "var(--srm-warning-50)", fg: "var(--srm-warning-700)", dot: "var(--srm-warning-500)" },
    danger: { bg: "var(--srm-danger-50)", fg: "var(--srm-danger-700)", dot: "var(--srm-danger-500)" },
    accent: { bg: "var(--srm-orange-50)", fg: "var(--srm-orange-700)", dot: "var(--srm-orange-500)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        fontSize: 11.5,
        fontWeight: 500,
        borderRadius: 999,
        lineHeight: 1.4,
        background: t.bg,
        color: t.fg,
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }} />}
      {children}
    </span>
  );
};

const Input = ({ label, hint, error, prefix, suffix, value, onChange, type = "text", placeholder, disabled, style = {}, ...rest }) => {
  const wrapperStyle = {
    display: "flex",
    alignItems: "stretch",
    border: `1px solid ${error ? "var(--srm-danger-500)" : "var(--border-default)"}`,
    borderRadius: "var(--radius-md)",
    background: disabled ? "var(--bg-sunken)" : "white",
    overflow: "hidden",
    transition: "all var(--motion-fast)",
  };
  const inputStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    padding: "9px 12px",
    border: 0,
    flex: 1,
    background: "transparent",
    color: disabled ? "var(--fg-disabled)" : "var(--fg-1)",
    outline: "none",
    fontVariantNumeric: type === "number" || rest.inputMode === "decimal" ? "tabular-nums lining-nums" : undefined,
    minWidth: 0,
    ...style,
  };
  const affixStyle = {
    background: "var(--bg-surface-alt)",
    padding: "9px 12px",
    fontSize: 13,
    color: "var(--fg-2)",
    fontFamily: "var(--font-mono)",
    display: "flex",
    alignItems: "center",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-2)" }}>{label}</label>}
      <div
        style={wrapperStyle}
        onFocus={(e) => {
          if (error || disabled) return;
          e.currentTarget.style.borderColor = "var(--srm-blue-500)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(36,97,175,0.18)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "var(--srm-danger-500)" : "var(--border-default)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {prefix && <div style={{ ...affixStyle, borderRight: "1px solid var(--border-default)" }}>{prefix}</div>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} style={inputStyle} {...rest} />
        {suffix && <div style={{ ...affixStyle, borderLeft: "1px solid var(--border-default)" }}>{suffix}</div>}
      </div>
      {error && (
        <div style={{ fontSize: 11.5, color: "var(--srm-danger-600)", display: "flex", gap: 4, alignItems: "center" }}>
          <Icon name="alertCircle" size={12} stroke={2} /> {error}
        </div>
      )}
      {hint && !error && <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{hint}</div>}
    </div>
  );
};

const Eyebrow = ({ children, style = {} }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--fg-3)",
      ...style,
    }}
  >
    {children}
  </div>
);

const KPI = ({ label, value, delta, deltaTone = "success", meta }) => {
  const tones = { success: "var(--srm-success-700)", danger: "var(--srm-danger-700)", neutral: "var(--fg-2)" };
  const bgs = { success: "var(--srm-success-50)", danger: "var(--srm-danger-50)", neutral: "var(--srm-neutral-50)" };
  return (
    <Card padding={20} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Eyebrow>{label}</Eyebrow>
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          fontVariantNumeric: "tabular-nums lining-nums",
          color: "var(--fg-1)",
          marginTop: 4,
        }}
      >
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, minHeight: 18 }}>
        {delta && (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              padding: "2px 7px",
              borderRadius: 999,
              background: bgs[deltaTone],
              color: tones[deltaTone],
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {delta}
          </span>
        )}
        {meta && (
          <div
            style={{
              fontSize: 12,
              color: "var(--fg-3)",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {meta}
          </div>
        )}
      </div>
    </Card>
  );
};

const Avatar = ({ name, size = 32 }) => {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: "var(--srm-blue-100)",
        color: "var(--srm-blue-700)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

Object.assign(window, { Icon, Button, Card, Badge, Input, Eyebrow, KPI, Avatar });
