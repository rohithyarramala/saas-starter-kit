import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// This tells pdfjs where to load worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function pdfToImages(pdfFile: ArrayBuffer): Promise<string[]> {
  const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data: pdfFile }).promise;
  const images: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 }); // Adjust scale for resolution

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render page
    await page.render({ canvasContext: context, viewport }).promise;

    // Convert to image
    images.push(canvas.toDataURL('image/png'));
  }

  return images;
}
