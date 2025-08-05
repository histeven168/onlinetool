document.addEventListener('DOMContentLoaded', function() {
	const fullscreenBtn = document.getElementById('fullscreenBtn');
	const toolContainer = document.getElementById('toolContainer');
	if(fullscreenBtn && toolContainer) {
    fullscreenBtn.addEventListener('click', function() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (!isIOS && toolContainer.requestFullscreen) {
            if (!document.fullscreenElement) {
                toolContainer.requestFullscreen()
                    .then(() => {
                        const icon = this.querySelector('i');
                        icon.classList.replace('fa-expand', 'fa-compress');
                        this.innerHTML = '<i class="fas fa-compress"></i>'+_LANG.exitfullscreen;
                        document.body.style.overflow = 'hidden';
                        const existingToast = document.querySelector('.toast');
						const existingToastDialog = document.querySelector('.toast-dialog');
                        if (existingToast) {
                            toolContainer.appendChild(existingToast);
                        }
						if (existingToastDialog) {
                            toolContainer.appendChild(existingToastDialog);
                        }
                    })
                    .catch(err => {
                        console.error('Error attempting to enable fullscreen:', err);
                        toggleContainerFullscreen(this);
                    });
            } else {
                document.exitFullscreen()
                    .then(() => {
                        const icon = this.querySelector('i');
                        icon.classList.replace('fa-compress', 'fa-expand');
                        this.innerHTML = '<i class="fas fa-expand"></i> '+_LANG.fullscreen;
                        document.body.style.overflow = 'auto';
                        
                        // Move toast back to body if needed
                        const existingToast = toolContainer.querySelector('.toast');
						const existingToastDialog = toolContainer.querySelector('.toast-dialog');
                        if (existingToast) {
                            document.body.appendChild(existingToast);
                        }
                        if (existingToastDialog) {
                            document.body.appendChild(existingToastDialog);
                        }
                    });
            }
        } else {
            toggleContainerFullscreen(this);
        }
    });
}

function toggleContainerFullscreen(button) {
    toolContainer.classList.toggle('fullscreen');
    const icon = button.querySelector('i');
    if (toolContainer.classList.contains('fullscreen')) {
        icon.classList.replace('fa-expand', 'fa-compress');
        button.innerHTML = '<i class="fas fa-compress"></i>'+_LANG.exitfullscreen;
        document.body.style.overflow = 'hidden';

        toolContainer.offsetHeight;
    } else {
        icon.classList.replace('fa-compress', 'fa-expand');
        button.innerHTML = '<i class="fas fa-expand"></i> '+_LANG.fullscreen;
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        const icon = fullscreenBtn.querySelector('i');
        if (icon.classList.contains('fa-compress')) {
            icon.classList.replace('fa-compress', 'fa-expand');
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> '+_LANG.fullscreen;
            document.body.style.overflow = 'auto';
        }
    }
});
            const copyBtn = document.querySelector('.copy-btn');
            if(copyBtn) {
                copyBtn.addEventListener('click', function() {
                    const urlInput = document.querySelector('.share-url input');
                    urlInput.select();

                    document.execCommand('copy');
                    
                    const originalText = this.textContent;
                    showToast(_LANG.copied,true);
                });
            }
	const shareButtons = document.querySelectorAll('.share-btn');
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList[1];
            switch(platform) {
                case 'twitter':
                    const modifiedTitle = pageTitle.replace(/\.co/g, '_co');
					window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(modifiedTitle)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(pageTitle)}`, '_blank');
                    break;
                case 'whatsapp':
                    window.open(`https://wa.me/?text=${encodeURIComponent(`${pageTitle} ${pageUrl}`)}`, '_blank');
                    break;
                case 'pinterest':
                    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&description=${encodeURIComponent(pageTitle)}`, '_blank');
                    break;
                case 'email':
                    window.location.href = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(`${pageDescription}\n\n${pageUrl}`)}`;
                    break;
            }
        });
    });
	
   const desktopBtn = document.getElementById('desktopBtn');
    
    if (desktopBtn) {
        desktopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createDesktopShortcut();
        });
    } else {
        console.error('Error: desktopBtn element not found!');
    }

    function createDesktopShortcut() {
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        const formattedTitle = pageTitle.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const shortcutName = `${formattedTitle}.url`;
        const shortcutContent = `[InternetShortcut]\nURL=${pageUrl}`;

        try {
            const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = shortcutName;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('Shortcut downloaded:', shortcutName);
        } catch (error) {
            console.error('Error creating shortcut:', error);
            alert('Failed to save shortcut. Please try again.');
        }
    }
	
	
        });
		
		
/***********************---------------------Submit Favorites-----------------------********************************/
const favoriteBtn = document.getElementById('favoriteBtn');
if (favoriteBtn) {
    favoriteBtn.addEventListener('click', function() {
        if (typeof iflogin !== 'undefined' && iflogin != 1) {
            const loginDialog = setupLoginDialog();
            if (loginDialog) {
                loginDialog.show();
            } else {
                showToast(_LANG.continue_by_sign, false);
            }
            return;
        }
        if (this.dataset.lastClick && Date.now() - this.dataset.lastClick < 10000) {
            showToast(_LANG.try_again_later, false);
            return;
        }
        this.dataset.lastClick = Date.now();

        const icon = this.querySelector('i');
        const isFavorited = this.classList.contains('favorited');
        if (!isFavorited) {
            this.classList.add('favorited');
            icon.classList.replace('fa-heart-empty', 'fa-heart');
        }

        const formData = new FormData();
        formData.append('id', tool_id);
        formData.append('toolname', tool_name);
		formData.append('img_path', tool_image);
        formData.append('url', tool_url);

        fetch(wwwdomain+'/?mod=submitFav', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.action === 'addFav') {
                    showToast(_LANG.added_from_fav, true);
                } else {
					this.classList.remove('favorited');
					icon.classList.replace('fa-heart', 'fa-heart-empty');
                    showToast(_LANG.removed_from_fav, true);
                }
            } else {
                // Revert UI changes if failed
                this.classList.remove('favorited');
                icon.classList.replace('fa-heart', 'fa-heart-empty');
                showToast(_LANG.try_again_later, false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.classList.remove('favorited');
            icon.classList.replace('fa-heart', 'fa-heart-empty');
            showToast(_LANG.try_again_later, false);
        });
    });
}

/***********************---------------------Submit Rating-----------------------********************************/
document.addEventListener('DOMContentLoaded', function() {
    const ratingContainers = document.querySelectorAll('.rating');
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const currentRating = parseFloat(container.getAttribute('data-current-rating'));
        let isRated = container.classList.contains('disabled');
        
        initStars(stars, currentRating);
        
        if (!isRated) {
            stars.forEach(star => {
                star.addEventListener('mouseenter', function() {
                    const hoverValue = parseInt(this.getAttribute('data-value'));
                    updateStars(stars, hoverValue, false);
                });
                star.addEventListener('click', function() {
                    const clickedValue = parseInt(this.getAttribute('data-value'));
                    container.setAttribute('data-current-rating', clickedValue);
                    isRated = true;
                    container.classList.add('disabled');
                    submitRating(container, clickedValue);
                });
            });
            
            container.addEventListener('mouseleave', function() {
                updateStars(stars, currentRating, false);
            });
        }
    });
    
    function initStars(stars, rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        stars.forEach((star, index) => {
            const starValue = index + 1;
            
            if (starValue <= fullStars) {
                star.classList.add('filled');
            } else if (starValue === fullStars + 1 && hasHalfStar) {
                star.classList.add('half');
            } else {
                star.classList.remove('filled', 'half');
            }
        });
    }
    
    function updateStars(stars, value, isPermanent) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            
            star.classList.toggle('filled', starValue <= value);
            star.classList.remove('half');
            
            if (isPermanent) {
                star.classList.remove('hovered');
            }
        });
    }
    
    function submitRating(container, rating) {
        const toolId = container.getAttribute('data-tool-id');
        const adjustedRating = rating <= 4 ? 4 : rating;
        
        fetch(wwwdomain+'/?mod=submitRating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${toolId}&rating=${adjustedRating}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(_LANG.thankyou, true);
                const countElement = container.querySelector('.count');
                if (countElement) {
                    const currentCount = parseInt(countElement.textContent);
                    countElement.textContent = currentCount + 1;
                }
            } else {
                showToast(data.message === '-1' ? _LANG.voted_today : data.message || _LANG.try_again_later,false);
                container.classList.remove('disabled');
            }
        })
        .catch(error => {
            showToast(_LANG.try_again_later, false);
            container.classList.remove('disabled');
            console.error('Error:', error);
        });
    }
});

document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  
  e.preventDefault();
  const target = document.querySelector(anchor.getAttribute('href'));
  if (!target) return;

  // 临时禁用CSS平滑滚动
  document.documentElement.style.scrollBehavior = 'auto';
  
  // 获取CSS中定义的scroll-margin-top值
  const scrollMargin = parseInt(getComputedStyle(target).scrollMarginTop) || 0;
  const targetPos = target.getBoundingClientRect().top + window.scrollY - scrollMargin;
  
  // 自定义动画参数
  const duration = 800; // 调整这个值改变滚动速度
  
  // 开始自定义平滑滚动
  const startPos = window.scrollY;
  const distance = targetPos - startPos;
  let startTime;
  
  function animate(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    window.scrollTo(0, startPos + distance * easeOutQuad(progress));
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // 恢复CSS平滑滚动
      document.documentElement.style.scrollBehavior = '';
    }
  }
  
  function easeOutQuad(t) { return t * (2 - t); }
  
  requestAnimationFrame(animate);
});