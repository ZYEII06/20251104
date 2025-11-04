// Constants for the grid and effect
const numb = 70; 
const step = 10; 
const distThreshold = 70; 
const distortionAmount = 20; 
let dots = []; 
let profileImage; // 🌟 新增：用於存儲個人圖片

// 🌟 更新：作品連結和新的名稱對應
const externalLinks = {
    '單元一作品': 'https://zyeii06.github.io/20251014_4/',
    '單元一筆記': 'https://hackmd.io/@lcienz/BJBl5dyngg',
    '測驗系統': 'https://zyeii06.github.io/-/',
    '測驗卷筆記': '#', // 請替換成您的測驗卷筆記連結
    '作品筆記': '#', // 請替換成您的作品筆記連結
    '淡江大學': 'https://www.tku.edu.tw/',
};

// 🌟 文本內容
const studentText = "教科一A 呂俞錚 414730670";

// iframe 相關變數
let contentFrame; 
const iframeScale = 0.8; 

// 選單相關變數
let menuContainer;
let hamburger; // 🌟 新增：漢堡圖示的引用

// 🌟 更新：作品樣式配置，使用新的名稱作為 Key
const styles = {
    '單元一作品': { // 馬卡龍粉 + 奶油白
        background: [255, 204, 204],    
        dotColor: [255, 255, 240]     
    },
    '單元一筆記': { // 馬卡龍藍 + 檸檬黃
        background: [173, 216, 230], 
        dotColor: [253, 253, 150]   
    },
    '測驗系統': { // 薄荷綠 + 奶油白
        background: [189, 236, 182],
        dotColor: [255, 255, 240]
    },
    '測驗卷筆記': { // 蜜桃粉 + 天空藍
        background: [255, 218, 185],
        dotColor: [135, 206, 250]
    },
    '作品筆記': { // 淺灰 + 柔粉
        background: [211, 211, 211],
        dotColor: [255, 192, 203]
    },
    '淡江大學': { // 淺紫 + 奶油白
        background: [221, 160, 221],
        dotColor: [255, 255, 240]
    },
    '關閉作品': { // 奶油黃 + 薰衣草紫
        background: [255, 248, 220], 
        dotColor: [200, 162, 200]      
    }
};

let currentWork = '關閉作品'; // 初始為關閉作品，顯示動畫

// 🌟 新增：定義首頁按鈕的名稱
const homeButtonName = '回到首頁';
styles[homeButtonName] = styles['關閉作品']; // 讓「回到首頁」使用與「關閉作品」相同的樣式


// The Dot class (保持不變)
class Dot {
  constructor(x, y) {
    this.pos = createVector(x, y); 
    this.origin = this.pos.copy(); 
    this.speed = createVector(0, 0); 
  }
  
  update(m) {
    let mouseToOrigin = this.origin.copy();
    mouseToOrigin.sub(m);
    const d = mouseToOrigin.mag();
    const c = map(d, 0, distThreshold, 0, PI);
    
    mouseToOrigin.normalize();
    mouseToOrigin.mult(distortionAmount * sin(c));
    const target = createVector(this.origin.x + mouseToOrigin.x, this.origin.y + mouseToOrigin.y);

    let strokeWidth;
    if (d < distThreshold) {
      strokeWidth = 1 + 10 * abs(cos(c / 2));
    } else {
      strokeWidth = map(min(d, max(width, height)), 0, max(width, height), 5, 0.1);
    }
    
    let acceleration = this.pos.copy();
    acceleration.sub(target);
    acceleration.mult(-map(m.dist(this.pos), 0, 2 * max(width, height), 0.1, 0.01));
    
    this.speed.add(acceleration);
    this.speed.mult(0.87);
    this.pos.add(this.speed);

    strokeWeight(strokeWidth);
    point(this.pos.x, this.pos.y);
  }
}

// 初始化點陣列，確保置中
function initializeDots() {
    dots = []; 
    const gridDim = numb * step;
    const dx = (width - gridDim) / 2; 
    const dy = (height - gridDim) / 2; 
    
    for (let i = 0; i < numb; i++) {
        dots[i] = [];
        for (let j = 0; j < numb; j++) {
            const x = i * step + dx;
            const y = j * step + dy;
            dots[i][j] = new Dot(x, y);
        }
    }
}

// 核心切換邏輯：控制 iframe
function changeWork(workName) {
    // 如果點擊的是「回到首頁」，則行為與「關閉作品」一致
    if (workName === homeButtonName) {
        currentWork = '關閉作品';
    } else {
        currentWork = workName;
    }

    if (externalLinks[currentWork]) { // 檢查是否有對應的外部連結
        // 顯示 iframe
        const url = externalLinks[currentWork];
        contentFrame.src = url;
        contentFrame.style.display = 'block';
    } else { // 處理如「關閉作品」等沒有外部連結的項目
        // 隱藏 iframe，顯示動畫
        contentFrame.style.display = 'none';
        contentFrame.src = ''; 
    }
}

// 調整 iframe 尺寸的函式
function resizeIframe() {
    if (!contentFrame) return;

    const newWidth = windowWidth * iframeScale;
    const newHeight = windowHeight * iframeScale;

    contentFrame.style.width = newWidth + 'px';
    contentFrame.style.height = newHeight + 'px';
}

// --- p5.js Preload Function ---
function preload() {
  // 🌟 新增：預先載入圖片
  // 請確保在專案資料夾下有一個 'assets' 資料夾，
  // 並且裡面有一張名為 'profile.png' 的圖片。
  profileImage = loadImage('assets/profile.jpeg');
}


// --- p5.js Setup Function ---
function setup() {
  createCanvas(displayWidth, displayHeight); 
  initializeDots();
  
  // 獲取 iframe 元素並調整尺寸
  contentFrame = document.getElementById('contentFrame');
  if (contentFrame) {
      resizeIframe(); 
  }
  
  // 創建漢堡圖示
  hamburger = createDiv(''); // 🌟 更新：賦值給全域變數
  hamburger.id('hamburger');
  hamburger.child(createDiv(''));
  hamburger.child(createDiv(''));
  hamburger.child(createDiv(''));
  hamburger.mousePressed(toggleMenu);

  // 創建選單容器
  menuContainer = createDiv();
  menuContainer.id('menu-container'); // 🌟 新增 ID 以便 CSS 選取
  
  // 創建按鈕並添加到容器中
  const buttonNames = Object.keys(styles);
  for (let name of buttonNames) {
    let button = createButton(name);
    button.mousePressed(() => {
        changeWork(name);
        toggleMenu(); // 點擊按鈕後自動收合選單
    });
    
    // 將按鈕添加到容器中
    menuContainer.child(button);
  }
  
  // 確保初始狀態下 iframe 是隱藏的
  if (contentFrame) {
      contentFrame.style.display = 'none';
  }
}

// 漢堡選單開關功能
function toggleMenu() {
    menuContainer.toggleClass('open');
}

// --- p5.js Draw Function ---
function draw() {
  // --- 繪製點動畫 ---
  const currentStyle = styles[currentWork];
  
  // 1. 繪製背景
  fill(currentStyle.background);
  noStroke();
  rect(0, 0, width, height); 
  
  // 2. 設定點的顏色
  stroke(currentStyle.dotColor); 

  // 繪製點的動畫
  const m = createVector(mouseX, mouseY);
  for (let i = 0; i < numb; i++) {
    for (let j = 0; j < numb; j++) {
      dots[i][j].update(m);
    }
  }

  // 🌟 新增：在動畫中間添加文字
  if (currentWork === '關閉作品') {
      // 繪製圖片
      if (profileImage) {
          const imgHeight = 200; // 🌟 將圖片放大
          // 根據原始寬高比，計算對應的寬度，避免圖片被壓縮
          const imgWidth = imgHeight * (profileImage.width / profileImage.height);

          imageMode(CENTER);
          // 使用計算後的新尺寸來繪製圖片
          image(profileImage, width / 2, height / 2 - 150, imgWidth, imgHeight); // 調整Y軸位置以適應更大的圖片
      }

      // 繪製文字
      strokeWeight(4); // 設定文字描邊寬度
      stroke(255, 255, 240); // 奶油白描邊
      fill(200, 162, 200);   // 薰衣草紫文字
      textStyle(BOLD); // 🌟 設定文字為粗體
      textSize(32);
      textAlign(CENTER, CENTER);
      
      // 將文字繪製在圖片下方
      text(studentText, width / 2, height / 2 + 20); 

      textStyle(NORMAL); // 重設文字樣式，避免影響其他繪圖
  }
}
/**
 * 🌟 新增：在每一幀中更新 UI 元素
 */
function updateUI() {
    // --- 1. 動態調整漢堡圖示顏色 ---
    const currentStyle = styles[currentWork];
    let bgColor = currentStyle.background;
    let hamburgerColor;

    // 判斷背景亮度
    let brightness = Array.isArray(bgColor) ? (bgColor[0] + bgColor[1] + bgColor[2]) / 3 : bgColor;
    
    // 如果背景偏暗，圖示設為白色，反之設為深灰色
    hamburgerColor = brightness < 128 ? 'white' : '#333';

    // 應用顏色到漢堡圖示的每一條線上
    const bars = hamburger.elt.getElementsByTagName('div');
    for (let bar of bars) {
        bar.style.backgroundColor = hamburgerColor;
    }

    // --- 2. 根據滑鼠位置觸發選單 ---
    if (mouseX < 50 && !menuContainer.hasClass('open')) {
        menuContainer.addClass('open');
    } else if (mouseX > 280 && menuContainer.hasClass('open')) { // 280px 約為選單寬度 + 一些緩衝
        menuContainer.removeClass('open');
    }
}


/**
 * 處理視窗大小改變
 */
function windowResized() {
  resizeCanvas(displayWidth, displayHeight);
  initializeDots();
  
  resizeIframe();
}

// 🌟 更新：在 p5.js 的 draw 函式結尾呼叫 UI 更新
const originalDraw = draw;
draw = function() {
    originalDraw();
    updateUI();
}