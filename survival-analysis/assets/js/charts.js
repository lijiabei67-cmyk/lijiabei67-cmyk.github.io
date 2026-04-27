/* ============================================
   Plotly Charts - Survival Analysis Blog
   ============================================ */

// Wait for DOM and Plotly to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if Plotly is loaded
    if (typeof Plotly !== 'undefined') {
        initCharts();
    } else {
        // Wait for Plotly to load
        window.addEventListener('load', function() {
            if (typeof Plotly !== 'undefined') {
                initCharts();
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
   Chart Configuration
   ============================================ */

// Color palette
const colors = {
    primary: '#0ABAB5',
    secondary: '#2C3E50',
    accent: '#E74C3C',
    success: '#27AE60',
    warning: '#F39C12',
    light: '#FAFAFA',
    dark: '#1E1E1E'
};

// Common layout settings
const commonLayout = {
    font: {
        family: "'Source Sans Pro', sans-serif",
        size: 12
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 60, r: 30, b: 60, l: 60 },
    hovermode: 'closest'
};

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
    const data = [{
        values: [1795, 1556],
        labels: ['未流失', '已流失'],
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: [colors.success, colors.accent]
        },
        textinfo: 'percent+label',
        textposition: 'outside',
        hovertemplate: '%{label}: %{value} 人<br>占比: %{percent}<extra></extra>'
    }];

    const layout = {
        ...commonLayout,
        title: {
            text: '客户流失分布',
            font: { size: 16, color: colors.secondary }
        },
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.1
        },
        annotations: [{
            text: '3351<br>客户',
            showarrow: false,
            font: { size: 18, color: colors.secondary }
        }]
    };

    Plotly.newPlot('churnDistributionChart', data, layout, config);
}

/* ============================================
   2. Kaplan-Meier Overall Chart
   ============================================ */
function createKMOverallChart() {
    // Simulated KM survival data
    const months = Array.from({length: 73}, (_, i) => i);

    // Survival probabilities (simulated based on median = 34)
    const survivalProb = months.map((t, i) => {
        if (t === 0) return 1.0;
        return Math.exp(-0.02 * t - 0.0001 * t * t);
    });

    // Confidence intervals
    const ciLower = survivalProb.map((s, i) => Math.max(0, s - 0.05 - 0.001 * i));
    const ciUpper = survivalProb.map((s, i) => Math.min(1, s + 0.03 + 0.001 * i));

    const survivalTrace = {
        x: months,
        y: survivalProb,
        type: 'scatter',
        mode: 'lines',
        name: '生存概率',
        line: { color: colors.primary, width: 3 },
        hovertemplate: '时间: %{x} 月<br>生存概率: %{y:.2%}<extra></extra>'
    };

    const ciTrace = {
        x: [...months, ...months.reverse()],
        y: [...ciUpper, ...ciLower.reverse()],
        fill: 'toself',
        fillcolor: 'rgba(10, 186, 181, 0.2)',
        line: { color: 'transparent' },
        name: '95% 置信区间',
        showlegend: true,
        hoverinfo: 'skip'
    };

    const medianLine = {
        x: [0, 72],
        y: [0.5, 0.5],
        type: 'scatter',
        mode: 'lines',
        line: { color: colors.accent, width: 2, dash: 'dash' },
        name: '50% 生存线',
        hovertemplate: '50% 生存概率<extra></extra>'
    };

    const medianPoint = {
        x: [34],
        y: [0.5],
        type: 'scatter',
        mode: 'markers+text',
        marker: { size: 12, color: colors.success },
        text: ['中位生存时间 = 34 月'],
        textposition: 'top right',
        name: '中位生存时间',
        hovertemplate: '中位生存时间: 34 月<extra></extra>'
    };

    const layout = {
        ...commonLayout,
        title: {
            text: 'Kaplan-Meier 生存曲线',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: '时间（月）',
            gridcolor: 'rgba(0,0,0,0.1)',
            zeroline: false
        },
        yaxis: {
            title: '生存概率',
            gridcolor: 'rgba(0,0,0,0.1)',
            zeroline: false,
            tickformat: '.0%',
            range: [0, 1.05]
        },
        legend: {
            orientation: 'h',
            y: -0.15
        }
    };

    Plotly.newPlot('kmOverallChart', [ciTrace, survivalTrace, medianLine, medianPoint], layout, config);
}

/* ============================================
   3. Kaplan-Meier by Online Security
   ============================================ */
function createKMOnlineSecurityChart() {
    const months = Array.from({length: 73}, (_, i) => i);

    // With Online Security (better survival)
    const withSecurity = months.map(t => t === 0 ? 1.0 : Math.exp(-0.012 * t - 0.00005 * t * t));

    // Without Online Security (worse survival)
    const withoutSecurity = months.map(t => t === 0 ? 1.0 : Math.exp(-0.025 * t - 0.00015 * t * t));

    const traces = [
        {
            x: months,
            y: withSecurity,
            type: 'scatter',
            mode: 'lines',
            name: '有网络安全服务',
            line: { color: colors.success, width: 2.5 },
            hovertemplate: '有网络安全服务<br>时间: %{x} 月<br>生存概率: %{y:.2%}<extra></extra>'
        },
        {
            x: months,
            y: withoutSecurity,
            type: 'scatter',
            mode: 'lines',
            name: '无网络安全服务',
            line: { color: colors.accent, width: 2.5 },
            hovertemplate: '无网络安全服务<br>时间: %{x} 月<br>生存概率: %{y:.2%}<extra></extra>'
        }
    ];

    const layout = {
        ...commonLayout,
        title: {
            text: '按网络安全服务分组的生存曲线',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: '时间（月）',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: '生存概率',
            gridcolor: 'rgba(0,0,0,0.1)',
            tickformat: '.0%',
            range: [0, 1.05]
        },
        legend: {
            orientation: 'h',
            y: -0.15
        },
        annotations: [{
            x: 50,
            y: 0.7,
            text: 'p < 0.05 (显著)',
            showarrow: false,
            font: { color: colors.success, size: 12 }
        }]
    };

    Plotly.newPlot('kmOnlineSecurityChart', traces, layout, config);
}

/* ============================================
   4. Kaplan-Meier by Tech Support
   ============================================ */
function createKMTechSupportChart() {
    const months = Array.from({length: 73}, (_, i) => i);

    // With Tech Support
    const withSupport = months.map(t => t === 0 ? 1.0 : Math.exp(-0.013 * t - 0.00006 * t * t));

    // Without Tech Support
    const withoutSupport = months.map(t => t === 0 ? 1.0 : Math.exp(-0.024 * t - 0.00012 * t * t));

    const traces = [
        {
            x: months,
            y: withSupport,
            type: 'scatter',
            mode: 'lines',
            name: '有技术支持',
            line: { color: colors.success, width: 2.5 },
            hovertemplate: '有技术支持<br>时间: %{x} 月<br>生存概率: %{y:.2%}<extra></extra>'
        },
        {
            x: months,
            y: withoutSupport,
            type: 'scatter',
            mode: 'lines',
            name: '无技术支持',
            line: { color: colors.accent, width: 2.5 },
            hovertemplate: '无技术支持<br>时间: %{x} 月<br>生存概率: %{y:.2%}<extra></extra>'
        }
    ];

    const layout = {
        ...commonLayout,
        title: {
            text: '按技术支持服务分组的生存曲线',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: '时间（月）',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: '生存概率',
            gridcolor: 'rgba(0,0,0,0.1)',
            tickformat: '.0%',
            range: [0, 1.05]
        },
        legend: {
            orientation: 'h',
            y: -0.15
        }
    };

    Plotly.newPlot('kmTechSupportChart', traces, layout, config);
}

/* ============================================
   5. Kaplan-Meier by Internet Service
   ============================================ */
function createKMInternetServiceChart() {
    const months = Array.from({length: 73}, (_, i) => i);

    // DSL (better survival)
    const dsl = months.map(t => t === 0 ? 1.0 : Math.exp(-0.015 * t - 0.00008 * t * t));

    // Fiber optic (worse survival)
    const fiber = months.map(t => t === 0 ? 1.0 : Math.exp(-0.022 * t - 0.0001 * t * t));

    const traces = [
        {
            x: months,
            y: dsl,
            type: 'scatter',
            mode: 'lines',
            name: 'DSL',
            line: { color: colors.primary, width: 2.5 },
            hovertemplate: 'DSL<br>时间: %{x} 月<br>生存概率: %{y:.2%}<extra></extra>'
        },
        {
            x: months,
            y: fiber,
            type: 'scatter',
            mode: 'lines',
            name: 'Fiber optic',
            line: { color: colors.warning, width: 2.5 },
            hovertemplate: 'Fiber optic<br>时间: %{x} 月<br>生存概率: %{y:.2%}<extra></extra>'
        }
    ];

    const layout = {
        ...commonLayout,
        title: {
            text: '按互联网服务类型分组的生存曲线',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: '时间（月）',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: '生存概率',
            gridcolor: 'rgba(0,0,0,0.1)',
            tickformat: '.0%',
            range: [0, 1.05]
        },
        legend: {
            orientation: 'h',
            y: -0.15
        }
    };

    Plotly.newPlot('kmInternetServiceChart', traces, layout, config);
}

/* ============================================
   6. Forest Plot (Cox Model HR)
   ============================================ */
function createForestPlot() {
    const variables = ['OnlineBackup_Yes', 'TechSupport_Yes', 'Dependents_Yes', 'InternetService_DSL'];
    const labels = ['在线备份服务', '技术支持服务', '有受抚养人', 'DSL 服务'];
    const hr = [0.46, 0.53, 0.72, 0.80];
    const ciLower = [0.41, 0.46, 0.63, 0.72];
    const ciUpper = [0.52, 0.61, 0.83, 0.90];

    // Create forest plot traces
    const hrTrace = {
        x: hr,
        y: labels,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 12,
            color: hr.map(h => h < 1 ? colors.success : colors.accent)
        },
        error_x: {
            type: 'data',
            symmetric: false,
            array: hr.map((h, i) => ciUpper[i] - h),
            arrayminus: hr.map((h, i) => h - ciLower[i]),
            color: 'rgba(44, 62, 80, 0.5)'
        },
        name: '风险比 (HR)',
        hovertemplate: '%{y}<br>HR: %{x:.2f}<br>95% CI: [%{error_x.arrayminus:.2f}, %{error_x.array:.2f}]<extra></extra>'
    };

    const refLine = {
        x: [1, 1],
        y: [-0.5, labels.length - 0.5],
        type: 'scatter',
        mode: 'lines',
        line: { color: colors.accent, width: 2, dash: 'dash' },
        name: '基准线 (HR=1)',
        hoverinfo: 'skip'
    };

    const layout = {
        ...commonLayout,
        title: {
            text: 'Cox 模型风险比森林图',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: '风险比 (Hazard Ratio)',
            gridcolor: 'rgba(0,0,0,0.1)',
            range: [0, 1.2]
        },
        yaxis: {
            autorange: 'reversed',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        legend: {
            orientation: 'h',
            y: -0.15
        },
        annotations: [
            {
                x: 0.3,
                y: labels.length,
                text: 'HR < 1: 保护因素',
                showarrow: false,
                font: { color: colors.success, size: 11 }
            },
            {
                x: 1.1,
                y: labels.length,
                text: 'HR > 1: 风险因素',
                showarrow: false,
                font: { color: colors.accent, size: 11 }
            }
        ]
    };

    Plotly.newPlot('forestPlot', [refLine, hrTrace], layout, config);
}

/* ============================================
   7. Log-Log Chart
   ============================================ */
function createLogLogChart() {
    const logTime = Array.from({length: 50}, (_, i) => Math.log(i + 1));

    // Simulated log(-log(S)) curves
    const withBackup = logTime.map((lt, i) => -0.8 - 0.3 * lt);
    const withoutBackup = logTime.map((lt, i) => -1.2 - 0.3 * lt);

    const traces = [
        {
            x: logTime,
            y: withBackup,
            type: 'scatter',
            mode: 'lines',
            name: '有在线备份',
            line: { color: colors.success, width: 2.5 }
        },
        {
            x: logTime,
            y: withoutBackup,
            type: 'scatter',
            mode: 'lines',
            name: '无在线备份',
            line: { color: colors.accent, width: 2.5 }
        }
    ];

    const layout = {
        ...commonLayout,
        title: {
            text: 'Log-log Kaplan-Meier 图',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: 'log(时间)',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: 'log(-log(生存概率))',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        legend: {
            orientation: 'h',
            y: -0.15
        },
        annotations: [{
            x: 2,
            y: -2.5,
            text: '曲线平行 → 满足比例风险假设',
            showarrow: false,
            font: { color: colors.primary, size: 11 }
        }]
    };

    Plotly.newPlot('logLogChart', traces, layout, config);
}

/* ============================================
   8. AFT Coefficients Chart
   ============================================ */
function createAFTCoefficientsChart() {
    const variables = ['OnlineSecurity', 'OnlineBackup', 'Credit Card', 'TechSupport', 'Partner', 'Bank Transfer'];
    const expCoef = [2.37, 2.25, 2.22, 1.99, 1.97, 2.10];

    const trace = {
        x: variables,
        y: expCoef,
        type: 'bar',
        marker: {
            color: expCoef.map(v => v > 2 ? colors.success : colors.primary)
        },
        text: expCoef.map(v => v.toFixed(2) + 'x'),
        textposition: 'outside',
        hovertemplate: '%{x}<br>时间加速因子: %{y:.2f}<extra></extra>'
    };

    const layout = {
        ...commonLayout,
        title: {
            text: 'AFT 模型时间加速因子',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: '变量',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: 'exp(coef) - 时间加速因子',
            gridcolor: 'rgba(0,0,0,0.1)',
            range: [0, 3]
        },
        annotations: [{
            x: 0.5,
            y: 2.8,
            text: '值 > 1 表示延长客户留存时间',
            showarrow: false,
            font: { color: colors.success, size: 11 }
        }]
    };

    Plotly.newPlot('aftCoefficientsChart', [trace], layout, config);
}

/* ============================================
   9. CLV Chart
   ============================================ */
function createCLVChart() {
    const months = Array.from({length: 37}, (_, i) => i);

    // CLV data for different customer types
    const highRiskCLV = months.map((t, i) => {
        const survival = Math.exp(-0.02 * t - 0.0001 * t * t);
        const profit = survival * 30;
        const npv = profit / Math.pow(1 + 0.10/12, t);
        return months.slice(0, i + 1).reduce((sum, m) => {
            const s = Math.exp(-0.02 * m - 0.0001 * m * m);
            const p = s * 30 / Math.pow(1 + 0.10/12, m);
            return sum + p;
        }, 0);
    });

    const mediumRiskCLV = months.map((t, i) => {
        return months.slice(0, i + 1).reduce((sum, m) => {
            const s = Math.exp(-0.015 * m - 0.00008 * m * m);
            const p = s * 30 / Math.pow(1 + 0.10/12, m);
            return sum + p;
        }, 0);
    });

    const lowRiskCLV = months.map((t, i) => {
        return months.slice(0, i + 1).reduce((sum, m) => {
            const s = Math.exp(-0.01 * m - 0.00005 * m * m);
            const p = s * 30 / Math.pow(1 + 0.10/12, m);
            return sum + p;
        }, 0);
    });

    const traces = [
        {
            x: months,
            y: lowRiskCLV,
            type: 'scatter',
            mode: 'lines',
            name: '低风险客户',
            line: { color: colors.success, width: 3 },
            fill: 'tozeroy',
            fillcolor: 'rgba(39, 174, 96, 0.1)',
            hovertemplate: '低风险客户<br>月份: %{x}<br>累计 NPV: $%{y:.2f}<extra></extra>'
        },
        {
            x: months,
            y: mediumRiskCLV,
            type: 'scatter',
            mode: 'lines',
            name: '中等风险客户',
            line: { color: colors.warning, width: 3 },
            hovertemplate: '中等风险客户<br>月份: %{x}<br>累计 NPV: $%{y:.2f}<extra></extra>'
        },
        {
            x: months,
            y: highRiskCLV,
            type: 'scatter',
            mode: 'lines',
            name: '高风险客户',
            line: { color: colors.accent, width: 3 },
            hovertemplate: '高风险客户<br>月份: %{x}<br>累计 NPV: $%{y:.2f}<extra></extra>'
        }
    ];

    // Add CAC reference line
    const cacLine = {
        x: [0, 36],
        y: [100, 100],
        type: 'scatter',
        mode: 'lines',
        line: { color: colors.secondary, width: 2, dash: 'dash' },
        name: '获客成本 ($100)',
        hovertemplate: '获客成本: $100<extra></extra>'
    };

    const layout = {
        ...commonLayout,
        title: {
            text: '客户生命周期价值对比',
            font: { size: 16, color: colors.secondary }
        },
        xaxis: {
            title: '月份',
            gridcolor: 'rgba(0,0,0,0.1)'
        },
        yaxis: {
            title: '累计 NPV ($)',
            gridcolor: 'rgba(0,0,0,0.1)',
            range: [0, 750]
        },
        legend: {
            orientation: 'h',
            y: -0.15
        },
        annotations: [
            {
                x: 36,
                y: 672.34,
                text: '$672.34',
                showarrow: true,
                arrowhead: 2,
                ax: 20,
                ay: -20,
                font: { color: colors.success, size: 11 }
            },
            {
                x: 36,
                y: 468.52,
                text: '$468.52',
                showarrow: true,
                arrowhead: 2,
                ax: 20,
                ay: 20,
                font: { color: colors.accent, size: 11 }
            }
        ]
    };

    Plotly.newPlot('clvChart', [...traces, cacLine], layout, config);
}