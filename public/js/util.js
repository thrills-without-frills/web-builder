function cloneTemplate(template, target, position = 'beforeend', callback = null) {
    return new Promise((resolve, reject) => {
        try {
            const templateElement = typeof template === 'string'
                ? document.querySelector(template)
                : template;
console.log(document.querySelector(template));
resolve(template);
return;
            if (!templateElement || templateElement.tagName !== 'TEMPLATE') {
                if (target) {
                     throw new Error('Invalid template element: Must be a <template> tag or a valid selector for one.');
                } else {
                     throw new Error('Invalid template element: A valid <template> is required even when returning HTML string.');
                }
            }

            const clone = document.importNode(templateElement.content, true);

            if (target === undefined || target === null) {
                 console.log("No target provided, returning HTML string.");
                 const tempDiv = document.createElement('div');
                 tempDiv.appendChild(clone);
                 const htmlString = tempDiv.innerHTML;
                 resolve(htmlString);
                 return;
            }

            const targetElement = typeof target === 'string'
                ? document.querySelector(target)
                : target;

            if (!targetElement) {
                throw new Error('Invalid target element: Target element not found or is invalid.');
            }

            const validPositions = ['beforebegin', 'afterbegin', 'beforeend', 'afterend'];
            if (!validPositions.includes(position)) {
                throw new Error(`Invalid position: Must be one of: ${validPositions.join(', ')}`);
            }

            targetElement.insertAdjacentElement(position, clone);

            if (callback && typeof callback === 'function') {
                callback(clone);
            }

            resolve(clone);

        } catch (error) {
            console.error("Error in cloneTemplate:", error);
            reject(error);
        }
    });
}