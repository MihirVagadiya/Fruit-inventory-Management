import * as XLSX from 'xlsx';

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

export const generateAllDataExcel = (
  fruits: Fruit[],
  shopTotals: Record<string, number>,
  paidHistory: PaymentEntry[] = []
) => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: All Fruits Data
    const fruitsData = fruits.map(fruit => ({
      'Company': fruit.shop,
      'Fruit': fruit.fruit,
      'Package': fruit.package || 'N/A',
      'Quantity': fruit.quantity || 'N/A',
      'Price': Number(fruit.price).toFixed(2),
      'Date': fruit.date
    }));

    const fruitsWS = XLSX.utils.json_to_sheet(fruitsData);
    XLSX.utils.book_append_sheet(wb, fruitsWS, 'All Fruits');

    // Sheet 2: Company-wise Summary
    const companySummaryData = Object.keys(shopTotals).map(company => {
      const total = shopTotals[company];
      const paid = paidHistory
        .filter(payment => payment.shop === company)
        .reduce((sum, payment) => sum + payment.amount, 0);
      const remaining = total - paid;
      const companyFruits = fruits.filter(fruit => fruit.shop === company);
      
      return {
        'Company': company,
        'Total Entries': companyFruits.length,
        'Total Amount': total.toFixed(2),
        'Paid Amount': paid.toFixed(2),
        'Remaining Balance': remaining.toFixed(2),
        'Status': remaining > 0 ? 'Outstanding' : 'Paid'
      };
    });

    const summaryWS = XLSX.utils.json_to_sheet(companySummaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Company Summary');

    // Sheet 3: Payment History
    if (paidHistory.length > 0) {
      const paymentData = paidHistory.map(payment => ({
        'Company': payment.shop,
        'Amount Paid': payment.amount.toFixed(2),
        'Payment Date': payment.date
      }));

      const paymentWS = XLSX.utils.json_to_sheet(paymentData);
      XLSX.utils.book_append_sheet(wb, paymentWS, 'Payment History');
    }

    // Sheet 4: Overall Statistics
    const totalAmount = Object.values(shopTotals).reduce((sum, amount) => sum + amount, 0);
    const totalPaid = paidHistory.reduce((sum, payment) => sum + payment.amount, 0);
    const totalOutstanding = totalAmount - totalPaid;

    const statsData = [
      { 'Metric': 'Total Companies', 'Value': Object.keys(shopTotals).length },
      { 'Metric': 'Total Fruit Entries', 'Value': fruits.length },
      { 'Metric': 'Total Inventory Value', 'Value': totalAmount.toFixed(2) },
      { 'Metric': 'Total Payments Made', 'Value': totalPaid.toFixed(2) },
      { 'Metric': 'Total Outstanding Amount', 'Value': totalOutstanding.toFixed(2) },
      { 'Metric': 'Payment Records', 'Value': paidHistory.length },
      { 'Metric': 'Report Generated', 'Value': new Date().toLocaleDateString() }
    ];

    const statsWS = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWS, 'Statistics');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `Inventory_and_Payment_Data_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);

    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return false;
  }
};

export const generateCompanyWiseExcel = (
  fruits: Fruit[],
  shopTotals: Record<string, number>,
  paidHistory: PaymentEntry[] = [],
  selectedCompany: string
) => {
  try {
    const wb = XLSX.utils.book_new();

    // Filter data for selected company
    const companyFruits = fruits.filter(fruit => fruit.shop === selectedCompany);
    const companyPayments = paidHistory.filter(payment => payment.shop === selectedCompany);
    const companyTotal = shopTotals[selectedCompany] || 0;
    const companyPaid = companyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const companyRemaining = companyTotal - companyPaid;

    // Sheet 1: Company Fruits
    const fruitsData = companyFruits.map(fruit => ({
      'Fruit': fruit.fruit,
      'Package': fruit.package || 'N/A',
      'Quantity': fruit.quantity || 'N/A',
      'Price': Number(fruit.price).toFixed(2),
      'Date': fruit.date
    }));

    const fruitsWS = XLSX.utils.json_to_sheet(fruitsData);
    XLSX.utils.book_append_sheet(wb, fruitsWS, 'Fruits');

    // Sheet 2: Company Summary
    const summaryData = [
      { 'Detail': 'Company Name', 'Value': selectedCompany },
      { 'Detail': 'Total Entries', 'Value': companyFruits.length },
      { 'Detail': 'Total Amount', 'Value': companyTotal.toFixed(2) },
      { 'Detail': 'Paid Amount', 'Value': companyPaid.toFixed(2) },
      { 'Detail': 'Remaining Balance', 'Value': companyRemaining.toFixed(2) },
      { 'Detail': 'Status', 'Value': companyRemaining > 0 ? 'Outstanding' : 'Paid' },
      { 'Detail': 'Report Generated', 'Value': new Date().toLocaleDateString() }
    ];

    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');

    // Sheet 3: Payment History (if exists)
    if (companyPayments.length > 0) {
      const paymentData = companyPayments.map(payment => ({
        'Amount Paid': payment.amount.toFixed(2),
        'Payment Date': payment.date
      }));

      const paymentWS = XLSX.utils.json_to_sheet(paymentData);
      XLSX.utils.book_append_sheet(wb, paymentWS, 'Payments');
    }

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `${selectedCompany}_Data_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);

    return true;
  } catch (error) {
    console.error('Error generating company Excel file:', error);
    return false;
  }
};

export const generatePaymentSummaryExcel = (
  shopTotals: Record<string, number>,
  paidHistory: PaymentEntry[]
) => {
  try {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Company-wise Payment Summary
    const companySummaryData = Object.keys(shopTotals).map(company => {
      const total = shopTotals[company];
      const paid = paidHistory
        .filter(payment => payment.shop === company)
        .reduce((sum, payment) => sum + payment.amount, 0);
      const remaining = total - paid;
      
      return {
        'Company': company,
        'Total Amount': total.toFixed(2),
        'Paid Amount': paid.toFixed(2),
        'Remaining Balance': remaining.toFixed(2),
        'Status': remaining > 0 ? 'Outstanding' : 'Paid'
      };
    });

    const summaryWS = XLSX.utils.json_to_sheet(companySummaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Payment Summary');

    // Sheet 2: All Payment History
    if (paidHistory.length > 0) {
      const paymentData = paidHistory.map(payment => ({
        'Company': payment.shop,
        'Amount Paid': payment.amount.toFixed(2),
        'Payment Date': payment.date
      }));

      const paymentWS = XLSX.utils.json_to_sheet(paymentData);
      XLSX.utils.book_append_sheet(wb, paymentWS, 'All Payments');
    }

    // Sheet 3: Overall Statistics
    const totalAmount = Object.values(shopTotals).reduce((sum, amount) => sum + amount, 0);
    const totalPaid = paidHistory.reduce((sum, payment) => sum + payment.amount, 0);
    const totalOutstanding = totalAmount - totalPaid;

    const statsData = [
      { 'Metric': 'Total Companies', 'Value': Object.keys(shopTotals).length },
      { 'Metric': 'Total Inventory Value', 'Value': totalAmount.toFixed(2) },
      { 'Metric': 'Total Payments Made', 'Value': totalPaid.toFixed(2) },
      { 'Metric': 'Total Outstanding Amount', 'Value': totalOutstanding.toFixed(2) },
      { 'Metric': 'Payment Records', 'Value': paidHistory.length },
      { 'Metric': 'Report Generated', 'Value': new Date().toLocaleDateString() }
    ];

    const statsWS = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWS, 'Statistics');

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `Payment_Summary_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);

    return true;
  } catch (error) {
    console.error('Error generating payment summary Excel file:', error);
    return false;
  }
};