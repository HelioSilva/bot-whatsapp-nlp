// Supports ES6
import { create, Whatsapp } from "venom-bot";
//const venom = require('venom-bot');
const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["pt"], forceNER: true });

// Adds the utterances and intents for the NLP
manager.addDocument("pt", "oi", "saudacao");
manager.addDocument("pt", "tudo bem", "saudacao");
manager.addDocument("pt", "boa tarde", "saudacao");
manager.addDocument("pt", "boa noite", "saudacao");
manager.addDocument("pt", "bom dia", "saudacao");
manager.addDocument("pt", "e ae", "saudacao");

manager.addDocument("pt", "onde fica localizada", "localizacao");
manager.addDocument("pt", "qual o ponto de referencia", "localizacao");
manager.addDocument("pt", "qual o endereço", "localizacao");
manager.addDocument("pt", "qual a localizacao da empresa", "localizacao");

// Train also the NLG
manager.addAnswer(
  "pt",
  "saudacao",
  "Olá, eu sou uma atendente virtual e estou aqui para te ajudar.\nQual sua duvida?"
);
manager.addAnswer(
  "pt",
  "saudacao",
  "Olá, sou um BOT. Adoro tirar dúvidas, qual é a sua?"
);
manager.addAnswer(
  "pt",
  "localizacao",
  "Ficamos localizados na Rua X, nº1000, Centro de Maceió.\nPróximo aos Correios."
);
manager.addAnswer(
  "pt",
  "localizacao",
  "Blz, vou te mandar a localizacao no mapa!"
);

// Função Main
(async () => {
  await manager.train();
  manager.save();
  create("BOT")
    .then((client) => {
      //Evento
      client.onMessage(async (message) => {
        if (message.isGroupMsg === false) {
          const response = await manager.process("pt", message.body);
          if (response.intent === "None") {
            await client.sendText(
              message.from,
              "Ahhh :( Desculpa não entendi sua dúvida\nAinda estou aprendendo as coisas do seu mundo.\n\nEm breve poderei te ajudar mas agora preciso que ligue para o suporte "
            );
          } else {
            await client.sendText(message.from, response.answer);
          }
          console.log(
            "A intenção do Cliente é :",
            response.intent + " e o score é  de ",
            response.score,
            " e o sentimento é de ",
            response.sentiment.type
          );
        }
      });
    })
    .catch((erro) => {
      console.log(erro);
    });
})();
