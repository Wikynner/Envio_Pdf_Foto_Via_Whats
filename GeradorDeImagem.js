// Importando os módulos necessários
const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
const pdf = require('pdf-poppler');

// Configurações da API
const apiUrl = "http://localhost:3000/client/sendMessage/comunidadezdg";
const apiKey = "SUA_CHAVE_API_AQUI";
const chatId = "SEU_CHAT_ID_AQUI";

// Caminho para o PDF e saída
const pdfPath = path.resolve('CAMINHO/DO/SEU/PDF/report.pdf');
const outputDir = path.resolve('CAMINHO/DE/SAIDA/output_images');

// Mensagem personalizada
const mensagemPersonalizada = "Texto personalizado";

// Função para converter PDF em imagem e enviar
const sender = async () => {
    try {
        // Garantindo que o diretório de saída exista
        await fs.mkdir(outputDir, { recursive: true });

        // Converter PDF para imagens
        await pdf.convert(pdfPath, {
            format: 'jpeg',
            out_dir: outputDir,
            out_prefix: 'output_image_page'
        });

        // Obtendo e enviando as imagens convertidas
        const imageFiles = (await fs.readdir(outputDir)).filter(file => file.endsWith('.jpg'));
        for (const imageFile of imageFiles) {
            const imagePath = path.resolve(outputDir, imageFile);
            const imageBase64 = await fs.readFile(imagePath, { encoding: 'base64' });

            // Envia a imagem como base64
            const response = await axios.post(
                apiUrl,
                {
                    chatId,
                    contentType: "MessageMedia",
                    content: {
                        mimetype: "image/jpeg",
                        data: imageBase64,
                        filename: imageFile
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey
                    }
                }
            );

            console.log(`Imagem ${imageFile} enviada com sucesso!`, response.data);
        }
    } catch (error) {
        console.error("Erro ao enviar a mensagem:", error.message);
        console.error("Detalhes do erro:", error.response?.data || error);
    }
};

// Executar a função de envio
sender();

/*
INSTRUÇÕES:
- Substitua "SUA_CHAVE_API_AQUI" pela sua chave da API.
- Substitua "SEU_CHAT_ID_AQUI" pelo seu Chat ID.
- Modifique os caminhos do PDF e do diretório de saída de acordo com seu ambiente.

ESSE CÓDIGO:
- Converte um arquivo PDF em várias imagens JPEG.
- Envia as imagens via uma API, convertendo-as para base64.

Dependências:
- axios: para fazer requisições HTTP.
- pdf-poppler: para converter o PDF em imagens.
*/
