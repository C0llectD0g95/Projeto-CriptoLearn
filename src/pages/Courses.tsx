import { useState, useEffect } from "react";
import { Book, Clock, ChevronDown, ChevronUp, CheckCircle, Circle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import { useCourseProgress } from "@/hooks/useCourseProgress";

interface Lesson {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const coursesData = {
  title: "Introdução ao Mundo Crypto",
  description: "Aprenda os fundamentos das criptomoedas e blockchain",
  modules: [
    {
      id: "module-1",
      title: "Módulo 1 - Tokens",
      description: "Entender o conceito de token e os principais tipos de tokens.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "O que são os Tokens?",
          content: `No mundo das criptomoedas, um token é uma representação virtual de um ativo. Um ativo é algo que uma pessoa tem e que pode ser convertido em dinheiro, como imóveis, carros e etc.

Para algo ser um token, ele não só deve ter um valor monetário, como também deve estar registrado em uma blockchain. Por isso que, mesmo que você tire foto da NFT de uma pessoa, a sua foto não irá valer nada, pois, como ela não está registrada na blockchain, ela não irá valer nada.

Uma coisa importante a ser ressaltada é que toda criptomoeda é um token, mas nem todo token é uma criptomoeda.`,
          completed: false,
        },
        {
          id: "lesson-1-2",
          title: "Tipos de Tokens",
          content: `Existem cinco tipos de Tokens, e são eles:

• Tokens de pagamento (Payment Tokens)
• Tokens Mobiliários (Security Tokens)
• Tokens Utilitários
• Tokens de Governança
• NFTs (Non-Fungible Tokens)`,
          completed: false,
        },
        {
          id: "lesson-1-3",
          title: "Tokens de Pagamento",
          content: `Os tokens de pagamento são tokens que funcionam como dinheiro (só que virtual). A maioria das criptomoedas se encontram nesta categoria.

Eles são utilizados como meio de troca em transações digitais e podem ser usados para comprar produtos, serviços ou serem trocados por outras moedas.`,
          completed: false,
        },
        {
          id: "lesson-1-4",
          title: "Tokens Utilitários",
          content: `São tokens que concedem alguma utilidade para as pessoas que o possuem, como desconto em um produto, por exemplo.

A principal diferença entre os tokens utilitários e as criptomoedas é a funcionalidade: Enquanto os tokens utilitário tem como finalidade conceder alguma utilidade para o seu detentor, a criptomoeda tem como finalidade servir como dinheiro para o detentor.

Alguns tokens do tipo NFT podem também ser tokens utilitários.`,
          completed: false,
        },
        {
          id: "lesson-1-5",
          title: "Tokens de Governança",
          content: `São um tipo de Token Utilitário. Esse tipo de token concede ao seu detentor o poder do voto, permitindo que ele possa votar em propostas que realizam mudanças em um projeto.

Geralmente, são usados em projetos de finanças descentralizadas (DeFi) e em Organizações Autônomas Descentralizadas (DAOs).

Os tokens de governança foram criados com o objetivo de tornar o processo da governança (conjunto de regras referente a tomada de decisões sobre algo) de um projeto mais fácil.`,
          completed: false,
        },
        {
          id: "lesson-1-6",
          title: "Non-Fungible Tokens (NFTs)",
          content: `Para entender os Non-fungible Tokens (em português: "Tokens Não fungíveis"), também conhecidos como NFTs, primeiro é necessário entender o que é um bem fungível e um bem não-fungível.

De acordo com o Código Civil Brasileiro, os bens fungíveis são um tipo de bem que pode ser trocado por outro bem de espécie, qualidade e quantidade iguais. Um exemplo de bem fungível é a moeda de R$1,00; que pode ser trocada por outra moeda de R$1,00 ou por duas moedas de R$0,50.

Já os bens não fungíveis, são os bens que são únicos e não podem ser trocados ou substituídos. Um exemplo são pinturas, que não podem ser substituídas por uma cópia.

Portanto, a NFT é um token que representa um item de natureza exclusiva e única, como obras digitais, itens de jogos e etc. Uma NFT é um certificado digital de propriedade e que está registrado na blockchain. Em outras palavras, a NFT é um certificado que afirma quem é o dono do item que ela representa.

Apesar deste certificado poder ser visto por qualquer pessoa, ele não pode ser copiado ou alterado.`,
          completed: false,
        },
        {
          id: "lesson-1-7",
          title: "Tokens Mobiliários (Security Tokens)",
          content: `São tokens que funcionam como ativos imobiliários (como uma ação da Bolsa de Valores).

Como estão "ligados" a algo regulamentado, eles precisam atender às regras de supervisores do mercado de capitais, passando por um processo de verificação chamado de "Howey Test".

Se passarem nessa verificação, eles se tornam um security token, podendo ser negociados como qualquer outro ativo regulamentado.`,
          completed: false,
        },
      ],
    },
  ] as Module[],
};

export default function Courses() {
  const [openModules, setOpenModules] = useState<string[]>(["module-1"]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const {
    completedLessons,
    lastAccessedLesson,
    loading,
    toggleLessonComplete,
    updateLastAccessed,
    isAuthenticated,
  } = useCourseProgress();

  // Restore last accessed lesson or default to first lesson
  useEffect(() => {
    if (loading) return;

    if (lastAccessedLesson) {
      // Find the lesson in the course data
      for (const module of coursesData.modules) {
        const lesson = module.lessons.find((l) => l.id === lastAccessedLesson);
        if (lesson) {
          setSelectedLesson(lesson);
          // Open the module containing this lesson
          if (!openModules.includes(module.id)) {
            setOpenModules((prev) => [...prev, module.id]);
          }
          return;
        }
      }
    }
    
    // Default to first lesson
    setSelectedLesson(coursesData.modules[0].lessons[0]);
  }, [loading, lastAccessedLesson]);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    updateLastAccessed(lesson.id);
  };

  const markAsCompleted = (lessonId: string) => {
    toggleLessonComplete(lessonId);
  };

  const totalLessons = coursesData.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <Badge className="mb-4 bg-crypto-purple/20 text-crypto-purple border-crypto-purple/30">
            Curso em Andamento
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {coursesData.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {coursesData.description}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso do curso</span>
              <span className="text-crypto-green font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-crypto-purple to-crypto-blue transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Modules */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Módulos do Curso
            </h2>
            
            {coursesData.modules.map((module) => (
              <Collapsible
                key={module.id}
                open={openModules.includes(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-crypto-purple/20">
                            <Book className="h-5 w-5 text-crypto-purple" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {module.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} aulas
                            </p>
                          </div>
                        </div>
                        {openModules.includes(module.id) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <li key={lesson.id}>
                            <button
                              onClick={() => handleSelectLesson(lesson)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                                selectedLesson?.id === lesson.id
                                  ? "bg-crypto-purple/20 text-crypto-purple"
                                  : "hover:bg-muted/50 text-foreground"
                              }`}
                            >
                              {completedLessons.includes(lesson.id) ? (
                                <CheckCircle className="h-4 w-4 text-crypto-green flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Main Content - Lesson */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-crypto-purple" />
                </CardContent>
              </Card>
            ) : selectedLesson && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>~5 min de leitura</span>
                  </div>
                  <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    {selectedLesson.content.split("\n\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-foreground/90 leading-relaxed mb-4 whitespace-pre-line"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                    <Button
                      variant={completedLessons.includes(selectedLesson.id) ? "secondary" : "default"}
                      onClick={() => markAsCompleted(selectedLesson.id)}
                      className={
                        completedLessons.includes(selectedLesson.id)
                          ? "bg-crypto-green/20 text-crypto-green hover:bg-crypto-green/30"
                          : "bg-crypto-purple hover:bg-crypto-purple/80"
                      }
                    >
                      {completedLessons.includes(selectedLesson.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Concluído
                        </>
                      ) : (
                        "Marcar como Concluído"
                      )}
                    </Button>
                    
                    <div className="flex gap-2">
                      {(() => {
                        const currentModule = coursesData.modules.find((m) =>
                          m.lessons.some((l) => l.id === selectedLesson.id)
                        );
                        if (!currentModule) return null;
                        
                        const currentIndex = currentModule.lessons.findIndex(
                          (l) => l.id === selectedLesson.id
                        );
                        const nextLesson = currentModule.lessons[currentIndex + 1];
                        
                        return nextLesson ? (
                          <Button
                            variant="outline"
                            onClick={() => handleSelectLesson(nextLesson)}
                          >
                            Próxima Aula →
                          </Button>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
