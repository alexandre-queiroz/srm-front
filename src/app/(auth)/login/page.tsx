"use client";

import React, { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/auth-actions";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await loginAction({ email, password });

      if (result && "error" in result) {
        throw new Error(result.error);
      }

      toast.success("Login realizado com sucesso!");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-brand-blue-950 overflow-hidden">
      {/* Left Side: Minimalist Brand Visual (60%) */}
      <div className="hidden lg:flex w-[60%] relative flex-col justify-center p-24 overflow-hidden border-r border-white/5 bg-brand-blue-950">
        
        {/* Watermark Icon - Side positioned */}
        <div 
          className="absolute -bottom-24 -left-24 w-[600px] h-[600px] opacity-[0.06] pointer-events-none select-none grayscale invert"
          style={{ 
            backgroundImage: "url('/assets/logo-icon.png')",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          }}
        />

        <div className="relative z-10 max-w-2xl">
          {/* Using t-h1 from design system */}
          <h1 className="t-h1 !text-[56px] !text-white !leading-[1.1] mb-8">
            A inteligência por trás do seu <br />
            Crescimento Financeiro
          </h1>
          
          {/* Using t-body-lg from design system */}
          <p className="t-body-lg !text-white/40 !text-xl max-w-lg">
            Soluções completas em antecipação de recebíveis, gestão de ativos e crédito estruturado para empresas que não param de crescer.
          </p>

          <div className="mt-12 flex items-center gap-10">
            <div className="flex flex-col">
              <span className="t-kpi !text-white !text-4xl">R$ 12B+</span>
              <span className="t-eyebrow !text-white/30 mt-1">Operados/Ano</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="t-kpi !text-white !text-4xl">98%</span>
              <span className="t-eyebrow !text-white/30 mt-1">Satisfação</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-24 z-10">
          <p className="t-eyebrow !text-white/10 tracking-[0.4em]">
            &copy; 2026 SRM ASSET MANAGEMENT
          </p>
        </div>
      </div>

      {/* Right Side: Login Form (40%) */}
      <div className="w-full lg:w-[40%] bg-white flex flex-col p-12 sm:p-24 justify-center relative">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden mb-12 flex justify-center">
               <Image 
                src="/assets/logo-full.png" 
                alt="SRM Asset" 
                width={140} 
                height={50} 
                style={{ height: 'auto' }}
                priority
              />
            </div>
            <Badge color="brand" variant="soft" className="mb-4">Mesa de Operações</Badge>
            <h2 className="t-h2 !text-3xl tracking-tight">Login</h2>
            <p className="t-body !text-fg-3 mt-2">Acesse sua conta para gerenciar suas operações.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Input 
                label="E-mail" 
                placeholder="Digite seu e-mail" 
                type="email" 
                icon="user"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="space-y-1">
                <Input 
                  label="Senha" 
                  placeholder="••••••••" 
                  type="password" 
                  icon="lock"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <Link href="#" className="text-sm font-bold text-brand-blue-600 hover:text-brand-blue-700 transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>
            </div>

            <div className="py-1">
              <Checkbox 
                label="Manter-me conectado"
                id="remember"
              />
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar no sistema
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="t-body-sm text-fg-3">
              Problemas com o acesso?{" "}
              <Link href="#" className="font-bold text-brand-blue-600 hover:underline">
                Contatar suporte
              </Link>
            </p>
          </div>
          
          <div className="mt-auto pt-12 flex justify-center opacity-30">
            <Image 
              src="/assets/logo-icon.png" 
              alt="SRM" 
              width={24} 
              height={24} 
              style={{ height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
