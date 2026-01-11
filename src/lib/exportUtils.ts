import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export const exportNoteToPDF = (
  title: string,
  notes: string,
  summary?: string,
  questions?: string[],
  category?: string
) => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, yPosition);
  yPosition += 10;

  // Add category and date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Category: ${category || 'General'}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;

  // Add original notes
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Original Notes', 20, yPosition);
  yPosition += 7;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const notesLines = doc.splitTextToSize(notes, 170);
  doc.text(notesLines, 20, yPosition);
  yPosition += notesLines.length * 5 + 10;

  // Add summary if exists
  if (summary) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(summary, 170);
    doc.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 5 + 10;
  }

  // Add questions if exist
  if (questions && questions.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Practice Questions', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    questions.forEach((q, i) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      const questionText = `${i + 1}. ${q}`;
      const questionLines = doc.splitTextToSize(questionText, 170);
      doc.text(questionLines, 20, yPosition);
      yPosition += questionLines.length * 5 + 5;
    });
  }

  // Save the PDF
  doc.save(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};

export const exportSummaryToPDF = (title: string, summary: string, category?: string) => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Summary: ${title}`, 20, yPosition);
  yPosition += 10;

  // Add metadata
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Category: ${category || 'General'}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;

  // Add summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  const summaryLines = doc.splitTextToSize(summary, 170);
  doc.text(summaryLines, 20, yPosition);

  // Save
  doc.save(`Summary_${title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};

export const exportQuestionsToPDF = (title: string, questions: string[], category?: string) => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Questions: ${title}`, 20, yPosition);
  yPosition += 10;

  // Add metadata
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Category: ${category || 'General'}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;

  // Add questions
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Practice Questions', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  questions.forEach((q, i) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    const questionText = `${i + 1}. ${q}`;
    const questionLines = doc.splitTextToSize(questionText, 170);
    doc.text(questionLines, 20, yPosition);
    yPosition += questionLines.length * 5 + 7;
  });

  // Save
  doc.save(`Questions_${title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};

export const exportToText = (title: string, notes: string, summary?: string, questions?: string[]) => {
  let content = `${title}\n`;
  content += `${'='.repeat(title.length)}\n\n`;
  content += `Date: ${new Date().toLocaleDateString()}\n\n`;
  
  content += `ORIGINAL NOTES\n`;
  content += `${'-'.repeat(50)}\n`;
  content += `${notes}\n\n`;

  if (summary) {
    content += `SUMMARY\n`;
    content += `${'-'.repeat(50)}\n`;
    content += `${summary}\n\n`;
  }

  if (questions && questions.length > 0) {
    content += `PRACTICE QUESTIONS\n`;
    content += `${'-'.repeat(50)}\n`;
    questions.forEach((q, i) => {
      content += `${i + 1}. ${q}\n\n`;
    });
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_')}.txt`);
};

export const exportToMarkdown = (title: string, notes: string, summary?: string, questions?: string[], category?: string) => {
  let content = `# ${title}\n\n`;
  content += `**Category:** ${category || 'General'}  \n`;
  content += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
  content += `---\n\n`;
  
  content += `## Original Notes\n\n`;
  content += `${notes}\n\n`;

  if (summary) {
    content += `## Summary\n\n`;
    content += `${summary}\n\n`;
  }

  if (questions && questions.length > 0) {
    content += `## Practice Questions\n\n`;
    questions.forEach((q, i) => {
      content += `${i + 1}. ${q}\n`;
    });
  }

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_')}.md`);
};