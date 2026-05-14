// Login screen — entry to SRM platform

const Login = ({ onLogin }) => {
  const [email, setEmail] = React.useState("mariana@construtora-horizonte.com.br");
  const [password, setPassword] = React.useState("••••••••••");
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 350);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 480px",
        background: "white",
      }}
    >
      {/* Left — institutional dark panel */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(155deg, var(--srm-blue-700) 0%, var(--srm-blue-900) 100%)",
          color: "white",
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src="../../assets/logo-icon.png"
          style={{
            position: "absolute",
            right: -120,
            bottom: -120,
            width: 480,
            opacity: 0.08,
            borderRadius: 0,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="../../assets/logo-icon.png" style={{ width: 40, height: 40, borderRadius: 8, background: "white" }} />
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>SRM Asset</div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
          <Eyebrow style={{ color: "rgba(255,255,255,0.6)" }}>Capital em movimento</Eyebrow>
          <h2
            style={{
              margin: "14px 0 18px",
              fontSize: 38,
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Antecipe seus recebíveis em até uma hora.
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "rgba(255,255,255,0.75)" }}>
            Plataforma de antecipação de duplicatas para cedentes e cotistas dos fundos FIDC da SRM Asset. 17 anos de mercado, R$ 2 bilhões
            em operações anuais.
          </p>

          <div style={{ display: "flex", gap: 32, marginTop: 36 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>2.500+</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>clientes ativos</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>R$ 2 bi</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>em operações/ano</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>17 anos</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>de mercado</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", marginTop: 36 }}>
          © 2026 SRM Asset · Gestão de fundos autorizada CVM
        </div>
      </div>

      {/* Right — form */}
      <div
        style={{
          padding: "64px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Eyebrow>Entrar na plataforma</Eyebrow>
        <h1 style={{ margin: "8px 0 6px", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>Bem-vindo de volta.</h1>
        <p style={{ margin: "0 0 32px", color: "var(--fg-2)", fontSize: 14 }}>Acesse sua conta para gerenciar suas operações.</p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="E-mail corporativo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com.br" />
          <div>
            <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a href="#" style={{ fontSize: 12, marginTop: 8, display: "inline-block" }}>
              Esqueci minha senha
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            iconRight={loading ? null : "arrowRight"}
            style={{ marginTop: 8, justifyContent: "center" }}
          >
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <div
          style={{
            marginTop: 28,
            padding: "12px 14px",
            background: "var(--bg-canvas)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 12.5,
            color: "var(--fg-2)",
            lineHeight: 1.45,
          }}
        >
          <Icon name="shield" size={16} stroke={1.7} style={{ color: "var(--srm-blue-500)", flexShrink: 0, marginTop: 1 }} />
          <span>Conexão protegida por criptografia TLS 1.3. A SRM Asset não solicita sua senha por e-mail ou telefone.</span>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 32, fontSize: 13, color: "var(--fg-2)", textAlign: "center" }}>
          Primeira vez na plataforma?{" "}
          <a href="#" style={{ fontWeight: 500 }}>
            Solicitar cadastro
          </a>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Login });
