// courses.js - DataTable with working Tailwind styles
$(function () {
  const coursesData = [
    { id: 1, code: 'MED-101', name: 'آناتومی عمومی', instructor: 'دکتر احمدی', units: 3 },
    { id: 2, code: 'MED-102', name: 'فیزیولوژی پایه', instructor: 'دکتر محمدی', units: 4 },
    { id: 3, code: 'MED-103', name: 'بیوشیمی پزشکی', instructor: 'دکتر رضایی', units: 3 },
    { id: 4, code: 'MED-104', name: 'میکروبیولوژی', instructor: 'دکتر کریمی', units: 3 },
    { id: 5, code: 'MED-105', name: 'پاتولوژی عمومی', instructor: 'دکتر حسینی', units: 4 }
  ];

  const $table = $('#courses-table');

  if ($table.length) {
    $table.DataTable({
      data: coursesData,
      processing: true,
      autoWidth: false,
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      
      columns: [
        { data: 'code' },
        { data: 'name' },
        { data: 'instructor', className: 'hidden md:table-cell' },
        { data: 'id', orderable: false, searchable: false }
      ],
      
      columnDefs: [
        {
          targets: 0,
          render: data => `<span class="font-mono text-primary font-medium">${data}</span>`
        },
        {
          targets: 1,
          render: (data, type, full) => `
            <div>
              <p class="font-medium">${data}</p>
              <p class="text-xs text-gray-500 md:hidden mt-1">${full.instructor}</p>
            </div>`
        },
        {
          targets: -1,
          render: (data, type, full) => `
            <div class="flex gap-1 items-center">
              <button onclick="enterClass(${full.id}, '${full.name}')" class="btn btn-outline btn-sm">ورود به کلاس</button>
              <button onclick="viewExams(${full.id}, '${full.name}')" class="btn btn-primary btn-sm">آزمون‌ها</button>
              <div class="dropdown dropdown-open-r" data-trigger="both" style="display:inline-block;">
                <button class="btn btn-outline btn-sm dropdown-trigger">بیشتر ▾</button>
                <div class="dropdown-menu">
                  <a href="#" class="dropdown-item">جزئیات</a>
                  <a href="#" class="dropdown-item">لیست جلسات</a>
                  <div class="dropdown-divider"></div>
                  <a href="#" class="dropdown-item item-danger">حذف</a>
                </div>
              </div>
            </div>`
        }
      ],
      

      
      language: {
        "sSearch": "جستجو:",
        "sSearchPlaceholder": "جستجو در دروس...",
        "sLengthMenu": "نمایش _MENU_ رکورد",
        "sInfo": "نمایش _START_ تا _END_ از _TOTAL_",
        "oPaginate": {
          "sNext": "بعدی",
          "sPrevious": "قبلی"
        }
      },
      
      initComplete: function () {
        $('.dataTables_filter input').attr('class', 'input w-64');
        $('.dataTables_length select').attr('class', 'input w-20');
      
      },
      
      drawCallback: function () {
        $('.paginate_button').each(function () {
          $(this).attr('class', 'px-3 py-1 rounded border border-gray-300 mx-0.5 cursor-pointer');
        });
        $('.paginate_button.current').attr('class', 'px-3 py-1 rounded bg-primary text-white border-primary mx-0.5');
        $('.paginate_button.disabled').attr('class', 'px-3 py-1 rounded border border-gray-200 mx-0.5 opacity-50 cursor-not-allowed');
        $('.paginate_button.previous').text('قبلی');
        $('.paginate_button.next').text('بعدی');
        // Initialize any dropdowns created inside the table rows
        if (window.dropdownInit) window.dropdownInit();
      }
    });
  }
});