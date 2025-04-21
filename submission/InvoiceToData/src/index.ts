import 'dotenv/config';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  Type,
} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function main() {
  const myfile = await ai.files.upload({
    file: __dirname + "/invoice.pdf",
    config: { mimeType: "application/pdf" },
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: createUserContent([
      createPartFromUri(myfile.uri!, myfile.mimeType!),
      "Describe this audio clip",
    ]),
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            'invoiceNumber': {
              type: Type.NUMBER,
              description: 'invoice number',
              nullable: false
            },
            'DateOfIssue': {
              type: Type.STRING,
              description: 'Date of issue',
              nullable: false
            },
            'Seller': {
              type: Type.STRING,
              description: 'Seller',
              nullable: false
            },
            'Client': {
              type: Type.STRING,
              description: 'Client',
              nullable: false
            },
            'ITEMS': {
              type: Type.ARRAY,
              description: 'ITEMS',
              nullable: false,
              items: {
                type: Type.OBJECT,
                properties: {
                  'No': {
                    type: Type.STRING,
                    description: 'Serial number present in table header',
                    nullable: false
                  },
                  'Description': {
                    type: Type.STRING,
                    description: 'Serial number present in table header',
                    nullable: false
                  },
                  'Qty': {
                    type: Type.NUMBER,
                    description: 'Serial number present in table header',
                    nullable: false
                  },
                }
              }
            },
          },
          required: ['invoiceNumber', "DateOfIssue", "Seller", "Client", "ITEMS"]
        }
      }
    }
  });
  console.log(response.text);
}

main();