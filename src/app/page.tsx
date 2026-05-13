import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-12 text-center">
        <header className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-brand">
              <Icon name="trending" size={32} stroke={2} />
            </div>
          </div>
          <h1 className="t-h1">SRM Asset Design System</h1>
          <p className="t-body-lg text-fg-2">
            Base técnica para a plataforma de antecipação de recebíveis.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/gallery" className="block group">
            <Card className="h-full border-2 border-transparent group-hover:border-brand-blue transition-all cursor-pointer">
              <Icon name="file" className="mb-4 text-brand-blue" size={32} />
              <h2 className="t-h3 mb-2">Galeria de UI</h2>
              <p className="t-body-sm text-fg-3">
                Visualize todos os componentes atômicos: botões, inputs, badges e indicadores.
              </p>
            </Card>
          </Link>

          <Link href="/colors" className="block group">
            <Card className="h-full border-2 border-transparent group-hover:border-brand-orange transition-all cursor-pointer">
              <Icon name="chart" className="mb-4 text-brand-orange" size={32} />
              <h2 className="t-h3 mb-2">Design Tokens</h2>
              <p className="t-body-sm text-fg-3">
                Consulte a paleta de cores completa e as escalas de tipografia e espaçamento.
              </p>
            </Card>
          </Link>
        </div>

        <footer className="pt-8">
          <Button variant="secondary" href="/gallery" iconRight="arrowRight">
            Ver Componentes
          </Button>
        </footer>
      </div>
    </main>
  );
}
