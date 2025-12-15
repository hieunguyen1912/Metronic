document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form.m-form');
    const submitBtn = document.querySelector('button[type="submit"]');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('title-input');
            const content = document.getElementById('content-input');
            const status = document.getElementById('status-input');

            clearErrors();

            let isValid = true;
            let errors = [];

            if (!title || !title.value.trim()) {
                isValid = false;
                errors.push('title is required');
                showError(title, 'title is required');
            } else if (title.value.trim().length < 3) {
                isValid = false;
                errors.push('at least 3 character');
                showError(title, 'at least 3 character');
            } else {
                clearError(title);
            }

            if (!content || !content.value.trim()) {
                isValid = false;
                errors.push('content is required');
                showError(content, 'content is required');
            } else if (content.value.trim().length < 10) {
                isValid = false;
                errors.push('at least 10 character');
                showError(content, 'at least 10 character');
            } else {
                clearError(content);
            }

            if (!status || !status.value || status.value.trim() === '') {
                isValid = false;
                errors.push('status is required');
                showError(status, 'status is required');
            } else if (status.value !== 'DRAFT' && status.value !== 'PUBLISHED') {
                isValid = false;
                errors.push('Status must be DRAFT or PUBLISHED');
                showError(status, 'Status must be DRAFT or PUBLISHED');
            } else {
                clearError(status);
            }

            if (!isValid) {
                const alertDiv = document.getElementById('m_form_1_msg');
                if (alertDiv) {
                    alertDiv.querySelector('.m-alert__text').textContent = 
                        'Please fix the following errors:\n\n' + errors.join('\n');
                    alertDiv.classList.remove('m--hide');
                }
                return false;
            }

            const alertDiv = document.getElementById('m_form_1_msg');
            if (alertDiv) {
                alertDiv.classList.add('m--hide');
            }

            const formData = {
                title: title.value.trim(),
                content: content.value.trim(),
                status: status.value
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }

            fetch('http://localhost:8080/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Validate';
                }
                
            alert('Form submitted successfully!\n\n' +
                    'Title: ' + data.title +
                    '\n\nContent: ' + data.content.substring(0, 50) + '...' +
                    '\n\nStatus: ' + data.status);
                
                form.reset();
                
                if (status && typeof $ !== 'undefined' && $.fn.selectpicker) {
                    $(status).selectpicker('refresh');
                }
            })
            .catch(error => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Validate';
                }

                let errorMessages = [];
                
                if (error.errors) {
                    Object.keys(error.errors).forEach(field => {
                        const fieldErrors = error.errors[field];
                        const fieldElement = getFieldElement(field);
                        
                        if (fieldElement) {
                            if (Array.isArray(fieldErrors)) {
                                showError(fieldElement, fieldErrors[0]);
                                errorMessages.push(field + ': ' + fieldErrors[0]);
                            } else {
                                showError(fieldElement, fieldErrors);
                                errorMessages.push(field + ': ' + fieldErrors);
                            }
                        }
                    });
                } else if (error.message) {
                    errorMessages.push(error.message);
                } else {
                    errorMessages.push('An error occurred while submitting the form');
                }

                const alertDiv = document.getElementById('m_form_1_msg');
                if (alertDiv) {
                    alertDiv.querySelector('.m-alert__text').textContent = 
                        'Error: ' + errorMessages.join('\n');
                    alertDiv.classList.remove('m--hide');
                }
            });
        });

        const title = document.getElementById('title-input');
        const content = document.getElementById('content-input');
        const status = document.getElementById('status-input');

        if (title) {
            title.addEventListener('blur', function () {
                if (this.value.trim() === '') {
                    showError(this, 'title is required');
                } else if (this.value.trim().length < 3) {
                    showError(this, 'at least 3 character');
                } else {
                    clearError(this);
                }
            });
        }

        if (content) {
            content.addEventListener('blur', function () {
                if (this.value.trim() === '') {
                    showError(this, 'content is required');
                } else if (this.value.trim().length < 10) {
                    showError(this, 'at least 10 character');
                } else {
                    clearError(this);
                }
            });
        }

        if (status) {
            status.addEventListener('change', function () {
                if (!this.value || this.value.trim() === '') {
                    showError(this, 'status is required');
                } else if (this.value !== 'DRAFT' && this.value !== 'PUBLISHED') {
                    showError(this, 'Status must be DRAFT or PUBLISHED');
                } else {
                    clearError(this);
                }
            });
        }
    }

    function showError(field, message) {
        field.classList.add('is-invalid');
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }

    function clearError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
    }

    function clearErrors() {
        const fields = ['title-input', 'content-input', 'status-input'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                clearError(field);
            }
        });
    }

    function getFieldElement(fieldName) {
        const fieldMap = {
            'title': 'title-input',
            'content': 'content-input',
            'status': 'status-input'
        };
        
        const fieldId = fieldMap[fieldName];
        return fieldId ? document.getElementById(fieldId) : null;
    }

    initializePostsDatatable();
});

function initializePostsDatatable() {
    if ($('#json_data').length === 0) {
        return;
    }

    var customQuery = {
        search: '',
        status: ''
    };

    var originalAjax = $.ajax;
    var datatableRef = null;
    
    $.ajax = function(options) {
        if (options.url && (options.url.indexOf('localhost:8080/posts') !== -1 || options.url.indexOf('/posts') !== -1)) {
            var page = 1;
            var perPage = 5;
            
            if (datatableRef && datatableRef.paging && datatableRef.paging.meta) {
                page = parseInt(datatableRef.paging.meta.page) || 1;
                perPage = parseInt(datatableRef.paging.meta.perpage) || 5;
            }
            else if (options.data && options.data.pagination) {
                page = parseInt(options.data.pagination.page) || 1;
                perPage = parseInt(options.data.pagination.perpage) || 5;
            }
            else if (datatableRef) {
                try {
                    var query = datatableRef.getDataSourceQuery();
                    if (query && query.pagination) {
                        page = parseInt(query.pagination.page) || 1;
                        perPage = parseInt(query.pagination.perpage) || 5;
                    } else if (query && query.page) {
                        page = parseInt(query.page) || 1;
                        perPage = parseInt(query.perPage) || 5;
                    }
                } catch(e) {
                }
            }
            
            var search = customQuery.search || '';
            var status = customQuery.status || '';
            
            var url = 'http://localhost:8080/posts?page=' + page + '&size=' + perPage;
            if (search) {
                url += '&search=' + encodeURIComponent(search);
            }
            if (status) {
                url += '&status=' + encodeURIComponent(status);
            }
            
            options.url = url;
            options.data = {};
        }
        return originalAjax.call(this, options);
    };

    var datatable = $('#json_data').mDatatable({
        data: {
            type: 'remote',
            source: {
                read: {
                    url: 'http://localhost:8080/posts',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        query: {
                            page: '',
                            size: '',
                            search: '',
                            status: ''
                        }
                    },
                    map: function(raw) {
                        raw.meta = {
                            page: parseInt(raw.page) || 1,
                            pages: parseInt(raw.totalPages) || 1,
                            perpage: parseInt(raw.size) || 5,
                            total: parseInt(raw.totalElements) || 0
                        };
                        
                        var dataSet = raw.data || [];
                        return dataSet;
                    }
                }
            },
            pageSize: 5,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            saveState: {
                cookie: false,
                webstorage: true
            }
        },

        layout: {
            theme: 'default',
            class: '',
            scroll: false,
            height: null,
            footer: false
        },

        sortable: false,

        toolbar: {
            placement: ['bottom'],
            items: {
                pagination: {
                    pageSizeSelect: [5, 10, 20, 30, 50]
                }
            }
        },

        search: {
            input: $('#generalSearch'),
            onEnter: true,
            delay: 400
        },

        columns: [{
            field: "id",
            title: "ID",
            width: 60,
            textAlign: 'center',
            sortable: false
        }, {
            field: "title",
            title: "Title",
            width: 200,
            template: function(row) {
                return '<span class="m--font-bold m--font-primary">' + row.title + '</span>';
            }
        }, {
            field: "content",
            title: "Content",
            width: 400,
            template: function(row) {
                var content = row.content || '';
                if (content.length > 100) {
                    content = content.substring(0, 100) + '...';
                }
                return content;
            }
        }, {
            field: "status",
            title: "Status",
            width: 120,
            template: function(row) {
                var statusClass = row.status === 'PUBLISHED' ? 'm-badge--success' : 'm-badge--warning';
                return '<span class="m-badge ' + statusClass + ' m-badge--wide">' + row.status + '</span>';
            }
        }, {
            field: "createdAt",
            title: "Created At",
            width: 180,
            template: function(row) {
                if (row.createdAt) {
                    var date = new Date(row.createdAt);
                    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                }
                return '';
            }
        }, {
            field: "Actions",
            width: 110,
            title: "Actions",
            sortable: false,
            overflow: 'visible',
            template: function (row, index, datatable) {
                var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                return '\
                    <div class="dropdown ' + dropup + '">\
                        <a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                            <i class="la la-ellipsis-h"></i>\
                        </a>\
                        <div class="dropdown-menu dropdown-menu-right">\
                            <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
                            <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
                            <a class="dropdown-item" href="#"><i class="la la-trash"></i> Delete</a>\
                        </div>\
                    </div>\
                ';
            }
        }]
    });
    
    datatableRef = datatable;
    
    
    $(datatable).on('m-datatable--on-goto-page', function(e, meta) {
        if (datatableRef && datatableRef.paging && datatableRef.paging.meta) {
            datatableRef.paging.meta.page = meta.page;
            datatableRef.paging.meta.pages = meta.pages;
            datatableRef.paging.meta.perpage = meta.perpage;
            datatableRef.paging.meta.total = meta.total;
        }
        
        setTimeout(function() {
            datatableRef.reload();
        }, 50);
    });
    
    $(document).on('click', '.m-datatable__pager-link-number, .m-datatable__pager-link--prev, .m-datatable__pager-link--next', function(e) {
        var page = $(this).attr('data-page');
        if (page) {
            if (datatableRef && datatableRef.paging && datatableRef.paging.meta) {
                datatableRef.paging.meta.page = parseInt(page);
            }
            setTimeout(function() {
                if (datatableRef) {
                    datatableRef.reload();
                }
            }, 100);
        }
    });

    $('#m_form_status').on('change', function() {
        customQuery.status = $(this).val() || '';
        datatable.setDataSourceQuery({
            page: 1
        });
        datatable.reload();
    });

    var searchTimeout;
    $('#generalSearch').on('keyup', function() {
        clearTimeout(searchTimeout);
        var self = this;
        searchTimeout = setTimeout(function() {
            customQuery.search = $(self).val() || '';
            datatable.setDataSourceQuery({
                page: 1
            });
            datatable.reload();
        }, 400);
    });

    if (typeof $ !== 'undefined' && $.fn.selectpicker) {
        $('#m_form_status').selectpicker();
    }
}
