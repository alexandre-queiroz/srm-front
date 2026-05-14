// App shell — wires together login, sidebar, header, and screens

const App = () => {
  const [authed, setAuthed] = React.useState(false);
  const [role, setRole] = React.useState("cedente");
  const [route, setRoute] = React.useState("dashboard");

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  const titles = {
    dashboard: role === "investidor" ? "Painel do investidor" : "Painel do cedente",
    nova: "Nova antecipação",
    operacoes: "Operações",
    sacados: "Sacados",
    extrato: "Extrato",
    relatorios: "Relatórios",
    carteira: "Carteira",
    fundos: "Fundos FIDC",
    compliance: "Compliance",
    settings: "Configurações",
  };
  const breadcrumbs = {
    dashboard: [],
    nova: ["Painel", "Nova antecipação"],
    operacoes: ["Painel", "Operações"],
    carteira: ["Painel", "Carteira"],
    fundos: ["Painel", "Fundos FIDC"],
  };

  const renderRoute = () => {
    if (role === "investidor" && route === "dashboard") return <InvestidorView />;
    if (role === "investidor" && route === "carteira") return <InvestidorView />;

    if (route === "dashboard") return <Dashboard onNewOperation={() => setRoute("nova")} onOpenOperation={() => setRoute("operacoes")} />;
    if (route === "nova") return <NovaAntecipacao onBack={() => setRoute("dashboard")} onComplete={() => setRoute("dashboard")} />;
    if (route === "operacoes") return <Operacoes />;

    // Fallback for routes we haven't filled in
    return (
      <Card padding={48} style={{ textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "var(--srm-blue-50)",
            color: "var(--srm-blue-500)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <Icon name="file" size={28} stroke={1.5} />
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 600 }}>{titles[route]}</h2>
        <p
          style={{
            margin: 0,
            color: "var(--fg-2)",
            maxWidth: 380,
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          Esta tela ainda não foi recriada neste kit. Use Painel ou Operações para ver o fluxo completo.
        </p>
      </Card>
    );
  };

  const headerAction =
    route === "dashboard" && role === "cedente"
      ? {
          label: "Nova antecipação",
          onAction: () => setRoute("nova"),
        }
      : {};

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-canvas)" }}>
      <Sidebar active={route} onNavigate={setRoute} role={role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header
          title={titles[route]}
          breadcrumbs={breadcrumbs[route]}
          role={role}
          onRoleChange={(r) => {
            setRole(r);
            setRoute("dashboard");
          }}
          actionLabel={headerAction.label}
          onAction={headerAction.onAction}
        />
        <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>{renderRoute()}</main>
      </div>
    </div>
  );
};

Object.assign(window, { App });
