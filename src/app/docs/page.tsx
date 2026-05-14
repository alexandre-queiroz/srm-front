import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-surface-canvas flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl space-y-12 text-center">
        <header className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-brand-blue shadow-brand flex h-16 w-16 items-center justify-center rounded-xl text-white">
              <Icon name="trending" size={32} stroke={2} />
            </div>
          </div>
          <h1 className="t-h1">SRM Asset Design System</h1>
          <p className="t-body-lg text-fg-2">Base técnica para a plataforma de antecipação de recebíveis.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/docs/gallery" className="group block">
            <Card className="group-hover:border-brand-blue h-full cursor-pointer border-2 border-transparent transition-all">
              <Icon name="file" className="text-brand-blue mb-4" size={32} />
              <h2 className="t-h3 mb-2">Galeria de UI</h2>
              <p className="t-body-sm text-fg-3">Visualize todos os componentes atômicos: botões, inputs, badges e indicadores.</p>
            </Card>
          </Link>

          <Link href="/docs/colors" className="group block">
            <Card className="group-hover:border-brand-orange h-full cursor-pointer border-2 border-transparent transition-all">
              <Icon name="chart" className="text-brand-orange mb-4" size={32} />
              <h2 className="t-h3 mb-2">Design Tokens</h2>
              <p className="t-body-sm text-fg-3">Consulte a paleta de cores completa e as escalas de tipografia e espaçamento.</p>
            </Card>
          </Link>
        </div>

        <footer className="pt-8">
          <Link href="/docs/gallery">
            <Button variant="outline" color="neutral" iconRight="arrowRight">
              Ver Componentes
            </Button>
          </Link>
        </footer>
      </div>
    </main>
  );
}
