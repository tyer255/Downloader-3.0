// Downloader 3.0 - Main Script

let downloadHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];

// DOM Elements
const urlInput = document.getElementById('urlInput');
const fileTypeSelect = document.getElementById('fileType');
const downloadBtn = document.getElementById('downloadBtn');
const progressSection = document.getElementById('progressSection');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const fileName = document.getElementById('fileName');
const cancelBtn = document.getElementById('cancelBtn');
const historyList = document.getElementById('historyList');
const clearHistory = document.getElementById('clearHistory');

let currentDownload = null;
let isDownloading = false;

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    updateHistoryDisplay();
});

// Download Button Click
downloadBtn.addEventListener('click', startDownload);
cancelBtn.addEventListener('click', cancelDownload);
clearHistory.addEventListener('click', clearDownloadHistory);

function startDownload() {
    const url = urlInput.value.trim();
    const fileType = fileTypeSelect.value;

    if (!url) {
        alert('❌ Please enter a valid URL');
        return;
    }

    if (!isValidUrl(url)) {
        alert('❌ Please enter a valid URL format (https://...)');
        return;
    }

    isDownloading = true;
    downloadBtn.disabled = true;
    progressSection.style.display = 'block';
    progressBar.style.width = '0%';

    const filenameFromUrl = extractFilename(url);
    fileName.textContent = `📥 Downloading: ${filenameFromUrl}`;
    progressText.textContent = '0%';

    // Simulate download
    simulateDownload(url, filenameFromUrl, fileType);
}

function simulateDownload(url, filename, fileType) {
    let progress = 0;
    const speed = Math.random() * 5 + 2; // Random speed between 2-7%
    
    const downloadInterval = setInterval(() => {
        progress += speed;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(downloadInterval);
            completeDownload(filename, fileType, 'success', url);
        }
        
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.floor(progress) + '%';
    }, 300);
    
    currentDownload = downloadInterval;
}

function completeDownload(filename, fileType, status, url) {
    isDownloading = false;
    downloadBtn.disabled = false;
    
    // Add to history
    const downloadItem = {
        filename: filename,
        fileType: fileType,
        status: status,
        time: new Date().toLocaleString(),
        url: url
    };
    
    downloadHistory.unshift(downloadItem);
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
    
    // Update UI
    updateHistoryDisplay();
    
    // Show completion message
    if (status === 'success') {
        alert(`✅ Download completed!\n\nFile: ${filename}`);
        setTimeout(() => {
            progressSection.style.display = 'none';
            urlInput.value = '';
        }, 2000);
    }
}

function cancelDownload() {
    if (currentDownload) {
        clearInterval(currentDownload);
        isDownloading = false;
        downloadBtn.disabled = false;
        progressSection.style.display = 'none';
        alert('❌ Download cancelled');
    }
}

function updateHistoryDisplay() {
    if (downloadHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No downloads yet</p>';
        clearHistory.style.display = 'none';
        return;
    }
    
    clearHistory.style.display = 'block';
    historyList.innerHTML = '';
    
    downloadHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const statusClass = `status-${item.status}`;
        const statusIcon = item.status === 'success' ? '✅' : item.status === 'pending' ? '⏳' : '❌';
        
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-name">📄 ${item.filename}</div>
                <div class="history-time">${item.time}</div>
            </div>
            <span class="history-status ${statusClass}">${statusIcon} ${item.status.toUpperCase()}</span>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function clearDownloadHistory() {
    if (confirm('Are you sure? This will clear all download history.')) {
        downloadHistory = [];
        localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
        updateHistoryDisplay();
        alert('✅ Download history cleared');
    }
}

function extractFilename(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'download';
        return filename || 'download';
    } catch {
        return 'download';
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Keyboard shortcuts
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.activeElement === urlInput) {
        startDownload();
    }
});

console.log('🚀 Downloader 3.0 Loaded Successfully');
console.log('Made with ❤️ by tyer255');