/* --- 整理後的 JS 程式碼 --- */

// 1. 選單切換函式 (修正箭頭控制)
function toggleSubMenu() {
    const subMenu = document.getElementById('sub-menu-items');
    const arrow = document.getElementById('menu-arrow');
    
    // 檢查元素是否存在，避免錯誤
    if (!subMenu || !arrow) return;

    if (subMenu.style.display === 'none' || subMenu.style.display === '') {
        subMenu.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    } else {
        subMenu.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

// 2. 頁面切換函式 (合併為一個)
function showSection(s, c="") { 
    const sections = ['view-home', 'view-shop', 'view-detail', 'view-how-to-buy', 'view-notice'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.display = 'none';
    });

    if (s === 'home') {
        document.getElementById('view-home').style.display = 'block';
    } else if (s === 'shop') {
        currentCategory = c;
        // 如果是大分類，標題顯示「🇯🇵選物 全部商品」
        const catLabel = document.getElementById('current-cat');
        if(catLabel) {
            catLabel.innerText = (c === '🇯🇵選物') ? '🇯🇵選物 全部商品' : c;
        }
        document.getElementById('view-shop').style.display = 'block';
        renderProducts();
    } else if (s === 'how-to-buy') {
        document.getElementById('view-how-to-buy').style.display = 'block';
    } else if (s === 'notice') {
        document.getElementById('view-notice').style.display = 'block';
    }
    
    window.scrollTo(0, 0);
}

// 3. 商品列表渲染 (合併為一個)
function renderProducts() {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';

    const filtered = products.filter(item => {
        if (currentCategory === '全部商品' || currentCategory === '') return true;
        if (currentCategory === '🇯🇵選物') {
            return item.category.startsWith('🇯🇵選物');
        }
        return item.category === currentCategory;
    });

    filtered.forEach(item => {
        const card = `
            <div class="product-card" onclick="showDetail(${item.id})">
                <img src="${item.image}" alt="${item.name}">
                <div class="product-info">
                    <h3>${item.name}</h3>
                    <p>NT$ ${item.price}</p>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 4. 商品詳情頁與輔助函式 (保持您的內容)
function showDetail(id) {
    const productData = JSON.parse(localStorage.getItem('momoko_products'));
    const p = productData.find(item => item.id === id);
    
    document.getElementById('view-shop').style.display = 'none';
    document.getElementById('view-home').style.display = 'none';
    
    const detailSec = document.getElementById('view-detail');
    detailSec.style.display = 'block';
    
    const imgs = p.img.split(',').map(s => s.trim());
    const thumbHtml = imgs.map((url, index) => 
        `<div class="thumb-item ${index===0?'active':''}" onclick="switchMainImg('${url}', this)">
            <img src="${url}">
        </div>`).join('');

    detailSec.innerHTML = `
        <div onclick="showSection('shop', currentCategory)" style="cursor:pointer; margin-bottom:20px; font-weight:500; font-size:14px; color:#666;">
            <i class="fa-solid fa-arrow-left"></i> 返回商店
        </div>
        <div class="detail-container" style="display: flex; flex-wrap: wrap; gap: 40px; max-width: 1000px; margin: 0 auto; padding: 0 10px;">
            <div class="detail-left" style="flex: 1.5; min-width: 320px;">
                <div class="main-img-holder" style="width: 100%; aspect-ratio: 1 / 1.15; overflow: hidden; border-radius: 12px; background: #f9f9f9; margin-bottom: 15px;">
                    <img id="main-detail-img" src="${imgs[0]}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="thumb-list" style="display: flex; gap: 8px;">${thumbHtml}</div>
            </div>
            <div class="detail-right" style="flex: 1; min-width: 300px;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #3e2723;">${p.name}</h2>
                <div class="detail-price" style="font-size: 22px; font-weight: 700; margin-bottom: 25px; color: #3e2723;">NT$ ${p.price}</div>
                ${p.colors ? `<label>顏色</label><select id="sel-color" class="spec-select">${p.colors.split(',').map(c => `<option>${c.trim()}</option>`).join('')}</select>` : ''}
                ${p.sizes ? `<label>尺寸</label><select id="sel-size" class="spec-select">${p.sizes.split(',').map(s => `<option>${s.trim()}</option>`).join('')}</select>` : ''}
                <label>件數</label>
                <div class="qty-control-wrapper" style="display: inline-flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 30px; padding: 5px;">
                    <button onclick="updateQtyDetail(-1)" style="background:none; border:none; width:35px; height:30px; cursor:pointer;">-</button>
                    <span id="qty-val-display" style="width:40px; text-align:center;">1</span>
                    <button onclick="updateQtyDetail(1)" style="background:none; border:none; width:35px; height:30px; cursor:pointer;">+</button>
                </div>
                <button class="btn-add-cart" onclick="addToCart(${p.id})" style="width: 100%; padding: 16px; background-color: #3e2723; color: #fff; border: none; border-radius: 10px;">加入購物車</button>
                <div style="margin-top:40px; color: #666; font-size: 14px;">
                    <p style="font-weight: 700; border-bottom: 1px solid #eee; padding-bottom: 10px;">商品描述</p>
                    <div style="white-space: pre-line; line-height: 1.8;">${p.desc || '暫無商品描述'}</div>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0,0);
}

function updateQtyDetail(val) {
    let current = parseInt(document.getElementById('qty-val-display').innerText);
    current = Math.max(1, current + val);
    document.getElementById('qty-val-display').innerText = current;
}