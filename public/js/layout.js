// --- Utility Functions ---
const getCssVariable = (variableName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};

const setCssVariable = (variableName, value) => {
    document.documentElement.style.setProperty(variableName, value);
};

const pxToNumber = (pxValue) => {
    return parseFloat(pxValue) || 0;
};

// --- Header Module ---
const Header = (function() {
    const headerEl = document.getElementById('app-header');
    const toggleBtn = headerEl ? headerEl.querySelector('.header-toggle') : null;
    let isCollapsed = false;

    const init = () => {
        if (!headerEl || !toggleBtn) {
            console.error('Header elements not found!');
            return;
        }
        toggleBtn.addEventListener('click', toggleCollapse);
    };

    const collapse = () => {
        if (!isCollapsed) {
            headerEl.classList.add('collapsed');
            isCollapsed = true;
            // Notify App or other modules if needed
            App.saveState();
        }
    };

    const expand = () => {
        if (isCollapsed) {
            headerEl.classList.remove('collapsed');
            isCollapsed = false;
             // Notify App or other modules if needed
             App.saveState();
        }
    };

    const toggleCollapse = () => {
        if (isCollapsed) {
            expand();
        } else {
            collapse();
        }
    };

     const getState = () => ({
        collapsed: isCollapsed
     });

     const applyState = (state) => {
        if (state.collapsed) {
            collapse();
        } else {
            expand();
        }
     };

    return {
        init,
        toggleCollapse,
        collapse,
        expand,
        getState,
        applyState
    };
})();


// --- Footer Module ---
const Footer = (function() {
    const footerEl = document.getElementById('app-footer');
    const toggleBtn = footerEl ? footerEl.querySelector('.footer-toggle') : null;
    let isCollapsed = false;

    const init = () => {
         if (!footerEl || !toggleBtn) {
            console.error('Footer elements not found!');
            return;
        }
        toggleBtn.addEventListener('click', toggleCollapse);
    };

    const collapse = () => {
        if (!isCollapsed) {
            footerEl.classList.add('collapsed');
            isCollapsed = true;
            App.saveState();
        }
    };

    const expand = () => {
        if (isCollapsed) {
            footerEl.classList.remove('collapsed');
            isCollapsed = false;
            App.saveState();
        }
    };

    const toggleCollapse = () => {
        if (isCollapsed) {
            expand();
        } else {
            collapse();
        }
    };

    const getState = () => ({
        collapsed: isCollapsed
     });

     const applyState = (state) => {
        if (state.collapsed) {
            collapse();
        } else {
            expand();
        }
     };

    return {
        init,
        toggleCollapse,
        collapse,
        expand,
        getState,
        applyState
    };
})();


// --- Left Sidebar Module ---
const LeftSidebar = (function() {
    const sidebarEl = document.getElementById('left-sidebar');
    const toggleArea = sidebarEl; // Clicking the sidebar itself toggles collapse/expand
    const detachBtn = sidebarEl ? sidebarEl.querySelector('.detach-btn') : null;
    const dragHandle = sidebarEl ? sidebarEl.querySelector('.left-sidebar-handle') : null;
    const navItems = sidebarEl ? sidebarEl.querySelectorAll('.nav-item') : []; // Nav items to trigger collapse

    let isCollapsed = false;
    let isDetached = false;
    let startX, startY, initialMouseX, initialMouseY;
    let activeItem = null;

    const init = () => {
        if (!sidebarEl || !detachBtn || !dragHandle) {
             console.error('Left sidebar elements not found!');
             return;
        }

        // Attach collapse/expand listeners (excluding detach button clicks)
         sidebarEl.addEventListener('click', (e) => {
             if (!e.target.closest('.detach-btn')) { // Don't toggle if detach button is clicked
                toggleCollapse();
             }
         });

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();

                /*
                if (!isDetached) {
                    toggleCollapse();
                }
                */
                const clickedItem = e.currentTarget;
                setActiveItem(clickedItem);

                if (activeItem) {
                    activeItem.classList.remove('active');
                }
                item.classList.add('active');
                activeItem = item;

                console.log('Nav item clicked:', item.textContent.trim(), isDetached);
            });
        });


        detachBtn.addEventListener('click', toggleDetach);

        // Add mousedown listener to the drag handle
        dragHandle.addEventListener('mousedown', startDrag);
    };

    const setActiveItem = (item) => {
        if (activeItem) {
            activeItem.classList.remove('active');
        }
        item.classList.add('active');
        activeItem = item;
        // Optional: Save active item state in App.saveState()
     };

    const collapse = () => {
        if (!isCollapsed) {
            sidebarEl.classList.add('collapsed');
            isCollapsed = true;
            // Ensure it's attached when collapsing
            if (isDetached) {
                attach();
            }
            App.saveState();
        }
    };

    const expand = () => {
        if (isCollapsed) {
            sidebarEl.classList.remove('collapsed');
            isCollapsed = false;
            App.saveState();
        }
    };

    const toggleCollapse = () => {
        if (isCollapsed) {
            expand();
        } else {
            collapse();
        }
    };

    const detach = () => {
        if (!isDetached) {
            // Store current dimensions before detaching for consistent appearance
            // when re-attaching or initially detaching.
            // Note: Width is already managed by expanded/collapsed classes.
            // Height might need capturing if content isn't driving it.
            // For now, we rely on content/flexbox for height when attached,
            // and auto height when detached.

            sidebarEl.classList.add('detached');
            isDetached = true;

            // Set initial position (can be center screen, or remembered last position)
            // For simplicity, let's start it near its original position visually
            const rect = sidebarEl.getBoundingClientRect();
            sidebarEl.style.left = `${rect.left}px`;
            sidebarEl.style.top = `${rect.top}px`;

            App.saveState();
        }
    };

    const attach = () => {
        if (isDetached) {
            sidebarEl.classList.remove('detached');
            sidebarEl.classList.remove('dragging'); // Remove dragging class if active
            sidebarEl.style.left = ''; // Remove absolute positioning styles
            sidebarEl.style.top = '';
            isDetached = false;

            // Ensure correct collapse state is applied after attaching
            if (isCollapsed) {
                 sidebarEl.classList.add('collapsed');
            } else {
                 sidebarEl.classList.remove('collapsed');
            }

             // Re-apply the event listeners if they were removed (though document listeners are fine)
             document.removeEventListener('mousemove', onDrag);
             document.removeEventListener('mouseup', stopDrag);


            App.saveState();
        }
    };

    const toggleDetach = () => {
        if (isDetached) {
            attach();
        } else {
            detach();
            // Ensure it's expanded when detached for better usability
            expand();
        }
    };

    const startDrag = (e) => {
        if (!isDetached) return; // Only drag when detached

        e.preventDefault(); // Prevent default browser drag behavior (like image drag)
        sidebarEl.classList.add('dragging');

        // Get the current position of the element
        const style = window.getComputedStyle(sidebarEl);
        startX = pxToNumber(style.left) - e.clientX;
        startY = pxToNumber(style.top) - e.clientY;

        // Store initial mouse position
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;


        // Attach listeners to the document to track mouse movement anywhere
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const onDrag = (e) => {
        if (!isDetached || !sidebarEl.classList.contains('dragging')) return;

        // Calculate new position based on mouse movement
        const newX = e.clientX + startX;
        const newY = e.clientY + startY;

        // Optional: Add bounds checking here to prevent dragging off-screen

        moveTo(newX, newY);
    };

     const moveTo = (x, y) => {
        sidebarEl.style.left = `${x}px`;
        sidebarEl.style.top = `${y}px`;
     };


    const stopDrag = () => {
        if (!isDetached || !sidebarEl.classList.contains('dragging')) return;

        sidebarEl.classList.remove('dragging');

        // Remove listeners
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);

        App.saveState(); // Save the final detached position
    };

     const getState = () => ({
        collapsed: isCollapsed,
        detached: isDetached,
        detachedPosition: isDetached ? {
            left: sidebarEl.style.left,
            top: sidebarEl.style.top
        } : null
     });

     const applyState = (state) => {
        if (state.detached) {
            detach(); // Apply detached first
             if (state.detachedPosition) {
                // Apply position after detaching, but allow CSS transition
                // A slight delay might be needed if the 'detached' class applies transitions
                setTimeout(() => {
                     sidebarEl.style.left = state.detachedPosition.left;
                     sidebarEl.style.top = state.detachedPosition.top;
                }, 0); // Use 0 delay to push to end of event queue
             }
            // Collapsed state only applies when attached, ensure expanded when detached
            expand(); // Explicitly ensure expanded when detached
        } else {
            attach(); // Apply attached
            if (state.collapsed) {
                collapse(); // Apply collapsed state if it was saved
            } else {
                expand(); // Apply expanded state if it was saved
            }
        }
     };


    return {
        init,
        toggleCollapse,
        collapse,
        expand,
        toggleDetach,
        detach,
        attach,
        startDrag, // Exposed for completeness, but internal handlers use it
        moveTo, // Exposed for completeness
        getState,
        applyState
    };
})();


// --- Right Sidebar Module ---
const RightSidebar = (function() {
    const sidebarEl = document.getElementById('right-sidebar');
    const resizeHandle = sidebarEl ? sidebarEl.querySelector('.right-sidebar-handle') : null;
    const minWidth = pxToNumber(getCssVariable('--right-sidebar-min-width'));
    const maxWidth = pxToNumber(getCssVariable('--right-sidebar-max-width'));

    let isResizing = false;
    let startMouseX;
    let startWidth;

    const init = () => {
        if (!sidebarEl || !resizeHandle) {
             console.error('Right sidebar elements not found!');
             return;
        }
        resizeHandle.addEventListener('mousedown', startResize);
    };

    const startResize = (e) => {
        e.preventDefault(); // Prevent default behavior

        isResizing = true;
        sidebarEl.classList.add('resizing');
        startMouseX = e.clientX;
        startWidth = sidebarEl.offsetWidth; // Get current rendered width

        // Attach listeners to the document
        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', stopResize);
    };

    const onResize = (e) => {
        if (!isResizing) return;

        const mouseDeltaX = e.clientX - startMouseX;
        // Since the handle is on the LEFT edge, increasing mouseX means making the sidebar WIDER
        let newWidth = startWidth - mouseDeltaX; // Subtract delta because handle is on left

        // Clamp width between min and max
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        setCurrentWidth(newWidth);
    };

    const setCurrentWidth = (width) => {
         // Apply the width directly. CSS min/max will handle clamping,
         // but JS clamping is better for smooth interaction.
         // We set it as a style property which overrides the flex/grid basis for this item.
         sidebarEl.style.width = `${width}px`;
         // Could also update a CSS variable: setCssVariable('--current-right-sidebar-width', `${width}px`);
         // and use var(--current-right-sidebar-width) in CSS, but inline style is simpler for drag/resize
    };


    const stopResize = () => {
        if (!isResizing) return;

        isResizing = false;
        sidebarEl.classList.remove('resizing');

        // Remove listeners
        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', stopResize);

        App.saveState(); // Save the final width
    };

    const getState = () => ({
        width: sidebarEl.style.width // Save the inline style width
     });

     const applyState = (state) => {
        if (state.width) {
            sidebarEl.style.width = state.width;
            // Ensure it respects min/max on load
            const currentWidth = sidebarEl.offsetWidth;
            const clampedWidth = Math.max(minWidth, Math.min(maxWidth, currentWidth));
            if (currentWidth !== clampedWidth) {
                 sidebarEl.style.width = `${clampedWidth}px`;
            }
        } else {
             // Apply default min width if no state
            sidebarEl.style.width = `${minWidth}px`;
        }
     };


    return {
        init,
        startResize, // Exposed for completeness
        setCurrentWidth, // Exposed for applying state or external changes
        getState,
        applyState
    };
})();


// --- App Module ---
const App = (function() {
    const localStorageKey = 'dynamicLayoutState';
    const resetBtn = document.getElementById('reset-layout-btn');

    const init = () => {
        console.log('App initializing...');
        // Initialize component modules
        Header.init();
        Footer.init();
        LeftSidebar.init();
        RightSidebar.init();

        // Add reset button listener
        if (resetBtn) {
            resetBtn.addEventListener('click', resetLayout);
        }

        // Load saved state or apply defaults
        loadState();

        console.log('App initialized.');
    };

    const saveState = () => {
        const state = {
            header: Header.getState(),
            footer: Footer.getState(),
            leftSidebar: LeftSidebar.getState(),
            rightSidebar: RightSidebar.getState()
        };
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(state));
            // console.log('State saved:', state);
        } catch (e) {
            console.error('Could not save state to localStorage:', e);
        }
    };

    const loadState = () => {
        try {
            const savedState = localStorage.getItem(localStorageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                console.log('Loading state:', state);
                Header.applyState(state.header || {}); // Use empty object as default if not found
                Footer.applyState(state.footer || {});
                // Left sidebar applyState needs to be done carefully w.r.t. detached/collapsed
                LeftSidebar.applyState(state.leftSidebar || {});
                 RightSidebar.applyState(state.rightSidebar || {});
            } else {
                console.log('No saved state found. Applying default layout.');
                // Optionally apply default states explicitly here if loadState is the ONLY entry point
                // Otherwise, component .init() methods should handle defaults
            }
        } catch (e) {
            console.error('Could not load state from localStorage:', e);
            // Optionally clear invalid state
            // localStorage.removeItem(localStorageKey);
        }
    };

    const resetLayout = () => {
        console.log('Resetting layout...');
        // Clear localStorage state
        try {
            localStorage.removeItem(localStorageKey);
            console.log('State cleared from localStorage.');
        } catch (e) {
            console.error('Could not clear state from localStorage:', e);
        }

        // Apply default states - components should revert to non-collapsed/attached, etc.
        // Explicitly call expand/attach on relevant components
        Header.expand();
        Footer.expand();
        LeftSidebar.attach(); // Ensure attached
        LeftSidebar.expand(); // Ensure expanded when attached
        // Right sidebar should revert to its min-width default style
        RightSidebar.setCurrentWidth(pxToNumber(getCssVariable('--right-sidebar-min-width'))); // Explicitly set min width

        console.log('Layout reset to default.');
    };

    // Expose necessary methods
    return {
        init,
        saveState, // Could be triggered by other events if needed
        loadState, // Primarily for init
        resetLayout // For the button
        // Could expose component modules here if direct access is needed elsewhere,
        // e.g., Header: Header, LeftSidebar: LeftSidebar, etc.
    };
})();

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', App.init);