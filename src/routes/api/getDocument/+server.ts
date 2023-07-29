// src/routes/generateDocx.ts
import { writable } from 'svelte/store';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import JSZip from 'jszip';
import { json } from '@sveltejs/kit';
import * as fs from "fs";

// Create a writable store with an initial value of null
// export const generatedDoc = writable(null);

export async function POST(request: { json: () => PromiseLike<{ bulletPoints: any; otherData: any; }> | { bulletPoints: any; otherData: any; }; }) {
  console.log('~[getDocument] !!!')
  // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
  // This simple example will only contain one section
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun("HELLO WORLD!!"),
              new TextRun({
                  text: "Foo Bar",
                  bold: true,
              }),
              new TextRun({
                  text: "\tGithub is the best!!!",
                  bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });
  
  // // Generate the Word document as a buffer
  // const buffer = await Packer.toBuffer(doc);

  // // Save the document as a file
  // saveAs(new Blob([buffer]), 'document.docx');
  console.log('~document !!!')
  // Used to export the file into a .docx file
  // const tempFilePath = '/public/documents/';
  const tempFilePath = '/src/documents/document.docx';
  Packer.toBuffer(doc).then((buffer) => {
    // fs.writeFileSync(tempFilePath, buffer);
    fs.writeFileSync("document.docx", buffer);
  });

  return json({ success: true, filePath: tempFilePath })
}