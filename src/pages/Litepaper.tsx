import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Litepaper = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-display font-bold">TEA</h1>
            <p className="text-muted-foreground">Versão: 0.1</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                O Token Experimenta para Aprendizado (ou somente TEA) é um token fungível ERC-20 criado com o objetivo de ensinar tanto adultos quanto jovens sobre o mundo das criptomoedas de uma forma totalmente gratuita.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>O Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Na sociedade brasileira contemporânea, a maior parte da população possui acesso à tecnologia e à internet. Apesar de ser algo bom, uma boa parte desses brasileiros não sabem usá-las para melhorar sua condição de vida ou tem receio de usá-las por acharem que isso é algo que não é para pessoas pobres.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>A Solução</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                O Projeto surgiu como uma forma de acabar com os estigmas sobre as criptomoedas e tokens, apresentando os prós e contras desse tipo de investimento.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                O Projeto é dividido em duas partes: A primeira é um token cuja principal funcionalidade é fazer tudo que uma criptomoeda normal faz, porém, sem o mesmo risco, atuando como uma ferramenta didática. A segunda é um curso gratuito que ensina o usuário sobre o mundo dos cripto ativos, fornecendo um pouco do token após concluir o módulo 3 para que o usuário possa usar.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Tokenomics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Informações Básicas</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><span className="font-medium text-foreground">Nome do Token:</span> Token Experimental para Aprendizado</li>
                  <li><span className="font-medium text-foreground">Símbolo:</span> TEA</li>
                  <li><span className="font-medium text-foreground">Suprimento Total:</span> 10 milhões</li>
                  <li><span className="font-medium text-foreground">Decimal:</span> 6</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Distribuição</h3>
                <p className="text-muted-foreground mb-4">Esta é a distribuição de tokens:</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Desenvolvimento</TableCell>
                      <TableCell>3 milhões</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Marketing</TableCell>
                      <TableCell>2 milhões</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Reservas</TableCell>
                      <TableCell>2 milhões</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Distribuição para Usuários</TableCell>
                      <TableCell>3 milhões</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Distribuição de Recursos</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Fundo Educacional (Tesouraria): 45%</li>
                  <li>Recompensa de Staking/Liquidez: 25%</li>
                  <li>Comunidade e Airdrops: 15%</li>
                  <li>Desenvolvimento e Manutenção: 10%</li>
                  <li>Reserva de Liquidez: 5%</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Utilidade</h3>
                <p className="text-muted-foreground mb-2">O TEA é usado para:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><span className="font-medium text-foreground">Pagamento:</span> O TEA é usado para o pagamento de taxas, compra de NFT's e etc.</li>
                  <li><span className="font-medium text-foreground">Aprendizado:</span> O usuário ganha uma pequena quantidade de TEA para aprender na prática sobre criptomoedas.</li>
                  <li><span className="font-medium text-foreground">Staking:</span> O usuário pode bloquear os seus TEA para ganhar recompensas.</li>
                  <li><span className="font-medium text-foreground">Governança:</span> O TEA é usado para permitir que os usuários possam votar não só em simulações de decisões do projeto, como também em decisões reais.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Política de Emissão</h3>
                <p className="text-muted-foreground">500.000 TEA são emitidos anualmente.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Queima (Burn)</h3>
                <p className="text-muted-foreground">A queima de TEA's ocorre tanto manualmente, sendo decidida pela comunidade através da governança.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Abaixo estão futuras adições para o projeto:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">2026:</span> Criação de um curso sobre estratégias de investimento em criptomoedas.
                </li>
                <li>
                  <span className="font-medium text-foreground">2027:</span> Criação de um jogo P2E (Play-to-Earn) que usa o TEA como moeda para atrair jovens para aprender sobre o mundo de criptomoedas.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Guilherme Soares</span> - Faz tudo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Github:</span> Descrição
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Discord:</span> @cd.95 (874266841273470986)
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Litepaper;
