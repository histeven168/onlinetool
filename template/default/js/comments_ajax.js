class CommentSystem {
    constructor(options = {}) {
        this.config = {
            container: '.comments__list',
            typeid: 0,
            type: 'news',
			source_title: 'tool&article',
            source_uri: '/article/',
			loginNeeded: 1,
            ...options
        };
        this.init();
    }

    init() {
        this.container = document.querySelector(this.config.container);
		this.paginationContainer = document.querySelector(this.config.pagination);
        if (!this.container) return;

        this.loadComments();
        this.setupEventListeners();
    }

    async loadComments(page = this.config.currentPage) {
        try {
            const params = new URLSearchParams({
                typeid: this.config.typeid,
                type: this.config.type,
				loginNeeded: this.config.loginNeeded,
                page: page,
                per_page: 10 // 每页显示10条评论
            });
            
            const response = await fetch(`/?mod=comments&${params}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderComments(data.data);
                this.renderPagination(data.page, data.per_page, data.total || data.data.length);
                this.config.currentPage = data.page; // 更新当前页码
            } else {
                console.error('No comments:', data.message);
                //showToast('Failed to load comments', false);
            }
        } catch (error) {
            console.error('Comments loading error:', error);
            //showToast('Error loading comments', false);
        }
    }

    renderComments(comments) {
        let html = '';
        comments.forEach(comment => {
            html += this.renderComment(comment);
        });
        this.container.innerHTML = html || '';
    }
	
	renderPagination(currentPage, perPage, totalItems) {
        if (!this.paginationContainer) return;
        
        const totalPages = Math.ceil(totalItems / perPage);
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }

        let html = '<div class="comments__pagination">';
        

        // 页码按钮
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        if (startPage > 1) {
            html += `<button class="comments__page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                html += '<span class="pagination__ellipsis">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="comments__page-btn ${i === currentPage ? 'comments__page-btn--active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<span class="pagination__ellipsis">...</span>';
            }
            html += `<button class="comments__page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }


        html += '</div>';
        this.paginationContainer.innerHTML = html;
    }

    renderComment(comment) {
        const avatar = comment.face 
            ? `<img src="${comment.face}" alt="User Avatar">` 
            : comment.cname.charAt(0);
        
        const time = new Date(comment.pubtime * 1000).toLocaleString();
        
        let repliesHtml = '';
        if (comment.reply && comment.reply.length) {
            comment.reply.forEach(reply => {
                repliesHtml += this.renderReply(reply);
            });
        }

        return `
        <div class="comments__item" data-comment-id="${comment.id}">
            <div class="comments__avatar">${avatar}</div>
            <div class="comments__content">
                <div class="comments__header">
                    <span class="comments__author">${comment.cname}</span>
                    <span class="comments__date">${time}</span>
                </div>
                <p class="comments__text">${comment.content}</p>
                
                <div class="comments__actions">
                    <button class="comments__vote-btn" data-action="upvote" data-comment-id="${comment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="comments__vote-icon comments__vote-icon--up">
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
                        </svg>
                        <span class="comments__vote-count">${comment.up || 0}</span>
                    </button>
                    <button class="comments__vote-btn" data-action="downvote" data-comment-id="${comment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="comments__vote-icon comments__vote-icon--down">
                            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.58-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                        </svg>
                        <span class="comments__vote-count">${comment.down || 0}</span>
                    </button>
                    <button class="comments__reply-btn" data-comment-id="${comment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="comments__reply-icon">
                            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
                        </svg>
                        ${_LANG.reply}
                    </button>
                </div>
                
                <div class="comments__reply-list">
                    <div class="comments__reply-form" style="display:none;">
                        <form class="comments__form">
                            <input type="hidden" name="parentid" value="${comment.id}">
                            <input type="hidden" name="typeid" value="${this.config.typeid}">
                            <input type="hidden" name="type" value="${this.config.type}">
							<input type="hidden" name="source_title" value="${this.config.source_title}">
                            <input type="hidden" name="source_uri" value="${this.config.source_uri}">
                            <div class="comments__form-group">
                                <input placeholder="${_LANG.yourname}" type="text" name="comment_name" class="comments__form-input" required>
                            </div>
                            <div class="comments__form-group">
                                <textarea name="comment_message" class="comments__form-input" placeholder="${_LANG.yourcomment}..." required></textarea>
                            </div>
                            <div class="comments__form-actions">
                                <button type="submit" class="comments__form-submit">${_LANG.post}</button>
                                <button type="button" class="comments__form-cancel">${_LANG.cancel}</button>
                            </div>
                        </form>
                    </div>
                    ${repliesHtml}
                </div>
            </div>
        </div>`;
    }

    renderReply(reply, isNew = false) {
        const avatar = reply.face 
            ? `<img src="${reply.face}" alt="Reply Avatar">` 
            : reply.cname.charAt(0);
        
        const time = new Date(reply.pubtime * 1000).toLocaleString();
        
        return `
        <div class="comments__reply-item" data-reply-id="${reply.id}">
            <div class="comments__admin-reply">
                <div class="comments__admin-header">
                    <span class="comments__admin-name">
                        <div class="comments__reply-avatar">${avatar}</div>
                        ${reply.cname}
                        ${isNew ? '<span class="comments__under-review">'+_LANG.under_review+'</span>' : ''}
                    </span>
                    <span class="comments__reply-date">${time}</span>
                </div>
                <p class="comments__admin-text">${reply.content}</p>
                <div class="comments__actions">
                    <button class="comments__vote-btn" data-action="upvote" data-comment-id="${reply.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="comments__vote-icon comments__vote-icon--up">
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
                        </svg>
                        <span class="comments__vote-count">${reply.up || 0}</span>
                    </button>
                    <button class="comments__vote-btn" data-action="downvote" data-comment-id="${reply.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="comments__vote-icon comments__vote-icon--down">
                            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.58-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                        </svg>
                        <span class="comments__vote-count">${reply.down || 0}</span>
                    </button>
                </div>
            </div>
        </div>`;
    }

    setupEventListeners() {
        document.addEventListener('click', async (e) => {
			if (e.target.closest('.comments__page-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.comments__page-btn');
                const page = parseInt(btn.dataset.page);
                if (!isNaN(page)) {
                    this.loadComments(page);
                    // 滚动到评论区域顶部
                    //this.container.scrollIntoView({ behavior: 'smooth' });
					this.container.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
window.scrollBy(0, -100);
                }
            }
            // Vote handling
            if (e.target.closest('.comments__vote-btn')) {
                const btn = e.target.closest('.comments__vote-btn');
                const action = btn.dataset.action;
                const commentId = btn.dataset.commentId;
                const countEl = btn.querySelector('.comments__vote-count');
                
                // Immediate UI update
                const oldCount = parseInt(countEl.textContent);
                countEl.textContent = oldCount + 1;
                
                try {
                    const response = await fetch(wwwdomain+'/?mod=submitComment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `vote_action=${action}&comment_id=${commentId}`
                    });
                    
                    const result = await response.json();
                    if (!result.success) {
                        countEl.textContent = oldCount; // Rollback
                        console.error('Failed:', result.message);
                        showToast(_LANG.try_again_later+': ' + result.message, false);
                    } else {
                        showToast(_LANG.thankyou, true);
                    }
                } catch (error) {
                    countEl.textContent = oldCount; // Rollback
                    console.error('Error:', error);
                    showToast(_LANG.try_again_later+': ' + error.message, false);
                }
            }
            
            // Reply button
            if (e.target.closest('.comments__reply-btn')) {
                const btn = e.target.closest('.comments__reply-btn');
                const commentId = btn.dataset.commentId;
                const commentItem = btn.closest('.comments__item');
                const replyList = commentItem.querySelector('.comments__reply-list');
                
                // Hide other forms
                document.querySelectorAll('.comments__reply-form').forEach(f => {
                    if (f !== replyList.querySelector('.comments__reply-form')) {
                        f.style.display = 'none';
                    }
                });
                
                // Show current form
				if(iflogin==1 || this.config.loginNeeded !=1){
					let form = replyList.querySelector('.comments__reply-form');
					if (!form) {
						form = document.createElement('div');
						form.className = 'comments__reply-form';
						form.innerHTML = `
							<form class="comments__form">
								<input type="hidden" name="parentid" value="${commentId}">
								<input type="hidden" name="typeid" value="${this.config.typeid}">
								<input type="hidden" name="type" value="${this.config.type}">
								<div class="comments__form-group">
									<input placeholder="Your Name" type="text" name="comment_name" class="comments__form-input" required>
								</div>
								<div class="comments__form-group">
									<textarea name="comment_message" class="comments__form-input" placeholder="Write your reply..." required></textarea>
								</div>
								<div class="comments__form-actions">
									<button type="submit" class="comments__form-submit">${_LANG.post}</button>
									<button type="button" class="comments__form-cancel">${_LANG.cancel}</button>
								</div>
							</form>
						`;
						replyList.prepend(form);
					}
					form.style.display = 'block';
                	form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				}else{
					const loginDialog = setupLoginDialog();
					if (loginDialog) {
						loginDialog.show();
					}
				}
                
            }
            
            // Cancel reply
            if (e.target.closest('.comments__form-cancel')) {
                e.target.closest('.comments__reply-form').style.display = 'none';
            }
            
            // Submit reply
            if (e.target.closest('.comments__form-submit')) {
                e.preventDefault();
                const form = e.target.closest('form');
				const formContainer = form.closest('.comments__reply-form'); // 获取表单容器
                const submitBtn = e.target.closest('button');
                const commentId = form.querySelector('[name="parentid"]').value;
                const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
                const replyList = commentItem.querySelector('.comments__reply-list');
                
                // Get form values
                const nameInput = form.querySelector('[name="comment_name"]');
                const contentInput = form.querySelector('[name="comment_message"]');
                const name = nameInput.value.trim();
                const content = contentInput.value.trim();

                // 验证逻辑
                let validationPassed = true;
                let validationMessage = '';
                
                // 如果有外部验证函数
                if (typeof validateCommentForm === 'function') {
                    const validationResult = validateCommentForm(name, content);
                    if (!validationResult) {
                        validationMessage = validationResult.message || _LANG.try_again_later;
                        validationPassed = false;
                    }
                } 
                // 备用验证
                else {
                    if (!name) {
                        validationMessage = 'Please enter your name';
                        validationPassed = false;
                    } 
                    else if (!content) {
                        validationMessage = 'Please enter your comment';
                        validationPassed = false;
                    }
                }

                // 如果验证失败
                if (!validationPassed) {
                    showToast(validationMessage, false);
                    if (!name) nameInput.focus();
                    else if (!content) contentInput.focus();
                    return false;
                }

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> '+_LANG.submitting;
                
                try {
                    // 立即显示回复(带"审核中"标签)
                    replyList.insertAdjacentHTML('afterbegin', this.renderReply({
                        id: 'new-' + Date.now(),
                        cname: name,
                        content: content,
                        pubtime: Math.floor(Date.now() / 1000),
                        up: 0,
                        down: 0,
                        face: ''
                    }, true));

                    // 准备提交数据
                    const formData = new FormData(form);
                    
                    // 提交到服务器
                    const response = await fetch(wwwdomain+'/?mod=submitComment', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (!result.success) {
                        throw new Error(result.message || _LANG.try_again_later);
                    }
                    
                    // 成功提交后重置表单
                    form.reset();
                    formContainer.style.display = 'none';
                    showToast(_LANG.submitted, true);
                    
                } catch (error) {
                    console.error('Error:', error);
                    showToast(_LANG.try_again_later, false);
                    
                    // 可以在这里添加回滚UI的代码
                    // 例如移除刚添加的回复
                    const newReply = replyList.querySelector('[data-reply-id^="new-"]');
                    if (newReply) {
                        newReply.remove();
                    }
                    
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = _LANG.post;
                }
            }
        });
    }
}