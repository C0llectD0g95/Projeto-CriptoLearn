import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, RotateCcw, Hash, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Block {
  id: number;
  hash: string;
  prevHash: string;
  timestamp: string;
  transactions: { from: string; to: string; amount: number }[];
}

const generateHash = () => {
  return "0x" + Math.random().toString(16).substring(2, 10).toUpperCase();
};

const initialBlocks: Block[] = [
  {
    id: 1,
    hash: "0x7A3B9F2E",
    prevHash: "0x00000000",
    timestamp: "14:30:25",
    transactions: [
      { from: "Alice", to: "Bob", amount: 0.5 },
    ],
  },
  {
    id: 2,
    hash: "0xC4D8E1F7",
    prevHash: "0x7A3B9F2E",
    timestamp: "14:31:42",
    transactions: [
      { from: "Bob", to: "Carol", amount: 0.3 },
    ],
  },
];

export default function BlockchainVisualization() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<{
    from: string;
    to: string;
    amount: number;
  } | null>(null);
  const [step, setStep] = useState(0);

  const resetVisualization = () => {
    setBlocks(initialBlocks);
    setPendingTransaction(null);
    setStep(0);
    setIsAnimating(false);
  };

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep(1);

    // Step 1: Create pending transaction
    setTimeout(() => {
      setPendingTransaction({ from: "David", to: "Eve", amount: 0.2 });
      setStep(2);
    }, 1000);

    // Step 2: Transaction being validated
    setTimeout(() => {
      setStep(3);
    }, 2500);

    // Step 3: Create new block
    setTimeout(() => {
      const lastBlock = blocks[blocks.length - 1];
      const newBlock: Block = {
        id: lastBlock.id + 1,
        hash: generateHash(),
        prevHash: lastBlock.hash,
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        transactions: [{ from: "David", to: "Eve", amount: 0.2 }],
      };
      setBlocks((prev) => [...prev, newBlock]);
      setPendingTransaction(null);
      setStep(4);
    }, 4000);

    // Reset animation state
    setTimeout(() => {
      setStep(0);
      setIsAnimating(false);
    }, 6000);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-crypto-purple/20">
              <Hash className="h-5 w-5 text-crypto-purple" />
            </div>
            Visualização da Blockchain
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetVisualization}
              disabled={isAnimating}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Resetar
            </Button>
            <Button
              size="sm"
              onClick={startAnimation}
              disabled={isAnimating}
              className="bg-crypto-purple hover:bg-crypto-purple/80"
            >
              <Play className="h-4 w-4 mr-1" />
              Simular Transação
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center p-3 rounded-lg bg-muted/50"
          >
            {step === 0 && (
              <p className="text-muted-foreground">
                Clique em "Simular Transação" para ver como uma nova transação é
                adicionada à blockchain
              </p>
            )}
            {step === 1 && (
              <p className="text-crypto-blue">
                ⏳ Iniciando nova transação...
              </p>
            )}
            {step === 2 && (
              <p className="text-crypto-purple">
                🔄 Transação pendente sendo validada pelos mineradores...
              </p>
            )}
            {step === 3 && (
              <p className="text-crypto-green">
                ✅ Transação validada! Criando novo bloco...
              </p>
            )}
            {step === 4 && (
              <p className="text-crypto-green font-medium">
                🎉 Bloco adicionado à blockchain com sucesso!
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pending Transaction */}
        <AnimatePresence>
          {pendingTransaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="flex justify-center"
            >
              <div className="relative p-4 rounded-xl border-2 border-dashed border-crypto-purple/50 bg-crypto-purple/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-crypto-purple flex items-center justify-center"
                >
                  <span className="text-xs text-white">⚡</span>
                </motion.div>
                <p className="text-sm text-muted-foreground mb-1">
                  Transação Pendente
                </p>
                <div className="flex items-center gap-2 text-foreground">
                  <span className="font-medium">{pendingTransaction.from}</span>
                  <ArrowRight className="h-4 w-4 text-crypto-purple" />
                  <span className="font-medium">{pendingTransaction.to}</span>
                  <span className="text-crypto-green ml-2">
                    {pendingTransaction.amount} ETH
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blockchain Visualization */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-center gap-2 min-w-max px-4">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={index === blocks.length - 1 && step === 4 ? { opacity: 0, scale: 0.5, x: 50 } : false}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex items-center"
              >
                {/* Block */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`relative p-4 rounded-xl border-2 min-w-[200px] ${
                    index === blocks.length - 1 && step === 4
                      ? "border-crypto-green bg-crypto-green/10"
                      : "border-border bg-card"
                  }`}
                >
                  {/* Block Number Badge */}
                  <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-crypto-purple text-white text-xs font-bold">
                    Bloco #{block.id}
                  </div>

                  <div className="mt-2 space-y-3">
                    {/* Hash */}
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Hash</p>
                        <p className="text-xs font-mono text-crypto-blue">
                          {block.hash}
                        </p>
                      </div>
                    </div>

                    {/* Previous Hash */}
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-muted-foreground rotate-180" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Hash Anterior
                        </p>
                        <p className="text-xs font-mono text-crypto-purple">
                          {block.prevHash}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Timestamp
                        </p>
                        <p className="text-xs font-mono">{block.timestamp}</p>
                      </div>
                    </div>

                    {/* Transactions */}
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">
                        Transações
                      </p>
                      {block.transactions.map((tx, txIndex) => (
                        <div
                          key={txIndex}
                          className="flex items-center gap-1 text-xs"
                        >
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{tx.from}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{tx.to}</span>
                          <span className="text-crypto-green ml-1">
                            {tx.amount} ETH
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Chain Connection */}
                {index < blocks.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="flex items-center mx-1"
                  >
                    <div className="w-8 h-1 bg-gradient-to-r from-crypto-purple to-crypto-blue rounded-full" />
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5 text-crypto-blue" />
                    </motion.div>
                    <div className="w-8 h-1 bg-gradient-to-r from-crypto-blue to-crypto-purple rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-crypto-purple" />
            <span>Hash conecta os blocos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-crypto-blue" />
            <span>Hash único do bloco</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-crypto-green" />
            <span>Transação validada</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
