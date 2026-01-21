// Dashboard Module
// Handles dashboard data loading and display

class DashboardManager {
  constructor() {
    this.database = null;
    this.userId = null;
    this.detections = [];
  }

  // Initialize dashboard
  async init() {
    const { database } = getFirebaseInstances();
    this.database = database;

    // Check authentication
    if (!authManager.requireAuth()) {
      return;
    }

    this.userId = authManager.currentUser.uid;

    // Load dashboard data
    await this.loadUserProfile();
    await this.loadDetections();
    this.calculateNextTestDate();
  }

  // Load user profile
  async loadUserProfile() {
    try {
      // Use async method to ensure data is loaded
      const userData = await authManager.getUserProfile();
      
      if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userMobile').textContent = userData.mobile;
      } else {
        console.warn('⚠️ User data not found despite being authenticated');
        // Optional: Retry after short delay
        setTimeout(() => this.loadUserProfile(), 2000);
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
    }
  }

  // Load detection history
  async loadDetections() {
    try {
      const snapshot = await this.database.ref(`detections/${this.userId}`).once('value');
      const data = snapshot.val();

      if (data) {
        this.detections = Object.entries(data).map(([id, detection]) => ({
          id,
          ...detection
        })).sort((a, b) => b.timestamp - a.timestamp);

        this.displayDetectionHistory();
        this.updateStatusCards();
        this.renderCharts();
      } else {
        this.displayDetectionHistory();
      }
    } catch (error) {
      console.error('❌ Error loading detections:', error);
    }
  }

  // Render Charts
  renderCharts() {
    // Process data for charts
    const bloodData = this.detections
      .filter(d => d.type === 'blood')
      .sort((a, b) => a.timestamp - b.timestamp) // Sort chronological for chart
      .map(d => ({
        x: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: parseFloat(d.detectionValue)
      }));

    const waterData = this.detections
      .filter(d => d.type === 'water')
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(d => ({
        x: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: parseFloat(d.detectionValue)
      }));

    // Common Chart Options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          padding: 10,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (context) => `Level: ${context.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      }
    };

    // Render Blood Chart
    const bloodCtx = document.getElementById('bloodChart').getContext('2d');
    if (this.bloodChartInstance) this.bloodChartInstance.destroy();
    
    this.bloodChartInstance = new Chart(bloodCtx, {
      type: 'line',
      data: {
        labels: bloodData.map(d => d.x),
        datasets: [{
          label: 'Blood Microplastic Level',
          data: bloodData.map(d => d.y),
          borderColor: '#ef4444',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ef4444'
        }]
      },
      options: chartOptions
    });

    // Render Water Chart
    const waterCtx = document.getElementById('waterChart').getContext('2d');
    if (this.waterChartInstance) this.waterChartInstance.destroy();

    this.waterChartInstance = new Chart(waterCtx, {
      type: 'line',
      data: {
        labels: waterData.map(d => d.x),
        datasets: [{
          label: 'Water Microplastic Level',
          data: waterData.map(d => d.y),
          borderColor: '#3b82f6',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3b82f6'
        }]
      },
      options: chartOptions
    });
  }

  // Display detection history
  // Display detection history
  displayDetectionHistory(limit = 5) {
    const bloodContainer = document.getElementById('bloodHistoryContainer');
    const waterContainer = document.getElementById('waterHistoryContainer');
    
    if (!bloodContainer || !waterContainer) return;

    bloodContainer.innerHTML = '';
    waterContainer.innerHTML = '';

    const bloodDetections = this.detections.filter(d => d.type === 'blood');
    const waterDetections = this.detections.filter(d => d.type === 'water');

    this.renderHistoryList(bloodContainer, bloodDetections, limit, 'Blood');
    this.renderHistoryList(waterContainer, waterDetections, limit, 'Water');
  }

  // Render a specific history list
  renderHistoryList(container, items, limit, type) {
    if (items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-slate-500 bg-dark-900/30 rounded-2xl border border-white/5 border-dashed">
          <div class="text-4xl mb-3 opacity-20 filter grayscale">📊</div>
          <h3 class="text-sm font-medium text-white mb-1">No ${type} History</h3>
          <p class="text-xs text-slate-400">No detections recorded yet</p>
        </div>
      `;
      return;
    }

    const itemsToShow = items.slice(0, limit);

    itemsToShow.forEach(detection => {
      const card = this.createHistoryCard(detection);
      container.appendChild(card);
    });
  }

  // Create history card
  createHistoryCard(detection) {
    const card = document.createElement('div');
    // Tailwind classes for the card
    card.className = 'bg-dark-900/40 border border-white/5 rounded-2xl p-6 transition-all hover:bg-dark-900/60 hover:border-white/10';
    card.style.marginBottom = '1rem';

    const date = new Date(detection.timestamp);
    const isBlood = detection.type === 'blood';
    const icon = isBlood ? '🩸' : '💧';
    const type = isBlood ? 'Blood' : 'Water';
    const typeColor = isBlood ? 'text-red-500' : 'text-blue-500';

    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-2xl shadow-inner border border-white/5 ${typeColor}">${icon}</div>
          <div>
            <h4 class="font-bold text-white text-lg">${type} Detection</h4>
            <p class="text-sm text-slate-500">
              ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold bg-gradient-to-r from-primary-light to-white bg-clip-text text-transparent">
            ${detection.detectionValue}
          </div>
          <span class="${this.getRiskBadgeClass(detection.aiAnalysis.riskLevel)}">
            ${detection.aiAnalysis.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>
      <p class="text-slate-400 mb-6 line-clamp-2 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
        ${detection.aiAnalysis.summary}
      </p>
      <button class="text-sm font-medium text-primary-light hover:text-white transition-colors flex items-center gap-1 group" onclick="dashboardManager.showDetectionDetails('${detection.id}')">
        View Full Analysis 
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </button>
    `;

    return card;
  }

  // Show detection details
  showDetectionDetails(detectionId) {
    const detection = this.detections.find(d => d.id === detectionId);
    if (!detection) return;

    const modal = document.getElementById('detailsModal');
    const isBlood = detection.type === 'blood';
    const icon = isBlood ? '🩸' : '💧';
    const type = isBlood ? 'Blood' : 'Water';
    const date = new Date(detection.timestamp);

    document.getElementById('detailsIcon').textContent = icon;
    document.getElementById('detailsType').textContent = `${type} Detection`;
    document.getElementById('detailsDate').textContent = date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    document.getElementById('detailsValue').textContent = detection.detectionValue;
    document.getElementById('detailsRisk').textContent = detection.aiAnalysis.riskLevel.toUpperCase();
    document.getElementById('detailsRisk').className = this.getRiskBadgeClass(detection.aiAnalysis.riskLevel);
    document.getElementById('detailsSummary').textContent = detection.aiAnalysis.summary;
    document.getElementById('detailsImpact').textContent = detection.aiAnalysis.healthImpact;

    const remediesList = document.getElementById('detailsRemedies');
    remediesList.innerHTML = '';
    detection.aiAnalysis.remedies.forEach(remedy => {
      const li = document.createElement('li');
      li.textContent = remedy;
      // li.style.marginBottom = 'var(--space-xs)'; // Handled by Tailwind
      remediesList.appendChild(li);
    });

    const nextDate = new Date(detection.aiAnalysis.nextTestDate);
    document.getElementById('detailsNextTest').textContent = nextDate.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    modal.classList.remove('invisible', 'opacity-0');
  }

  // Update status cards
  updateStatusCards() {
    if (this.detections.length === 0) return;

    const latestBlood = this.detections.find(d => d.type === 'blood');
    const latestWater = this.detections.find(d => d.type === 'water');

    if (latestBlood) {
      document.getElementById('bloodStatus').textContent = latestBlood.detectionValue;
      document.getElementById('bloodRisk').textContent = latestBlood.aiAnalysis.riskLevel.toUpperCase();
      document.getElementById('bloodRisk').className = this.getRiskBadgeClass(latestBlood.aiAnalysis.riskLevel);
      
      const bloodDate = new Date(latestBlood.timestamp);
      document.getElementById('bloodDate').textContent = bloodDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }

    if (latestWater) {
      document.getElementById('waterStatus').textContent = latestWater.detectionValue;
      document.getElementById('waterRisk').textContent = latestWater.aiAnalysis.riskLevel.toUpperCase();
      document.getElementById('waterRisk').className = this.getRiskBadgeClass(latestWater.aiAnalysis.riskLevel);
      
      const waterDate = new Date(latestWater.timestamp);
      document.getElementById('waterDate').textContent = waterDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }
  }

  // Calculate next test date
  calculateNextTestDate() {
    if (this.detections.length === 0) {
      document.getElementById('nextTestDate').textContent = 'Schedule your first test';
      return;
    }

    // Get the earliest next test date from all detections
    const nextDates = this.detections
      .map(d => d.aiAnalysis.nextTestDate)
      .filter(date => date > Date.now());

    if (nextDates.length > 0) {
      const earliestDate = new Date(Math.min(...nextDates));
      document.getElementById('nextTestDate').textContent = earliestDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } else {
      document.getElementById('nextTestDate').textContent = 'Test recommended now';
    }
  }

  // Show empty state - REMOVED (Handled in renderHistoryList)
  showEmptyState() {
     // Deprecated
  }

  // Get badge class for risk level - UPDATED for Tailwind
  getRiskBadgeClass(riskLevel) {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border";
    
    const variantClasses = {
      'low': 'bg-green-500/10 text-green-400 border-green-500/20',
      'medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'high': 'bg-red-500/10 text-red-400 border-red-500/20',
      'critical': 'bg-red-600/20 text-red-500 border-red-500/30'
    };
    
    return `${baseClasses} ${variantClasses[riskLevel.toLowerCase()] || 'bg-slate-700 text-slate-300 border-slate-600'}`;
  }

  // Logout
  async logout() {
    const result = await authManager.logout();
    if (result.success) {
      window.location.href = 'index.html';
    }
  }
}

// Create global instance
const dashboardManager = new DashboardManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.dashboardManager = dashboardManager;
}
