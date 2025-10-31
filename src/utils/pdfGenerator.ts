import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Fruit {
  shop: string;
  fruit: string;
  package: string;
  quantity: string;
  price: string;
  date: string;
}

interface PaymentEntry {
  shop: string;
  amount: number;
  date: string;
}

export const generateCompanyWisePDF = (
  fruits: Fruit[],
  shopTotals: Record<string, number>,
  paidHistory: PaymentEntry[] = [],
  selectedCompany?: string
) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const title = selectedCompany 
      ? `${selectedCompany} - Inventory Report`
      : 'Company-wise Inventory Report';
    
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
    
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const reportDate = `Generated on: ${new Date().toLocaleDateString()}`;
    doc.text(reportDate, pageWidth - doc.getTextWidth(reportDate) - 20, yPosition);
    
    yPosition += 20;

    // Filter companies
    const companies = selectedCompany ? [selectedCompany] : Object.keys(shopTotals);

    companies.forEach((company, companyIndex) => {
      if (companyIndex > 0) {
        doc.addPage();
        yPosition = 20;
      }

      // Company Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Company: ${company}`, 20, yPosition);
      yPosition += 15;

      // Company Summary
      const companyFruits = fruits.filter(fruit => fruit.shop === company);
      const companyTotal = shopTotals[company] || 0;
      const companyPayments = paidHistory
        .filter(payment => payment.shop === company)
        .reduce((sum, payment) => sum + payment.amount, 0);
      const remainingBalance = companyTotal - companyPayments;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const summaryData = [
        ['Total Entries:', companyFruits.length.toString()],
        ['Total Amount:', companyTotal.toFixed(2)],
        ['Paid Amount:', companyPayments.toFixed(2)],
        ['Remaining Balance:', remainingBalance.toFixed(2)]
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 30 }
        },
        margin: { left: 20 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Fruits Table
      if (companyFruits.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Inventory Details:', 20, yPosition);
        yPosition += 10;

        const tableData = companyFruits.map(fruit => [
          fruit.fruit,
          fruit.package || 'N/A',
          fruit.quantity || 'N/A',
          Number(fruit.price).toFixed(2),
          fruit.date
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Fruit', 'Package', 'Quantity', 'Price', 'Date']],
          body: tableData,
          theme: 'striped',
          styles: { fontSize: 9 },
          headStyles: { fillColor: [34, 197, 94] },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 30 }
          },
          margin: { left: 20, right: 20 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // Payment History for this company
      const companyPaymentHistory = paidHistory.filter(payment => payment.shop === company);
      if (companyPaymentHistory.length > 0) {
        // Check if we need a new page
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment History:', 20, yPosition);
        yPosition += 10;

        const paymentData = companyPaymentHistory.map(payment => [
          payment.amount.toFixed(2),
          payment.date
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Amount Paid', 'Date']],
          body: paymentData,
          theme: 'striped',
          styles: { fontSize: 9 },
          headStyles: { fillColor: [239, 68, 68] },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 40 }
          },
          margin: { left: 20 }
        });
      }
    });

    // Save the PDF
    const fileName = selectedCompany 
      ? `${selectedCompany}_inventory_report.pdf`
      : 'company_wise_inventory_report.pdf';
    
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

export const generatePaymentSummaryPDF = (
  shopTotals: Record<string, number>,
  paidHistory: PaymentEntry[]
) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const title = 'Payment Summary Report';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
    
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const reportDate = `Generated on: ${new Date().toLocaleDateString()}`;
    doc.text(reportDate, pageWidth - doc.getTextWidth(reportDate) - 20, yPosition);
    
    yPosition += 20;

    // Overall Summary
    const totalAmount = Object.values(shopTotals).reduce((sum, amount) => sum + amount, 0);
    const totalPaid = paidHistory.reduce((sum, payment) => sum + payment.amount, 0);
    const totalOutstanding = totalAmount - totalPaid;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Summary', 20, yPosition);
    yPosition += 15;

    const overallSummaryData = [
      ['Total Inventory Value:', totalAmount.toFixed(2)],
      ['Total Payments Made:', totalPaid.toFixed(2)],
      ['Total Outstanding:', totalOutstanding.toFixed(2)],
      ['Number of Companies:', Object.keys(shopTotals).length.toString()]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [],
      body: overallSummaryData,
      theme: 'grid',
      styles: { fontSize: 12 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 40 }
      },
      margin: { left: 20 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;

    // Company-wise breakdown
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Company-wise Breakdown', 20, yPosition);
    yPosition += 15;

    const companyData = Object.keys(shopTotals).map(company => {
      const total = shopTotals[company];
      const paid = paidHistory
        .filter(payment => payment.shop === company)
        .reduce((sum, payment) => sum + payment.amount, 0);
      const remaining = total - paid;
      
      return [
        company,
        total.toFixed(2),
        paid.toFixed(2),
        remaining.toFixed(2),
        remaining > 0 ? 'Outstanding' : 'Paid'
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Company', 'Total Amount', 'Paid Amount', 'Remaining', 'Status']],
      body: companyData,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 }
      },
      margin: { left: 20, right: 20 }
    });

    doc.save('payment_summary_report.pdf');
  } catch (error) {
    console.error('Error generating payment summary PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};