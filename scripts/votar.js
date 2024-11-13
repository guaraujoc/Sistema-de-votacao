const Web3 = require("web3");  // Importa a biblioteca Web3 para interagir com a blockchain Ethereum
const fs = require("fs");      // Importa o módulo fs para ler arquivos do sistema

// Cria uma instância do Web3 conectando ao nó local Ethereum (por exemplo, Ganache ou Besu)
const web3 = new Web3("http://localhost:8545");

// Definição de variáveis de endereço e chave privada
const enderecoContrato = "0x4523b320593D4E0AaB304a47c062e0Fb8ad45308"; // Endereço do contrato inteligente
const enderecoVotante = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88"; // Endereço do votante (usuário)
const chavePrivada = "0x8f7a4b4f0b20767a34c813577dfbfedb56d270a06f7b17915831380a804ba194";  // Chave privada do votante (usuário)

// Lê o arquivo JSON do contrato inteligente, que contém o ABI do contrato
const arquivoContrato = JSON.parse(fs.readFileSync("./artifacts/contracts/contrato.sol/Votacao.json", "utf-8"));

// Cria uma instância do contrato inteligente utilizando o ABI e o endereço do contrato
const contrato = new web3.eth.Contract(arquivoContrato.abi, enderecoContrato);

// Função para registrar o voto na blockchain
const votar = async (votoEncriptado) => {
  try {
    // Chama o método 'votar' do contrato inteligente passando o voto encriptado
    const transacao = contrato.methods.votar(votoEncriptado);

    // Codifica a transação para enviar os dados binários necessários à blockchain
    const dados = transacao.encodeABI();

    // Assina a transação com a chave privada do votante
    const transacaoAssinada = await web3.eth.accounts.signTransaction(
      {
        to: enderecoContrato,              // Endereço do contrato inteligente
        data: dados,                        // Dados codificados da transação
        from: enderecoVotante,              // Endereço do votante
        gas: 2000000                        // Quantidade de gas estimada para a transação
      },
      chavePrivada  // Chave privada do votante para assinar a transação
    );

    // Envia a transação assinada para a blockchain e aguarda o recibo da transação
    const recibo = await web3.eth.sendSignedTransaction(transacaoAssinada.rawTransaction);

    // Exibe o hash da transação no console para confirmar que o voto foi registrado com sucesso
    console.log("Voto registrado com sucesso:", recibo.transactionHash);
  } catch (erro) {
    // Caso ocorra algum erro durante o processo, exibe o erro no console
    console.error("Erro ao registrar voto:", erro);
  }
};

// Exemplo de voto encriptado (ajuste conforme necessário)
const votoEncriptado = 1; // Este valor deve ser um hash ou valor encriptado
votar(votoEncriptado).catch(console.error);
