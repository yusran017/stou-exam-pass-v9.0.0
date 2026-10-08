/**
 * STOU Exam Pass - Liquid & Aero Glass Architecture (v6)
 * Pure SVG Icons Everywhere, Zero Emojis, No Dark Text Shadows,
 * Real-Time Upcoming Exam Countdown Ticker,
 * Morning (Sun) vs. Afternoon (Sunset) SVG Indicators,
 * Flexible Exam Time Customization (+/- 1 hour, custom minutes),
 * Multi-Sheet Excel (.xls XML Spreadsheet) & CSV Report Exporter.
 */

const App = {
  data: null,
  deferredPrompt: null,
  curriculumSearchQuery: '',
  curriculumFilterStatus: 'all',
  activeEditingCourseCode: null,
  expandedExamCards: new Set(),
  expandedBookCards: new Set(),
  activeDropdownCode: null,
  countdownInterval: null,
  currentSubUnitTarget: { courseCode: null, unitNumber: null },

  init() {
    this.setupTheme();
    this.setupPWA();
    this.setupNavigation();
    this.setupModals();
    this.setupSearchAndFilters();
    this.setupExcelExport();
    this.setupJsonIO();
    this.setupSyncHub();
    this.setupReadingTracker();
    this.setupGlobalClickListener();
    this.startCountdownTimer();
    this.loadInitialData();
  },

  // ═══════════════════════════════════
  // Pure SVG Icons Repository (Zero Emojis)
  // ═══════════════════════════════════
  getStatusSvg(status) {
    switch (status) {
      case 'will_take': // ลงทะเบียนสอบไล่ภาคปกติ (Liquid Azure)
        return `<svg class="status-svg-ico icon-azure" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
      case 'will_take_samrit': // สัมฤทธิบัตร (Liquid Purple)
        return `<svg class="status-svg-ico icon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      case 'will_take_summer': // ภาคฤดูร้อน (Liquid Amber)
        return `<svg class="status-svg-ico icon-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      case 'will_take_retake': // สอบซ่อม (Liquid Orange)
        return `<svg class="status-svg-ico icon-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`;
      case 'failed': // สอบไม่ผ่าน/รอซ่อม (Liquid Coral Red)
        return `<svg class="status-svg-ico icon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      case 'passed': // สอบผ่านแล้ว S/H (Liquid Emerald Green)
        return `<svg class="status-svg-ico icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      case 'transferred': // เทียบโอนชุดวิชา (Liquid Teal)
        return `<svg class="status-svg-ico icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
      case 'not_taken': // ยังไม่ลงทะเบียน (Aero Slate)
      default:
        return `<svg class="status-svg-ico icon-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
    }
  },

  getStatusLabel(status) {
    switch (status) {
      case 'will_take': return 'ลงทะเบียนสอบไล่ (ภาคปกติ)';
      case 'will_take_samrit': return 'ลงทะเบียนโครงการสัมฤทธิบัตร';
      case 'will_take_summer': return 'ลงทะเบียนภาคพิเศษ / ฤดูร้อน';
      case 'will_take_retake': return 'ลงทะเบียนสอบซ่อม (Make-up)';
      case 'failed': return 'สอบไม่ผ่าน (รอสอบซ่อม / ลงใหม่)';
      case 'passed': return 'สอบผ่านแล้ว (ได้ S / H)';
      case 'transferred': return 'เทียบโอนชุดวิชา';
      case 'not_taken':
      default: return 'ยังไม่ลงทะเบียน';
    }
  },

  getMorningSunSvg() {
    return `<svg class="session-svg-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  },

  getAfternoonSunSvg() {
    return `<svg class="session-svg-sunset" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line></svg>`;
  },

  getOnlineFormatSvg() {
    return `<svg class="format-svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
  },

  getOnsiteFormatSvg() {
    return `<svg class="format-svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 7h1"></path><path d="M9 11h1"></path><path d="M9 15h1"></path><path d="M14 7h1"></path><path d="M14 11h1"></path><path d="M14 15h1"></path></svg>`;
  },

  // ═══════════════════════════════════
  // Aero & Liquid Glass Theme Management
  // ═══════════════════════════════════
  setupTheme() {
    const savedTheme = localStorage.getItem('stou_aero_theme') || localStorage.getItem('stou_aqua_theme') || 'aqua-dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'aqua-light' ? 'aqua-dark' : 'aqua-light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('stou_aero_theme', next);
      this.updateThemeIcon(next);
    });
  },

  updateThemeIcon(theme) {
    const c = document.getElementById('theme-icon-container');
    if (!c) return;
    c.innerHTML = theme === 'aqua-light'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  },

  // ═══════════════════════════════════
  // PWA Support
  // ═══════════════════════════════════
  setupPWA() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then((reg) => console.log('STOU ServiceWorker active with scope:', reg.scope))
          .catch((err) => console.warn('ServiceWorker registration warning:', err));
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBtn = document.getElementById('btn-install-pwa');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', () => {
          this.deferredPrompt.prompt();
          this.deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
              this.showToast('ติดตั้งแอปบนหน้าจอมือถือเรียบร้อยแล้ว');
            }
            this.deferredPrompt = null;
            installBtn.style.display = 'none';
          });
        });
      }
    });

    window.addEventListener('appinstalled', () => {
      this.showToast('ติดตั้งแอปบนหน้าจอหลักสำเร็จ');
    });
  },

  // ═══════════════════════════════════
  // Navigation & Dropdown Global Handlers
  // ═══════════════════════════════════
  setupNavigation() {
    document.querySelectorAll('.aqua-dock-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.switchTab(target);
      });
    });
  },

  switchTab(targetPaneId) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.aqua-dock-item').forEach(b => b.classList.remove('active'));

    const pane = document.getElementById(targetPaneId);
    if (pane) pane.classList.add('active');

    document.querySelectorAll(`[data-target="${targetPaneId}"]`).forEach(b => b.classList.add('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close any floating popovers
    this.closeAllDropdowns();
  },

  setupGlobalClickListener() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.aero-dropdown-wrapper')) {
        this.closeAllDropdowns();
      }
      if (e.target.classList && e.target.classList.contains('aqua-modal-backdrop')) {
        this.closeAllModals();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
        this.closeAllModals();
      }
    });
  },

  closeAllModals() {
    document.querySelectorAll('.aqua-modal-backdrop').forEach(m => {
      m.style.display = 'none';
    });
    document.body.classList.remove('modal-open');
    this.currentSubUnitTarget = { courseCode: null, unitNumber: null };
  },

  closeAllDropdowns() {
    document.querySelectorAll('.aero-dropdown-popover.is-open').forEach(el => el.classList.remove('is-open'));
    document.querySelectorAll('.aqua-course-card.has-open-dropdown').forEach(el => el.classList.remove('has-open-dropdown'));
    this.activeDropdownCode = null;
  },

  toggleStatusMenu(code) {
    const isCurrentOpen = this.activeDropdownCode === code;
    this.closeAllDropdowns();

    if (!isCurrentOpen) {
      const popover = document.getElementById(`popover-${code}`);
      const card = document.getElementById(`course-card-${code}`);
      if (popover) {
        popover.classList.add('is-open');
        this.activeDropdownCode = code;
      }
      if (card) {
        card.classList.add('has-open-dropdown');
      }
    }
  },

  selectCourseStatus(code, newStatus) {
    this.closeAllDropdowns();
    this.changeCourseStatus(code, newStatus);
  },

  // ═══════════════════════════════════
  // Search & Filter Listeners
  // ═══════════════════════════════════
  setupSearchAndFilters() {
    const searchInput = document.getElementById('curriculum-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.curriculumSearchQuery = e.target.value.toLowerCase().trim();
        this.renderCurriculum();
      });
    }

    document.querySelectorAll('#curriculum-filters .aqua-filter-btn').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#curriculum-filters .aqua-filter-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.curriculumFilterStatus = chip.getAttribute('data-filter') || 'all';
        this.renderCurriculum();
      });
    });
  },

  // ═══════════════════════════════════
  // Modal & Flexible Exam Time Controls
  // ═══════════════════════════════════
  setupModals() {
    document.getElementById('btn-close-exam-modal')?.addEventListener('click', () => this.closeExamModal());
    document.getElementById('btn-cancel-modal')?.addEventListener('click', () => this.closeExamModal());

    document.getElementById('btn-save-modal')?.addEventListener('click', () => {
      this.saveExamModalChanges();
    });
  },

  onExamFormatChange(format) {
    const isOnline = format === 'online';
    const venueField = document.getElementById('field-modal-venue');
    const roomField = document.getElementById('field-modal-room');
    const seatField = document.getElementById('field-modal-seat');
    const rowField = document.getElementById('field-modal-row');
    const onlineHint = document.getElementById('field-modal-online-hint');

    if (venueField) venueField.style.display = isOnline ? 'none' : 'block';
    if (roomField) roomField.style.display = isOnline ? 'none' : 'block';
    if (seatField) seatField.style.display = isOnline ? 'none' : 'block';
    if (rowField) rowField.style.display = isOnline ? 'none' : 'block';
    if (onlineHint) onlineHint.style.display = isOnline ? 'block' : 'none';
  },

  onExamSessionPresetChange(val) {
    const startInp = document.getElementById('inp-modal-time-start');
    const endInp = document.getElementById('inp-modal-time-end');
    if (!startInp || !endInp) return;

    if (val === 'morning') {
      startInp.value = '09:00';
      endInp.value = '12:00';
    } else if (val === 'afternoon') {
      startInp.value = '13:30';
      endInp.value = '16:30';
    }
    this.updateModalDuration();
  },

  onCustomTimeChange() {
    const presetSelect = document.getElementById('inp-modal-session-preset');
    const startInp = document.getElementById('inp-modal-time-start');
    const endInp = document.getElementById('inp-modal-time-end');
    if (presetSelect && startInp && endInp) {
      if (startInp.value === '09:00' && endInp.value === '12:00') {
        presetSelect.value = 'morning';
      } else if (startInp.value === '13:30' && endInp.value === '16:30') {
        presetSelect.value = 'afternoon';
      } else {
        presetSelect.value = 'custom';
      }
    }
    this.updateModalDuration();
  },

  adjustExamTime(type, deltaMinutes) {
    const startInp = document.getElementById('inp-modal-time-start');
    const endInp = document.getElementById('inp-modal-time-end');
    const presetSelect = document.getElementById('inp-modal-session-preset');
    if (!startInp || !endInp) return;

    const targetInp = type === 'start' ? startInp : endInp;
    let [h, m] = (targetInp.value || '09:00').split(':').map(Number);
    let total = h * 60 + m + deltaMinutes;
    if (total < 0) total = 0;
    if (total >= 24 * 60) total = 24 * 60 - 1;

    const newH = String(Math.floor(total / 60)).padStart(2, '0');
    const newM = String(total % 60).padStart(2, '0');
    targetInp.value = `${newH}:${newM}`;

    if (presetSelect) presetSelect.value = 'custom';
    this.updateModalDuration();
  },

  updateModalDuration() {
    const startInp = document.getElementById('inp-modal-time-start');
    const endInp = document.getElementById('inp-modal-time-end');
    const durationText = document.getElementById('modal-duration-text');
    if (!startInp || !endInp || !durationText) return;

    const [sh, sm] = (startInp.value || '09:00').split(':').map(Number);
    const [eh, em] = (endInp.value || '12:00').split(':').map(Number);

    let diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff <= 0) diff += 24 * 60;

    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    durationText.textContent = `ระยะเวลาสอบ: ${hours} ชั่วโมง${mins > 0 ? ` ${mins} นาที` : ''}`;
  },

  openExamModal(courseCode) {
    if (!this.data) return;
    this.activeEditingCourseCode = courseCode;

    const curCourse = this.data.curriculum?.find(c => c.courseCode === courseCode);
    const examCourse = this.data.courses?.find(c => c.courseCode === courseCode);
    const courseName = curCourse?.courseNameTh || examCourse?.courseNameTh || `ชุดวิชา ${courseCode}`;

    document.getElementById('modal-course-code').textContent = courseCode;
    document.getElementById('modal-course-name').textContent = courseName;

    // Detect STOU exam type
    let defaultType = 'regular';
    if (curCourse?.status === 'will_take_samrit' || examCourse?.examType === 'samrit') {
      defaultType = 'samrit';
    } else if (curCourse?.status === 'will_take_summer' || examCourse?.examType === 'summer') {
      defaultType = 'summer';
    } else if (curCourse?.status === 'will_take_retake' || examCourse?.examType === 'retake') {
      defaultType = 'retake';
    } else if (examCourse?.examType) {
      defaultType = examCourse.examType;
    }

    const format = examCourse?.examFormat || 'onsite';

    const typeSelect = document.getElementById('inp-modal-type');
    if (typeSelect) typeSelect.value = defaultType;

    const formatSelect = document.getElementById('inp-modal-format');
    if (formatSelect) formatSelect.value = format;

    this.onExamFormatChange(format);

    // Prefill date & time
    document.getElementById('inp-modal-date').value = examCourse?.examDate || '';

    // Flexible Start & End Time
    const startTime = examCourse?.startTime || (examCourse?.examSession === 'afternoon' ? '13:30' : '09:00');
    const endTime = examCourse?.endTime || (examCourse?.examSession === 'afternoon' ? '16:30' : '12:00');

    document.getElementById('inp-modal-time-start').value = startTime;
    document.getElementById('inp-modal-time-end').value = endTime;

    const presetSelect = document.getElementById('inp-modal-session-preset');
    if (presetSelect) {
      if (startTime === '09:00' && endTime === '12:00') {
        presetSelect.value = 'morning';
      } else if (startTime === '13:30' && endTime === '16:30') {
        presetSelect.value = 'afternoon';
      } else {
        presetSelect.value = 'custom';
      }
    }
    this.updateModalDuration();

    document.getElementById('inp-modal-venue').value = examCourse?.examVenue || this.data.examCenter?.centerName || '';
    document.getElementById('inp-modal-room').value = examCourse?.examRoom || '';
    document.getElementById('inp-modal-seat').value = examCourse?.seatNumber || '';
    document.getElementById('inp-modal-row').value = examCourse?.examRow || '';

    const modal = document.getElementById('exam-edit-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.classList.add('modal-open');
      const bodyEl = modal.querySelector('.aqua-modal-body');
      if (bodyEl) bodyEl.scrollTop = 0;
    }
  },

  closeExamModal() {
    const modal = document.getElementById('exam-edit-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.activeEditingCourseCode = null;
  },

  saveExamModalChanges() {
    const code = this.activeEditingCourseCode;
    if (!code || !this.data) return;

    const examTypeVal = document.getElementById('inp-modal-type').value;
    const examFormatVal = document.getElementById('inp-modal-format').value;
    const dateVal = document.getElementById('inp-modal-date').value;
    const startTimeVal = document.getElementById('inp-modal-time-start').value || '09:00';
    const endTimeVal = document.getElementById('inp-modal-time-end').value || '12:00';
    const venueVal = document.getElementById('inp-modal-venue').value.trim();
    const roomVal = document.getElementById('inp-modal-room').value.trim();
    const seatVal = document.getElementById('inp-modal-seat').value.trim();
    const rowVal = document.getElementById('inp-modal-row').value.trim();

    // Determine Morning vs. Afternoon Session
    const [startH] = startTimeVal.split(':').map(Number);
    const isMorning = startH < 13;
    const sessionVal = isMorning ? 'morning' : 'afternoon';
    const sessionTh = `${isMorning ? 'สอบช่วงเช้า' : 'สอบช่วงบ่าย'} ${startTimeVal} - ${endTimeVal} น.`;

    // Format Thai Date
    let dateTh = dateVal;
    if (dateVal) {
      try {
        const d = new Date(dateVal + 'T00:00:00');
        const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        dateTh = `${dayNames[d.getDay()]}ที่ ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear() + 543}`;
      } catch (e) {
        dateTh = dateVal;
      }
    }

    const examTypeNames = {
      regular: 'สอบไล่ประจำภาคปกติ',
      samrit: 'โครงการสัมฤทธิบัตร',
      summer: 'ภาคพิเศษ / ภาคฤดูร้อน',
      retake: 'การสอบซ่อม (Make-up)'
    };

    if (!this.data.courses) this.data.courses = [];
    let examCourse = this.data.courses.find(c => c.courseCode === code);

    // Sync curriculum status with chosen exam type
    const curCourse = this.data.curriculum?.find(c => c.courseCode === code);
    if (curCourse) {
      if (examTypeVal === 'samrit') curCourse.status = 'will_take_samrit';
      else if (examTypeVal === 'summer') curCourse.status = 'will_take_summer';
      else if (examTypeVal === 'retake') curCourse.status = 'will_take_retake';
      else curCourse.status = 'will_take';
    }

    const venue = examFormatVal === 'online' ? 'สอบออนไลน์ มสธ.' : (venueVal || this.data.examCenter?.centerName || '');

    const coursePayload = {
      courseCode: code,
      courseNameTh: curCourse?.courseNameTh || `ชุดวิชา ${code}`,
      credits: 6,
      examType: examTypeVal,
      examTypeName: examTypeNames[examTypeVal] || 'สอบไล่ประจำภาคปกติ',
      examFormat: examFormatVal,
      examFormatName: examFormatVal === 'online' ? 'สอบออนไลน์' : 'สนามสอบ',
      examDate: dateVal,
      examDateTh: dateTh,
      startTime: startTimeVal,
      endTime: endTimeVal,
      examSession: sessionVal,
      examTimeTh: sessionTh,
      examVenue: venue,
      examRoom: examFormatVal === 'online' ? '' : roomVal,
      seatNumber: examFormatVal === 'online' ? '' : seatVal,
      examRow: examFormatVal === 'online' ? '' : rowVal
    };

    if (examCourse) {
      Object.assign(examCourse, coursePayload);
    } else {
      this.data.courses.push(coursePayload);
    }

    this.saveDataAndRefresh();
    this.closeExamModal();
    this.showToast(`บันทึกข้อมูลการสอบวิชา ${code} (${examTypeNames[examTypeVal]}) สำเร็จ`);
  },

  // ═══════════════════════════════════
  // Data Loading & Storage
  // ═══════════════════════════════════
  loadInitialData() {
    const saved = localStorage.getItem('stou_aero_glass_v6') || localStorage.getItem('stou_liquid_glass_v5');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        if (this.data.courses) {
          this.data.courses.forEach(c => {
            if (!c.startTime) c.startTime = c.examSession === 'afternoon' ? '13:30' : '09:00';
            if (!c.endTime) c.endTime = c.examSession === 'afternoon' ? '16:30' : '12:00';
          });
        }
        this.refreshAllViews();
        return;
      } catch (e) {
        console.error('Error loading stored data:', e);
      }
    }

    // Default Fallback Data (Instant 0ms, Zero Network Dependency, 100% Reliable on GitHub Pages & file://)
    this.data = this.getDefaultData();
    this.saveDataAndRefresh();

    // Background sync with sample-stou-data.json if available
    fetch('./data/sample-stou-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then(json => {
        if (!localStorage.getItem('stou_aero_glass_v6_custom')) {
          this.data = json;
          if (this.data.courses) {
            this.data.courses.forEach(c => {
              if (!c.startTime) c.startTime = c.examSession === 'afternoon' ? '13:30' : '09:00';
              if (!c.endTime) c.endTime = c.examSession === 'afternoon' ? '16:30' : '12:00';
            });
          }
          this.saveDataAndRefresh();
        }
      })
      .catch(() => {
        // Embedded default data is already active
      });
  },

  getDefaultData() {
    return {
      student: {
        studentId: "6630018899",
        name: "นายสมชาย ใจดีมุ่งมั่น",
        degree: "ปริญญาตรี",
        faculty: "สาขาวิชาวิทยาศาสตร์และเทคโนโลยี",
        major: "วิทยาการคอมพิวเตอร์และสารสนเทศ",
        center: "ศูนย์วิทยพัฒนา มสธ. นนทบุรี",
        semester: "1",
        academicYear: "2567"
      },
      examCenter: {
        centerName: "โรงเรียนเบญจมราชูทิศ",
        province: "นนทบุรี",
        locationAddress: "ถนนประชาราษฎร์ ตำบลสวนใหญ่ อำเภอเมือง จังหวัดนนทบุรี",
        googleMapsQuery: "โรงเรียนเบญจมราชูทิศ นนทบุรี"
      },
      courses: [
        {
          courseCode: "10151",
          courseNameTh: "ไทยศึกษา",
          credits: 6,
          examType: "regular",
          examTypeName: "สอบไล่ประจำภาคปกติ",
          examFormat: "onsite",
          examFormatName: "สนามสอบ",
          examDate: "2026-11-21",
          examDateTh: "วันเสาร์ที่ 21 พฤศจิกายน 2569",
          examSession: "morning",
          startTime: "09:00",
          endTime: "12:00",
          examTimeTh: "คาบเช้า 09:00 - 12:00 น.",
          examRoom: "อาคาร 3 ห้อง 324",
          seatNumber: "042",
          examRow: "4",
          examVenue: "โรงเรียนเบญจมราชูทิศ"
        },
        {
          courseCode: "96414",
          courseNameTh: "การโปรแกรมคอมพิวเตอร์",
          credits: 6,
          examType: "samrit",
          examTypeName: "โครงการสัมฤทธิบัตร",
          examFormat: "online",
          examFormatName: "สอบออนไลน์",
          examDate: "2026-11-21",
          examDateTh: "วันเสาร์ที่ 21 พฤศจิกายน 2569",
          examSession: "afternoon",
          startTime: "13:30",
          endTime: "16:30",
          examTimeTh: "คาบบ่าย 13:30 - 16:30 น.",
          examRoom: "",
          seatNumber: "",
          examRow: "",
          examVenue: "สอบออนไลน์ มสธ."
        },
        {
          courseCode: "96408",
          courseNameTh: "การจัดการระบบฐานข้อมูล",
          credits: 6,
          examType: "retake",
          examTypeName: "การสอบซ่อม (Make-up)",
          examFormat: "onsite",
          examFormatName: "สนามสอบ",
          examDate: "2026-11-22",
          examDateTh: "วันอาทิตย์ที่ 22 พฤศจิกายน 2569",
          examSession: "morning",
          startTime: "09:00",
          endTime: "12:00",
          examTimeTh: "คาบเช้า 09:00 - 12:00 น.",
          examRoom: "อาคาร 2 ห้อง 201",
          seatNumber: "018",
          examRow: "2",
          examVenue: "โรงเรียนเบญจมราชูทิศ"
        }
      ],
      curriculum: [
        { courseCode: "10103", courseNameTh: "ทักษะชีวิต", credits: 6, category: "หมวดวิชาศึกษาทั่วไป กลุ่มวิชาบังคับ (5 ชุดวิชา)", status: "passed" },
        { courseCode: "10111", courseNameTh: "ภาษาอังกฤษเพื่อการสื่อสาร", credits: 6, category: "หมวดวิชาศึกษาทั่วไป กลุ่มวิชาบังคับ (5 ชุดวิชา)", status: "passed" },
        { courseCode: "10131", courseNameTh: "สังคมมนุษย์", credits: 6, category: "หมวดวิชาศึกษาทั่วไป กลุ่มวิชาบังคับ (5 ชุดวิชา)", status: "transferred" },
        { courseCode: "10141", courseNameTh: "วิทยาศาสตร์ เทคโนโลยีและสิ่งแวดล้อมเพื่อชีวิต", credits: 6, category: "หมวดวิชาศึกษาทั่วไป กลุ่มวิชาบังคับ (5 ชุดวิชา)", status: "not_taken" },
        { courseCode: "10151", courseNameTh: "ไทยศึกษา", credits: 6, category: "หมวดวิชาศึกษาทั่วไป กลุ่มวิชาบังคับ (5 ชุดวิชา)", status: "will_take" },
        { courseCode: "96304", courseNameTh: "การสื่อสารข้อมูลและระบบเครือข่ายคอมพิวเตอร์", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "failed" },
        { courseCode: "96407", courseNameTh: "การพัฒนาระบบสารสนเทศ", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "96408", courseNameTh: "การจัดการระบบฐานข้อมูล", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "will_take_retake" },
        { courseCode: "96414", courseNameTh: "การโปรแกรมคอมพิวเตอร์", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "will_take_samrit" },
        { courseCode: "99202", courseNameTh: "การวิเคราะห์ข้อมูล", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99313", courseNameTh: "การสื่อสารไร้สายและเครือข่าย", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99315", courseNameTh: "สถาปัตยกรรมคอมพิวเตอร์และระบบปฏิบัติการ", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99409", courseNameTh: "ประสบการณ์วิชาชีพเทคโนโลยีสารสนเทศและการสื่อสาร", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99410", courseNameTh: "การจัดการและการออกแบบระบบโทรคมนาคม", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99412", courseNameTh: "หลักการและการบริหารเครือข่าย", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99419", courseNameTh: "ความมั่นคงปลอดภัยไซเบอร์", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)", status: "not_taken" },
        { courseCode: "96102", courseNameTh: "คณิตศาสตร์และสถิติสำหรับวิทยาศาสตร์และเทคโนโลยี", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (2 ชุดวิชา)", status: "passed" },
        { courseCode: "99203", courseNameTh: "คณิตศาสตร์สำหรับวิทยาการคอมพิวเตอร์", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "96411", courseNameTh: "ระบบสารสนเทศและการจัดการความรู้", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "96412", courseNameTh: "การบริหารโครงการด้านเทคโนโลยีสารสนเทศ", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99201", courseNameTh: "วิทยาศาสตร์สำหรับเทคโนโลยีสารสนเทศและการสื่อสาร", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99301", courseNameTh: "เทคโนโลยีการบริการผ่านเว็บและการประยุกต์", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99314", courseNameTh: "โครงสร้างข้อมูลและขั้นตอนวิธี", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99321", courseNameTh: "การประยุกต์เทคโนโลยีสารสนเทศและการสื่อสารสำหรับผู้สูงอายุ", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99402", courseNameTh: "การจัดการความมั่นคงปลอดภัยในระบบคอมพิวเตอร์", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99414", courseNameTh: "เทคโนโลยีมัลติมีเดีย", credits: 6, category: "หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)", status: "not_taken" },
        { courseCode: "99999", courseNameTh: "หมวดวิชาเลือกเสรี (เลือกชุดวิชาใดก็ได้ของ มสธ.)", credits: 6, category: "หมวดวิชาเลือกเสรี (1 ชุดวิชา)", status: "not_taken" }
      ],
      studyPlan: [
        {
          courseCode: "10151",
          courseNameTh: "ไทยศึกษา",
          bookTitle: "เอกสารการสอนชุดวิชาไทยศึกษา (15 หน่วย)",
          totalUnits: 15,
          units: [
            { unit: 1, title: "ความรู้ทั่วไปเกี่ยวกับไทยศึกษา", completed: true },
            { unit: 2, title: "สิ่งแวดล้อมทางกายภาพกับวิถีชีวิตไทย", completed: true },
            { unit: 3, title: "ระบบสังคมและสถาบันทางสังคมไทย", completed: true },
            { unit: 4, title: "ระบบเศรษฐกิจไทย", completed: true },
            { unit: 5, title: "การเมืองการปกครองไทย", completed: true },
            { unit: 6, title: "กฎหมายและกระบวนการยุติธรรมไทย", completed: false },
            { unit: 7, title: "ศาสนาและความเชื่อในสังคมไทย", completed: false },
            { unit: 8, title: "ภาษาและวรรณกรรมไทย", completed: false },
            { unit: 9, title: "ศิลปวัฒนธรรมและประเพณีไทย", completed: false },
            { unit: 10, title: "วิทยาศาสตร์ เทคโนโลยี และภูมิปัญญาไทย", completed: false },
            { unit: 11, title: "การเปลี่ยนแปลงทางสังคมและวัฒนธรรมไทย", completed: false },
            { unit: 12, title: "ปัญหาและแนวทางการพัฒนาสังคมไทย", completed: false },
            { unit: 13, title: "ไทยกับประชาคมระหว่างประเทศ", completed: false },
            { unit: 14, title: "สื่อสารมวลชนกับการพัฒนาสังคมไทย", completed: false },
            { unit: 15, title: "แนวโน้มและอนาคตของสังคมไทย", completed: false }
          ]
        }
      ]
    };
  },

  saveDataAndRefresh() {
    if (!this.data) return;
    localStorage.setItem('stou_aero_glass_v6', JSON.stringify(this.data));
    this.refreshAllViews();
  },

  refreshAllViews() {
    this.renderCountdownWidget();
    this.renderExamCards();
    this.renderCurriculum();
    this.renderReadingTracker();
  },

  // ═══════════════════════════════════
  // Countdown Timer System
  // ═══════════════════════════════════
  startCountdownTimer() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.updateCountdownTick();
    }, 1000);
  },

  findNearestUpcomingExam() {
    const courses = this.data?.courses || [];
    const datedCourses = courses.filter(c => c.examDate).sort((a, b) => {
      const timeA = (a.examDate || '') + ' ' + (a.startTime || '09:00');
      const timeB = (b.examDate || '') + ' ' + (b.startTime || '09:00');
      return timeA.localeCompare(timeB);
    });

    if (datedCourses.length === 0) return null;

    const now = new Date();
    for (const c of datedCourses) {
      const sTime = c.startTime || (c.examSession === 'afternoon' ? '13:30' : '09:00');
      const dt = new Date(`${c.examDate}T${sTime}:00`);
      // Within 4 hours after start time counts as active
      if (dt.getTime() - now.getTime() > -1000 * 60 * 60 * 4) {
        return c;
      }
    }

    return datedCourses[0];
  },

  renderCountdownWidget() {
    const container = document.getElementById('upcoming-exam-countdown');
    if (!container) return;

    const nextExam = this.findNearestUpcomingExam();

    if (!nextExam) {
      container.innerHTML = `
        <div class="aero-countdown-card empty-state">
          <div class="countdown-badge-row">
            <div class="countdown-status-indicator">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>กำหนดการสอบที่ใกล้ถึง</span>
            </div>
          </div>
          <p class="countdown-empty-text">ยังไม่มีวิชาที่กำหนดวันสอบ — แตะเลือกรายวิชาในหน้าหลักสูตรเพื่อกำหนดวันเวลา</p>
        </div>`;
      return;
    }

    const sTime = nextExam.startTime || (nextExam.examSession === 'afternoon' ? '13:30' : '09:00');
    const eTime = nextExam.endTime || (nextExam.examSession === 'afternoon' ? '16:30' : '12:00');
    const [sh] = sTime.split(':').map(Number);
    const isMorning = sh < 13;

    const sessionBadge = isMorning
      ? `<span class="session-badge session-badge-morning">
          ${this.getMorningSunSvg()}
          <span>สอบช่วงเช้า (${sTime} - ${eTime} น.)</span>
        </span>`
      : `<span class="session-badge session-badge-afternoon">
          ${this.getAfternoonSunSvg()}
          <span>สอบช่วงบ่าย (${sTime} - ${eTime} น.)</span>
        </span>`;

    container.innerHTML = `
      <div class="aero-countdown-card" onclick="App.openExamModal('${nextExam.courseCode}')" title="แตะเพื่อแก้ไขวันเวลาสอบ">
        <div class="countdown-card-inner">
          <div class="countdown-top-bar">
            <div class="countdown-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>วิชาสอบถัดไปที่ใกล้จะถึง</span>
            </div>
            <div class="countdown-meta-row">
              <span class="countdown-code">${nextExam.courseCode}</span>
              <span class="countdown-title">${nextExam.courseNameTh}</span>
            </div>
          </div>

          <div class="countdown-middle-row">
            <div class="countdown-date-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
              <span>${nextExam.examDateTh || nextExam.examDate}</span>
            </div>
            ${sessionBadge}
          </div>

          <!-- Dynamic Countdown Digit Tickers -->
          <div class="countdown-grid" id="countdown-ticker-box">
            <div class="digit-cell">
              <span class="digit-value" id="cd-days">00</span>
              <span class="digit-unit">วัน</span>
            </div>
            <div class="digit-colon">:</div>
            <div class="digit-cell">
              <span class="digit-value" id="cd-hours">00</span>
              <span class="digit-unit">ชั่วโมง</span>
            </div>
            <div class="digit-colon">:</div>
            <div class="digit-cell">
              <span class="digit-value" id="cd-mins">00</span>
              <span class="digit-unit">นาที</span>
            </div>
            <div class="digit-colon">:</div>
            <div class="digit-cell digit-cell-sec">
              <span class="digit-value" id="cd-secs">00</span>
              <span class="digit-unit">วินาที</span>
            </div>
          </div>
        </div>
      </div>`;

    this.updateCountdownTick();
  },

  updateCountdownTick() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const nextExam = this.findNearestUpcomingExam();
    if (!nextExam || !nextExam.examDate) return;

    const sTime = nextExam.startTime || (nextExam.examSession === 'afternoon' ? '13:30' : '09:00');
    const targetDate = new Date(`${nextExam.examDate}T${sTime}:00`);
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      if (diff > -1000 * 60 * 60 * 4) {
        // Exam ongoing
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }
      diff = 0;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  },

  // ═══════════════════════════════════
  // TAB 1: Render Exam Cards (Pure SVG Icons, Morning/Afternoon Badges)
  // ═══════════════════════════════════
  renderExamCards() {
    const container = document.getElementById('exam-list-container');
    const countBadge = document.getElementById('exam-count-badge');
    if (!container) return;

    const courses = this.data?.courses || [];

    if (countBadge) {
      countBadge.textContent = `${courses.length} วิชา`;
    }

    if (courses.length === 0) {
      container.innerHTML = `
        <div class="aqua-empty-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <div class="empty-title">ยังไม่มีวิชาที่กำหนดจะสอบ</div>
          <p class="empty-desc">ไปที่หน้า "โครงสร้างหลักสูตร" แล้วเลือกสถานะการลงทะเบียนสอบตามต้องการ (ภาคปกติ, สัมฤทธิบัตร, ซัมเมอร์, หรือสอบซ่อม)</p>
          <button type="button" class="aqua-btn-gel" onclick="App.switchTab('pane-curriculum')">
            <span>ไปที่หน้าโครงสร้างหลักสูตร</span>
          </button>
        </div>`;
      return;
    }

    // Sort by exam date and start time
    const sorted = [...courses].sort((a, b) => {
      const dateA = (a.examDate || '9999-99-99') + (a.startTime || '09:00');
      const dateB = (b.examDate || '9999-99-99') + (b.startTime || '09:00');
      return dateA.localeCompare(dateB);
    });

    let html = '';
    sorted.forEach((c) => {
      const startTime = c.startTime || (c.examSession === 'afternoon' ? '13:30' : '09:00');
      const endTime = c.endTime || (c.examSession === 'afternoon' ? '16:30' : '12:00');
      const [sh] = startTime.split(':').map(Number);
      const isMorning = sh < 13;
      const sessionLabel = isMorning ? 'สอบช่วงเช้า' : 'สอบช่วงบ่าย';
      const sessionTimeRange = `${startTime} - ${endTime} น.`;
      const isExpanded = this.expandedExamCards.has(c.courseCode);
      const isOnline = c.examFormat === 'online';

      // Detect STOU Exam Type
      const curCourse = this.data.curriculum?.find(x => x.courseCode === c.courseCode);
      let examType = c.examType;
      if (!examType) {
        if (curCourse?.status === 'will_take_samrit') examType = 'samrit';
        else if (curCourse?.status === 'will_take_summer') examType = 'summer';
        else if (curCourse?.status === 'will_take_retake') examType = 'retake';
        else examType = 'regular';
      }

      let typeBadgeClass = 'badge-type-regular';
      let typeLabel = 'สอบไล่ภาคปกติ';
      if (examType === 'samrit') {
        typeBadgeClass = 'badge-type-samrit';
        typeLabel = 'โครงการสัมฤทธิบัตร';
      } else if (examType === 'summer') {
        typeBadgeClass = 'badge-type-summer';
        typeLabel = 'ภาคพิเศษ / ฤดูร้อน';
      } else if (examType === 'retake') {
        typeBadgeClass = 'badge-type-retake';
        typeLabel = 'การสอบซ่อม';
      }

      const venue = isOnline ? 'สอบออนไลน์ มสธ. (Online Portal)' : (c.examVenue || this.data.examCenter?.centerName || '');

      const sessionPillHtml = isMorning
        ? `<span class="session-badge session-badge-morning">
            ${this.getMorningSunSvg()}
            <span>${sessionLabel} (${sessionTimeRange})</span>
          </span>`
        : `<span class="session-badge session-badge-afternoon">
            ${this.getAfternoonSunSvg()}
            <span>${sessionLabel} (${sessionTimeRange})</span>
          </span>`;

      html += `
        <div class="aqua-exam-card ${isExpanded ? 'is-expanded' : ''} exam-card-${examType}" onclick="App.toggleExamExpand('${c.courseCode}')">
          <!-- Compact Card Header (Clean & Minimalist: Code + Name + Expand Chevron) -->
          <div class="exam-card-head">
            <span class="exam-code-pill-gel pill-code-${examType}">${c.courseCode}</span>
            <div class="exam-head-info">
              <h3 class="exam-course-name">${c.courseNameTh}</h3>
            </div>
            <div class="exam-expand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <!-- Accordion Details (Revealed on Click: Full Date, Session, Venue, and Tags) -->
          <div class="exam-accordion-details">
            <div class="exam-tag-row details-tag-row">
              <span class="exam-type-pill ${typeBadgeClass}">${typeLabel}</span>
              <span class="exam-format-pill ${isOnline ? 'format-online' : 'format-onsite'}">
                ${isOnline ? this.getOnlineFormatSvg() : this.getOnsiteFormatSvg()}
                <span>${isOnline ? 'สอบออนไลน์' : 'สนามสอบ'}</span>
              </span>
              ${sessionPillHtml}
            </div>

            <div class="details-aqua-grid">
              <div class="details-row-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>วันสอบ: <strong>${c.examDateTh || c.examDate || 'ยังไม่กำหนดวัน'}</strong></span>
              </div>
              <div class="details-row-item">
                ${isMorning ? this.getMorningSunSvg() : this.getAfternoonSunSvg()}
                <span>ช่วงเวลาสอบ: <strong>${sessionLabel} (${sessionTimeRange})</strong></span>
              </div>
              <div class="details-row-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>สถานที่สอบ: <strong>${venue}</strong></span>
              </div>
              ${!isOnline ? `
                <div class="details-row-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                  <span>ห้องสอบ: ${c.examRoom ? `<strong>${c.examRoom}</strong>` : `<span class="pill-waiting">รอประกาศห้อง</span>`}</span>
                </div>
                <div class="details-row-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>ที่นั่งสอบ: ${c.seatNumber ? `<strong>${c.seatNumber}${c.examRow ? ` (แถว ${c.examRow})` : ''}</strong>` : `<span class="pill-waiting">รอประกาศที่นั่ง</span>`}</span>
                </div>
              ` : `
                <div class="details-row-item full-width-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <span class="online-exam-desc">สอบออนไลน์ผ่านระบบ มสธ. (Online Portal) จากที่พักอาศัย ตามวันเวลาที่กำหนด</span>
                </div>
              `}
            </div>

            </div>
          </div>
        </div>`;
    });

    container.innerHTML = html;
  },

  toggleExamExpand(courseCode) {
    if (this.expandedExamCards.has(courseCode)) {
      this.expandedExamCards.delete(courseCode);
    } else {
      this.expandedExamCards.add(courseCode);
    }
    this.renderExamCards();
  },

  // ═══════════════════════════════════
  // TAB 2: Render Curriculum (Pure SVG Dropdowns, No Text Shadows)
  // ═══════════════════════════════════
  renderCurriculum() {
    const container = document.getElementById('curriculum-container');
    if (!container || !this.data?.curriculum) return;

    const curriculum = this.data.curriculum;

    // Filter status counts
    const scheduledCourses = curriculum.filter(c => ['will_take', 'will_take_samrit', 'will_take_summer', 'will_take_retake'].includes(c.status));
    const willTakeCourses = curriculum.filter(c => c.status === 'will_take');
    const samritCourses = curriculum.filter(c => c.status === 'will_take_samrit');
    const summerCourses = curriculum.filter(c => c.status === 'will_take_summer');
    const retakeCourses = curriculum.filter(c => c.status === 'will_take_retake');
    const failedCourses = curriculum.filter(c => c.status === 'failed');
    const passedCourses = curriculum.filter(c => c.status === 'passed');
    const transferredCourses = curriculum.filter(c => c.status === 'transferred');
    const notTakenCourses = curriculum.filter(c => c.status === 'not_taken' || !c.status);

    // Calculate Earned Credits (Passed + Transferred)
    const earnedCourses = curriculum.filter(c => c.status === 'passed' || c.status === 'transferred');
    const totalPassedCredits = earnedCourses.reduce((sum, c) => sum + (c.credits || 6), 0);
    const progressPercent = Math.min(100, Math.round((totalPassedCredits / 126) * 100));

    // Update Filter Counter Badges
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('count-scheduled', scheduledCourses.length);
    setEl('count-will-take', willTakeCourses.length);
    setEl('count-samrit', samritCourses.length);
    setEl('count-summer', summerCourses.length);
    setEl('count-retake', retakeCourses.length);
    setEl('count-failed', failedCourses.length);
    setEl('count-passed', passedCourses.length);
    setEl('count-transferred', transferredCourses.length);
    setEl('count-not-taken', notTakenCourses.length);

    // Update Total Earned Credits & Progress Bar
    setEl('stat-total-passed-credits', totalPassedCredits);
    const progressFill = document.getElementById('curriculum-progress-fill');
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    // Category Stats (Full word 'หน่วยกิต')
    const genPassed = earnedCourses.filter(c => c.category?.includes('หมวดวิชาศึกษาทั่วไป')).length;
    setEl('cat-stat-gen', `${genPassed * 6} / 30 หน่วยกิต`);

    const corePassed = earnedCourses.filter(c => c.category?.includes('กลุ่มวิชาบังคับ') && c.category?.includes('หมวดวิชาเฉพาะ')).length;
    setEl('cat-stat-core', `${corePassed * 6} / 78 หน่วยกิต`);

    const majorElecPassed = earnedCourses.filter(c => c.category?.includes('กลุ่มวิชาเลือก')).length;
    setEl('cat-stat-major-elec', `${majorElecPassed * 6} / 12 หน่วยกิต`);

    const freePassed = earnedCourses.filter(c => c.category?.includes('หมวดวิชาเลือกเสรี')).length;
    setEl('cat-stat-free', `${freePassed * 6} / 6 หน่วยกิต`);

    // Filter courses
    let filtered = curriculum;
    if (this.curriculumFilterStatus && this.curriculumFilterStatus !== 'all') {
      if (this.curriculumFilterStatus === 'scheduled') {
        filtered = filtered.filter(c => ['will_take', 'will_take_samrit', 'will_take_summer', 'will_take_retake'].includes(c.status));
      } else {
        filtered = filtered.filter(c => (c.status || 'not_taken') === this.curriculumFilterStatus);
      }
    }
    if (this.curriculumSearchQuery) {
      const q = this.curriculumSearchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        (c.courseCode && String(c.courseCode).toLowerCase().includes(q)) ||
        (c.courseNameTh && c.courseNameTh.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="aqua-empty-card" style="padding:28px 16px;">
          <div class="empty-title">ไม่พบวิชาที่ค้นหา</div>
          <p class="empty-desc">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองเป็น "ทั้งหมด"</p>
        </div>`;
      return;
    }

    // Grouping according to official STOU curriculum
    const categoryOrder = [
      'หมวดวิชาศึกษาทั่วไป กลุ่มวิชาบังคับ (5 ชุดวิชา)',
      'หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (11 ชุดวิชา)',
      'หมวดวิชาเฉพาะ กลุ่มวิชาบังคับ (2 ชุดวิชา)',
      'หมวดวิชาเฉพาะ กลุ่มวิชาเลือก (เลือก 2 ชุดวิชา)',
      'หมวดวิชาเลือกเสรี (1 ชุดวิชา)'
    ];

    const groups = {};
    filtered.forEach(c => {
      const cat = c.category || 'หมวดวิชาทั่วไป';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(c);
    });

    let html = '';
    const allCategories = Object.keys(groups).sort((a, b) => {
      const idxA = categoryOrder.findIndex(cat => a.includes(cat) || cat.includes(a));
      const idxB = categoryOrder.findIndex(cat => b.includes(cat) || cat.includes(b));
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    const statusOptionsList = [
      { key: 'not_taken', label: 'ยังไม่ลงทะเบียน' },
      { key: 'will_take', label: 'ลงทะเบียนสอบไล่ (ภาคปกติ)' },
      { key: 'will_take_samrit', label: 'ลงทะเบียนโครงการสัมฤทธิบัตร' },
      { key: 'will_take_summer', label: 'ลงทะเบียนภาคพิเศษ / ฤดูร้อน' },
      { key: 'will_take_retake', label: 'ลงทะเบียนสอบซ่อม (Make-up)' },
      { key: 'failed', label: 'สอบไม่ผ่าน (รอสอบซ่อม / ลงใหม่)' },
      { key: 'passed', label: 'สอบผ่านแล้ว (ได้ S / H)' },
      { key: 'transferred', label: 'เทียบโอนชุดวิชา' }
    ];

    allCategories.forEach((category) => {
      const courses = groups[category];
      html += `
        <div class="aqua-cat-group">
          <div class="aqua-group-head">
            <span class="group-title-text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>${category}</span>
            </span>
            <span class="group-count-tag">${courses.length} ชุดวิชา</span>
          </div>

          <div class="aqua-courses-column">`;

      courses.forEach(c => {
        const curStatus = c.status || 'not_taken';
        const isScheduled = ['will_take', 'will_take_samrit', 'will_take_summer', 'will_take_retake'].includes(curStatus);
        const examInfo = this.data.courses?.find(x => x.courseCode === c.courseCode);

        let cardClass = 'card-not-taken';
        let codePillClass = 'pill-code-nottaken';
        let statusLabelText = this.getStatusLabel(curStatus);
        let statusTagClass = 'status-tag-nottaken';

        if (curStatus === 'passed') {
          cardClass = 'card-passed';
          codePillClass = 'pill-code-passed';
          statusTagClass = 'status-tag-passed';
        } else if (curStatus === 'transferred') {
          cardClass = 'card-transferred';
          codePillClass = 'pill-code-transferred';
          statusTagClass = 'status-tag-transferred';
        } else if (curStatus === 'failed') {
          cardClass = 'card-failed';
          codePillClass = 'pill-code-failed';
          statusTagClass = 'status-tag-failed';
        } else if (curStatus === 'will_take') {
          cardClass = 'card-will-take';
          codePillClass = 'pill-code-regular';
          statusTagClass = 'status-tag-regular';
        } else if (curStatus === 'will_take_samrit') {
          cardClass = 'card-samrit';
          codePillClass = 'pill-code-samrit';
          statusTagClass = 'status-tag-samrit';
        } else if (curStatus === 'will_take_summer') {
          cardClass = 'card-summer';
          codePillClass = 'pill-code-summer';
          statusTagClass = 'status-tag-summer';
        } else if (curStatus === 'will_take_retake') {
          cardClass = 'card-retake';
          codePillClass = 'pill-code-retake';
          statusTagClass = 'status-tag-retake';
        }

        // Render pure SVG options for the dropdown popover
        let popoverItemsHtml = '';
        statusOptionsList.forEach(opt => {
          const isSelected = opt.key === curStatus;
          popoverItemsHtml += `
            <button type="button" class="aero-popover-item opt-${opt.key} ${isSelected ? 'is-selected' : ''}" onclick="event.stopPropagation(); App.selectCourseStatus('${c.courseCode}', '${opt.key}')">
              <span class="opt-svg-wrap">${this.getStatusSvg(opt.key)}</span>
              <span class="opt-text">${opt.label}</span>
              ${isSelected ? `<svg class="opt-check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
            </button>`;
        });

        html += `
          <div class="aqua-course-card ${cardClass}" id="course-card-${c.courseCode}">
            <!-- Top Bar: Code Pill + Credits + Status on left, Dropdown on right -->
            <div class="course-card-top-bar">
              <div class="course-code-credits-wrap">
                <span class="course-code-aqua ${codePillClass}">${c.courseCode}</span>
                <span class="course-credits-badge">${c.credits || 6} หน่วยกิต</span>
                <span class="course-status-pill status-pill-${curStatus}">${statusLabelText}</span>
              </div>

              <!-- Compact Corner Status Dropdown -->
              <div class="course-action-group">
                <div class="aero-dropdown-wrapper" id="dropdown-box-${c.courseCode}">
                  <button type="button" class="aero-dropdown-trigger compact-trigger status-btn-${curStatus}" onclick="event.stopPropagation(); App.toggleStatusMenu('${c.courseCode}')" aria-label="สถานะ: ${statusLabelText}" title="คลิกเพื่อเปลี่ยนสถานะวิชา ${c.courseCode}">
                    <span class="trigger-icon-wrap">${this.getStatusSvg(curStatus)}</span>
                    <span class="trigger-btn-label">เปลี่ยน</span>
                    <svg class="trigger-chevron-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>

                  <div class="aero-dropdown-popover popover-align-right" id="popover-${c.courseCode}">
                    <div class="aero-popover-list">
                      ${popoverItemsHtml}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Full-Width Course Name (No button crowding or truncating the text) -->
            <div class="course-name-full-row">
              <h4 class="course-name-text">${c.courseNameTh}</h4>
            </div>

            <!-- Passed Celebratory Strip -->
            ${curStatus === 'passed' ? `
              <div class="passed-celebrate-strip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>สอบผ่านแล้ว สะสมสำเร็จ ${c.credits || 6} หน่วยกิต</span>
              </div>
            ` : ''}

            <!-- Transferred Strip -->
            ${curStatus === 'transferred' ? `
              <div class="transferred-strip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>เทียบโอนชุดวิชา สะสมสำเร็จ ${c.credits || 6} หน่วยกิต</span>
              </div>
            ` : ''}

            <!-- Failed Strip -->
            ${curStatus === 'failed' ? `
              <div class="failed-alert-strip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>สอบไม่ผ่าน: สามารถเลือกลงทะเบียน "สอบซ่อม" หรือลงทะเบียนเรียนใหม่ในภาคถัดไป</span>
              </div>
            ` : ''}

            <!-- Bottom: Scheduled Exam Strip -->
            ${isScheduled ? `
              <div class="course-exam-strip strip-${curStatus}">
                <div class="exam-strip-info">
                  <div class="exam-strip-head-row">
                    <span class="exam-strip-badge">
                      ${curStatus === 'will_take_samrit' ? 'โครงการสัมฤทธิบัตร' :
                        curStatus === 'will_take_summer' ? 'ภาคพิเศษ / ฤดูร้อน' :
                        curStatus === 'will_take_retake' ? 'การสอบซ่อม' : 'สอบไล่ภาคปกติ'}
                    </span>
                    <span class="exam-format-mini-tag">
                      ${examInfo?.examFormat === 'online' ? this.getOnlineFormatSvg() : this.getOnsiteFormatSvg()}
                      <span>${examInfo?.examFormat === 'online' ? 'สอบออนไลน์' : 'สนามสอบ'}</span>
                    </span>
                  </div>
                  <div class="exam-strip-details-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
                    <span class="exam-strip-date-text">
                      ${examInfo?.examDateTh
                        ? `${examInfo.examDateTh} • ${examInfo.startTime || '09:00'} - ${examInfo.endTime || '12:00'} น.${examInfo.examFormat !== 'online' && examInfo.examRoom ? ` (ห้อง ${examInfo.examRoom})` : ''}`
                        : 'ยังไม่ได้ระบุวันและห้องสอบ'}
                    </span>
                  </div>
                </div>
                <button type="button" class="btn-aqua-config-pill" onclick="App.openExamModal('${c.courseCode}')" title="กำหนดวันสอบและห้องสอบ">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>กำหนดวัน/เวลาสอบ</span>
                </button>
              </div>
            ` : ''}
          </div>`;
      });

      html += `
          </div>
        </div>`;
    });

    container.innerHTML = html;
  },

  changeCourseStatus(courseCode, newStatus) {
    if (!this.data?.curriculum) return;

    const course = this.data.curriculum.find(c => c.courseCode === courseCode);
    if (!course) return;

    course.status = newStatus;
    if (!this.data.courses) this.data.courses = [];

    const isScheduled = ['will_take', 'will_take_samrit', 'will_take_summer', 'will_take_retake'].includes(newStatus);

    if (isScheduled) {
      let examCourse = this.data.courses.find(c => c.courseCode === courseCode);

      let examType = 'regular';
      let examTypeName = 'สอบไล่ประจำภาคปกติ';
      if (newStatus === 'will_take_samrit') {
        examType = 'samrit';
        examTypeName = 'โครงการสัมฤทธิบัตร';
      } else if (newStatus === 'will_take_summer') {
        examType = 'summer';
        examTypeName = 'ภาคพิเศษ / ภาคฤดูร้อน';
      } else if (newStatus === 'will_take_retake') {
        examType = 'retake';
        examTypeName = 'การสอบซ่อม (Make-up)';
      }

      if (!examCourse) {
        this.data.courses.push({
          courseCode: course.courseCode,
          courseNameTh: course.courseNameTh,
          credits: course.credits || 6,
          examType: examType,
          examTypeName: examTypeName,
          examFormat: 'onsite',
          examFormatName: 'สนามสอบ',
          examDate: '',
          examDateTh: '',
          startTime: '09:00',
          endTime: '12:00',
          examSession: 'morning',
          examTimeTh: 'สอบช่วงเช้า 09:00 - 12:00 น.',
          examVenue: this.data.examCenter?.centerName || '',
          examRoom: '',
          seatNumber: '',
          examRow: ''
        });
      } else {
        examCourse.examType = examType;
        examCourse.examTypeName = examTypeName;
      }

      this.saveDataAndRefresh();
      this.showToast(`เพิ่มวิชา ${courseCode} (${examTypeName}) ในตารางสอบ`);

      const updated = this.data.courses.find(c => c.courseCode === courseCode);
      if (!updated?.examDate) {
        setTimeout(() => this.openExamModal(courseCode), 200);
      }
    } else {
      this.data.courses = this.data.courses.filter(c => c.courseCode !== courseCode);
      this.saveDataAndRefresh();

      if (newStatus === 'passed') {
        this.showToast(`สะสมสำเร็จ 6 หน่วยกิต! วิชา ${courseCode} ผ่านแล้ว`, 'gold');
      } else if (newStatus === 'transferred') {
        this.showToast(`เทียบโอนวิชา ${courseCode} สำเร็จ (6 หน่วยกิต)`, 'gold');
      } else if (newStatus === 'failed') {
        this.showToast(`บันทึกวิชา ${courseCode} ไม่ผ่าน (สามารถเลือกสอบซ่อมได้)`, 'error');
      } else {
        this.showToast(`ปรับสถานะวิชา ${courseCode} เป็นยังไม่ลงทะเบียน`);
      }
    }
  },

  // ═══════════════════════════════════
  // Multi-Sheet Excel (.xls XML) & CSV Export
  // ═══════════════════════════════════
  setupExcelExport() {
    const btn = document.getElementById('btn-export-excel');
    if (btn) {
      btn.addEventListener('click', () => {
        this.exportExcelMultiSheet();
      });
    }
  },

  // ═══════════════════════════════════
  // JSON Export / Import (AI-friendly)
  // ═══════════════════════════════════
  setupJsonIO() {
    document.getElementById('btn-export-json')?.addEventListener('click', () => this.exportJson());
    const fileInput = document.getElementById('inp-import-json');
    document.getElementById('btn-import-json')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.importJsonFile(file);
      e.target.value = '';
    });
  },

  setupSyncHub() {
    document.getElementById('btn-open-sync-hub')?.addEventListener('click', () => this.openSyncModal());
    document.getElementById('btn-close-sync-modal')?.addEventListener('click', () => this.closeSyncModal());
    document.getElementById('btn-cancel-sync-modal')?.addEventListener('click', () => this.closeSyncModal());

    document.getElementById('btn-sync-export-json')?.addEventListener('click', () => {
      this.exportJson();
    });

    const fileInput = document.getElementById('inp-sync-import-file');
    document.getElementById('btn-sync-trigger-import')?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const mode = document.querySelector('input[name="sync-import-mode"]:checked')?.value || 'merge';
        this.importJsonFile(file, { replaceCurriculum: mode === 'replace' });
        this.closeSyncModal();
      }
      e.target.value = '';
    });

    document.getElementById('btn-sync-reset-curriculum')?.addEventListener('click', () => {
      this.resetCurriculumCourses();
    });
  },

  openSyncModal() {
    const summary = document.getElementById('sync-status-summary');
    if (summary) {
      const curCount = this.data?.curriculum?.length || 0;
      const examCount = this.data?.courses?.length || 0;
      const bookCount = this.data?.studyPlan?.length || 0;
      summary.textContent = `หลักสูตร ${curCount} วิชา • ตารางสอบ ${examCount} วิชา • แผนการอ่าน ${bookCount} เล่ม`;
    }
    const modal = document.getElementById('sync-backup-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.classList.add('modal-open');
    }
  },

  closeSyncModal() {
    const modal = document.getElementById('sync-backup-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  },

  resetCurriculumCourses() {
    if (!this.data) this.data = this.getDefaultData();
    const count = (this.data.curriculum || []).length;
    if (count === 0) {
      this.showToast('ไม่มีรายวิชาในหลักสูตรให้ล้าง');
      return;
    }
    if (!confirm(`ต้องการล้างรายวิชาในหลักสูตรทั้งหมด (${count} วิชา) หรือไม่?\n\nการกระทำนี้จะล้างรายวิชาเดิมทั้งหมด เพื่อให้คุณสามารถเริ่มใหม่หรือนำเข้าโครงสร้างหลักสูตรของสาขาวิชาอื่นได้`)) {
      return;
    }

    this.data.curriculum = [];
    this.data.courses = [];
    localStorage.setItem('stou_aero_glass_v6_custom', '1');
    this.saveDataAndRefresh();
    this.closeSyncModal();
    this.showToast('ล้างรายวิชาในหลักสูตรทั้งหมดเรียบร้อยแล้ว พร้อมสำหรับหลักสูตรสาขาใหม่', 'gold');
  },

  getAiGuide() {
    return {
      purpose: 'ไฟล์ข้อมูลแอป STOU Exam Pass — ส่งไฟล์นี้ให้ AI แล้วบอกว่าต้องการเพิ่ม/แก้ไขอะไร จากนั้นนำไฟล์ที่ AI ส่งกลับมาอัปโหลดเพื่ออัปเดตข้อมูล',
      instructionsForAI: [
        'ตอบกลับเป็น JSON เดียวที่ถูกต้อง โครงสร้างเดียวกับไฟล์นี้ (เก็บ _aiGuide ไว้หรือลบทิ้งก็ได้)',
        'การอัปโหลดปกติจะ "รวมข้อมูล" (merge) ตาม courseCode: มีอยู่แล้วจะอัปเดต ไม่มีจะเพิ่มใหม่',
        'หากต้องการเปลี่ยนสาขาวิชา/ล้างวิชาสาขาเดิม ให้ใส่ "replaceCurriculum": true หรือ "mode": "replace" ใน JSON เพื่อแทนที่โครงสร้างหลักสูตรเดิมทั้งหมดด้วยวิชาในไฟล์นี้',
        'curriculum[] = รายวิชาในโครงสร้างหลักสูตร (courseCode, courseNameTh, credits, category, status)',
        'courses[] = ตารางสอบ ใช้กับวิชาที่ status เป็น will_take / will_take_samrit / will_take_summer / will_take_retake',
        'studyPlan[] = แผนการอ่านหนังสือของแต่ละวิชา (courseCode, courseNameTh, bookTitle, totalUnits, units: [{ unit, title, completed, subUnits: [{ id, title, completed }] }])',
        'subUnits[] = ตอนย่อย/หัวข้อย่อยในแต่ละหน่วย สามารถเพิ่ม/แก้ไขได้ในไฟล์ JSON เช่น id: "1.1", title: "...", completed: true/false',
        'examDate รูปแบบ YYYY-MM-DD (ค.ศ.), startTime/endTime รูปแบบ HH:MM 24 ชม.',
        'examDateTh, examTimeTh, examSession, examTypeName, examFormatName ไม่ต้องใส่ แอปจะคำนวณให้เอง',
        'ถ้า examFormat เป็น online ไม่ต้องใส่ examRoom, seatNumber, examRow'
      ],
      allowedValues: {
        'curriculum[].status': ['not_taken', 'will_take', 'will_take_samrit', 'will_take_summer', 'will_take_retake', 'passed', 'failed', 'transferred'],
        'courses[].examType': ['regular', 'samrit', 'summer', 'retake'],
        'courses[].examFormat': ['onsite', 'online'],
        'studyPlan[].units[].completed': [true, false],
        'studyPlan[].units[].subUnits[].completed': [true, false]
      },
      statusMeaning: {
        not_taken: 'ยังไม่ลงทะเบียน',
        will_take: 'ลงทะเบียนสอบไล่ภาคปกติ',
        will_take_samrit: 'โครงการสัมฤทธิบัตร',
        will_take_summer: 'ภาคฤดูร้อน',
        will_take_retake: 'สอบซ่อม',
        passed: 'สอบผ่านแล้ว',
        failed: 'สอบไม่ผ่าน',
        transferred: 'เทียบโอน'
      },
      examples: {
        curriculumItem: { courseCode: '10151', courseNameTh: 'ไทยศึกษา', credits: 6, category: 'หมวดวิชาศึกษาทั่วไป กลุ่มวิชาบังคับ (5 ชุดวิชา)', status: 'will_take' },
        courseItem: { courseCode: '10151', examType: 'regular', examFormat: 'onsite', examDate: '2026-11-21', startTime: '09:00', endTime: '12:00', examVenue: 'โรงเรียนเบญจมราชูทิศ', examRoom: 'อาคาร 3 ห้อง 324', seatNumber: '042', examRow: '4' },
        studyPlanItem: {
          courseCode: '10151',
          courseNameTh: 'ไทยศึกษา',
          bookTitle: 'เอกสารการสอนชุดวิชาไทยศึกษา (15 หน่วย)',
          totalUnits: 15,
          units: [
            {
              unit: 1,
              title: 'ความรู้ทั่วไปเกี่ยวกับไทยศึกษา',
              completed: true,
              subUnits: [
                { id: '1.1', title: 'ความหมายและขอบข่ายของไทยศึกษา', completed: true },
                { id: '1.2', title: 'แนวคิดและทฤษฎีในการศึกษาไทย', completed: true },
                { id: '1.3', title: 'ระเบียบวิธีและแหล่งข้อมูลไทยศึกษา', completed: true }
              ]
            },
            {
              unit: 2,
              title: 'สิ่งแวดล้อมทางกายภาพกับวิถีชีวิตไทย',
              completed: false,
              subUnits: [
                { id: '2.1', title: 'สภาพแวดล้อมทางภูมิศาสตร์ของไทย', completed: false }
              ]
            }
          ]
        }
      }
    };
  },

  exportJson() {
    if (!this.data) return;
    const out = { _aiGuide: this.getAiGuide(), ...this.data };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STOU_Data_${this.data.student?.studentId || 'backup'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON สำเร็จ', 'gold');
  },

  importJsonFile(file, options = {}) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        this.mergeImportedData(json, options);
      } catch (err) {
        console.error(err);
        this.showToast('ไฟล์ JSON ไม่ถูกต้อง: ' + err.message, 'error');
      }
    };
    reader.onerror = () => this.showToast('อ่านไฟล์ไม่สำเร็จ', 'error');
    reader.readAsText(file);
  },

  normalizeExamCourse(c, existing, curName) {
    const m = Object.assign({}, existing || {}, c);
    const types = { regular: 'สอบไล่ประจำภาคปกติ', samrit: 'โครงการสัมฤทธิบัตร', summer: 'ภาคพิเศษ / ภาคฤดูร้อน', retake: 'การสอบซ่อม (Make-up)' };
    m.courseNameTh = m.courseNameTh || curName || `ชุดวิชา ${m.courseCode}`;
    m.credits = m.credits || 6;
    m.examType = types[m.examType] ? m.examType : 'regular';
    m.examTypeName = types[m.examType];
    m.examFormat = m.examFormat === 'online' ? 'online' : 'onsite';
    m.examFormatName = m.examFormat === 'online' ? 'สอบออนไลน์' : 'สนามสอบ';
    m.startTime = m.startTime || '09:00';
    m.endTime = m.endTime || '12:00';
    const isMorning = Number(m.startTime.split(':')[0]) < 13;
    m.examSession = isMorning ? 'morning' : 'afternoon';
    m.examTimeTh = `${isMorning ? 'สอบช่วงเช้า' : 'สอบช่วงบ่าย'} ${m.startTime} - ${m.endTime} น.`;
    if (m.examDate) {
      const d = new Date(m.examDate + 'T00:00:00');
      if (!isNaN(d)) {
        const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        m.examDateTh = `${dayNames[d.getDay()]}ที่ ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear() + 543}`;
      }
    } else {
      m.examDate = '';
      m.examDateTh = '';
    }
    if (m.examFormat === 'online') {
      m.examVenue = 'สอบออนไลน์ มสธ.';
      m.examRoom = m.seatNumber = m.examRow = '';
    } else {
      m.examVenue = m.examVenue || this.data?.examCenter?.centerName || '';
      m.examRoom = m.examRoom || '';
      m.seatNumber = m.seatNumber || '';
      m.examRow = m.examRow || '';
    }
    return m;
  },

  mergeImportedData(json, options = {}) {
    if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('โครงสร้างข้อมูลไม่ถูกต้อง');
    if (!Array.isArray(json.curriculum) && !Array.isArray(json.courses) && !json.student && !json.examCenter && !Array.isArray(json.studyPlan)) {
      throw new Error('ไม่พบข้อมูล curriculum / courses / studyPlan ในไฟล์ JSON');
    }
    const data = this.data || this.getDefaultData();
    if (json.student) data.student = Object.assign({}, data.student, json.student);
    if (json.examCenter) data.examCenter = Object.assign({}, data.examCenter, json.examCenter);
    if (!Array.isArray(data.curriculum)) data.curriculum = [];
    if (!Array.isArray(data.courses)) data.courses = [];

    const isReplace = options.replaceCurriculum || json.replaceCurriculum === true || json.mode === 'replace';

    const scheduledSet = ['will_take', 'will_take_samrit', 'will_take_summer', 'will_take_retake'];
    const statusToType = { will_take: 'regular', will_take_samrit: 'samrit', will_take_summer: 'summer', will_take_retake: 'retake' };
    const typeToStatus = { regular: 'will_take', samrit: 'will_take_samrit', summer: 'will_take_summer', retake: 'will_take_retake' };
    let added = 0, updated = 0;

    if (isReplace && Array.isArray(json.curriculum)) {
      // Clear all previous courses of old major completely!
      data.curriculum = [];
      const newCodes = new Set(json.curriculum.map(c => String(c.courseCode)));
      data.courses = data.courses.filter(x => newCodes.has(String(x.courseCode)));
    }

    (json.curriculum || []).forEach(item => {
      if (!item || !item.courseCode) return;
      const code = String(item.courseCode);
      const idx = data.curriculum.findIndex(x => x.courseCode === code);
      if (idx >= 0) { Object.assign(data.curriculum[idx], item, { courseCode: code }); updated++; }
      else { data.curriculum.push(Object.assign({ credits: 6, status: 'not_taken' }, item, { courseCode: code })); added++; }
    });

    (json.courses || []).forEach(item => {
      if (!item || !item.courseCode) return;
      const code = String(item.courseCode);
      const cur = data.curriculum.find(x => x.courseCode === code);
      const idx = data.courses.findIndex(x => x.courseCode === code);
      const norm = this.normalizeExamCourse(Object.assign({}, item, { courseCode: code }), idx >= 0 ? data.courses[idx] : null, cur?.courseNameTh);
      if (idx >= 0) { data.courses[idx] = norm; updated++; } else { data.courses.push(norm); added++; }
      if (cur && !scheduledSet.includes(cur.status) && !['passed', 'transferred'].includes(cur.status)) {
        cur.status = typeToStatus[norm.examType];
      }
    });

    // Keep exam schedule consistent with curriculum statuses
    data.curriculum.forEach(c => {
      if (scheduledSet.includes(c.status)) {
        if (!data.courses.some(x => x.courseCode === c.courseCode)) {
          data.courses.push(this.normalizeExamCourse({ courseCode: c.courseCode, examType: statusToType[c.status], examDate: '' }, null, c.courseNameTh));
        }
      } else {
        data.courses = data.courses.filter(x => x.courseCode !== c.courseCode);
      }
    });

    // Merge reading books / study plan
    if (Array.isArray(json.studyPlan)) {
      if (!Array.isArray(data.studyPlan)) data.studyPlan = [];
      json.studyPlan.forEach(plan => {
        if (!plan || !plan.courseCode) return;
        const code = String(plan.courseCode);
        const idx = data.studyPlan.findIndex(x => x.courseCode === code);
        if (idx >= 0) {
          data.studyPlan[idx] = Object.assign({}, data.studyPlan[idx], plan);
          updated++;
        } else {
          data.studyPlan.push(plan);
          added++;
        }
      });
    }

    this.data = data;
    localStorage.setItem('stou_aero_glass_v6_custom', '1');
    this.saveDataAndRefresh();

    if (isReplace) {
      this.showToast(`แทนที่โครงสร้างหลักสูตรสาขาใหม่เรียบร้อยแล้ว (${data.curriculum.length} วิชา)`, 'gold');
    } else {
      this.showToast(`อัปเดตข้อมูลสำเร็จ (เพิ่ม ${added} • แก้ไข ${updated})`, 'gold');
    }
  },

  escapeXml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  exportExcelMultiSheet() {
    if (!this.data) return;

    const student = this.data.student || {};
    const curriculum = this.data.curriculum || [];
    const courses = this.data.courses || [];

    const earnedCourses = curriculum.filter(c => c.status === 'passed' || c.status === 'transferred');
    const totalPassedCredits = earnedCourses.reduce((sum, c) => sum + (c.credits || 6), 0);
    const passedCount = curriculum.filter(c => c.status === 'passed').length;
    const transferredCount = curriculum.filter(c => c.status === 'transferred').length;
    const scheduledCount = curriculum.filter(c => ['will_take', 'will_take_samrit', 'will_take_summer', 'will_take_retake'].includes(c.status)).length;
    const notTakenCount = curriculum.filter(c => c.status === 'not_taken' || !c.status).length;
    const failedCount = curriculum.filter(c => c.status === 'failed').length;

    const remainingCredits = Math.max(0, 126 - totalPassedCredits);
    const progressPercent = Math.min(100, Math.round((totalPassedCredits / 126) * 100));

    // Category breakdown
    const genPassed = earnedCourses.filter(c => c.category?.includes('หมวดวิชาศึกษาทั่วไป')).length * 6;
    const corePassed = earnedCourses.filter(c => c.category?.includes('กลุ่มวิชาบังคับ') && c.category?.includes('หมวดวิชาเฉพาะ')).length * 6;
    const majorElecPassed = earnedCourses.filter(c => c.category?.includes('กลุ่มวิชาเลือก')).length * 6;
    const freePassed = earnedCourses.filter(c => c.category?.includes('หมวดวิชาเลือกเสรี')).length * 6;

    const nowTh = new Date().toLocaleString('th-TH');

    const esc = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = [
      [esc('มหาวิทยาลัยสุโขทัยธรรมาธิราช (STOU)'), esc('รายงานสรุปผลการศึกษาและตารางสอบ 126 หน่วยกิต')],
      [esc(`ข้อมูลออกรายงาน ณ วันที่: ${nowTh}`)],
      [],
      [esc('════════ ข้อมูลนักศึกษาและหลักสูตร ════════')],
      [esc('รหัสนักศึกษา'), esc(student.studentId || '-'), esc('ชื่อ-นามสกุล'), esc(student.name || '-')],
      [esc('ระดับการศึกษา'), esc(student.degree || 'ปริญญาตรี'), esc('สาขาวิชา'), esc(student.faculty || '-')],
      [esc('วิชาเอก'), esc(student.major || '-'), esc('ศูนย์วิทยพัฒนา'), esc(student.center || '-')],
      [esc('ภาคการศึกษา'), esc(student.semester || '1'), esc('ปีการศึกษา'), esc(student.academicYear || '2567')],
      [],
      [esc('════════ สรุปความก้าวหน้าหน่วยกิต (Dashboard KPIs) ════════')],
      [esc('หน่วยกิตสะสมที่ผ่านแล้ว (Earned Credits)'), totalPassedCredits, esc('หน่วยกิตเป้าหมายตามหลักสูตร'), 126],
      [esc('ความสำเร็จของการศึกษา (%)'), `${progressPercent}%`, esc('หน่วยกิตคงเหลือที่ต้องเก็บเพิ่ม'), remainingCredits],
      [esc('ชุดวิชาที่สอบผ่านแล้ว (S / H)'), passedCount, esc('ชุดวิชาเทียบโอนสำเร็จ'), transferredCount],
      [esc('ชุดวิชาที่ลงทะเบียนจะสอบในรอบนี้'), scheduledCount, esc('ชุดวิชาที่ยังไม่ลงทะเบียน'), notTakenCount],
      [esc('ชุดวิชาที่สอบไม่ผ่าน (รอสอบซ่อม/ลงใหม่)'), failedCount, esc('ชุดวิชาทั้งหมดในหลักสูตร'), curriculum.length],
      [],
      [esc('════════ การวิเคราะห์หน่วยกิตแยกตามหมวดวิชา ════════')],
      [esc('หมวดวิชา'), esc('เป้าหมาย (หน่วยกิต)'), esc('สะสมแล้ว (หน่วยกิต)'), esc('คงเหลือ (หน่วยกิต)'), esc('ความคืบหน้า (%)')],
      [esc('1. หมวดวิชาศึกษาทั่วไป (General Education)'), 30, genPassed, Math.max(0, 30 - genPassed), `${Math.round((genPassed / 30) * 100)}%`],
      [esc('2. หมวดวิชาเฉพาะ (กลุ่มวิชาบังคับ)'), 78, corePassed, Math.max(0, 78 - corePassed), `${Math.round((corePassed / 78) * 100)}%`],
      [esc('3. หมวดวิชาเฉพาะ (กลุ่มวิชาเลือก)'), 12, majorElecPassed, Math.max(0, 12 - majorElecPassed), `${Math.round((majorElecPassed / 12) * 100)}%`],
      [esc('4. หมวดวิชาเลือกเสรี (Free Elective)'), 6, freePassed, Math.max(0, 6 - freePassed), `${Math.round((freePassed / 6) * 100)}%`],
      [],
      [esc('════════ ตารางสอบรายวิชาที่ลงทะเบียนไว้ (Active Scheduled Exams) ════════')],
      [esc('ลำดับ'), esc('รหัสวิชา'), esc('ชื่อชุดวิชา'), esc('หน่วยกิต'), esc('ประเภทการสอบ'), esc('รูปแบบ'), esc('วันที่สอบ'), esc('เวลาสอบ'), esc('สถานที่สอบ'), esc('ห้องสอบ'), esc('เลขที่นั่ง')],
    ];

    if (courses.length === 0) {
      rows.push([esc('-'), esc('-'), esc('ยังไม่มีวิชาที่กำหนดจะสอบในรอบนี้'), esc('-'), esc('-'), esc('-'), esc('-'), esc('-'), esc('-'), esc('-'), esc('-')]);
    } else {
      courses.forEach((c, idx) => {
        const startTime = c.startTime || (c.examSession === 'afternoon' ? '13:30' : '09:00');
        const endTime = c.endTime || (c.examSession === 'afternoon' ? '16:30' : '12:00');
        const [sh] = startTime.split(':').map(Number);
        const isMorning = sh < 13;
        const sessionLabel = isMorning ? 'สอบช่วงเช้า' : 'สอบช่วงบ่าย';
        const timeStr = `${sessionLabel} (${startTime} - ${endTime} น.)`;
        const seatStr = c.seatNumber ? `${c.seatNumber}${c.examRow ? ` (แถว ${c.examRow})` : ''}` : '-';

        rows.push([
          idx + 1,
          esc(c.courseCode),
          esc(c.courseNameTh),
          c.credits || 6,
          esc(c.examTypeName || 'สอบไล่ปกติ'),
          esc(c.examFormat === 'online' ? 'สอบออนไลน์' : 'สนามสอบ'),
          esc(c.examDateTh || c.examDate || 'ยังไม่กำหนดวัน'),
          esc(timeStr),
          esc(c.examVenue || '-'),
          esc(c.examRoom || '-'),
          esc(seatStr)
        ]);
      });
    }

    rows.push([]);
    rows.push([esc('════════ โครงสร้างหลักสูตรและรายวิชาทั้งหมด (126 หน่วยกิต) ════════')]);
    rows.push([esc('ลำดับ'), esc('รหัสวิชา'), esc('ชื่อชุดวิชา (ภาษาไทย)'), esc('หน่วยกิต'), esc('หมวดวิชา'), esc('คาบเวลาสอบตามหลักสูตร'), esc('สถานะปัจจุบัน'), esc('ผลการเรียน')]);

    curriculum.forEach((c, idx) => {
      const grade = c.status === 'passed' ? 'S / H (ผ่าน)' : c.status === 'transferred' ? 'เทียบโอน' : c.status === 'failed' ? 'U (ไม่ผ่าน)' : '-';
      rows.push([
        idx + 1,
        esc(c.courseCode),
        esc(c.courseNameTh),
        c.credits || 6,
        esc(c.category || '-'),
        esc(c.examSlotTh || 'คาบสอบตามคู่มือ'),
        esc(this.getStatusLabel(c.status)),
        esc(grade)
      ]);
    });

    const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const yearTh = new Date().getFullYear() + 543;
    link.download = `STOU_Curriculum_Report_${student.studentId || '2567'}_${yearTh}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('ส่งออกไฟล์รายงานสำเร็จ (เปิดได้ทั้ง Google Sheets และ Excel 100%)', 'gold');
  },

  // ═══════════════════════════════════
  // Reading & Chapter Progress Tracker
  // ═══════════════════════════════════
  setupReadingTracker() {
    document.getElementById('btn-toggle-reading-sample')?.addEventListener('click', () => this.toggleReadingSample());
    document.getElementById('btn-reset-reading-progress')?.addEventListener('click', () => this.resetReadingProgress());
    document.getElementById('btn-open-add-book-modal')?.addEventListener('click', () => this.openAddBookModal());
    document.getElementById('btn-close-reading-add-modal')?.addEventListener('click', () => this.closeAddBookModal());
    document.getElementById('btn-cancel-reading-add')?.addEventListener('click', () => this.closeAddBookModal());
    document.getElementById('btn-save-new-book')?.addEventListener('click', () => this.saveNewBook());

    // Sub-unit modal event handlers
    document.getElementById('btn-close-subunit-modal')?.addEventListener('click', () => this.closeSubUnitModal());
    document.getElementById('btn-cancel-subunit-modal')?.addEventListener('click', () => this.closeSubUnitModal());
    document.getElementById('btn-save-subunit-modal')?.addEventListener('click', () => this.saveNewSubUnit());
  },

  getSampleStudyPlan() {
    return [
      {
        courseCode: "10151",
        courseNameTh: "ไทยศึกษา",
        bookTitle: "เอกสารการสอนชุดวิชาไทยศึกษา (15 หน่วย)",
        totalUnits: 15,
        units: [
          {
            unit: 1,
            title: "ความรู้ทั่วไปเกี่ยวกับไทยศึกษา",
            completed: true,
            subUnits: [
              { id: "1.1", title: "ความหมายและขอบข่ายของไทยศึกษา", completed: true },
              { id: "1.2", title: "แนวคิดและทฤษฎีในการศึกษาไทย", completed: true },
              { id: "1.3", title: "ระเบียบวิธีและแหล่งข้อมูลไทยศึกษา", completed: true }
            ]
          },
          {
            unit: 2,
            title: "สิ่งแวดล้อมทางกายภาพกับวิถีชีวิตไทย",
            completed: true,
            subUnits: [
              { id: "2.1", title: "สภาพแวดล้อมทางภูมิศาสตร์ของไทย", completed: true },
              { id: "2.2", title: "ทรัพยากรธรรมชาติกับวิถีชีวิตคนไทย", completed: true },
              { id: "2.3", title: "นิเวศวัฒนธรรมและการปรับตัว", completed: true }
            ]
          },
          {
            unit: 3,
            title: "ระบบสังคมและสถาบันทางสังคมไทย",
            completed: true,
            subUnits: [
              { id: "3.1", title: "โครงสร้างและความสัมพันธ์ทางสังคมไทย", completed: true },
              { id: "3.2", title: "ครอบครัว เครือญาติ และชุมชนไทย", completed: true },
              { id: "3.3", title: "การจัดระเบียบและการเปลี่ยนแปลงทางสังคม", completed: true }
            ]
          },
          {
            unit: 4,
            title: "ระบบเศรษฐกิจไทย",
            completed: true,
            subUnits: [
              { id: "4.1", title: "วิวัฒนาการและโครงสร้างเศรษฐกิจไทย", completed: true },
              { id: "4.2", title: "ภาคเกษตรกรรม อุตสาหกรรม และบริการ", completed: true },
              { id: "4.3", title: "ปรัชญาเศรษฐกิจพอเพียงกับการพัฒนา", completed: true }
            ]
          },
          {
            unit: 5,
            title: "การเมืองการปกครองไทย",
            completed: true,
            subUnits: [
              { id: "5.1", title: "พัฒนาการทางการเมืองการปกครองไทย", completed: true },
              { id: "5.2", title: "สถาบันการเมืองและรัฐธรรมนูญไทย", completed: true },
              { id: "5.3", title: "การมีส่วนร่วมทางการเมืองของประชาชน", completed: true }
            ]
          },
          {
            unit: 6,
            title: "กฎหมายและกระบวนการยุติธรรมไทย",
            completed: false,
            subUnits: [
              { id: "6.1", title: "ประวัติศาสตร์และวิวัฒนาการกฎหมายไทย", completed: false },
              { id: "6.2", title: "กฎหมายที่เกี่ยวข้องกับชีวิตประจำวัน", completed: false },
              { id: "6.3", title: "ระบบและองค์กรในกระบวนการยุติธรรมไทย", completed: false }
            ]
          },
          {
            unit: 7,
            title: "ศาสนาและความเชื่อในสังคมไทย",
            completed: false,
            subUnits: [
              { id: "7.1", title: "พระพุทธศาสนากับสังคมไทย", completed: false },
              { id: "7.2", title: "ศาสนาพราหมณ์-ฮินดู ศาสนาอิสลาม คริสต์", completed: false },
              { id: "7.3", title: "ความเชื่อพื้นบ้านและพิธีกรรมในสังคมไทย", completed: false }
            ]
          },
          {
            unit: 8,
            title: "ภาษาและวรรณกรรมไทย",
            completed: false,
            subUnits: [
              { id: "8.1", title: "ลักษณะและวิวัฒนาการของภาษาไทย", completed: false },
              { id: "8.2", title: "วรรณกรรมไทยสมัยโบราณถึงรัตนโกสินทร์", completed: false },
              { id: "8.3", title: "วรรณกรรมร่วมสมัยและวรรณกรรมท้องถิ่น", completed: false }
            ]
          },
          {
            unit: 9,
            title: "ศิลปวัฒนธรรมและประเพณีไทย",
            completed: false,
            subUnits: [
              { id: "9.1", title: "ทัศนศิลป์ สถาปัตยกรรม และประติมากรรมไทย", completed: false },
              { id: "9.2", title: "ดนตรี นาฏศิลป์ และการละเล่นพื้นบ้าน", completed: false },
              { id: "9.3", title: "ประเพณีและเทศกาลสำคัญของไทย", completed: false }
            ]
          },
          {
            unit: 10,
            title: "วิทยาศาสตร์ เทคโนโลยี และภูมิปัญญาไทย",
            completed: false,
            subUnits: [
              { id: "10.1", title: "ภูมิปัญญาพื้นบ้านและการแพทย์แผนไทย", completed: false },
              { id: "10.2", title: "การพัฒนาวิทยาศาสตร์และเทคโนโลยีในไทย", completed: false },
              { id: "10.3", title: "การประยุกต์ภูมิปัญญากับเทคโนโลยีสมัยใหม่", completed: false }
            ]
          },
          {
            unit: 11,
            title: "การเปลี่ยนแปลงทางสังคมและวัฒนธรรมไทย",
            completed: false,
            subUnits: [
              { id: "11.1", title: "ปัจจัยที่ทำให้เกิดการเปลี่ยนแปลงทางสังคม", completed: false },
              { id: "11.2", title: "กระแสโลกาภิวัตน์กับวัฒนธรรมไทย", completed: false },
              { id: "11.3", title: "การปรับตัวและการอนุรักษ์เอกลักษณ์ไทย", completed: false }
            ]
          },
          {
            unit: 12,
            title: "ปัญหาและแนวทางการพัฒนาสังคมไทย",
            completed: false,
            subUnits: [
              { id: "12.1", title: "ปัญหาสังคม ความยากจน และความเหลื่อมล้ำ", completed: false },
              { id: "12.2", title: "ปัญหาสิ่งแวดล้อมและคุณภาพชีวิต", completed: false },
              { id: "12.3", title: "ยุทธศาสตร์และแนวทางการพัฒนาที่ยั่งยืน", completed: false }
            ]
          },
          {
            unit: 13,
            title: "ไทยกับประชาคมระหว่างประเทศ",
            completed: false,
            subUnits: [
              { id: "13.1", title: "ความสัมพันธ์ระหว่างประเทศของไทยในอดีต", completed: false },
              { id: "13.2", title: "บทบาทของไทยในประชาคมอาเซียน (ASEAN)", completed: false },
              { id: "13.3", title: "ไทยในเวทีการเมืองและเศรษฐกิจโลก", completed: false }
            ]
          },
          {
            unit: 14,
            title: "สื่อสารมวลชนกับการพัฒนาสังคมไทย",
            completed: false,
            subUnits: [
              { id: "14.1", title: "วิวัฒนาการสื่อสารมวลชนไทย", completed: false },
              { id: "14.2", title: "สื่อดิจิทัลและสังคมออนไลน์ในยุคปัจจุบัน", completed: false },
              { id: "14.3", title: "การรู้เท่าทันสื่อและจริยธรรมสื่อมวลชน", completed: false }
            ]
          },
          {
            unit: 15,
            title: "แนวโน้มและอนาคตของสังคมไทย",
            completed: false,
            subUnits: [
              { id: "15.1", title: "การเปลี่ยนแปลงโครงสร้างประชากรผู้สูงวัย", completed: false },
              { id: "15.2", title: "การเตรียมความพร้อมต่อการเปลี่ยนแปลงในอนาคต", completed: false },
              { id: "15.3", title: "ภาพอนาคตและวิสัยทัศน์การพัฒนาสังคมไทย", completed: false }
            ]
          }
        ]
      }
    ];
  },

  renderReadingTracker() {
    const container = document.getElementById('reading-container');
    if (!container) return;

    if (!Array.isArray(this.data?.studyPlan)) {
      if (this.data) this.data.studyPlan = this.getSampleStudyPlan();
    }

    const books = this.data?.studyPlan || [];
    let totalUnits = 0;
    let completedUnits = 0;
    let totalSubUnits = 0;
    let completedSubUnits = 0;

    books.forEach(b => {
      const units = b.units || [];
      units.forEach(u => {
        totalUnits++;
        if (u.completed) completedUnits++;
        const subs = Array.isArray(u.subUnits) ? u.subUnits : [];
        if (subs.length > 0) {
          totalSubUnits += subs.length;
          completedSubUnits += subs.filter(s => s.completed).length;
        } else {
          totalSubUnits += 1;
          if (u.completed) completedSubUnits += 1;
        }
      });
    });

    const percent = totalSubUnits > 0 ? Math.round((completedSubUnits / totalSubUnits) * 100) : 0;

    // Update Header Summary stats
    const statPercent = document.getElementById('reading-stat-percent');
    if (statPercent) statPercent.textContent = `${percent}%`;

    const statFraction = document.getElementById('reading-stat-fraction');
    if (statFraction) {
      if (totalSubUnits > totalUnits) {
        statFraction.textContent = `(${completedUnits}/${totalUnits} หน่วย • ${completedSubUnits}/${totalSubUnits} ตอน)`;
      } else {
        statFraction.textContent = `(${completedUnits}/${totalUnits} หน่วย)`;
      }
    }

    const fillBar = document.getElementById('reading-progress-fill');
    if (fillBar) fillBar.style.width = `${percent}%`;

    const statTotalBooks = document.getElementById('reading-stat-total-books');
    if (statTotalBooks) statTotalBooks.textContent = `${books.length} เล่ม`;

    const statComp = document.getElementById('reading-stat-completed-units');
    if (statComp) {
      statComp.textContent = totalSubUnits > totalUnits
        ? `${completedUnits} หน่วย (${completedSubUnits} ตอน)`
        : `${completedUnits} หน่วย`;
    }

    const statRem = document.getElementById('reading-stat-remaining-units');
    if (statRem) {
      const remUnits = Math.max(0, totalUnits - completedUnits);
      const remSubs = Math.max(0, totalSubUnits - completedSubUnits);
      statRem.textContent = totalSubUnits > totalUnits
        ? `${remUnits} หน่วย (${remSubs} ตอน)`
        : `${remUnits} หน่วย`;
    }

    if (books.length === 0) {
      container.innerHTML = `
        <div class="aero-countdown-card empty-state" style="margin-top:10px;">
          <div class="countdown-badge-row">
            <div class="countdown-status-indicator" style="background:rgba(52,211,153,0.15); border-color:rgba(52,211,153,0.4); color:#34d399;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <span>ยังไม่มีรายการหนังสือที่กำลังอ่าน</span>
            </div>
          </div>
          <p class="countdown-empty-text">แตะปุ่มวงกลมตัวอย่างด้านบนเพื่อดูตัวอย่างหนังสือ 1 เล่ม (15 หน่วย) หรือแตะปุ่มเครื่องหมายบวกเพื่อเพิ่มเล่มใหม่</p>
        </div>`;
      return;
    }

    // Default expand first book if set is empty
    if (this.expandedBookCards.size === 0 && books.length > 0) {
      this.expandedBookCards.add(books[0].courseCode);
    }

    let html = '';
    books.forEach(b => {
      const units = b.units || [];
      const bookTotal = units.length;
      const bookComp = units.filter(u => u.completed).length;

      let bookSubsCount = 0;
      let bookSubsDone = 0;
      units.forEach(u => {
        const subs = Array.isArray(u.subUnits) ? u.subUnits : [];
        if (subs.length > 0) {
          bookSubsCount += subs.length;
          bookSubsDone += subs.filter(s => s.completed).length;
        } else {
          bookSubsCount += 1;
          if (u.completed) bookSubsDone += 1;
        }
      });

      const bookPct = bookSubsCount > 0 ? Math.round((bookSubsDone / bookSubsCount) * 100) : 0;
      const isExpanded = this.expandedBookCards.has(b.courseCode);
      const isAllDone = bookTotal > 0 && bookComp === bookTotal;

      let unitsHtml = '';
      units.forEach(u => {
        const isDone = !!u.completed;
        const subs = Array.isArray(u.subUnits) ? u.subUnits : [];
        const hasSubs = subs.length > 0;
        const subsDoneCount = subs.filter(s => s.completed).length;
        const isAllSubsDone = hasSubs && subsDoneCount === subs.length;

        // Render sub-units HTML
        let subUnitsListHtml = '';
        if (hasSubs) {
          subs.forEach(s => {
            const subDone = !!s.completed;
            subUnitsListHtml += `
              <div class="subunit-row ${subDone ? 'is-completed' : ''}" id="subunit-${b.courseCode}-${u.unit}-${s.id}">
                <button type="button" class="btn-subunit-check ${subDone ? 'is-checked' : ''}" onclick="App.toggleSubUnitCheck('${b.courseCode}', ${u.unit}, '${s.id}')" aria-label="${subDone ? 'อ่านจบแล้ว (แตะเพื่อยกเลิก)' : 'ยังไม่ได้อ่าน (แตะเพื่อติ๊กจบ)'}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <span class="subunit-id-pill">ตอน ${s.id}</span>
                <span class="subunit-title-text">${s.title || `ตอนที่ ${s.id}`}</span>
                <button type="button" class="btn-del-subunit" onclick="App.deleteSubUnit('${b.courseCode}', ${u.unit}, '${s.id}')" title="ลบตอนย่อย ${s.id}" aria-label="ลบตอนย่อย">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>`;
          });
        }

        // Sub-units container with "+ เพิ่มตอนย่อย"
        const subUnitsContainerHtml = `
          <div class="unit-subunits-box">
            ${subUnitsListHtml}
            <button type="button" class="btn-add-subunit-inline" onclick="event.stopPropagation(); App.openAddSubUnitModal('${b.courseCode}', ${u.unit});" title="เพิ่มตอนย่อยในหน่วยที่ ${u.unit}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>+ เพิ่มตอนย่อย</span>
            </button>
          </div>`;

        unitsHtml += `
          <div class="unit-block-wrap" id="unit-block-${b.courseCode}-${u.unit}">
            <div class="book-unit-row ${isDone ? 'is-completed' : ''}" id="unit-row-${b.courseCode}-${u.unit}">
              <button type="button" class="btn-unit-check ${isDone ? 'is-checked' : ''}" onclick="App.toggleUnitCheck('${b.courseCode}', ${u.unit})" aria-label="${isDone ? 'อ่านจบแล้ว (แตะเพื่อยกเลิก)' : 'ยังไม่ได้อ่าน (แตะเพื่อติ๊กจบ)'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <div class="unit-main-col">
                <div class="unit-meta-row">
                  <span class="unit-num-pill">หน่วยที่ ${String(u.unit).padStart(2, '0')}</span>
                  ${hasSubs ? `<span class="unit-subcount-pill ${isAllSubsDone ? 'all-done' : ''}">${subsDoneCount}/${subs.length} ตอน</span>` : ''}
                  ${isDone ? '<span class="unit-done-tag">อ่านจบแล้ว</span>' : ''}
                </div>
                <div class="unit-text-name">${u.title || `หน่วยที่ ${u.unit}`}</div>
              </div>
            </div>
            ${subUnitsContainerHtml}
          </div>`;
      });

      html += `
        <div class="aqua-book-card ${isExpanded ? 'is-expanded' : ''}" id="book-card-${b.courseCode}">
          <div class="book-card-header" onclick="App.toggleBookExpand('${b.courseCode}')">
            <div class="book-header-left">
              <span class="book-code-pill">${b.courseCode}</span>
              <div class="book-info-col">
                <h4 class="book-title-text">${b.courseNameTh || `ชุดวิชา ${b.courseCode}`}</h4>
                <span class="book-subtitle-text">${b.bookTitle || 'เอกสารการสอน มสธ.'}</span>
              </div>
            </div>

            <div class="book-header-right">
              <span class="book-progress-badge ${isAllDone ? 'is-complete' : ''}">
                ${isAllDone ? 'จบครบทั้งเล่ม' : `${bookComp}/${bookTotal} หน่วย (${bookPct}%)`}
              </span>
              <button type="button" class="btn-book-expand" aria-label="กาง/หุบรายการบท">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
          </div>

          <div class="book-units-container">
            ${unitsHtml}

            <!-- Bottom Actions Bar for each book -->
            <div class="book-card-actions-bar">
              <button type="button" class="btn-book-action-mini" onclick="App.addNewUnitPrompt('${b.courseCode}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>+ เพิ่มหน่วยใหม่</span>
              </button>

              <div style="display:flex; gap:6px;">
                <button type="button" class="btn-book-action-mini" onclick="App.toggleAllUnitsInBook('${b.courseCode}')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>${isAllDone ? 'ยกเลิกทั้งหมด' : 'ติ๊กจบทั้งเล่ม'}</span>
                </button>
                <button type="button" class="btn-book-action-mini btn-danger" onclick="App.deleteBook('${b.courseCode}')" title="ลบเล่มนี้">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  <span>ลบ</span>
                </button>
              </div>
            </div>
          </div>
        </div>`;
    });

    container.innerHTML = html;
  },

  toggleBookExpand(code) {
    if (this.expandedBookCards.has(code)) {
      this.expandedBookCards.delete(code);
    } else {
      this.expandedBookCards.add(code);
    }
    this.renderReadingTracker();
  },

  toggleUnitCheck(courseCode, unitNumber) {
    if (!this.data?.studyPlan) return;
    const book = this.data.studyPlan.find(b => b.courseCode === courseCode);
    if (!book) return;

    const unit = (book.units || []).find(u => u.unit === unitNumber);
    if (!unit) return;

    const hasSubs = Array.isArray(unit.subUnits) && unit.subUnits.length > 0;

    if (hasSubs) {
      const targetState = !unit.completed;
      unit.completed = targetState;
      unit.subUnits.forEach(s => { s.completed = targetState; });
    } else {
      unit.completed = !unit.completed;
    }

    this.saveDataAndRefresh();

    if (unit.completed) {
      this.showToast(`อ่านจบแล้ว! วิชา ${courseCode} หน่วยที่ ${unitNumber} ${hasSubs ? '(ครบทุกตอนย่อย)' : ''}`, 'gold');
    } else {
      this.showToast(`ปรับสถานะ วิชา ${courseCode} หน่วยที่ ${unitNumber} เป็นยังไม่อ่าน`);
    }
  },

  toggleSubUnitCheck(courseCode, unitNumber, subUnitId) {
    if (!this.data?.studyPlan) return;
    const book = this.data.studyPlan.find(b => b.courseCode === courseCode);
    if (!book) return;

    const unit = (book.units || []).find(u => u.unit === unitNumber);
    if (!unit || !Array.isArray(unit.subUnits)) return;

    const sub = unit.subUnits.find(s => String(s.id) === String(subUnitId));
    if (!sub) return;

    sub.completed = !sub.completed;

    // Auto-update parent unit completed status
    unit.completed = unit.subUnits.length > 0 && unit.subUnits.every(s => s.completed);

    this.saveDataAndRefresh();

    if (sub.completed) {
      this.showToast(`อ่านจบแล้ว! ตอน ${sub.id}: ${sub.title || ''}`, 'gold');
    } else {
      this.showToast(`ปรับสถานะ ตอน ${sub.id} เป็นยังไม่อ่าน`);
    }
  },

  openAddSubUnitModal(courseCode, unitNumber) {
    this.currentSubUnitTarget = { courseCode, unitNumber };
    const book = this.data?.studyPlan?.find(b => b.courseCode === courseCode);
    const unit = (book?.units || []).find(u => u.unit === unitNumber);

    const heading = document.getElementById('modal-subunit-heading');
    if (heading) heading.textContent = `เพิ่มตอนย่อยในหน่วยที่ ${unitNumber}`;

    const codePill = document.getElementById('modal-subunit-course-code');
    if (codePill) codePill.textContent = courseCode;

    const unitTitle = document.getElementById('modal-subunit-unit-title');
    if (unitTitle) unitTitle.textContent = unit?.title || `หน่วยที่ ${unitNumber}`;

    const inpId = document.getElementById('inp-subunit-id');
    const existingSubs = Array.isArray(unit?.subUnits) ? unit.subUnits : [];
    const nextSubNum = existingSubs.length + 1;
    if (inpId) inpId.value = `${unitNumber}.${nextSubNum}`;

    const inpTitle = document.getElementById('inp-subunit-title');
    if (inpTitle) {
      inpTitle.value = '';
      setTimeout(() => inpTitle.focus(), 100);
    }

    const modal = document.getElementById('subunit-add-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.classList.add('modal-open');
    }
  },

  closeSubUnitModal() {
    const modal = document.getElementById('subunit-add-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.currentSubUnitTarget = { courseCode: null, unitNumber: null };
  },

  saveNewSubUnit() {
    const { courseCode, unitNumber } = this.currentSubUnitTarget;
    if (!courseCode || unitNumber === null) return;

    const inpId = document.getElementById('inp-subunit-id');
    const inpTitle = document.getElementById('inp-subunit-title');

    const subId = inpId?.value.trim();
    const subTitle = inpTitle?.value.trim();

    if (!subId || !subTitle) {
      this.showToast('กรุณาระบุลำดับตอนย่อยและชื่อหัวข้อ', 'error');
      return;
    }

    const book = this.data?.studyPlan?.find(b => b.courseCode === courseCode);
    if (!book) return;

    const unit = (book.units || []).find(u => u.unit === unitNumber);
    if (!unit) return;

    if (!Array.isArray(unit.subUnits)) {
      unit.subUnits = [];
    }

    // Check duplicate ID
    if (unit.subUnits.some(s => String(s.id) === subId)) {
      this.showToast(`ตอนที่ ${subId} มีอยู่แล้วในหน่วยนี้`, 'error');
      return;
    }

    unit.subUnits.push({
      id: subId,
      title: subTitle,
      completed: false
    });

    // Recheck unit completion
    unit.completed = unit.subUnits.every(s => s.completed);

    this.closeSubUnitModal();
    this.saveDataAndRefresh();
    this.showToast(`เพิ่มตอนย่อย ${subId} ในหน่วยที่ ${unitNumber} สำเร็จ`, 'gold');
  },

  deleteSubUnit(courseCode, unitNumber, subUnitId) {
    if (!this.data?.studyPlan) return;
    const book = this.data.studyPlan.find(b => b.courseCode === courseCode);
    if (!book) return;

    const unit = (book.units || []).find(u => u.unit === unitNumber);
    if (!unit || !Array.isArray(unit.subUnits)) return;

    if (!confirm(`ต้องการลบตอนย่อย ${subUnitId} หรือไม่?`)) return;

    unit.subUnits = unit.subUnits.filter(s => String(s.id) !== String(subUnitId));
    if (unit.subUnits.length > 0) {
      unit.completed = unit.subUnits.every(s => s.completed);
    }

    this.saveDataAndRefresh();
    this.showToast(`ลบตอนย่อย ${subUnitId} แล้ว`);
  },

  toggleAllUnitsInBook(courseCode) {
    if (!this.data?.studyPlan) return;
    const book = this.data.studyPlan.find(b => b.courseCode === courseCode);
    if (!book || !book.units) return;

    const allCompleted = book.units.every(u => u.completed);
    const targetState = !allCompleted;

    book.units.forEach(u => {
      u.completed = targetState;
      if (Array.isArray(u.subUnits)) {
        u.subUnits.forEach(s => { s.completed = targetState; });
      }
    });

    this.saveDataAndRefresh();

    if (targetState) {
      this.showToast(`ยินดีด้วย! ติ๊กอ่านจบครบทั้งเล่มวิชา ${courseCode} แล้ว`, 'gold');
    } else {
      this.showToast(`รีเซ็ตการอ่านวิชา ${courseCode} เรียบร้อยแล้ว`);
    }
  },

  deleteBook(courseCode) {
    if (!this.data?.studyPlan) return;
    if (!confirm(`ต้องการลบรายการอ่านหนังสือวิชา ${courseCode} หรือไม่?`)) return;

    this.data.studyPlan = this.data.studyPlan.filter(b => b.courseCode !== courseCode);
    this.expandedBookCards.delete(courseCode);
    this.saveDataAndRefresh();
    this.showToast(`ลบรายการอ่านหนังสือวิชา ${courseCode} แล้ว`);
  },

  addNewUnitPrompt(courseCode) {
    if (!this.data?.studyPlan) return;
    const book = this.data.studyPlan.find(b => b.courseCode === courseCode);
    if (!book) return;

    if (!Array.isArray(book.units)) book.units = [];
    const nextUnitNum = book.units.length + 1;
    const title = prompt(`เพิ่มหน่วยใหม่ หน่วยที่ ${nextUnitNum}\nกรุณาระบุชื่อหน่วย/บท:`, `หน่วยที่ ${nextUnitNum}: หัวข้อการเรียนรู้`);
    if (!title || !title.trim()) return;

    book.units.push({
      unit: nextUnitNum,
      title: title.trim(),
      completed: false,
      subUnits: [
        { id: `${nextUnitNum}.1`, title: `ตอนที่ ${nextUnitNum}.1 สาระสำคัญที่ 1`, completed: false },
        { id: `${nextUnitNum}.2`, title: `ตอนที่ ${nextUnitNum}.2 สาระสำคัญที่ 2`, completed: false }
      ]
    });
    book.totalUnits = book.units.length;

    this.expandedBookCards.add(courseCode);
    this.saveDataAndRefresh();
    this.showToast(`เพิ่มหน่วยที่ ${nextUnitNum} ในวิชา ${courseCode} เรียบร้อยแล้ว`);
  },

  toggleReadingSample() {
    if (!this.data) this.data = this.getDefaultData();
    if (!Array.isArray(this.data.studyPlan)) this.data.studyPlan = [];

    const hasSample = this.data.studyPlan.some(b => b.courseCode === '10151');
    if (hasSample) {
      this.data.studyPlan = this.data.studyPlan.filter(b => b.courseCode !== '10151');
      this.expandedBookCards.delete('10151');
      this.saveDataAndRefresh();
      this.showToast('ปิดการแสดงตัวอย่างหนังสือ (วิชา 10151) แล้ว');
    } else {
      const sample = this.getSampleStudyPlan()[0];
      this.data.studyPlan.unshift(sample);
      this.expandedBookCards.add('10151');
      this.saveDataAndRefresh();
      this.showToast('เปิดตัวอย่างหนังสือ 1 เล่ม (วิชา 10151 ไทยศึกษา 15 หน่วย) แล้ว', 'gold');
    }
  },

  resetReadingProgress() {
    if (!this.data?.studyPlan || this.data.studyPlan.length === 0) {
      this.showToast('ไม่มีรายการหนังสือให้อ่าน');
      return;
    }
    if (!confirm('ต้องการรีเซ็ตสถานะการอ่านหนังสือทุกวิชาให้เป็น 0% หรือไม่?')) return;

    this.data.studyPlan.forEach(b => {
      (b.units || []).forEach(u => {
        u.completed = false;
        if (Array.isArray(u.subUnits)) {
          u.subUnits.forEach(s => { s.completed = false; });
        }
      });
    });
    this.saveDataAndRefresh();
    this.showToast('รีเซ็ตความคืบหน้าการอ่านทั้งหมดเรียบร้อยแล้ว');
  },

  openAddBookModal() {
    this.populateCoursePresetDropdown();
    const modal = document.getElementById('reading-add-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.classList.add('modal-open');
    }
  },

  closeAddBookModal() {
    const modal = document.getElementById('reading-add-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  },

  populateCoursePresetDropdown() {
    const select = document.getElementById('inp-book-preset-course');
    if (!select) return;

    const cur = this.data?.curriculum || [];
    let opts = '<option value="">-- เลือกจากวิชาในหลักสูตร --</option>';
    cur.forEach(c => {
      opts += `<option value="${c.courseCode}">${c.courseCode} - ${c.courseNameTh}</option>`;
    });
    opts += '<option value="__custom__">+ กรอกรหัสวิชาอื่นด้วยตนเอง</option>';
    select.innerHTML = opts;
  },

  onPresetCourseChange(val) {
    if (!val || val === '__custom__') return;
    const cur = this.data?.curriculum?.find(c => c.courseCode === val);
    if (!cur) return;

    const codeInp = document.getElementById('inp-book-course-code');
    const nameInp = document.getElementById('inp-book-course-name');
    const titleInp = document.getElementById('inp-book-title');

    if (codeInp) codeInp.value = cur.courseCode;
    if (nameInp) nameInp.value = cur.courseNameTh;
    if (titleInp) titleInp.value = `เอกสารการสอนชุดวิชา${cur.courseNameTh} (15 หน่วย)`;
  },

  saveNewBook() {
    const codeInp = document.getElementById('inp-book-course-code');
    const nameInp = document.getElementById('inp-book-course-name');
    const titleInp = document.getElementById('inp-book-title');
    const unitsInp = document.getElementById('inp-book-total-units');

    const code = codeInp?.value.trim();
    const name = nameInp?.value.trim();
    const title = titleInp?.value.trim() || `เอกสารการสอนชุดวิชา${name || code}`;
    const totalUnits = Math.max(1, Math.min(30, parseInt(unitsInp?.value || '15', 10)));

    if (!code || !name) {
      this.showToast('กรุณากรอกรหัสวิชาและชื่อวิชา', 'error');
      return;
    }

    if (!this.data) this.data = this.getDefaultData();
    if (!Array.isArray(this.data.studyPlan)) this.data.studyPlan = [];

    // Check if exists
    let existing = this.data.studyPlan.find(b => b.courseCode === code);
    if (existing) {
      this.showToast(`วิชา ${code} มีอยู่ในรายการอ่านหนังสือแล้ว`, 'error');
      return;
    }

    const units = [];
    for (let i = 1; i <= totalUnits; i++) {
      units.push({
        unit: i,
        title: `หน่วยที่ ${i}: สาระการเรียนรู้ที่ ${i}`,
        completed: false,
        subUnits: [
          { id: `${i}.1`, title: `ตอนที่ ${i}.1 สาระสำคัญที่ 1`, completed: false },
          { id: `${i}.2`, title: `ตอนที่ ${i}.2 สาระสำคัญที่ 2`, completed: false },
          { id: `${i}.3`, title: `ตอนที่ ${i}.3 สาระสำคัญที่ 3`, completed: false }
        ]
      });
    }

    this.data.studyPlan.push({
      courseCode: code,
      courseNameTh: name,
      bookTitle: title,
      totalUnits: totalUnits,
      units: units
    });

    this.expandedBookCards.add(code);
    this.closeAddBookModal();
    this.saveDataAndRefresh();
    this.showToast(`เพิ่มหนังสือวิชา ${code} (${totalUnits} หน่วย) เรียบร้อยแล้ว`, 'gold');
  },

  // ═══════════════════════════════════
  // Toast Notification System
  // ═══════════════════════════════════
  showToast(msg, type = 'aqua') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'gold' ? 'toast-gold' : ''}`;
    
    // Pure SVG icon inside toast
    const iconSvg = type === 'gold'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : type === 'error'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `<span class="toast-svg-wrap">${iconSvg}</span><span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px) scale(0.96)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
};

// Start application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
