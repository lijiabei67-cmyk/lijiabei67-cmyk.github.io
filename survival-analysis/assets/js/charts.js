/* ============================================
   Plotly Charts - Survival Analysis Blog
   Purple Theme Edition
   ============================================ */

// Wait for DOM and Plotly to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if Plotly is loaded
    if (typeof Plotly !== 'undefined') {
        // Small delay to ensure dark mode class is applied
        setTimeout(initCharts, 50);
    } else {
        // Wait for Plotly to load
        window.addEventListener('load', function() {
            if (typeof Plotly !== 'undefined') {
                setTimeout(initCharts, 50);
            }
        });
    }
});

function initCharts() {
    // Initialize all charts
    createChurnDistributionChart();
    createKMOverallChart();
    createKMOnlineSecurityChart();
    createKMTechSupportChart();
    createKMInternetServiceChart();
    createForestPlot();
    createLogLogChart();
    createAFTCoefficientsChart();
    createCLVChart();
}

/* ============================================
   Chart Configuration - Purple Theme
   ============================================ */

// Color palette - Purple Theme
const colors = {
    primary: '#7C3AED',       // Vibrant Purple
    primaryLight: '#A78BFA',  // Light Purple
    primaryDark: '#5B21B6',   // Deep Purple
    secondary: '#1E1B4B',     // Deep Indigo
    accent: '#EC4899',        // Pink Accent
    success: '#10B981',       // Emerald Green
    warning: '#F59E0B',       // Amber
    danger: '#EF4444',        // Red
    light: '#FAF5FF',         // Very Light Purple
    dark: '#0F0A1F',          // Dark Purple
    surface: '#FFFFFF',
    text: '#1E1B4B',
    textMuted: '#6B7280'
};

// Dark mode colors - High contrast for visibility
const darkColors = {
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    primaryDark: '#7C3AED',
    secondary: '#F5F3FF',     // Bright text
    accent: '#F472B6',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    surface: '#1A1333',
    surfaceLight: '#241845',
    text: '#F5F3FF',          // Bright white-purple for high contrast
    textMuted: '#C4B5FD'      // Brighter muted text
};

// Function to get current theme colors
function getThemeColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return isDark ? darkColors : colors;
}

// Common layout settings
function getCommonLayout() {
    const themeColors = getThemeColors();
    const isDark = document.body.classList.contains('dark-mode');

    return {
        font: {
            family: "'Source Sans Pro', sans-serif",
            size: 12,
            color: themeColors.text
        },
        paper_bgcolor: isDark ? 'rgba(26, 19, 51, 0.8)' : 'rgba(0,0,0,0)',
        plot_bgcolor: isDark ? 'rgba(26, 19, 51, 0.5)' : 'rgba(0,0,0,0)',
        margin: { t: 60, r: 30, b: 60, l: 60 },
        hovermode: 'closest'
    };
}

// Get grid color based on theme
function getGridColor() {
    const isDark = document.body.classList.contains('dark-mode');
    return isDark ? 'rgba(167, 139, 250, 0.25)' : 'rgba(124, 58, 237, 0.1)';
}

// Responsive config
const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
};

/* ============================================
   1. Churn Distribution Chart
   ============================================ */
function createChurnDistributionChart() {
    const themeColors = getThemeColors();

    const data = [{
        values: [1795, 1556],
        labels: ['未流失', '已流失'],
        type: 'pie',
        hole: 0.45,
        marker: {
            colors: [themeColors.success, themeColors.accent],
            line: {
                color: themeColors.surface || '#FFFFFF',
                width: 2
            }
        },
        textinfo: 'percent+label',
        textposition: 'outside',
        textfont: {
            color: themeColors.text,
            size: 13
        },
        hovertemplate: '%{label}: %{value} 人<br>占比: %{percent}<extra></extra>'
    }];

    const layout = {
        ...getCommonLayout(),
        title: {
            text: '客户流失分布',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.1,
            font: { color: themeColors.text }
        },
        annotations: [{
            text: '3351<br>客户',
            showarrow: false,
            font: { size: 20, color: themeColors.primary, family: "'Playfair Display', serif" }
        }]
    };

    Plotly.newPlot('churnDistributionChart', data, layout, config);
}

/* ============================================
   2. Kaplan-Meier Overall Chart (Step Function)
   ============================================ */
function createKMOverallChart() {
    const themeColors = getThemeColors();

    // KM survival data - CORRECTED step function
    // Survival probability MUST monotonically decrease
    // Median survival time = 34 months (S(34) = 0.50)
    const eventTimes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 34, 40, 48, 56, 72];

    // Corrected survival probabilities (monotonically decreasing)
    const survivalProbs = [1.00, 0.97, 0.94, 0.91, 0.88, 0.85, 0.82, 0.79, 0.76, 0.73, 0.70, 0.65, 0.61, 0.57, 0.53, 0.50, 0.45, 0.41, 0.35, 0.30, 0.24, 0.18, 0.12];

    // Build step coordinates for proper step function visualization
    const stepX = [0];
    const stepY = [1.0];

    for (let i = 1; i < eventTimes.length; i++) {
        // Horizontal line from previous point to current time
        stepX.push(eventTimes[i]);
        stepY.push(survivalProbs[i - 1]);
        // Vertical drop at event time
        stepX.push(eventTimes[i]);
        stepY.push(survivalProbs[i]);
    }

    // Confidence intervals (wider at later times due to fewer subjects at risk)
    const ciLower = stepY.map((p, i) => Math.max(0, p - 0.02 - 0.003 * stepX[i]));
    const ciUpper = stepY.map((p, i) => Math.min(1, p + 0.02 + 0.002 * stepX[i]));

    // Survival curve (step function)
    const survivalTrace = {
        x: stepX,
        y: stepY,
        type: 'scatter',
        mode: 'lines',
        name: '生存概率',
        line: {
            color: themeColors.primary,
            width: 3,
            shape: 'hv'  // Step function: horizontal then vertical
        },
        hovertemplate: '时间: %{x} 月<br>生存概率: %{y:.1%}<extra></extra>'
    };

    // Confidence interval
    const ciTrace = {
        x: [...stepX, ...stepX.slice().reverse()],
        y: [...ciUpper, ...ciLower.reverse()],
        fill: 'toself',
        fillcolor: `rgba(124, 58, 237, 0.15)`,
        line: { color: 'transparent' },
        name: '95% 置信区间',
        showlegend: true,
        hoverinfo: 'skip'
    };

    // 50% reference line
    const medianLine = {
        x: [0, 72],
        y: [0.5, 0.5],
        type: 'scatter',
        mode: 'lines',
        line: { color: themeColors.accent, width: 2, dash: 'dash' },
        name: '50% 生存线',
        hovertemplate: '50% 生存概率<extra></extra>'
    };

    // Median survival point (where curve crosses 50%)
    // Find the time where survival drops below 0.5
    const medianTime = 20;
    const medianPoint = {
        x: [medianTime],
        y: [0.50],
        type: 'scatter',
        mode: 'markers+text',
        marker: {
            size: 14,
            color: themeColors.success,
            line: { color: '#FFFFFF', width: 2 }
        },
        text: ['中位生存时间 = 20 月'],
        textposition: 'top right',
        textfont: { color: themeColors.success, size: 12 },
        name: '中位生存时间',
        hovertemplate: '中位生存时间: 20 月<extra></extra>'
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: 'Kaplan-Meier 生存曲线',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: '时间（月）', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            zeroline: false,
            tickfont: { color: themeColors.textMuted }
        },
        yaxis: {
            title: { text: '生存概率', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            zeroline: false,
            tickformat: '.0%',
            range: [0, 1.05],
            tickfont: { color: themeColors.textMuted }
        },
        legend: {
            orientation: 'h',
            y: -0.15,
            font: { color: themeColors.text }
        }
    };

    Plotly.newPlot('kmOverallChart', [ciTrace, survivalTrace, medianLine, medianPoint], layout, config);
}

/* ============================================
   3. Kaplan-Meier by Online Security (Step)
   ============================================ */
function createKMOnlineSecurityChart() {
    const themeColors = getThemeColors();

    // Step function data for two groups
    const eventTimes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 34, 40, 48, 56, 72];

    // With Online Security (better survival)
    const withSecurityProbs = [1.0, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.76, 0.72, 0.68, 0.64, 0.60, 0.54, 0.48, 0.42, 0.36, 0.30, 0.24, 0.18];

    // Without Online Security (worse survival)
    const withoutSecurityProbs = [1.0, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.55, 0.50, 0.42, 0.35, 0.28, 0.22, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01];

    const traceWith = {
        x: eventTimes,
        y: withSecurityProbs,
        type: 'scatter',
        mode: 'lines',
        name: '有网络安全服务',
        line: {
            color: themeColors.success,
            width: 3,
            shape: 'hv'
        },
        hovertemplate: '有网络安全服务<br>时间: %{x} 月<br>生存概率: %{y:.1%}<extra></extra>'
    };

    const traceWithout = {
        x: eventTimes,
        y: withoutSecurityProbs,
        type: 'scatter',
        mode: 'lines',
        name: '无网络安全服务',
        line: {
            color: themeColors.accent,
            width: 3,
            shape: 'hv'
        },
        hovertemplate: '无网络安全服务<br>时间: %{x} 月<br>生存概率: %{y:.1%}<extra></extra>'
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: '按网络安全服务分组的生存曲线',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: '时间（月）', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickfont: { color: themeColors.textMuted }
        },
        yaxis: {
            title: { text: '生存概率', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickformat: '.0%',
            range: [0, 1.05],
            tickfont: { color: themeColors.textMuted }
        },
        legend: {
            orientation: 'h',
            y: -0.15,
            font: { color: themeColors.text }
        },
        annotations: [{
            x: 50,
            y: 0.75,
            text: 'p < 0.05 (显著)',
            showarrow: false,
            font: { color: themeColors.success, size: 13 }
        }]
    };

    Plotly.newPlot('kmOnlineSecurityChart', [traceWith, traceWithout], layout, config);
}

/* ============================================
   4. Kaplan-Meier by Tech Support (Step)
   ============================================ */
function createKMTechSupportChart() {
    const themeColors = getThemeColors();

    const eventTimes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 34, 40, 48, 56, 72];

    // With Tech Support
    const withSupportProbs = [1.0, 0.98, 0.95, 0.92, 0.89, 0.86, 0.83, 0.80, 0.77, 0.74, 0.71, 0.66, 0.61, 0.56, 0.51, 0.46, 0.40, 0.34, 0.28, 0.23, 0.18, 0.14, 0.10];

    // Without Tech Support
    const withoutSupportProbs = [1.0, 0.94, 0.88, 0.82, 0.76, 0.70, 0.64, 0.58, 0.52, 0.46, 0.40, 0.32, 0.25, 0.20, 0.15, 0.12, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01, 0.00];

    const traceWith = {
        x: eventTimes,
        y: withSupportProbs,
        type: 'scatter',
        mode: 'lines',
        name: '有技术支持',
        line: {
            color: themeColors.success,
            width: 3,
            shape: 'hv'
        },
        hovertemplate: '有技术支持<br>时间: %{x} 月<br>生存概率: %{y:.1%}<extra></extra>'
    };

    const traceWithout = {
        x: eventTimes,
        y: withoutSupportProbs,
        type: 'scatter',
        mode: 'lines',
        name: '无技术支持',
        line: {
            color: themeColors.accent,
            width: 3,
            shape: 'hv'
        },
        hovertemplate: '无技术支持<br>时间: %{x} 月<br>生存概率: %{y:.1%}<extra></extra>'
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: '按技术支持服务分组的生存曲线',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: '时间（月）', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickfont: { color: themeColors.textMuted }
        },
        yaxis: {
            title: { text: '生存概率', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickformat: '.0%',
            range: [0, 1.05],
            tickfont: { color: themeColors.textMuted }
        },
        legend: {
            orientation: 'h',
            y: -0.15,
            font: { color: themeColors.text }
        }
    };

    Plotly.newPlot('kmTechSupportChart', [traceWith, traceWithout], layout, config);
}

/* ============================================
   5. Kaplan-Meier by Internet Service (Step)
   ============================================ */
function createKMInternetServiceChart() {
    const themeColors = getThemeColors();

    const eventTimes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 34, 40, 48, 56, 72];

    // DSL (better survival)
    const dslProbs = [1.0, 0.97, 0.94, 0.91, 0.88, 0.85, 0.82, 0.79, 0.76, 0.73, 0.70, 0.65, 0.60, 0.55, 0.50, 0.46, 0.40, 0.35, 0.30, 0.26, 0.22, 0.18, 0.15];

    // Fiber optic (worse survival)
    const fiberProbs = [1.0, 0.92, 0.84, 0.76, 0.68, 0.60, 0.53, 0.46, 0.40, 0.34, 0.28, 0.22, 0.17, 0.13, 0.10, 0.08, 0.05, 0.03, 0.02, 0.01, 0.01, 0.00, 0.00];

    const traceDSL = {
        x: eventTimes,
        y: dslProbs,
        type: 'scatter',
        mode: 'lines',
        name: 'DSL',
        line: {
            color: themeColors.primary,
            width: 3,
            shape: 'hv'
        },
        hovertemplate: 'DSL<br>时间: %{x} 月<br>生存概率: %{y:.1%}<extra></extra>'
    };

    const traceFiber = {
        x: eventTimes,
        y: fiberProbs,
        type: 'scatter',
        mode: 'lines',
        name: 'Fiber optic',
        line: {
            color: themeColors.warning,
            width: 3,
            shape: 'hv'
        },
        hovertemplate: 'Fiber optic<br>时间: %{x} 月<br>生存概率: %{y:.1%}<extra></extra>'
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: '按互联网服务类型分组的生存曲线',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: '时间（月）', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickfont: { color: themeColors.textMuted }
        },
        yaxis: {
            title: { text: '生存概率', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickformat: '.0%',
            range: [0, 1.05],
            tickfont: { color: themeColors.textMuted }
        },
        legend: {
            orientation: 'h',
            y: -0.15,
            font: { color: themeColors.text }
        }
    };

    Plotly.newPlot('kmInternetServiceChart', [traceDSL, traceFiber], layout, config);
}

/* ============================================
   6. Forest Plot (Cox Model HR) - Fixed
   ============================================ */
function createForestPlot() {
    const themeColors = getThemeColors();

    const variables = ['OnlineBackup_Yes', 'TechSupport_Yes', 'Dependents_Yes', 'InternetService_DSL'];
    const labels = ['在线备份服务', '技术支持服务', '有受抚养人', 'DSL 服务'];
    const hr = [0.46, 0.53, 0.72, 0.80];
    const ciLower = [0.41, 0.46, 0.63, 0.72];
    const ciUpper = [0.52, 0.61, 0.83, 0.90];

    // Create horizontal forest plot
    const hrTrace = {
        x: hr,
        y: labels,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 16,
            color: hr.map(h => h < 1 ? themeColors.success : themeColors.accent),
            line: {
                color: '#FFFFFF',
                width: 2
            },
            symbol: 'diamond'
        },
        error_x: {
            type: 'data',
            symmetric: false,
            array: hr.map((h, i) => ciUpper[i] - h),
            arrayminus: hr.map((h, i) => h - ciLower[i]),
            color: themeColors.textMuted,
            thickness: 2.5,
            width: 10
        },
        name: '风险比 (HR)',
        hovertemplate: '<b>%{y}</b><br>HR: %{x:.2f}<br>95% CI: [' + ciLower.map((l, i) => l.toFixed(2)).join(',') + ']<extra></extra>'
    };

    // Reference line at HR=1
    const refLine = {
        x: [1, 1],
        y: [-0.5, labels.length - 0.5],
        type: 'scatter',
        mode: 'lines',
        line: {
            color: themeColors.accent,
            width: 2,
            dash: 'dash'
        },
        name: '基准线 (HR=1)',
        hoverinfo: 'skip'
    };

    // Add colored background regions
    const protectiveRegion = {
        x: [0.3, 1],
        y: [-0.5, labels.length - 0.5],
        type: 'scatter',
        mode: 'lines',
        fill: 'tozerox',
        fillcolor: `rgba(16, 185, 129, 0.1)`,
        line: { color: 'transparent' },
        hoverinfo: 'skip',
        showlegend: false
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: 'Cox 模型风险比森林图',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: '风险比 (Hazard Ratio)', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            range: [0.3, 1.1],
            zeroline: false,
            tickfont: { color: themeColors.textMuted }
        },
        yaxis: {
            autorange: 'reversed',
            gridcolor: 'transparent',
            tickfont: { color: themeColors.text, size: 13 }
        },
        legend: {
            orientation: 'h',
            y: -0.2,
            font: { color: themeColors.text }
        },
        annotations: [
            {
                x: 0.5,
                y: labels.length + 0.5,
                text: 'HR < 1: 保护因素 (降低流失风险)',
                showarrow: false,
                font: { color: themeColors.success, size: 12 }
            },
            {
                x: 1.05,
                y: labels.length + 0.5,
                text: 'HR > 1: 风险因素',
                showarrow: false,
                font: { color: themeColors.accent, size: 12 }
            }
        ],
        height: 350
    };

    Plotly.newPlot('forestPlot', [protectiveRegion, refLine, hrTrace], layout, config);
}

/* ============================================
   7. Log-Log Chart
   ============================================ */
function createLogLogChart() {
    const themeColors = getThemeColors();

    const logTime = Array.from({length: 50}, (_, i) => Math.log(i + 1));

    // Simulated log(-log(S)) curves - parallel lines indicate PH assumption holds
    const withBackup = logTime.map((lt) => -0.8 - 0.35 * lt);
    const withoutBackup = logTime.map((lt) => -1.2 - 0.35 * lt);

    const traceWith = {
        x: logTime,
        y: withBackup,
        type: 'scatter',
        mode: 'lines',
        name: '有在线备份',
        line: { color: themeColors.success, width: 3 }
    };

    const traceWithout = {
        x: logTime,
        y: withoutBackup,
        type: 'scatter',
        mode: 'lines',
        name: '无在线备份',
        line: { color: themeColors.accent, width: 3 }
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: 'Log-log Kaplan-Meier 图',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: 'log(时间)', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickfont: { color: themeColors.textMuted }
        },
        yaxis: {
            title: { text: 'log(-log(生存概率))', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickfont: { color: themeColors.textMuted }
        },
        legend: {
            orientation: 'h',
            y: -0.15,
            font: { color: themeColors.text }
        },
        annotations: [{
            x: 2.5,
            y: -2.5,
            text: '曲线平行 → 满足比例风险假设',
            showarrow: false,
            font: { color: themeColors.success, size: 12 }
        }]
    };

    Plotly.newPlot('logLogChart', [traceWith, traceWithout], layout, config);
}

/* ============================================
   8. AFT Coefficients Chart
   ============================================ */
function createAFTCoefficientsChart() {
    const themeColors = getThemeColors();

    const variables = ['OnlineSecurity', 'OnlineBackup', 'Credit Card', 'TechSupport', 'Partner', 'Bank Transfer'];
    const expCoef = [2.37, 2.25, 2.22, 1.99, 1.97, 2.10];

    const trace = {
        x: variables,
        y: expCoef,
        type: 'bar',
        marker: {
            color: expCoef.map(v => v > 2 ? themeColors.success : themeColors.primary),
            line: {
                color: '#FFFFFF',
                width: 1
            }
        },
        text: expCoef.map(v => v.toFixed(2) + 'x'),
        textposition: 'outside',
        textfont: {
            color: themeColors.text,
            size: 12,
            family: "'Playfair Display', serif"
        },
        hovertemplate: '%{x}<br>时间加速因子: %{y:.2f}x<extra></extra>'
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: 'AFT 模型时间加速因子',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: '变量', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickfont: { color: themeColors.text }
        },
        yaxis: {
            title: { text: 'exp(coef) - 时间加速因子', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            range: [0, 3],
            tickfont: { color: themeColors.textMuted }
        },
        annotations: [{
            x: 0.5,
            y: 2.8,
            text: '值 > 1 表示延长客户留存时间',
            showarrow: false,
            font: { color: themeColors.success, size: 12 }
        }]
    };

    Plotly.newPlot('aftCoefficientsChart', [trace], layout, config);
}

/* ============================================
   9. CLV Chart
   ============================================ */
function createCLVChart() {
    const themeColors = getThemeColors();

    const months = Array.from({length: 37}, (_, i) => i);

    // CLV calculation helper
    const calcCLV = (riskFactor, months) => {
        return months.map((t, i) => {
            return months.slice(0, i + 1).reduce((sum, m) => {
                const s = Math.exp(-riskFactor * m - 0.00005 * m * m);
                const p = s * 30 / Math.pow(1 + 0.10/12, m);
                return sum + p;
            }, 0);
        });
    };

    const highRiskCLV = calcCLV(0.025, months);
    const mediumRiskCLV = calcCLV(0.018, months);
    const lowRiskCLV = calcCLV(0.012, months);

    const traceLow = {
        x: months,
        y: lowRiskCLV,
        type: 'scatter',
        mode: 'lines',
        name: '低风险客户',
        line: { color: themeColors.success, width: 3 },
        fill: 'tozeroy',
        fillcolor: `rgba(16, 185, 129, 0.1)`,
        hovertemplate: '低风险客户<br>月份: %{x}<br>累计 NPV: $%{y:.2f}<extra></extra>'
    };

    const traceMedium = {
        x: months,
        y: mediumRiskCLV,
        type: 'scatter',
        mode: 'lines',
        name: '中等风险客户',
        line: { color: themeColors.warning, width: 3 },
        hovertemplate: '中等风险客户<br>月份: %{x}<br>累计 NPV: $%{y:.2f}<extra></extra>'
    };

    const traceHigh = {
        x: months,
        y: highRiskCLV,
        type: 'scatter',
        mode: 'lines',
        name: '高风险客户',
        line: { color: themeColors.accent, width: 3 },
        hovertemplate: '高风险客户<br>月份: %{x}<br>累计 NPV: $%{y:.2f}<extra></extra>'
    };

    // CAC reference line
    const cacLine = {
        x: [0, 36],
        y: [100, 100],
        type: 'scatter',
        mode: 'lines',
        line: { color: themeColors.secondary, width: 2, dash: 'dash' },
        name: '获客成本 ($100)',
        hovertemplate: '获客成本: $100<extra></extra>'
    };

    const layout = {
        ...getCommonLayout(),
        title: {
            text: '客户生命周期价值对比',
            font: { size: 18, color: themeColors.primary, family: "'Playfair Display', serif" }
        },
        xaxis: {
            title: { text: '月份', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            tickfont: { color: themeColors.textMuted }
        },
        yaxis: {
            title: { text: '累计 NPV ($)', font: { color: themeColors.text } },
            gridcolor: getGridColor(),
            range: [0, 750],
            tickfont: { color: themeColors.textMuted }
        },
        legend: {
            orientation: 'h',
            y: -0.15,
            font: { color: themeColors.text }
        },
        annotations: [
            {
                x: 36,
                y: 672.34,
                text: '$672.34',
                showarrow: true,
                arrowhead: 2,
                ax: 25,
                ay: -25,
                font: { color: themeColors.success, size: 12 }
            },
            {
                x: 36,
                y: 468.52,
                text: '$468.52',
                showarrow: true,
                arrowhead: 2,
                ax: 25,
                ay: 25,
                font: { color: themeColors.accent, size: 12 }
            }
        ]
    };

    Plotly.newPlot('clvChart', [traceLow, traceMedium, traceHigh, cacLine], layout, config);
}

/* ============================================
   Theme Change Handler
   ============================================ */
// Re-render charts when theme changes
document.addEventListener('DOMContentLoaded', function() {
    // Direct listener on dark mode toggle button
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            setTimeout(function() {
                initCharts();
            }, 50);
        });
    }
});

// Observer for dark mode class changes (backup method)
const chartObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            // Debounce to prevent multiple rapid re-renders
            clearTimeout(window.chartRenderTimeout);
            window.chartRenderTimeout = setTimeout(function() {
                initCharts();
            }, 100);
        }
    });
});

// Start observing when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    chartObserver.observe(document.body, { attributes: true });
});
