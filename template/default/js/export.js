// 更可靠的Safari检测
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                navigator.vendor === "Apple Computer, Inc.";

// 检查是否在24小时内关闭过提示
function shouldShowPrompt() {
    const closedTime = localStorage.getItem('promptClosedTime');
    if (!closedTime) return true;
    
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24小时的毫秒数
    return (now - parseInt(closedTime)) > twentyFourHours;
}

// 初始化显示逻辑
function initPrompt() {
    const prompt = document.querySelector('.save-prompt');
    if (!prompt) return;
    
    if (isSafari && shouldShowPrompt()) {
        prompt.style.display = 'block';
    } else {
        prompt.style.display = 'none';
    }
}

// 关闭提示并记录时间
function closePrompt() {
    const prompt = document.querySelector('.save-prompt');
    if (prompt) {
        prompt.style.display = 'none';
        localStorage.setItem('promptClosedTime', new Date().getTime());
    }
}

// 打开提示（清除存储的时间）
function openPrompt() {
    const prompt = document.querySelector('.save-prompt');
    if (prompt) {
        prompt.style.display = 'block';
        localStorage.removeItem('promptClosedTime');
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initPrompt);