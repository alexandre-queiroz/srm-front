// Sidebar + Header for the SRM platform shell

const Sidebar = ({ active, onNavigate, role }) => {
  const cedenteNav = [
    { id: "dashboard", icon: "home", label: "Painel" },
    { id: "nova", icon: "plus", label: "Nova antecipação", highlight: true },
    { id: "operacoes", icon: "file", label: "Operações", badge: "23" },
    { id: "sacados", icon: "building", label: "Sacados" },
    { id: "extrato", icon: "receipt", label: "Extrato" },
    { id: "relatorios", icon: "chart", label: "Relatórios" },
  ];
  const investidorNav = [
    { id: "dashboard", icon: "home", label: "Painel" },
    { id: "carteira", icon: "wallet", label: "Carteira" },
    { id: "fundos", icon: "trending", label: "Fundos FIDC" },
    { id: "extrato", icon: "receipt", label: "Extrato" },
    { id: "relatorios", icon: "chart", label: "Relatórios" },
  ];
  const nav = role === "investidor" ? investidorNav : cedenteNav;
  const footerNav = [
    { id: "compliance", icon: "shield", label: "Compliance" },
    { id: "settings", icon: "settings", label: "Configurações" },
  ];

  const Item = ({ item }) => {
    const isActive = active === item.id;
    return (
      <button
        onClick={() => onNavigate(item.id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          padding: "9px 12px",
          border: 0,
          borderRadius: "var(--radius-md)",
          background: isActive ? "var(--srm-blue-50)" : "transparent",
          color: isActive ? "var(--srm-blue-700)" : "var(--fg-2)",
          fontFamily: "var(--font-sans)",
          fontSize: 13.5,
          fontWeight: isActive ? 600 : 500,
          cursor: "pointer",
          textAlign: "left",
          transition: "all var(--motion-fast)",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = "var(--srm-neutral-50)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        {isActive && (
          <span
            style={{
              position: "absolute",
              left: -16,
              top: 4,
              bottom: 4,
              width: 3,
              background: "var(--srm-blue-500)",
              borderRadius: "0 3px 3px 0",
            }}
          />
        )}
        <Icon name={item.icon} size={18} stroke={1.7} />
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && (
          <span
            style={{
              background: isActive ? "var(--srm-blue-500)" : "var(--srm-neutral-200)",
              color: isActive ? "white" : "var(--fg-2)",
              fontSize: 10.5,
              fontWeight: 600,
              padding: "1px 7px",
              borderRadius: 999,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {item.badge}
          </span>
        )}
        {item.highlight && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--srm-orange-500)",
            }}
          />
        )}
      </button>
    );
  };

  return (
    <aside
      style={{
        width: 248,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        padding: "20px 16px",
        gap: 4,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 16px" }}>
        <img src="../../assets/logo-icon.png" alt="SRM" style={{ width: 32, height: 32, borderRadius: 6 }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.01em" }}>SRM Asset</div>
          <div style={{ fontSize: 10.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>
            {role === "investidor" ? "Investidor" : "Cedente"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 2, borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
        {footerNav.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>

      <div
        style={{
          marginTop: 8,
          padding: 12,
          background: "var(--bg-canvas)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Avatar name="Mariana Oliveira" size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "var(--fg-1)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Mariana Oliveira
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-3)" }}>Construtora Horizonte</div>
        </div>
        <button style={{ background: "transparent", border: 0, color: "var(--fg-3)", cursor: "pointer", padding: 4 }} title="Sair">
          <Icon name="logout" size={16} stroke={1.7} />
        </button>
      </div>
    </aside>
  );
};

const Header = ({ title, breadcrumbs, role, onRoleChange, onAction, actionLabel }) => (
  <header
    style={{
      height: 64,
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexShrink: 0,
    }}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--fg-3)", marginBottom: 2 }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chevronRight" size={11} stroke={2} />}
              <span style={i === breadcrumbs.length - 1 ? { color: "var(--fg-2)" } : {}}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <h1
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--fg-1)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 100,
        }}
      >
        {title}
      </h1>
    </div>

    <div
      className="header-search"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 12px",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        width: 240,
        background: "var(--bg-canvas)",
        color: "var(--fg-3)",
        fontSize: 12.5,
        flexShrink: 1,
        minWidth: 0,
      }}
    >
      <Icon name="search" size={15} stroke={1.7} style={{ flexShrink: 0 }} />
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>Buscar duplicata, sacado…</span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          padding: "1px 5px",
          background: "white",
          border: "1px solid var(--border-subtle)",
          borderRadius: 3,
          flexShrink: 0,
        }}
      >
        ⌘K
      </span>
    </div>

    <button
      onClick={() => onRoleChange(role === "cedente" ? "investidor" : "cedente")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px 6px 12px",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-pill)",
        background: "white",
        cursor: "pointer",
        fontSize: 12.5,
        fontWeight: 500,
        color: "var(--fg-2)",
      }}
      title="Trocar de perfil"
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: role === "investidor" ? "var(--srm-orange-500)" : "var(--srm-blue-500)",
        }}
      />
      {role === "investidor" ? "Investidor" : "Cedente"}
      <Icon name="chevronDown" size={13} stroke={1.8} />
    </button>

    <button style={{ position: "relative", background: "transparent", border: 0, color: "var(--fg-2)", cursor: "pointer", padding: 8 }}>
      <Icon name="bell" size={18} stroke={1.7} />
      <span
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 7,
          height: 7,
          borderRadius: 999,
          background: "var(--srm-orange-500)",
          border: "1.5px solid white",
        }}
      />
    </button>

    {actionLabel && (
      <Button variant="primary" icon="plus" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </header>
);

Object.assign(window, { Sidebar, Header });
