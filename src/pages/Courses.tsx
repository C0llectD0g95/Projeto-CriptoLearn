import { useState, useEffect } from "react";
import { Book, Clock, ChevronDown, ChevronUp, CheckCircle, Circle, Loader2, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import ModuleQuiz from "@/components/ModuleQuiz";
import { quizzes } from "@/data/quizzes";

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
    {
      id: "module-2",
      title: "Módulo 2 - Criptomoedas",
      description: "Entender o conceito de criptomoedas, as vantagens e riscos de investir em criptomoedas e formas de investir nas criptomoedas.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "O que é uma criptomoeda?",
          content: `Uma criptomoeda é um tipo de token que atua como um dinheiro digital que não é emitido por um governo. São exemplos de criptomoedas o Ethereum (ETH), o Bitcoin (BTC) e a Solana (SOL).

As criptomoedas não só possuem a função de dinheiro físico, como também servem para preservar o poder de compra do detentor.

As transações de uma criptomoeda são registradas e validadas por um grupo de pessoas (chamados de mineradores) na blockchain. Isso inclui também o processo de emissão de novas unidades de uma criptomoeda (processo chamado de "mineração").`,
          completed: false,
        },
        {
          id: "lesson-2-2",
          title: "Vantagens e Riscos de investimento",
          content: `Investir em criptomoedas oferece oportunidades de alta rentabilidade, liquidez e acesso a um mercado global descentralizado, que funciona 24 horas por dia e permite transações rápidas e baratas. Além de facilitar a diversificação do portfólio, o setor cresce constantemente com inovações como DeFi, NFTs e Web3.

Por outro lado, o investimento nesse mercado envolve riscos elevados: forte volatilidade, ausência de regulação clara, possibilidade de perda total do capital em projetos frágeis ou fraudulentos, além da responsabilidade de segurança ficar totalmente nas mãos do usuário.

A complexidade técnica e os impactos de fatores macroeconômicos também tornam o ambiente mais desafiador. Assim, criptomoedas podem ser vantajosas, mas exigem estudo, cautela e gestão de risco para evitar decisões impulsivas e perdas significativas.`,
          completed: false,
        },
      ],
    },
    {
      id: "module-3",
      title: "Módulo 3 - Carteiras",
      description: "Entender o que são as carteiras digitais e quais são os tipos de carteiras.",
      lessons: [
        {
          id: "lesson-3-1",
          title: "O que são as carteiras digitais",
          content: `As carteiras de criptomoeda (também chamadas de wallets) são softwares que permitem ao usuário ver e transferir os seus ativos armazenados na Blockchain. Algumas carteiras também permitem que o usuário compre, venda e faça o staking de suas criptomoedas (é possível que ele só consiga fazer de algumas, não de todas).

Em resumo, elas são iguais às carteiras de bancos, porém, você é o "banco", sendo responsável pela segurança da sua carteira. Tenha em mente que, uma vez que você perca acesso a carteira, você perderá permanentemente os seus ativos.`,
          completed: false,
        },
        {
          id: "lesson-3-2",
          title: "Chaves da Carteira",
          content: `Uma carteira é composta por três tipos de chaves, sendo elas:

• Endereço: É uma chave que pode ser vista por qualquer pessoa e serve como um identificador da sua conta. Ela é usada para você pagar e receber transferências de criptomoedas. É como se fosse a chave do pix;

• Chave Privada: É como se fosse uma segunda senha da conta, permitindo você entrar na sua conta. Deve ser guardada com muita segurança, pois, se alguém obter ela, poderá ter acesso aos seus ativos;

• Frase de Recuperação: é um conjunto de 12 a 24 palavras em inglês. Funciona de forma semelhante à chave privada, porém, com duas diferenças: A primeira é que, se você perder ela, você perde acesso a sua conta e a segunda é que existem carteiras que permitem você usar uma senha criada por você ao invés de uma frase de recuperação.`,
          completed: false,
        },
        {
          id: "lesson-3-3",
          title: "Hot Wallets",
          content: `As carteiras são divididas em dois tipos: As Hot Wallets e as Cold Wallets.

As Hot Wallets são carteiras que estão conectadas à Internet. Apesar de serem mais fáceis de criar e usar, elas estão mais suscetíveis a ataques de hackers, pois estão conectadas na Internet.`,
          completed: false,
        },
        {
          id: "lesson-3-4",
          title: "Cold Wallets",
          content: `Diferente das Hot Wallets, as Cold Wallets são carteiras que não estão conectadas na internet, sendo mais seguras que a Hot Wallet. Elas são divididas em hardware wallets e paper wallets:

• Hardware Wallets: São dispositivos físicos que armazenam criptomoedas;

• Paper Wallets: Uma Paper Wallet é um pedaço de papel que contém a chave pública e a chave privada da sua carteira.`,
          completed: false,
        },
      ],
    },
  ] as Module[],
};

export default function Courses() {
  const [openModules, setOpenModules] = useState<string[]>(["module-1"]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  
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
    setSelectedQuiz(null);
    updateLastAccessed(lesson.id);
  };

  const handleSelectQuiz = (moduleId: string) => {
    setSelectedQuiz(moduleId);
    setSelectedLesson(null);
  };

  const handleQuizComplete = (moduleId: string, passed: boolean) => {
    if (passed && !completedQuizzes.includes(moduleId)) {
      setCompletedQuizzes((prev) => [...prev, moduleId]);
    }
  };

  const isModuleComplete = (moduleId: string) => {
    const module = coursesData.modules.find((m) => m.id === moduleId);
    if (!module) return false;
    return module.lessons.every((lesson) => completedLessons.includes(lesson.id));
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
                        {/* Quiz item */}
                        <li>
                          <button
                            onClick={() => handleSelectQuiz(module.id)}
                            disabled={!isModuleComplete(module.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                              selectedQuiz === module.id
                                ? "bg-crypto-purple/20 text-crypto-purple"
                                : !isModuleComplete(module.id)
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-muted/50 text-foreground"
                            }`}
                          >
                            {completedQuizzes.includes(module.id) ? (
                              <CheckCircle className="h-4 w-4 text-crypto-green flex-shrink-0" />
                            ) : (
                              <HelpCircle className="h-4 w-4 text-crypto-blue flex-shrink-0" />
                            )}
                            <span className="text-sm">Quiz do Módulo</span>
                          </button>
                        </li>
                      </ul>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Main Content - Lesson or Quiz */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-crypto-purple" />
                </CardContent>
              </Card>
            ) : selectedQuiz ? (
              (() => {
                const quiz = quizzes.find((q) => q.moduleId === selectedQuiz);
                if (!quiz) return null;
                return (
                  <ModuleQuiz
                    quiz={quiz}
                    onComplete={(passed, score) => handleQuizComplete(selectedQuiz, passed)}
                    isCompleted={completedQuizzes.includes(selectedQuiz)}
                  />
                );
              })()
            ) : selectedLesson ? (
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
                        const currentModuleIndex = coursesData.modules.findIndex((m) =>
                          m.lessons.some((l) => l.id === selectedLesson.id)
                        );
                        if (currentModuleIndex === -1) return null;
                        
                        const currentModule = coursesData.modules[currentModuleIndex];
                        const currentLessonIndex = currentModule.lessons.findIndex(
                          (l) => l.id === selectedLesson.id
                        );
                        
                        // Check if this is the last lesson in the module
                        const isLastLessonInModule = currentLessonIndex === currentModule.lessons.length - 1;
                        
                        if (isLastLessonInModule && isModuleComplete(currentModule.id)) {
                          return (
                            <Button
                              variant="outline"
                              onClick={() => handleSelectQuiz(currentModule.id)}
                            >
                              Fazer Quiz →
                            </Button>
                          );
                        }
                        
                        // Try next lesson in current module
                        let nextLesson = currentModule.lessons[currentLessonIndex + 1];
                        let nextModuleId = currentModule.id;
                        
                        // If no next lesson in current module, try first lesson of next module
                        if (!nextLesson && currentModuleIndex < coursesData.modules.length - 1) {
                          const nextModule = coursesData.modules[currentModuleIndex + 1];
                          nextLesson = nextModule.lessons[0];
                          nextModuleId = nextModule.id;
                        }
                        
                        return nextLesson ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleSelectLesson(nextLesson);
                              if (!openModules.includes(nextModuleId)) {
                                setOpenModules((prev) => [...prev, nextModuleId]);
                              }
                            }}
                          >
                            Próxima Aula →
                          </Button>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
