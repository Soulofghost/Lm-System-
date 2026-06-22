const modules = [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard.html', icon: 'D' },
    { key: 'categories', label: 'Categories', href: '/categories.html', icon: 'C' },
    { key: 'authors', label: 'Authors', href: '/authors.html', icon: 'A' },
    { key: 'publishers', label: 'Publishers', href: '/publishers.html', icon: 'P' },
    { key: 'books', label: 'Books', href: '/books.html', icon: 'B' },
    { key: 'members', label: 'Members', href: '/members.html', icon: 'M' },
    { key: 'issue', label: 'Issue Book', href: '/issue-book.html', icon: 'I' },
    { key: 'return', label: 'Return Book', href: '/return-book.html', icon: 'R' }
];

const page = document.body.dataset.page;
let dataTable;
let currentRows = [];

document.addEventListener('DOMContentLoaded', async () => {
    renderShell();
    await loadCurrentUser();
    routePage();
});

function renderShell() {
    const active = item => item.key === page ? 'active' : '';
    document.getElementById('appShell').innerHTML = `
        <div class="app-shell d-flex">
            <aside class="sidebar">
                <div class="sidebar-brand d-flex align-items-center justify-content-between">
                    <div>
                        <div class="h4 mb-0">LMS</div>
                        <small>Catalog Terminal</small>
                    </div>
                </div>
                <nav class="nav flex-column gap-1">
                    ${modules.map(item => `<a class="nav-link ${active(item)}" href="${item.href}">${item.label}</a>`).join('')}
                </nav>
            </aside>
            <main class="content-area">
                <div class="app-window">
                    <div class="retro-titlebar">
                        <span id="pageTitle">${titleFor(page)}</span>
                        <span class="retro-controls"><span>_</span><span>[]</span><span>x</span></span>
                    </div>
                    <div class="menubar"><span>File</span><span>Records</span><span>Circulation</span><span>Reports</span><span>Help</span></div>
                    <div class="topbar px-3 py-2 d-flex gap-3 align-items-center justify-content-between">
                        <div>
                            <div class="fw-semibold">Central Library Desk</div>
                            <div class="small text-secondary" id="userLabel">Signed in</div>
                        </div>
                        <form method="post" action="/logout">
                            <button class="btn btn-outline-danger btn-sm" type="submit">Logout</button>
                        </form>
                    </div>
                    <div class="content-pad" id="content"></div>
                    <div class="statusbar"><span>Ready</span><span>Fine rule: 14 days, $1/day</span></div>
                </div>
            </main>
        </div>
    `;
}

async function loadCurrentUser() {
    try {
        const user = await api('/api/auth/me');
        document.getElementById('userLabel').textContent = `${user.fullName || user.username} (${user.role || 'USER'})`;
    } catch {
        document.getElementById('userLabel').textContent = 'Signed in';
    }
}

function routePage() {
    if (page === 'dashboard') return renderDashboard();
    if (page === 'categories') return renderCrudPage({
        title: 'Category Management',
        endpoint: '/api/categories',
        fields: [
            { name: 'name', label: 'Category Name', required: true },
            { name: 'description', label: 'Description', type: 'textarea' }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'name', title: 'Name' },
            { data: 'description', title: 'Description', defaultContent: '' }
        ]
    });
    if (page === 'authors') return renderCrudPage({
        title: 'Author Management',
        endpoint: '/api/authors',
        fields: [
            { name: 'name', label: 'Author Name', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone' },
            { name: 'biography', label: 'Biography', type: 'textarea' }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'name', title: 'Name' },
            { data: 'email', title: 'Email', defaultContent: '' },
            { data: 'phone', title: 'Phone', defaultContent: '' }
        ]
    });
    if (page === 'publishers') return renderCrudPage({
        title: 'Publisher Management',
        endpoint: '/api/publishers',
        fields: [
            { name: 'name', label: 'Publisher Name', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone' },
            { name: 'address', label: 'Address', type: 'textarea' }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'name', title: 'Name' },
            { data: 'email', title: 'Email', defaultContent: '' },
            { data: 'phone', title: 'Phone', defaultContent: '' }
        ]
    });
    if (page === 'books') return renderBooksPage();
    if (page === 'members') return renderCrudPage({
        title: 'Member Management',
        endpoint: '/api/members',
        fields: [
            { name: 'memberCode', label: 'Member ID', required: true },
            { name: 'fullName', label: 'Full Name', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone' },
            { name: 'address', label: 'Address', type: 'textarea' },
            { name: 'membershipDate', label: 'Membership Date', type: 'date' },
            { name: 'active', label: 'Active', type: 'checkbox' }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'memberCode', title: 'Member ID' },
            { data: 'fullName', title: 'Name' },
            { data: 'email', title: 'Email', defaultContent: '' },
            { data: 'phone', title: 'Phone', defaultContent: '' },
            { data: 'active', title: 'Status', render: value => value ? 'Active' : 'Inactive' }
        ],
        defaults: { membershipDate: today(), active: true }
    });
    if (page === 'issue') return renderIssuePage();
    if (page === 'return') return renderReturnPage();
}

function renderDashboard() {
    document.getElementById('content').innerHTML = `
        <section class="mb-4">
            <div class="retro-stamp mb-3">CLASSICAL LIBRARY MANAGEMENT SYSTEM</div>
            <h1 class="h3 fw-bold">Welcome to the Library Dashboard</h1>
            <p class="text-secondary mb-0">Use the terminal modules below to manage catalog records, members, and circulation.</p>
        </section>
        <div class="row g-3">
            ${modules.filter(m => m.key !== 'dashboard').map(m => `
                <div class="col-12 col-sm-6 col-xl-3">
                    <a class="module-card d-block" href="${m.href}">
                        <span class="module-icon mb-3">${m.icon}</span>
                        <h2 class="h5 mb-1">${m.label}</h2>
                        <p class="text-secondary mb-0 small">${moduleDescription(m.key)}</p>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
}

async function renderCrudPage(config) {
    document.getElementById('content').innerHTML = crudLayout(config.title);
    document.getElementById('entityForm').innerHTML = fieldsHtml(config.fields);
    document.getElementById('addBtn').addEventListener('click', () => openForm(config));
    document.getElementById('entityForm').addEventListener('submit', event => saveEntity(event, config));
    await loadCrudRows(config);
}

async function renderBooksPage() {
    const [categories, authors, publishers] = await Promise.all([
        api('/api/categories'), api('/api/authors'), api('/api/publishers')
    ]);
    const config = {
        title: 'Book Management',
        endpoint: '/api/books',
        fields: [
            { name: 'title', label: 'Book Title', required: true },
            { name: 'isbn', label: 'ISBN' },
            { name: 'categoryId', label: 'Category', type: 'select', required: true, options: categories.map(item => ({ value: item.id, text: item.name })) },
            { name: 'authorId', label: 'Author', type: 'select', required: true, options: authors.map(item => ({ value: item.id, text: item.name })) },
            { name: 'publisherId', label: 'Publisher', type: 'select', required: true, options: publishers.map(item => ({ value: item.id, text: item.name })) },
            { name: 'edition', label: 'Edition' },
            { name: 'publicationYear', label: 'Publication Year', type: 'number' },
            { name: 'totalCopies', label: 'Total Copies', type: 'number', required: true },
            { name: 'availableCopies', label: 'Available Copies', type: 'number', required: true },
            { name: 'shelfLocation', label: 'Shelf Location' }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'title', title: 'Title' },
            { data: 'isbn', title: 'ISBN', defaultContent: '' },
            { data: 'category.name', title: 'Category', defaultContent: '' },
            { data: 'author.name', title: 'Author', defaultContent: '' },
            { data: 'publisher.name', title: 'Publisher', defaultContent: '' },
            { data: 'availableCopies', title: 'Available' }
        ],
        defaults: { totalCopies: 1, availableCopies: 1 },
        mapToForm: row => ({
            ...row,
            categoryId: row.category?.id,
            authorId: row.author?.id,
            publisherId: row.publisher?.id
        })
    };
    document.getElementById('content').innerHTML = crudLayout(config.title);
    document.getElementById('entityForm').innerHTML = fieldsHtml(config.fields);
    document.getElementById('addBtn').addEventListener('click', () => openForm(config));
    document.getElementById('entityForm').addEventListener('submit', event => saveEntity(event, config));
    await loadCrudRows(config);
}

async function renderIssuePage() {
    const [books, members] = await Promise.all([api('/api/books'), api('/api/members')]);
    document.getElementById('content').innerHTML = `
        ${alertHtml()}
        <div class="row g-3">
            <div class="col-lg-4">
                <div class="page-card">
                    <h1 class="h4 mb-3">Issue Book</h1>
                    <form id="issueForm">
                        ${selectField('memberId', 'Member ID', members.filter(m => m.active).map(m => ({ value: m.id, text: `${m.memberCode} - ${m.fullName}` })), true)}
                        ${selectField('bookId', 'Book ID', books.filter(b => b.availableCopies > 0).map(b => ({ value: b.id, text: `${b.id} - ${b.title} (${b.availableCopies} available)` })), true)}
                        ${inputField({ name: 'issueDate', label: 'Issue Date', type: 'date' })}
                        <button class="btn btn-primary w-100" type="submit">Issue Book</button>
                    </form>
                </div>
            </div>
            <div class="col-lg-8"><div class="page-card"><table id="dataTable" class="table table-striped"></table></div></div>
        </div>`;
    document.getElementById('issueDate').value = today();
    document.getElementById('issueForm').addEventListener('submit', async event => {
        event.preventDefault();
        await api('/api/issues', { method: 'POST', body: formPayload(event.target) });
        await renderIssuePage();
        showAlert('Book issued successfully.', 'success');
    });
    await loadIssueTable('/api/issues');
}

async function renderReturnPage() {
    const issues = await api('/api/issues/open');
    document.getElementById('content').innerHTML = `
        ${alertHtml()}
        <div class="row g-3">
            <div class="col-lg-4">
                <div class="page-card">
                    <h1 class="h4 mb-3">Return Book</h1>
                    <form id="returnForm">
                        ${selectField('issueId', 'Issued Record', issues.map(i => ({ value: i.id, text: `#${i.id} - ${i.book.title} to ${i.member.fullName}` })), true)}
                        ${inputField({ name: 'returnDate', label: 'Return Date', type: 'date' })}
                        <button class="btn btn-primary w-100" type="submit">Process Return</button>
                    </form>
                </div>
            </div>
            <div class="col-lg-8"><div class="page-card"><table id="dataTable" class="table table-striped"></table></div></div>
        </div>`;
    document.getElementById('returnDate').value = today();
    document.getElementById('returnForm').addEventListener('submit', async event => {
        event.preventDefault();
        const result = await api('/api/issues/return', { method: 'POST', body: formPayload(event.target) });
        await renderReturnPage();
        showAlert(`Book returned. Days kept: ${result.daysKept}. Fine: $${Number(result.fineAmount).toFixed(2)}.`, 'success');
    });
    await loadIssueTable('/api/issues/open');
}

function crudLayout(title) {
    return `
        ${alertHtml()}
        <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            <div>
                <h1 class="h3 fw-bold mb-1">${title}</h1>
                <p class="text-secondary mb-0">Create, search, edit, and delete records.</p>
            </div>
            <button class="btn btn-primary" id="addBtn" type="button">Add New</button>
        </div>
        <div class="page-card"><table id="dataTable" class="table table-striped align-middle"></table></div>
        <div class="modal fade" id="entityModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <form id="entityForm"></form>
                </div>
            </div>
        </div>`;
}

async function loadCrudRows(config) {
    currentRows = await api(config.endpoint);
    const columns = [
        ...config.columns,
        {
            data: null,
            title: 'Actions',
            orderable: false,
            render: row => `
                <button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-id="${row.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${row.id}">Delete</button>`
        }
    ];
    if (dataTable) dataTable.destroy();
    dataTable = new DataTable('#dataTable', { data: currentRows, columns });
    document.getElementById('dataTable').addEventListener('click', event => handleTableAction(event, config));
}

function openForm(config, row = null) {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('entityModal'));
    const form = document.getElementById('entityForm');
    const values = row ? (config.mapToForm ? config.mapToForm(row) : row) : (config.defaults || {});
    form.dataset.id = row?.id || '';
    form.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title h5">${row ? 'Edit' : 'Add'} Record</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body row g-3">${fieldsHtml(config.fields, values)}</div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
        </div>`;
    modal.show();
}

async function saveEntity(event, config) {
    event.preventDefault();
    const id = event.target.dataset.id;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${config.endpoint}/${id}` : config.endpoint;
    await api(url, { method, body: formPayload(event.target) });
    bootstrap.Modal.getInstance(document.getElementById('entityModal')).hide();
    showAlert('Record saved successfully.', 'success');
    await loadCrudRows(config);
}

async function handleTableAction(event, config) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = Number(button.dataset.id);
    const row = currentRows.find(item => item.id === id);
    if (button.dataset.action === 'edit') {
        openForm(config, row);
    }
    if (button.dataset.action === 'delete' && confirm('Delete this record?')) {
        await api(`${config.endpoint}/${id}`, { method: 'DELETE' });
        showAlert('Record deleted.', 'success');
        await loadCrudRows(config);
    }
}

async function loadIssueTable(endpoint) {
    currentRows = await api(endpoint);
    if (dataTable) dataTable.destroy();
    dataTable = new DataTable('#dataTable', {
        data: currentRows,
        columns: [
            { data: 'id', title: 'Issue ID' },
            { data: 'member.memberCode', title: 'Member ID' },
            { data: 'member.fullName', title: 'Member' },
            { data: 'book.id', title: 'Book ID' },
            { data: 'book.title', title: 'Book' },
            { data: 'issueDate', title: 'Issue Date' },
            { data: 'dueDate', title: 'Due Date' },
            { data: 'returnDate', title: 'Return Date', defaultContent: '' },
            { data: 'fineAmount', title: 'Fine', render: value => `$${Number(value || 0).toFixed(2)}` },
            { data: 'status', title: 'Status' }
        ]
    });
}

function fieldsHtml(fields, values = {}) {
    return fields.map(field => {
        if (field.type === 'textarea') return textareaField(field, values[field.name]);
        if (field.type === 'select') return selectField(field.name, field.label, field.options || [], field.required, values[field.name]);
        if (field.type === 'checkbox') return checkboxField(field, values[field.name]);
        return inputField(field, values[field.name]);
    }).join('');
}

function inputField(field, value = '') {
    return `
        <div class="col-md-6">
            <label class="form-label" for="${field.name}">${field.label}</label>
            <input id="${field.name}" name="${field.name}" type="${field.type || 'text'}" class="form-control" value="${escapeHtml(value ?? '')}" ${field.required ? 'required' : ''}>
        </div>`;
}

function textareaField(field, value = '') {
    return `
        <div class="col-12">
            <label class="form-label" for="${field.name}">${field.label}</label>
            <textarea id="${field.name}" name="${field.name}" class="form-control" rows="3" ${field.required ? 'required' : ''}>${escapeHtml(value ?? '')}</textarea>
        </div>`;
}

function selectField(name, label, options, required = false, value = '') {
    return `
        <div class="col-md-6 mb-3">
            <label class="form-label" for="${name}">${label}</label>
            <select id="${name}" name="${name}" class="form-select" ${required ? 'required' : ''}>
                <option value="">Select ${label}</option>
                ${options.map(option => `<option value="${option.value}" ${String(option.value) === String(value) ? 'selected' : ''}>${escapeHtml(option.text)}</option>`).join('')}
            </select>
        </div>`;
}

function checkboxField(field, value = false) {
    return `
        <div class="col-md-6 d-flex align-items-end">
            <div class="form-check mb-2">
                <input id="${field.name}" name="${field.name}" type="checkbox" class="form-check-input" ${value ? 'checked' : ''}>
                <label class="form-check-label" for="${field.name}">${field.label}</label>
            </div>
        </div>`;
}

function formPayload(form) {
    const payload = {};
    new FormData(form).forEach((value, key) => {
        payload[key] = value === '' ? null : value;
    });
    form.querySelectorAll('input[type="checkbox"]').forEach(input => {
        payload[input.name] = input.checked;
    });
    return payload;
}

async function api(url, options = {}) {
    const response = await fetch(url, {
        method: options.method || 'GET',
        headers: options.body ? { 'Content-Type': 'application/json' } : {},
        body: options.body ? JSON.stringify(options.body) : undefined
    });
    if (response.redirected && response.url.includes('login.html')) {
        location.href = response.url;
        return;
    }
    if (!response.ok) {
        let message = 'Something went wrong.';
        try {
            const error = await response.json();
            message = error.message || message;
        } catch {}
        showAlert(message, 'danger');
        throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
}

function alertHtml() {
    return '<div id="pageAlert" class="alert d-none" role="alert"></div>';
}

function showAlert(message, type) {
    const alert = document.getElementById('pageAlert');
    if (!alert) return;
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
}

function titleFor(key) {
    return modules.find(item => item.key === key)?.label || 'Library Management';
}

function moduleDescription(key) {
    return {
        categories: 'Organize books by subject and genre.',
        authors: 'Maintain author profiles and contact details.',
        publishers: 'Manage publishing companies and addresses.',
        books: 'Add inventory and connect books to catalog data.',
        members: 'Register and update library subscribers.',
        issue: 'Assign available books to active members.',
        return: 'Close issued records and calculate late fines.'
    }[key] || '';
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
