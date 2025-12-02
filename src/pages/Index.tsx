import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Shield, Wallet, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Aprenda do Zero",
      description: "Cursos completos desde conceitos básicos até estratégias avançadas de trading.",
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Aprenda a proteger seus ativos e evitar golpes no mundo crypto.",
    },
    {
      icon: TrendingUp,
      title: "Análise de Mercado",
      description: "Entenda gráficos, indicadores e faça análises técnicas profissionais.",
    },
    {
      icon: Wallet,
      title: "Carteiras Digitais",
      description: "Configure e gerencie suas carteiras de forma segura e eficiente.",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte-se com outros entusiastas e tire dúvidas em tempo real.",
    },
    {
      icon: Zap,
      title: "DeFi & NFTs",
      description: "Explore finanças descentralizadas, NFTs e o futuro da Web3.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
              Domine o mundo das{" "}
              <span className="gradient-text">Criptomoedas</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Aprenda tudo sobre Bitcoin, Ethereum, DeFi e muito mais. 
              Conecte sua carteira e comece sua jornada no universo crypto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gradient-primary">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Explorar Cursos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Por que aprender conosco?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conteúdo atualizado, prático e pensado para todos os níveis de conhecimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="gradient-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
            <CardContent className="relative p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
                Crie sua conta gratuita, conecte sua carteira e tenha acesso a todo o conteúdo educacional.
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 CryptoLearn. Aprenda sobre criptomoedas de forma segura.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
