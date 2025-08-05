// Form Validation (Length checks only)
function validateCommentForm(name, content) {
    // Name validation
    if (!name || name.length < 3) {
        showToast(_LANG.at_least_3, false);
        return false;
    }
    
    if (name.length > 20) {
        showToast('Name cannot exceed 20 characters', false);
        return false;
    }
    
    // Content validation
    if (!content || content.length < 10) {
        showToast(_LANG.at_least_10, false);
        return false;
    }
    
    if (content.length > 500) {
        showToast('Comment cannot exceed 500 characters', false);
        return false;
    }
    
    return true;
}

// Form Submission Handler
document.getElementById('commentForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput = form.querySelector('#comment_name');
    const commentInput = form.querySelector('#comment_message');
    
    // Validate form
    if (!validateCommentForm(nameInput.value, commentInput.value)) {
        return;
    }
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = _LANG.submitting;
    
    try {
        const formData = new FormData(form);
        
        const response = await fetch(wwwdomain+'/?mod=submitComment', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) throw new Error(_LANG.try_again_later);
        
        const result = await response.json();
        
        if (result.success) {
            showToast(_LANG.submitted, true);
            addCommentToUI(nameInput.value, commentInput.value);
            commentInput.value = '';
        } else {
            throw new Error(result.message || _LANG.try_again_later);
        }
    } catch (error) {
        //showToast(error.message || _LANG.try_again_later, false);
		showToast(error.message === '-1' ? _LANG.voted_today :error.message ? error.message :_LANG.try_again_later,false);
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = _LANG.leaveacomment;
    }
});

// 表单验证函数（示例）
function validateCommentForm(name, content) {
    if (!name || name.length < 3) {
        showToast(_LANG.at_least_3, false);
        return false;
    }
    
    if (!content || content.length < 10) {
        showToast(_LANG.at_least_10, false);
        return false;
    }
    
    return true;
}

// 添加评论到UI的函数
function addCommentToUI(name, content) {
    const commentsContainer = document.querySelector('.comments__list') || 
                             document.querySelector('.comments');
    if (!commentsContainer) return;
    
    const newComment = document.createElement('div');
    newComment.className = 'comments__item';
    newComment.innerHTML = `
        <div class="comments__avatar">${name.charAt(0).toUpperCase()}</div>
        <div class="comments__content">
            <div class="comments__header">
                <span class="comments__author">${name}<span class="comments__under-review">${_LANG.under_review}</span></span>
                <span class="comments__date">${_LANG.just_now}</span>
            </div>
            <p class="comments__text">${content}</p>
        </div>
    `;
    
    commentsContainer.prepend(newComment);
}

// Rate limiting (10 seconds between submissions)
let lastSubmitTime = 0;
document.getElementById('commentForm')?.addEventListener('submit', function(e) {
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
        e.preventDefault();
        showToast(_LANG.try_again_later, false);
        return false;
    }
    lastSubmitTime = now;
});

// Character counters setup
function setupCharCounters() {
    // Comment character counter
    const commentInput = document.getElementById('comment_message');
    if (commentInput) {
        const counter = document.createElement('div');
        counter.id = 'comment-char-count';
        counter.style.fontSize = '12px';
        counter.style.color = '#666';
        counter.style.marginTop = '5px';
        commentInput.parentNode.appendChild(counter);
        
        commentInput.addEventListener('input', function(e) {
            const charCount = e.target.value.length;
            counter.textContent = `${charCount}/500 characters`;
            counter.style.color = charCount > 500 ? 'red' : '#666';
        });
    }
    
    // Name character counter
    const nameInput = document.getElementById('comment_name');
    if (nameInput) {
        const counter = document.createElement('div');
        counter.id = 'name-char-count';
        counter.style.fontSize = '12px';
        counter.style.color = '#666';
        counter.style.marginTop = '5px';
        nameInput.parentNode.appendChild(counter);
        
        nameInput.addEventListener('input', function(e) {
            const charCount = e.target.value.length;
            counter.textContent = `${charCount}/20 characters`;
            counter.style.color = charCount > 20 ? 'red' : '#666';
        });
    }
}

// Initialize character counters
document.addEventListener('DOMContentLoaded', setupCharCounters);