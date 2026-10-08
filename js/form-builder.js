/**
 * STOU Exam Pass - Form Builder & Editor
 * Allows users to visually create, edit, and export their STOU JSON data
 */

const FormBuilder = {
  // Render the interactive form into the container
  initForm(currentData) {
    const container = document.getElementById('form-builder-container');
    if (!container) return;

    const data = currentData || {
      student: { studentId: '', name: '', faculty: '', major: '', center: '', semester: '1', academicYear: '2567' },
      examCenter: { centerCode: '', centerName: '', province: '', locationAddress: '', googleMapsQuery: '', examFormat: 'onsite', examFormatText: 'สอบ ณ สนามสอบ (On-site)' },
      courses: []
    };

    let html = `
      <div class="glass-card" style="border-left: 4px solid var(--stou-gold);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--stou-gold);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:text-bottom; margin-right:6px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              แบบฟอร์มบันทึก / แก้ไขข้อมูลนักศึกษาและตารางสอบ มสธ.
            </h3>
            <p style="font-size:0.8rem; color:var(--text-muted);">
              กรอกข้อมูลตรงนี้ได้โดยไม่ต้องเขียนโค้ด JSON ระบบจะจัดโครงสร้างและบันทึกลงแอปให้อัตโนมัติ
            </p>
          </div>
          <button type="button" class="btn btn-gold btn-sm" id="btn-export-json-file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            ดาวน์โหลดไฟล์ .json
          </button>
        </div>

        <form id="stou-profile-form" onsubmit="event.preventDefault();">
          <!-- Student Section -->
          <div style="background:rgba(0,0,0,0.2); padding:14px; border-radius:var(--radius-md); margin-bottom:16px; border:1px solid var(--border-color);">
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--stou-primary-light); margin-bottom:12px;">
              👤 ข้อมูลนักศึกษา มสธ.
            </h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <div class="form-group">
                <label class="form-label">รหัสนักศึกษา (10 หลัก) *</label>
                <input type="text" class="form-input" id="inp-studentId" value="${data.student.studentId || ''}" placeholder="เช่น 6630018899" maxlength="10" required>
              </div>
              <div class="form-group">
                <label class="form-label">ชื่อ - นามสกุล *</label>
                <input type="text" class="form-input" id="inp-studentName" value="${data.student.name || ''}" placeholder="เช่น นายสมชาย ใจดีมุ่งมั่น" required>
              </div>
              <div class="form-group">
                <label class="form-label">สาขาวิชา</label>
                <input type="text" class="form-input" id="inp-faculty" value="${data.student.faculty || ''}" placeholder="เช่น สาขาวิชาวิทยาศาสตร์และเทคโนโลยี">
              </div>
              <div class="form-group">
                <label class="form-label">วิชาเอก / แขนงวิชา</label>
                <input type="text" class="form-input" id="inp-major" value="${data.student.major || ''}" placeholder="เช่น วิทยาการคอมพิวเตอร์">
              </div>
              <div class="form-group">
                <label class="form-label">ศูนย์วิทยพัฒนา มสธ.</label>
                <input type="text" class="form-input" id="inp-center" value="${data.student.center || ''}" placeholder="เช่น ศูนย์วิทยพัฒนา มสธ. นนทบุรี">
              </div>
              <div class="form-group" style="display:flex; gap:10px;">
                <div style="flex:1;">
                  <label class="form-label">ภาคการศึกษา</label>
                  <input type="text" class="form-input" id="inp-semester" value="${data.student.semester || '1'}" placeholder="1">
                </div>
                <div style="flex:1;">
                  <label class="form-label">ปีการศึกษา</label>
                  <input type="text" class="form-input" id="inp-academicYear" value="${data.student.academicYear || '2567'}" placeholder="2567">
                </div>
              </div>
            </div>
          </div>

          <!-- Exam Center Section -->
          <div style="background:rgba(0,0,0,0.2); padding:14px; border-radius:var(--radius-md); margin-bottom:16px; border:1px solid var(--border-color);">
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--stou-primary-light); margin-bottom:12px;">
              📍 ข้อมูลสถานที่สอบ / สนามสอบ มสธ.
            </h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
              <div class="form-group">
                <label class="form-label">รูปแบบการสอบ</label>
                <select class="form-select" id="inp-examFormat">
                  <option value="onsite" ${data.examCenter.examFormat === 'onsite' ? 'selected' : ''}>สอบ ณ สนามสอบ (On-site)</option>
                  <option value="online" ${data.examCenter.examFormat === 'online' ? 'selected' : ''}>สอบออนไลน์ (STOU Online Exam)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">ชื่อสนามสอบ / โรงเรียนที่สอบ *</label>
                <input type="text" class="form-input" id="inp-centerName" value="${data.examCenter.centerName || ''}" placeholder="เช่น โรงเรียนเบญจมราชูทิศ" required>
              </div>
              <div class="form-group">
                <label class="form-label">รหัสสนามสอบ</label>
                <input type="text" class="form-input" id="inp-centerCode" value="${data.examCenter.centerCode || ''}" placeholder="เช่น 1001">
              </div>
              <div class="form-group">
                <label class="form-label">จังหวัดสนามสอบ</label>
                <input type="text" class="form-input" id="inp-province" value="${data.examCenter.province || ''}" placeholder="เช่น นนทบุรี">
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label">คำค้นหาใน Google Maps (สำหรับกดนำทาง) *</label>
                <input type="text" class="form-input" id="inp-googleMapsQuery" value="${data.examCenter.googleMapsQuery || data.examCenter.centerName || ''}" placeholder="เช่น โรงเรียนเบญจมราชูทิศ นนทบุรี">
              </div>
            </div>
          </div>

          <!-- Courses List Section -->
          <div style="background:rgba(0,0,0,0.2); padding:14px; border-radius:var(--radius-md); margin-bottom:16px; border:1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h4 style="font-size:0.95rem; font-weight:700; color:var(--stou-primary-light);">
                📚 รายการชุดวิชาที่ลงทะเบียนและตารางสอบ
              </h4>
              <button type="button" class="btn btn-primary btn-sm" id="btn-add-course-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                เพิ่มชุดวิชา
              </button>
            </div>

            <div id="course-rows-container">
              <!-- Dynamically populated rows -->
            </div>
          </div>

          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button type="button" class="btn btn-outline" id="btn-reset-form">คืนค่าเริ่มต้น</button>
            <button type="button" class="btn btn-primary" id="btn-save-form-data" style="padding:10px 24px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              บันทึกข้อมูลเข้าสู่แอปพลิเคชัน
            </button>
          </div>
        </form>
      </div>
    `;

    container.innerHTML = html;

    // Render course rows
    const courseContainer = document.getElementById('course-rows-container');
    if (data.courses && data.courses.length > 0) {
      data.courses.forEach((c, idx) => {
        FormBuilder.appendCourseRow(courseContainer, c, idx);
      });
    } else {
      FormBuilder.appendCourseRow(courseContainer, {}, 0);
    }

    // Attach Event Handlers
    document.getElementById('btn-add-course-row')?.addEventListener('click', () => {
      const idx = document.querySelectorAll('.course-form-card').length;
      FormBuilder.appendCourseRow(courseContainer, {}, idx);
    });

    document.getElementById('btn-save-form-data')?.addEventListener('click', () => {
      const builtData = FormBuilder.extractFormData();
      if (!builtData) return;
      App.loadData(builtData);
      App.showToast('✅ บันทึกข้อมูลสำเร็จ พร้อมแสดงผลบัตรสอบแล้ว!', 'green');
      App.switchTab('pane-pass');
    });

    document.getElementById('btn-export-json-file')?.addEventListener('click', () => {
      const builtData = FormBuilder.extractFormData();
      if (!builtData) return;
      FormBuilder.downloadJSONFile(builtData);
    });

    document.getElementById('btn-reset-form')?.addEventListener('click', () => {
      if (confirm('คุณต้องการโหลดข้อมูลตัวอย่าง มสธ. เริ่มต้นใช่หรือไม่?')) {
        App.loadSampleData();
      }
    });
  },

  appendCourseRow(container, course = {}, index) {
    const rowId = `course-card-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const card = document.createElement('div');
    card.className = 'course-form-card';
    card.id = rowId;
    card.style = 'background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; margin-bottom:12px; position:relative;';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-size:0.85rem; font-weight:700; color:var(--stou-gold);">ชุดวิชาที่ ${index + 1}</span>
        <button type="button" class="btn btn-outline btn-sm delete-course-btn" style="color:var(--accent-rose); border-color:rgba(244,63,94,0.3); padding:3px 8px;">
          ลบวิชานี้
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:10px;">
        <div class="form-group">
          <label class="form-label">รหัสวิชา (5 หลัก) *</label>
          <input type="text" class="form-input c-code" value="${course.courseCode || ''}" placeholder="เช่น 10151" maxlength="5" required>
        </div>
        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label">ชื่อชุดวิชา (ภาษาไทย) *</label>
          <input type="text" class="form-input c-name-th" value="${course.courseNameTh || ''}" placeholder="เช่น ไทยศึกษา" required>
        </div>
        <div class="form-group">
          <label class="form-label">แผนการศึกษา</label>
          <select class="form-select c-plan">
            <option value="ก1" ${course.plan === 'ก1' ? 'selected' : ''}>ก1 (สอบปลายภาค 100%)</option>
            <option value="ก2" ${course.plan === 'ก2' ? 'selected' : ''}>ก2 (สอบกลางภาค + ปลายภาค)</option>
            <option value="ก3" ${course.plan === 'ก3' ? 'selected' : ''}>ก3 (กิจกรรม/อบรม + สอบปลายภาค)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">วันสอบ (ค.ศ. เช่น 2026-11-21) *</label>
          <input type="date" class="form-input c-exam-date" value="${course.examDate || ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">คาบเวลาสอบ *</label>
          <select class="form-select c-session">
            <option value="morning" ${course.examSession === 'morning' ? 'selected' : ''}>คาบเช้า (09:00 - 12:00 น.)</option>
            <option value="afternoon" ${course.examSession === 'afternoon' ? 'selected' : ''}>คาบบ่าย (13:30 - 16:30 น.)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ห้องสอบ</label>
          <input type="text" class="form-input c-room" value="${course.examRoom || ''}" placeholder="เช่น ห้อง 324">
        </div>
        <div class="form-group">
          <label class="form-label">เลขที่นั่งสอบ</label>
          <input type="text" class="form-input c-seat" value="${course.seatNumber || ''}" placeholder="เช่น 042">
        </div>
        <div class="form-group">
          <label class="form-label">แถวที่นั่ง</label>
          <input type="text" class="form-input c-row" value="${course.examRow || ''}" placeholder="เช่น 4">
        </div>
      </div>
    `;

    card.querySelector('.delete-course-btn').addEventListener('click', () => {
      card.remove();
      // Re-index remaining rows
      document.querySelectorAll('.course-form-card').forEach((el, idx) => {
        el.querySelector('span').textContent = `ชุดวิชาที่ ${idx + 1}`;
      });
    });

    container.appendChild(card);
  },

  extractFormData() {
    const studentId = document.getElementById('inp-studentId').value.trim();
    const name = document.getElementById('inp-studentName').value.trim();
    const centerName = document.getElementById('inp-centerName').value.trim();

    if (!studentId || !name || !centerName) {
      App.showToast('⚠️ กรุณากรอกรหัสนักศึกษา, ชื่อ-สกุล และชื่อสนามสอบ ให้ครบถ้วน', 'gold');
      return null;
    }

    const courseCards = document.querySelectorAll('.course-form-card');
    const courses = [];

    courseCards.forEach((card) => {
      const code = card.querySelector('.c-code').value.trim();
      const nameTh = card.querySelector('.c-name-th').value.trim();
      const plan = card.querySelector('.c-plan').value;
      const examDate = card.querySelector('.c-exam-date').value;
      const examSession = card.querySelector('.c-session').value;
      const examRoom = card.querySelector('.c-room').value.trim();
      const seatNumber = card.querySelector('.c-seat').value.trim();
      const examRow = card.querySelector('.c-row').value.trim();

      if (code && nameTh) {
        const sessionTh = examSession === 'morning' ? 'คาบเช้า 09:00 - 12:00 น.' : 'คาบบ่าย 13:30 - 16:30 น.';
        
        let dateThFormatted = '';
        if (examDate) {
          try {
            const d = new Date(examDate + 'T00:00:00');
            const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
            const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            dateThFormatted = `${dayNames[d.getDay()]}ที่ ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear() + 543}`;
          } catch(e) {
            dateThFormatted = examDate;
          }
        }

        courses.push({
          courseCode: code,
          courseNameTh: nameTh,
          courseNameEn: '',
          credits: 6,
          plan: plan,
          planDescription: plan === 'ก1' ? 'สอบไล่ปลายภาค 100%' : plan === 'ก2' ? 'สอบกลางภาค + สอบไล่' : 'กิจกรรม + สอบปลายภาค',
          assignmentStatus: plan === 'ก1' ? 'ไม่มีกิจกรรม (แผน ก1)' : 'กิจกรรมสมบูรณ์',
          examDate: examDate,
          examDateTh: dateThFormatted,
          examSession: examSession,
          examTimeTh: sessionTh,
          examRoom: examRoom || 'ตามประกาศหน้าสนามสอบ',
          seatNumber: seatNumber || '-',
          examRow: examRow || '-',
          allowCalculator: false,
          allowedTools: 'ดินสอ 2B, ยางลบ, ปากกาน้ำเงิน'
        });
      }
    });

    const formatSelect = document.getElementById('inp-examFormat').value;

    return {
      student: {
        studentId: studentId,
        name: name,
        degree: 'ปริญญาตรี',
        faculty: document.getElementById('inp-faculty').value.trim(),
        major: document.getElementById('inp-major').value.trim(),
        center: document.getElementById('inp-center').value.trim(),
        semester: document.getElementById('inp-semester').value.trim() || '1',
        academicYear: document.getElementById('inp-academicYear').value.trim() || '2567'
      },
      examCenter: {
        centerCode: document.getElementById('inp-centerCode').value.trim() || '1001',
        centerName: centerName,
        province: document.getElementById('inp-province').value.trim(),
        locationAddress: '',
        googleMapsQuery: document.getElementById('inp-googleMapsQuery').value.trim() || centerName,
        examFormat: formatSelect,
        examFormatText: formatSelect === 'onsite' ? 'สอบ ณ สนามสอบ (On-site)' : 'สอบออนไลน์ (STOU Online Exam)',
        rulesNote: 'โปรดเตรียมบัตรนักศึกษา/บัตรประชาชน ดินสอ 2B ปากกาน้ำเงิน และเข้าห้องสอบก่อนเวลา 15 นาที'
      },
      courses: courses
    };
  },

  downloadJSONFile(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stou-exam-${data.student?.studentId || 'data'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    App.showToast('📥 ดาวน์โหลดไฟล์ .json เรียบร้อยแล้ว!', 'green');
  }
};
