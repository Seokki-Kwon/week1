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
              'invoiceNumber':{
                type: Type.STRING,
                description: 'invoice number',
                nullable: false
              }
            },
            required: ['invoiceNumber']
          }
        }
      }
    });
    console.log(response.text);
  }
  
  main();