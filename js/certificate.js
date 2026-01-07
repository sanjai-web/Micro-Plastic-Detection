// Certificate Generation Module
// Generates professional PDF certificates for detection results

class CertificateGenerator {
  constructor() {
    this.jsPDF = null;
  }

  // Initialize jsPDF (loaded from CDN)
  init() {
    if (typeof window.jspdf !== 'undefined') {
      this.jsPDF = window.jspdf.jsPDF;
      console.log('✅ Certificate generator initialized');
    } else {
      console.error('❌ jsPDF library not loaded');
    }
  }

  // Generate certificate for detection result
  async generateCertificate(detectionData, historyData = []) {
    if (!this.jsPDF) {
      console.error('❌ jsPDF not initialized');
      return;
    }

    try {
      // Create new PDF document (A4 size)
      const doc = new this.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Get user data
      const userData = authManager.getUserData();
      const userName = userData?.name || 'User';
      const userEmail = userData?.email || '';

      // Parse detection data
      const detectionType = detectionData.type === 'blood' ? 'Blood' : 'Water';
      const detectionValue = detectionData.detectionValue;
      const riskLevel = detectionData.aiAnalysis.riskLevel;
      const timestamp = new Date(detectionData.timestamp);
      const certificateId = `MG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Colors
      const primaryColor = [0, 191, 255]; // Cyan
      const secondaryColor = [179, 102, 255]; // Purple
      const darkBg = [28, 32, 43]; // Dark background
      const textColor = [242, 242, 242]; // Light text
      const mutedText = [156, 163, 175]; // Muted text

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Draw background
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Draw header gradient effect (simulated with rectangles)
      for (let i = 0; i < 30; i++) {
        const alpha = 1 - (i / 30);
        const r = primaryColor[0] + (secondaryColor[0] - primaryColor[0]) * (i / 30);
        const g = primaryColor[1] + (secondaryColor[1] - primaryColor[1]) * (i / 30);
        const b = primaryColor[2] + (secondaryColor[2] - primaryColor[2]) * (i / 30);
        doc.setFillColor(r, g, b);
        doc.setGState(new doc.GState({ opacity: alpha * 0.3 }));
        doc.rect(0, i * 2, pageWidth, 2, 'F');
      }
      doc.setGState(new doc.GState({ opacity: 1 }));

      // Draw decorative border
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Draw inner border
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      // Logo/Icon area (top center)
      doc.setFillColor(...primaryColor);
      doc.circle(pageWidth / 2, 35, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('MG', pageWidth / 2, 37, { align: 'center' }); // MG = MicroGuard

      // Title
      doc.setTextColor(...textColor);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('MICROGUARD', pageWidth / 2, 60, { align: 'center' });

      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('Microplastic Detection Certificate', pageWidth / 2, 70, { align: 'center' });

      // Horizontal line
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(40, 75, pageWidth - 40, 75);

      // Certificate body
      doc.setFontSize(12);
      doc.setTextColor(...mutedText);
      doc.text('This is to certify that', pageWidth / 2, 90, { align: 'center' });

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text(userName, pageWidth / 2, 100, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...mutedText);
      doc.text(userEmail, pageWidth / 2, 106, { align: 'center' });

      doc.setFontSize(12);
      doc.text('has completed a microplastic detection test with the following results:', pageWidth / 2, 120, { align: 'center' });

      // Results box
      const boxY = 130;
      const boxHeight = 60;
      
      // Box background
      doc.setFillColor(35, 40, 52);
      doc.roundedRect(30, boxY, pageWidth - 60, boxHeight, 3, 3, 'F');
      
      // Box border
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.roundedRect(30, boxY, pageWidth - 60, boxHeight, 3, 3, 'S');

      // Detection type
      doc.setFontSize(11);
      doc.setTextColor(...mutedText);
      doc.text('Detection Type:', 40, boxY + 12);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.text(detectionType + ' Sample Analysis', 40, boxY + 18);

      // Detection value (large and prominent)
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(detectionValue, pageWidth / 2, boxY + 35, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(...mutedText);
      doc.text('Microplastic Concentration', pageWidth / 2, boxY + 42, { align: 'center' });

      // Risk level badge
      const riskColors = {
        'low': [34, 197, 94],
        'medium': [251, 191, 36],
        'high': [239, 68, 68],
        'critical': [220, 38, 38]
      };
      const riskColor = riskColors[riskLevel] || [59, 130, 246];

      doc.setFillColor(...riskColor);
      doc.roundedRect(pageWidth / 2 - 20, boxY + 48, 40, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(riskLevel.toUpperCase() + ' RISK', pageWidth / 2, boxY + 54, { align: 'center' });


      // History Table
      const tableY = 205;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('Recent Test History:', 30, tableY);

      // Table Header
      const headerY = tableY + 8;
      const col1X = 30;  // Date
      const col2X = 80;  // Type
      const col3X = 120; // Level
      const col4X = 160; // Risk

      doc.setFontSize(9);
      doc.setTextColor(...mutedText);
      doc.text('Date', col1X, headerY);
      doc.text('Type', col2X, headerY);
      doc.text('Level', col3X, headerY);
      doc.text('Risk', col4X, headerY);

      // Draw line under header
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.2);
      doc.line(30, headerY + 2, pageWidth - 30, headerY + 2);

      // Table Rows
      let currentRowY = headerY + 8;
      
      // Combine current result with history, ensure unique and sorted
      // Current result is already in detectionData
      // historyData might contain the current one if it was just added to dashboard, but likely not yet locally refreshed if using basic array
      
      // Filter history to match current detection type and limit to latest 4
      // We assume historyData is already sorted by timestamp desc, but good to be safe if that assumption holds from dashboard.js logic (which it does)
      const filteredHistory = (historyData || [])
        .filter(record => record.type === detectionData.type)
        // Ensure we don't duplicate the current record if it's already in history (check by timestamp close proximity or ID if available)
        // Simple distinct check:
        .filter(record => Math.abs(record.timestamp - detectionData.timestamp) > 1000) 
        .slice(0, 3); // Take top 3 + current = 4 total

      // Combine: Current (newest) + History
      // Note: detectionData is the current one being generated, so it goes first.
      const rowsToRender = [detectionData, ...filteredHistory];

      doc.setFont('helvetica', 'normal');
      
      rowsToRender.forEach((record) => {
        const recordDate = new Date(record.timestamp);
        const dateStr = recordDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const typeStr = record.type === 'blood' ? 'Blood' : 'Water';
        const levelStr = record.detectionValue;
        const riskStr = record.aiAnalysis.riskLevel.toUpperCase();
        
        doc.setTextColor(...textColor);
        doc.text(dateStr, col1X, currentRowY);
        doc.text(typeStr, col2X, currentRowY);
        doc.text(levelStr, col3X, currentRowY);
        
        // Color code risk
        let riskColor = [255, 255, 255];
        if (record.aiAnalysis.riskLevel === 'low') riskColor = [34, 197, 94];
        else if (record.aiAnalysis.riskLevel === 'medium') riskColor = [251, 191, 36];
        else if (record.aiAnalysis.riskLevel === 'high') riskColor = [239, 68, 68];
        else if (record.aiAnalysis.riskLevel === 'critical') riskColor = [220, 38, 38];
        
        doc.setTextColor(...riskColor);
        doc.setFont('helvetica', 'bold');
        doc.text(riskStr, col4X, currentRowY);
        doc.setFont('helvetica', 'normal');

        currentRowY += 7;
      });

      // Footer section
      const footerY = pageHeight - 50;

      // Certificate details
      doc.setFontSize(8);
      doc.setTextColor(...mutedText);
      doc.text('Certificate ID:', 30, footerY);
      doc.setTextColor(...textColor);
      doc.text(certificateId, 30, footerY + 5);

      doc.setTextColor(...mutedText);
      doc.text('Issue Date:', 30, footerY + 12);
      doc.setTextColor(...textColor);
      doc.text(timestamp.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }), 30, footerY + 17);

      // Digital signature area
      doc.setTextColor(...mutedText);
      doc.text('Digitally Verified', pageWidth - 30, footerY + 12, { align: 'right' });
      doc.setDrawColor(...primaryColor);
      doc.line(pageWidth - 60, footerY + 15, pageWidth - 30, footerY + 15);

      // Footer text
      doc.setFontSize(7);
      doc.setTextColor(...mutedText);
      doc.text('This certificate is generated by MicroGuard AI-Powered Detection System', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('For verification, visit microguard.health/verify with Certificate ID', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Generate filename
      const filename = `MicroGuard_${detectionType}_Certificate_${timestamp.toISOString().split('T')[0]}.pdf`;

      // Save the PDF
      doc.save(filename);

      console.log('✅ Certificate generated:', filename);
      return { success: true, filename };

    } catch (error) {
      console.error('❌ Error generating certificate:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create global instance
const certificateGenerator = new CertificateGenerator();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.certificateGenerator = certificateGenerator;
}
