// Debounce: Delays executing a function until after a period of inactivity
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle: Ensures a function is called at most once in a specified time period
function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Preload: Preloads images to browser cache
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}

// Preload multiple images
function preloadImages(urls) {
    return Promise.all(urls.map(url => preloadImage(url)));
}

// Usage examples:
// const debouncedFunction = debounce(() => console.log('debounced'), 300);
// const throttledFunction = throttle(() => console.log('throttled'), 300);
// preloadImages(['image1.jpg', 'image2.jpg']).then(() => console.log('Images loaded'));

// Deep clone an object
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    const copy = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        copy[key] = deepClone(obj[key]);
    }
    return copy;
}

const UUID = (function () {
    function generate() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function isValid(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    return {
        generate: generate,
        isValid: isValid
    };
})();

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getQueryParams() {
    return Object.fromEntries(
        new URLSearchParams(window.location.search).entries()
    );
}

function cloneTemplate(template, target = null, position = 'beforeend', callback = null) {
    return new Promise((resolve, reject) => {
        try {
            const templateElement = typeof template === 'string'
                ? document.querySelector(template)
                : template;

            if (!templateElement || templateElement.tagName !== 'TEMPLATE') {
                throw new Error('Invalid template element');
            }

            const clone = document.importNode(templateElement.content, true);
            if (target === null) {
                if (callback && typeof callback === 'function') {
                    callback(clone);
                }
                /*
                const serializer = new XMLSerializer();
                const clone_html = serializer.serializeToString(clone);
                */
                // convert clone to HTML string



                let div = document.createElement('div');
                div.appendChild(clone);
                clone_html = div.innerHTML;
                resolve(clone_html);
                return;
            }
            const targetElement = typeof target === 'string'
                ? document.querySelector(target)
                : target;

            if (!targetElement) {
                throw new Error('Invalid target element');
            }

            const validPositions = ['beforebegin', 'afterbegin', 'beforeend', 'afterend'];
            if (!validPositions.includes(position)) {
                throw new Error(`Invalid position. Must be one of: ${validPositions.join(', ')}`);
            }

            targetElement.insertAdjacentElement(position, clone);

            if (callback && typeof callback === 'function') {
                callback(clone);
            }

            resolve(clone);
        } catch (error) {
            reject(error);
        }
    });
}