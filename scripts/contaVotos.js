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
const enderecoContrato = "0x3d0510cf966b41aa11f7B99716b9d0b47d226223"; // Endereço do contrato inteligente
const enderecoAdministrador = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88"; // Endereço do administrador
const chavePrivada = "0x8f7a4b4f0b20767a34c813577dfbfedb56d270a06f7b17915831380a804ba194";  // Chave privada do administrador

// Lê o arquivo JSON do contrato inteligente, que contém o ABI e o bytecode
const arquivoContrato = JSON.parse(fs.readFileSync("./artifacts/contracts/contrato.sol/Votacao.json", "utf-8"));

// Cria uma instância do contrato inteligente utilizando o ABI e o endereço do contrato
const contrato = new web3.eth.Contract(arquivoContrato.abi, enderecoContrato);

// Função para contabilizar os votos no contrato inteligente
const contarVotos = async () => {
  try {
    // Chama o método 'contabilizarVotos' do contrato com um array de votos (exemplo: [0, 1, 2])
    const transacao = contrato.methods.contabilizarVotos([0, 1, 2]);

    // Estima a quantidade de gas necessária para executar a transação
    const gasEstimada = await transacao.estimateGas({ from: enderecoAdministrador });

    // Codifica a transação para enviar os dados binários necessários à blockchain
    const dadosCodificados = transacao.encodeABI();

    // Assina a transação com a chave privada do administrador
    const transacaoAssinada = await web3.eth.accounts.signTransaction(
      {
        to: enderecoContrato,            // Endereço do contrato inteligente
        data: dadosCodificados,          // Dados codificados da transação
        from: enderecoAdministrador,     // Endereço do administrador
        gas: gasEstimada,                // Quantidade de gas estimada
      },
      chavePrivada  // Chave privada do administrador para assinar a transação
    );

    // Envia a transação assinada para a blockchain e aguarda o recibo da transação
    const recibo = await web3.eth.sendSignedTransaction(transacaoAssinada.rawTransaction);

    // Exibe o hash da transação no console para confirmar que a votação foi contabilizada com sucesso
    console.log("Votação contabilizada com sucesso:", recibo.transactionHash);
  } catch (erro) {
    // Caso ocorra algum erro durante o processo, exibe o erro no console
    console.error("Erro ao contar votos:", erro);
  }
};

// Chama a função 'contarVotos' para executar a contabilização dos votos
contarVotos().catch(console.error);
