import { Quiz } from "@/components/ModuleQuiz";

export const quizzes: Quiz[] = [
  {
    moduleId: "module-1",
    title: "Quiz - Módulo 1: Tokens",
    questions: [
      {
        id: "q1-1",
        question: "O que é um token no mundo das criptomoedas?",
        options: [
          "Apenas uma moeda física",
          "Uma representação virtual de um ativo registrado em uma blockchain",
          "Um código de desconto",
          "Uma senha de acesso"
        ],
        correctAnswer: 1,
        explanation: "Um token é uma representação virtual de um ativo que possui valor monetário e está registrado em uma blockchain."
      },
      {
        id: "q1-2",
        question: "Qual a relação entre tokens e criptomoedas?",
        options: [
          "São a mesma coisa",
          "Nem todo token é uma criptomoeda, mas toda criptomoeda é um token",
          "Tokens são sempre mais valiosos que criptomoedas",
          "Criptomoedas não são tokens"
        ],
        correctAnswer: 1,
        explanation: "Toda criptomoeda é um token, mas nem todo token é uma criptomoeda. Tokens podem ter diversas funções além de servir como dinheiro."
      },
      {
        id: "q1-3",
        question: "O que são NFTs?",
        options: [
          "Tokens que podem ser trocados por outros iguais",
          "Tokens não fungíveis que representam itens únicos",
          "Um tipo de criptomoeda de pagamento",
          "Tokens de governança"
        ],
        correctAnswer: 1,
        explanation: "NFTs (Non-Fungible Tokens) são tokens que representam itens únicos e exclusivos, como obras digitais e itens de jogos."
      },
      {
        id: "q1-4",
        question: "Qual é a principal função dos tokens de governança?",
        options: [
          "Servir como dinheiro",
          "Dar descontos em produtos",
          "Permitir que detentores votem em propostas do projeto",
          "Representar ativos imobiliários"
        ],
        correctAnswer: 2,
        explanation: "Os tokens de governança concedem ao detentor o poder do voto, permitindo participar de decisões sobre mudanças em um projeto."
      },
      {
        id: "q1-5",
        question: "O que são Security Tokens?",
        options: [
          "Tokens que garantem segurança na internet",
          "Tokens que funcionam como ativos mobiliários regulamentados",
          "Tokens de pagamento seguros",
          "Senhas de segurança digitais"
        ],
        correctAnswer: 1,
        explanation: "Security Tokens funcionam como ativos mobiliários (como ações) e precisam passar por verificação regulatória chamada 'Howey Test'."
      }
    ]
  },
  {
    moduleId: "module-2",
    title: "Quiz - Módulo 2: Criptomoedas",
    questions: [
      {
        id: "q2-1",
        question: "O que é uma criptomoeda?",
        options: [
          "Dinheiro emitido pelo governo de forma digital",
          "Um token que atua como dinheiro digital não emitido por governos",
          "Apenas uma forma de investimento",
          "Um tipo de cartão de crédito virtual"
        ],
        correctAnswer: 1,
        explanation: "Uma criptomoeda é um tipo de token que atua como dinheiro digital não emitido por nenhum governo."
      },
      {
        id: "q2-2",
        question: "Quem valida as transações de criptomoedas na blockchain?",
        options: [
          "Bancos centrais",
          "Governos",
          "Mineradores",
          "Empresas de tecnologia"
        ],
        correctAnswer: 2,
        explanation: "As transações de criptomoedas são registradas e validadas por mineradores na blockchain."
      },
      {
        id: "q2-3",
        question: "Qual NÃO é uma vantagem de investir em criptomoedas?",
        options: [
          "Alta liquidez",
          "Mercado funciona 24 horas",
          "Garantia de lucro sempre",
          "Transações rápidas e baratas"
        ],
        correctAnswer: 2,
        explanation: "Não existe garantia de lucro em criptomoedas. O mercado envolve riscos elevados, incluindo forte volatilidade e possibilidade de perda total."
      },
      {
        id: "q2-4",
        question: "Qual é um dos principais riscos de investir em criptomoedas?",
        options: [
          "Transações muito lentas",
          "Impossibilidade de diversificação",
          "Forte volatilidade dos preços",
          "Taxas muito altas"
        ],
        correctAnswer: 2,
        explanation: "A forte volatilidade é um dos principais riscos, junto com ausência de regulação clara e possibilidade de perda total do capital."
      }
    ]
  },
  {
    moduleId: "module-3",
    title: "Quiz - Módulo 3: Carteiras",
    questions: [
      {
        id: "q3-1",
        question: "O que são carteiras de criptomoeda (wallets)?",
        options: [
          "Carteiras físicas para guardar dinheiro",
          "Softwares para ver e transferir ativos na blockchain",
          "Contas bancárias digitais",
          "Aplicativos de bancos tradicionais"
        ],
        correctAnswer: 1,
        explanation: "Carteiras de criptomoeda são softwares que permitem ao usuário ver e transferir seus ativos armazenados na blockchain."
      },
      {
        id: "q3-2",
        question: "Qual é a função do 'Endereço' em uma carteira?",
        options: [
          "Funciona como senha de acesso",
          "É usado para recuperar a conta",
          "Serve como identificador público para receber transferências",
          "Protege contra hackers"
        ],
        correctAnswer: 2,
        explanation: "O endereço é uma chave pública que serve como identificador da conta, usado para pagar e receber transferências. É como a chave do PIX."
      },
      {
        id: "q3-3",
        question: "O que acontece se você perder sua Frase de Recuperação?",
        options: [
          "Nada, você pode criar uma nova",
          "O banco ajuda a recuperar",
          "Você perde acesso permanente à sua carteira",
          "Seus ativos são transferidos automaticamente"
        ],
        correctAnswer: 2,
        explanation: "Se você perder a frase de recuperação, você perde acesso permanente à sua carteira e seus ativos."
      },
      {
        id: "q3-4",
        question: "Qual é a diferença entre Hot Wallets e Cold Wallets?",
        options: [
          "Hot Wallets são mais seguras",
          "Cold Wallets estão conectadas à internet",
          "Hot Wallets estão conectadas à internet, Cold Wallets não",
          "Não há diferença significativa"
        ],
        correctAnswer: 2,
        explanation: "Hot Wallets estão conectadas à internet (mais práticas, menos seguras). Cold Wallets ficam offline (mais seguras, menos práticas)."
      },
      {
        id: "q3-5",
        question: "O que é uma Paper Wallet?",
        options: [
          "Uma carteira digital em papel",
          "Um papel com chave pública e privada da carteira",
          "Um tipo de Hot Wallet",
          "Um documento bancário"
        ],
        correctAnswer: 1,
        explanation: "Uma Paper Wallet é um pedaço de papel que contém a chave pública e a chave privada da sua carteira, sendo um tipo de Cold Wallet."
      }
    ]
  },
  {
    moduleId: "module-4",
    title: "Quiz - Módulo 4: Blockchains e Smart Contracts",
    questions: [
      {
        id: "q4-1",
        question: "O que é uma blockchain?",
        options: [
          "Um banco de dados centralizado",
          "Um registro descentralizado de transações que qualquer um pode ver",
          "Um software para minerar criptomoedas",
          "Uma carteira digital"
        ],
        correctAnswer: 1,
        explanation: "A blockchain é um registro de transações feitas usando tokens que qualquer um pode ver, sendo normalmente descentralizada."
      },
      {
        id: "q4-2",
        question: "Quem são os 'nós' ou 'mineradores' na blockchain?",
        options: [
          "Usuários comuns da rede",
          "Bancos que validam transações",
          "Computadores poderosos que registram e validam transações",
          "Empresas de tecnologia"
        ],
        correctAnswer: 2,
        explanation: "Os nós ou mineradores são computadores poderosos capazes de fazer o trabalho de registro e validação de transações na blockchain."
      },
      {
        id: "q4-3",
        question: "O que são soluções de segunda camada (Layer 2)?",
        options: [
          "Atualizações de segurança da blockchain",
          "Redes que funcionam como ramificações para reduzir taxas",
          "Novas criptomoedas",
          "Métodos de mineração mais rápidos"
        ],
        correctAnswer: 1,
        explanation: "As soluções de segunda camada são redes que funcionam como 'ramificações' de uma rede principal, permitindo taxas de gás mais baixas."
      },
      {
        id: "q4-4",
        question: "O que é um Smart Contract?",
        options: [
          "Um contrato físico digitalizado",
          "Um código implantado na blockchain que é imutável, público e autônomo",
          "Uma carteira inteligente",
          "Um tipo de criptomoeda"
        ],
        correctAnswer: 1,
        explanation: "Um Smart Contract é um código escrito em linguagem própria (como Solidity) e implantado na blockchain, sendo imutável, público e autônomo."
      },
      {
        id: "q4-5",
        question: "Qual NÃO é uma função comum dos Smart Contracts?",
        options: [
          "Criar tokens (ERC-20, ERC-721)",
          "Gerenciar governança (votações DAO)",
          "Emitir dinheiro físico",
          "Realizar swaps e staking"
        ],
        correctAnswer: 2,
        explanation: "Smart Contracts operam apenas no ambiente digital da blockchain. Eles podem criar tokens, gerenciar governança, fazer swaps e staking, mas não podem emitir dinheiro físico."
      },
      {
        id: "q4-6",
        question: "Qual é a principal importância dos Smart Contracts?",
        options: [
          "Aumentar os custos das transações",
          "Eliminar burocracia e automatizar operações, reduzindo fraudes",
          "Centralizar o controle das transações",
          "Dificultar o acesso às criptomoedas"
        ],
        correctAnswer: 1,
        explanation: "Os Smart Contracts eliminam burocracia, automatizam transações e operações feitas com tokens, e diminuem o risco de fraude."
      }
    ]
  }
];
