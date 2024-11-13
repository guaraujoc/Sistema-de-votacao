/*
Universidade de São Paulo
SSC0958 - Criptomoedas e Blockchain
Gustavo Carvalho Araújo (13735630)
*/

pragma solidity ^0.8.0;

contract Votacao {
    // Estrutura para armazenar informações de um eleitor
    struct Eleitor {
        bool votou;              // Indica se o eleitor já votou
        uint votoEncriptado;     // Voto encriptado (hash do voto)
    }

    // Estrutura para armazenar informações de um candidato
    struct Candidato {
        uint id;                 // ID único do candidato
        string nome;             // Nome do candidato
        uint contagemVotos;      // Contador de votos recebidos pelo candidato
    }

    // Endereço do administrador (quem cria o contrato)
    address public administrador;

    // Mapeamento para armazenar informações dos eleitores
    mapping(address => Eleitor) public eleitores;

    // Lista de candidatos no sistema de votação
    Candidato[] public candidatos;

    // Total de votos registrados
    uint public totalVotos;

    // Eventos para registrar ações no contrato
    event VotoRegistrado(address indexed eleitor, uint votoEncriptado); // Emitido quando alguém vota
    event VotosContabilizados(uint idCandidato, uint contagemVotos);    // Emitido ao contar votos para um candidato

    // Modificador para restringir funções apenas ao administrador
    modifier apenasAdministrador() {
        require(msg.sender == administrador, "Nao autorizado");
        _;
    }

    // Construtor do contrato
    constructor(string[] memory nomesCandidatos) {
        administrador = msg.sender; // Define o administrador como o criador do contrato

        // Adiciona os candidatos ao array
        for (uint i = 0; i < nomesCandidatos.length; i++) {
            candidatos.push(Candidato({
                id: i,                   // ID do candidato (índice no array)
                nome: nomesCandidatos[i], // Nome do candidato
                contagemVotos: 0          // Inicializa o contador de votos como 0
            }));
        }
    }

    // Função para registrar um voto encriptado
    function votar(uint votoEncriptado) public {
        require(!eleitores[msg.sender].votou, "Voce ja votou"); // Verifica se o eleitor já votou

        // Registra o voto
        eleitores[msg.sender] = Eleitor({
            votou: true,               // Marca como votado
            votoEncriptado: votoEncriptado // Armazena o voto encriptado
        });

        totalVotos++; // Incrementa o total de votos registrados

        emit VotoRegistrado(msg.sender, votoEncriptado); // Emite um evento indicando o voto
    }

    // Função para contar os votos descriptografados
    function contabilizarVotos(uint[] memory votosDescriptografados) public apenasAdministrador {
        require(votosDescriptografados.length == totalVotos, "Inconsistencia na contagem de votos"); // Verifica se o número de votos bate

        // Processa os votos descriptografados
        for (uint i = 0; i < votosDescriptografados.length; i++) {
            uint idCandidato = votosDescriptografados[i]; // Obtém o ID do candidato votado
            candidatos[idCandidato].contagemVotos++;      // Incrementa o contador do candidato
        }

        // Emite eventos para cada candidato com o total de votos
        for (uint j = 0; j < candidatos.length; j++) {
            emit VotosContabilizados(candidatos[j].id, candidatos[j].contagemVotos);
        }
    }

    // Função para obter informações de um candidato específico
    function obterCandidato(uint idCandidato) public view returns (string memory nome, uint contagemVotos) {
        Candidato memory candidato = candidatos[idCandidato]; // Obtém o candidato
        return (candidato.nome, candidato.contagemVotos);      // Retorna os dados do candidato
    }
}
