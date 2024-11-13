/*
Universidade de São Paulo
SSC0958 - Criptomoedas e blockchain
Gustavo Carvalho Araújo (13735630)
*/

const Web3 = require("web3");  // Importa a biblioteca Web3 para interagir com a blockchain Ethereum
const fs = require("fs");      // Importa o módulo fs para ler arquivos do sistema

// Cria uma instância do Web3 conectando ao nó local Ethereum (por exemplo, Ganache ou Besu)
const web3 = new Web3("http://localhost:8545");

// Definição de variáveis de endereço e chave privada
const enderecoAdministrador = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88"; // Endereço do administrador
const chavePrivada = "0x8f7a4b4f0b20767a34c813577dfbfedb56d270a06f7b17915831380a804ba194"; // Chave privada do administrador

// Lê o arquivo JSON do contrato inteligente, que contém o ABI e o bytecode do contrato
const arquivoContrato = JSON.parse(fs.readFileSync("./artifacts/contracts/contrato.sol/Votacao.json", "utf-8"));

// Função para implantar o contrato inteligente na blockchain
const implantarContrato = async () => {
  // Cria uma instância do contrato inteligente utilizando o ABI, sem fornecer um endereço (ainda não implantado)
  const contrato = new web3.eth.Contract(arquivoContrato.abi);

  // Cria a transação de implantação do contrato, passando os dados do bytecode e os argumentos do contrato
  const transacao = contrato.deploy({
    data: arquivoContrato.bytecode,  // Bytecode do contrato inteligente (código compilado)
    arguments: [candidatos],         // Argumentos passados para o contrato (neste caso, os candidatos)
  });

  // Estima a quantidade de gas necessária para executar a transação de implantação
  const gasEstimada = await transacao.estimateGas({ from: enderecoAdministrador });

  // Codifica a transação para enviar os dados binários necessários à blockchain
  const dadosCodificados = transacao.encodeABI();

  // Assina a transação com a chave privada do administrador
  const transacaoAssinada = await web3.eth.accounts.signTransaction(
    {
      data: dadosCodificados,            // Dados codificados da transação
      from: enderecoAdministrador,       // Endereço do administrador
      gas: gasEstimada                   // Quantidade de gas estimada
    },
    chavePrivada  // Chave privada do administrador para assinar a transação
  );

  // Envia a transação assinada para a blockchain e aguarda o recibo da transação
  const recibo = await web3.eth.sendSignedTransaction(transacaoAssinada.rawTransaction);

  // Exibe o endereço do contrato implantado na blockchain
  console.log("Contrato implantado em:", recibo.contractAddress);
};

// Chama a função 'implantarContrato' para implantar o contrato inteligente na blockchain
implantarContrato().catch(console.error);
