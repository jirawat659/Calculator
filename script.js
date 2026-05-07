document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const equalsBtn = document.getElementById('equals-btn');
    const modal = document.getElementById('subscription-modal');
    const closeModal = document.getElementById('close-modal');
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');

    const pricingOptions = document.querySelector('.pricing-options');
    const modalHeader = document.querySelector('.modal-content h2');
    const modalDesc = document.querySelector('.modal-content p');
    const modalIcon = document.querySelector('.modal-icon');
    const qrSection = document.getElementById('qr-section');
    const selectedPlanText = document.getElementById('selected-plan-text');
    const backToPlansBtn = document.getElementById('back-to-plans-btn');

    const trollModal = document.getElementById('troll-modal');
    const closeTrollModal = document.getElementById('close-troll-modal');
    const trollEmoji = document.getElementById('troll-emoji');
    const trollTitle = document.getElementById('troll-title');
    const trollText = document.getElementById('troll-text');
    const trollSubscribeBtn = document.getElementById('troll-subscribe-btn');

    const listIconBtn = document.getElementById('list-icon-btn');
    const calcIconBtn = document.getElementById('calc-icon-btn');

    const showTroll = (emoji, title, text) => {
        trollEmoji.textContent = emoji;
        trollTitle.textContent = title;
        trollText.textContent = text;
        trollModal.classList.add('active');
    };

    listIconBtn.addEventListener('click', () => {
        showTroll('📜', 'ดูประวัติเหรอ?', 'แหม... ขนาดผลลัพธ์ยังไม่ให้ดูฟรีเลย สมัครสมาชิกก่อนเถอะพ่อหนุ่ม! 💸');
    });

    calcIconBtn.addEventListener('click', () => {
        showTroll('🤫', 'โดนหลอก!', 'ปุ่มนี้มีไว้เท่ๆ งั้นแหละ กดไปก็ไม่มีอะไรเกิดขึ้นหรอก... ยกเว้นคุณจะเปย์ให้เรา 5555 🤪💰');
    });

    closeTrollModal.addEventListener('click', () => {
        trollModal.classList.remove('active');
    });

    trollModal.addEventListener('click', (e) => {
        if (e.target === trollModal) {
            trollModal.classList.remove('active');
        }
    });

    trollSubscribeBtn.addEventListener('click', () => {
        trollModal.classList.remove('active');
        modal.classList.add('active');
    });

    let currentInput = '0';
    let shouldResetDisplay = false;
    let activeOpBtn = null;

    // Format number with commas
    const formatNumber = (numStr) => {
        if (!numStr) return '';
        const parts = numStr.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join('.');
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn === equalsBtn) return;

            const isNum = btn.classList.contains('btn-num');
            const isTop = btn.classList.contains('btn-top');
            const isOp = btn.classList.contains('btn-op');

            if (isNum) {
                // Ignore the calculator icon button
                if (btn.querySelector('i')) return;

                const val = btn.textContent.trim();

                if (shouldResetDisplay) {
                    currentInput = '0';
                    shouldResetDisplay = false;
                    if (activeOpBtn) {
                        activeOpBtn.style.backgroundColor = '';
                        activeOpBtn.style.color = '';
                        activeOpBtn = null;
                    }
                }

                // Prevent multiple decimals
                if (val === '.' && currentInput.includes('.')) return;

                // Remove commas for length check and appending
                let cleanInput = currentInput.replace(/,/g, '');

                if (cleanInput === '0' && val !== '.') {
                    cleanInput = val;
                } else if (cleanInput.length < 9) {
                    cleanInput += val;
                }

                currentInput = cleanInput;
                display.textContent = formatNumber(currentInput);

                // Simple adjust font size if length is too long
                if (currentInput.length > 7) {
                    display.style.fontSize = '60px';
                } else {
                    display.style.fontSize = '80px';
                }

            } else if (isTop) {
                const action = btn.textContent.trim();
                if (action === 'AC') {
                    currentInput = '0';
                    display.textContent = currentInput;
                    display.style.fontSize = '80px';
                    shouldResetDisplay = false;
                    if (activeOpBtn) {
                        activeOpBtn.style.backgroundColor = '';
                        activeOpBtn.style.color = '';
                        activeOpBtn = null;
                    }
                } else if (action === '+/-') {
                    if (currentInput !== '0') {
                        if (currentInput.startsWith('-')) {
                            currentInput = currentInput.substring(1);
                        } else {
                            currentInput = '-' + currentInput;
                        }
                        display.textContent = formatNumber(currentInput);
                    }
                } else if (action === '%') {
                    const val = parseFloat(currentInput.replace(/,/g, '')) / 100;
                    currentInput = val.toString();
                    // Limiting decimal places for percentage
                    if (currentInput.length > 9) {
                        currentInput = parseFloat(currentInput).toPrecision(9).toString();
                    }
                    display.textContent = formatNumber(currentInput);
                }
            } else if (isOp) {
                if (activeOpBtn) {
                    activeOpBtn.style.backgroundColor = '';
                    activeOpBtn.style.color = '';
                }
                btn.style.backgroundColor = '#fff';
                btn.style.color = '#FF9F0A';
                activeOpBtn = btn;
                shouldResetDisplay = true;
            }
        });
    });

    // Show modal on equals click
    equalsBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    const resetModal = () => {
        pricingOptions.style.display = 'flex';
        modalHeader.style.display = 'block';
        modalDesc.style.display = 'block';
        modalIcon.style.display = 'block';
        qrSection.style.display = 'none';
    };

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(resetModal, 300);
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(resetModal, 300);
        }
    });

    // Subscribe buttons interaction
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal background click
            const plan = e.target.closest('.option').querySelector('h3').textContent;

            pricingOptions.style.display = 'none';
            modalHeader.style.display = 'none';
            modalDesc.style.display = 'none';
            modalIcon.style.display = 'none';

            qrSection.style.display = 'block';
            selectedPlanText.textContent = `แผนที่เลือก: ${plan}`;
        });
    });

    backToPlansBtn.addEventListener('click', () => {
        resetModal();
    });
});
