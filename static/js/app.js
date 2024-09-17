document.addEventListener('DOMContentLoaded', () => {
    // Объявление элементов интерфейса
    const colorPicker = document.getElementById('colorPicker');

    const colorDisplay = document.getElementById('colorDisplay');

        colorDisplay.style.backgroundColor = 'rgb(255, 0, 0)';

    const rInput = document.getElementById('rInput');
    const gInput = document.getElementById('gInput');
    const bInput = document.getElementById('bInput');

    const xInput = document.getElementById('xInput');
    const yInput = document.getElementById('yInput');
    const zInput = document.getElementById('zInput');

    const hInput = document.getElementById('hInput');
    const lInput = document.getElementById('lInput');
    const sInput = document.getElementById('sInput');

const rRange = document.getElementById('rRange');
const gRange = document.getElementById('gRange');
const bRange = document.getElementById('bRange');

const xRange = document.getElementById('xRange');
const yRange = document.getElementById('yRange');
const zRange = document.getElementById('zRange');

const hRange = document.getElementById('hRange');
const lRange = document.getElementById('lRange');
const sRange = document.getElementById('sRange');

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

  function showAlert(message) {
        alertPopup.textContent = message;
        alertPopup.style.display = 'block';

        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            alertPopup.style.display = 'none';
        }, 3500);
    }

    const alertPopup = document.createElement('div');
    alertPopup.id = 'alertPopup';
    alertPopup.style.position = 'fixed';
    alertPopup.style.top = '20px';
    alertPopup.style.left = '50%';
    alertPopup.style.transform = 'translateX(-50%)';
    alertPopup.style.padding = '10px 20px';
    alertPopup.style.backgroundColor = 'red';
    alertPopup.style.color = 'white';
    alertPopup.style.borderRadius = '5px';
    alertPopup.style.display = 'none';
    alertPopup.style.zIndex = '1000';
    alertPopup.textContent = '';

    document.body.appendChild(alertPopup);

   function limitValue(value, min, max) {

        if (value < min) {
           // showAlert(`Значение ${value} ниже допустимого минимума (${min}). Установлено значение ${min}.`);
            showAlert(`Происходит обрезание-округление. Установлено значение ${min}.`);
            return min;
        } else if (value > max) {
           // showAlert(`Значение ${value} выше допустимого максимума (${max}). Установлено значение ${max}.`);
            showAlert(`Происходит обрезание-округление. Установлено значение ${max}.`);
            return max;
        }
        return value;
    }

  function updateColorDisplay(rgb) {
    // Отображение цвета в элементе colorDisplay
    colorDisplay.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

    function rgbToXyz(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;

        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
        let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
        let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;

        return {
            x: limitValue(Math.round(x), 0, 100),
            y: limitValue(Math.round(y), 0, 100),
            z: limitValue(Math.round(z), 0, 100)
        };
    }

    function xyzToRgb(x, y, z) {
        x = x / 100;
        y = y / 100;
        z = z / 100;

        let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
        b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

        return {
            r: limitValue(Math.round(r * 255), 0, 255),
            g: limitValue(Math.round(g * 255), 0, 255),
            b: limitValue(Math.round(b * 255), 0, 255)
        };
    }

    function rgbToHls(r, g, b) {
        // Нормализуем значения RGB в диапазоне [0, 1]
        r /= 255;
        g /= 255;
        b /= 255;

        // Находим максимум и минимум из нормализованных значений
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        // Вычисляем яркость (Lightness)
        let l = (max + min) / 2;

        // Инициализируем значения насыщенности (Saturation) и оттенка (Hue)
        let s = 0;
        let h = 0;

        // Вычисляем насыщенность (Saturation) только если максимальное и минимальное значение не равны
        if (delta !== 0) {
            s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

            // Вычисляем оттенок (Hue) на основе максимального значения
            switch (max) {
                case r:
                    h = (g - b) / delta + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / delta + 2;
                    break;
                case b:
                    h = (r - g) / delta + 4;
                    break;
            }

            h /= 6;
        }

        // Преобразуем Hue, Lightness и Saturation в диапазоны [0, 360] и [0, 100]
        h = h * 360;
        l = l * 100;
        s = s * 100;

        // Если светлота равна 0 или 100, Hue не имеет значения и должен быть установлен в 0
        if (l === 0 || l === 100) {
            h = 0;
        }

        // Обрезаем значения до допустимых границ и округляем
        return {
            h: limitValue(Math.round(h), 0, 360),
            l: limitValue(Math.round(l), 0, 100),
            s: limitValue(Math.round(s), 0, 100)
        };
    }

    function hlsToRgb(h, l, s) {
    h = h / 360;  // H должен быть в диапазоне [0,1]
    l = l / 100;  // L должен быть в диапазоне [0,1]
    s = s / 100;  // S должен быть в диапазоне [0,1]

    let r, g, b;

    if (s === 0) {
        // Если насыщенность 0, то это ахроматический цвет (оттенок не важен)
        r = g = b = l; // серый
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


    function updateFieldsFromRgb(r, g, b) {
        r = limitValue(r, 0, 255);
        g = limitValue(g, 0, 255);
        b = limitValue(b, 0, 255);

                updateColorDisplay({ r, g, b });

        rInput.value = r;
        gInput.value = g;
        bInput.value = b;


        const xyz = rgbToXyz(r, g, b);
        xInput.value = xyz.x;
        yInput.value = xyz.y;
        zInput.value = xyz.z;

        const hls = rgbToHls(r, g, b);
        hInput.value = hls.h;
        lInput.value = hls.l;
        sInput.value = hls.s;
        syncFieldsAndSliders();
    }

    function updateFieldsFromXyz(x, y, z) {
        x = limitValue(x, 0, 100);
        y = limitValue(y, 0, 100);
        z = limitValue(z, 0, 100);

        const rgb = xyzToRgb(x, y, z);
 rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
updateColorDisplay(rgb);

        xInput.value = x;
        yInput.value = y
        zInput.value = z;


        const hls = rgbToHls(rgb.r, rgb.g, rgb.b);
        hInput.value = hls.h;
        lInput.value = hls.l;
        sInput.value = hls.s;
        syncFieldsAndSliders();
    }

    function updateFieldsFromHls(h, l, s) {
        h = limitValue(h, 0, 360);
        l = limitValue(l, 0, 100);
        s = limitValue(s, 0, 100);

        hInput.value = h;
        lInput.value = l;
        sInput.value = s;
const rgb = hlsToRgb(h, l, s);
updateColorDisplay(rgb);


        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;

        const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
        xInput.value = xyz.x;
        yInput.value = xyz.y;
        zInput.value = xyz.z;
    }

    colorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        const rgb = hexToRgb(color);
        updateFieldsFromRgb(rgb.r, rgb.g, rgb.b);
        syncFieldsAndSliders();
    });


    rInput.addEventListener('input', debounce(() => {
        const r = parseInt(rInput.value, 10);
        const g = parseInt(gInput.value, 10);
        const b = parseInt(bInput.value, 10);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            updateFieldsFromRgb(r, g, b);
        }
    }, 500));

    gInput.addEventListener('input', debounce(() => {
        const r = parseInt(rInput.value, 10);
        const g = parseInt(gInput.value, 10);
        const b = parseInt(bInput.value, 10);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            updateFieldsFromRgb(r, g, b);
        }
    }, 500));

    bInput.addEventListener('input', debounce(() => {
        const r = parseInt(rInput.value, 10);
        const g = parseInt(gInput.value, 10);
        const b = parseInt(bInput.value, 10);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            updateFieldsFromRgb(r, g, b);
        }
    }, 500));

    xInput.addEventListener('input', debounce(() => {
        const x = parseInt(xInput.value, 10);
        const y = parseInt(yInput.value, 10);
        const z = parseInt(zInput.value, 10);
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            updateFieldsFromXyz(x, y, z);
        }
    }, 500));

    yInput.addEventListener('input', debounce(() => {
        const x = parseInt(xInput.value, 10);
        const y = parseInt(yInput.value, 10);
        const z = parseInt(zInput.value, 10);
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            updateFieldsFromXyz(x, y, z);
        }
    }, 500));

    zInput.addEventListener('input', debounce(() => {
        const x = parseInt(xInput.value, 10);
        const y = parseInt(yInput.value, 10);
        const z = parseInt(zInput.value, 10);
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            updateFieldsFromXyz(x, y, z);
        }
    }, 500));

    hInput.addEventListener('input', debounce(() => {
        const h = parseInt(hInput.value, 10);
        const l = parseInt(lInput.value, 10);
        const s = parseInt(sInput.value, 10);
        if (!isNaN(h) && !isNaN(l) && !isNaN(s)) {
            updateFieldsFromHls(h, l, s);
        }
    }, 500));

    lInput.addEventListener('input', debounce(() => {
        const h = parseInt(hInput.value, 10);
        const l = parseInt(lInput.value, 10);
        const s = parseInt(sInput.value, 10);
        if (!isNaN(h) && !isNaN(l) && !isNaN(s)) {
            updateFieldsFromHls(h, l, s);
        }
    }, 500));

    sInput.addEventListener('input', debounce(() => {
        const h = parseInt(hInput.value, 10);
        const l = parseInt(lInput.value, 10);
        const s = parseInt(sInput.value, 10);
        if (!isNaN(h) && !isNaN(l) && !isNaN(s)) {
            updateFieldsFromHls(h, l, s);
        }
    }, 500));

 // Синхронизация ползунков и полей ввода
  function syncFieldsAndSliders() {
    rRange.addEventListener('input', () => {
        const r = parseInt(rRange.value, 10);
        const g = parseInt(gRange.value, 10);
        const b = parseInt(bRange.value, 10);
        updateFieldsFromRgb(r, g, b);
    });
    gRange.addEventListener('input', () => {
        const r = parseInt(rRange.value, 10);
        const g = parseInt(gRange.value, 10);
        const b = parseInt(bRange.value, 10);
        updateFieldsFromRgb(r, g, b);
    });
    bRange.addEventListener('input', () => {
        const r = parseInt(rRange.value, 10);
        const g = parseInt(gRange.value, 10);
        const b = parseInt(bRange.value, 10);
        updateFieldsFromRgb(r, g, b);
    });

    xRange.addEventListener('input', () => {
        const x = parseInt(xRange.value, 10);
        const y = parseInt(yRange.value, 10);
        const z = parseInt(zRange.value, 10);
        updateFieldsFromXyz(x, y, z);
    });
    yRange.addEventListener('input', () => {
        const x = parseInt(xRange.value, 10);
        const y = parseInt(yRange.value, 10);
        const z = parseInt(zRange.value, 10);
        updateFieldsFromXyz(x, y, z);
    });
    zRange.addEventListener('input', () => {
        const x = parseInt(xRange.value, 10);
        const y = parseInt(yRange.value, 10);
        const z = parseInt(zRange.value, 10);
        updateFieldsFromXyz(x, y, z);
    });

    hRange.addEventListener('input', () => {
        const h = parseInt(hRange.value, 10);
        const l = parseInt(lRange.value, 10);
        const s = parseInt(sRange.value, 10);
        updateFieldsFromHls(h, l, s);
    });
    lRange.addEventListener('input', () => {
        const h = parseInt(hRange.value, 10);
        const l = parseInt(lRange.value, 10);
        const s = parseInt(sRange.value, 10);
        updateFieldsFromHls(h, l, s);
    });
    sRange.addEventListener('input', () => {
        const h = parseInt(hRange.value, 10);
        const l = parseInt(lRange.value, 10);
        const s = parseInt(sRange.value, 10);
        updateFieldsFromHls(h, l, s);
    });
}


    syncFieldsAndSliders();
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return { r, g, b };
    }





});
