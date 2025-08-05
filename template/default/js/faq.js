document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const isMobile = window.matchMedia('(max-width: 767px)').matches;
            
            if (isMobile) {
                // 手机端：手风琴效果（只展开一个）
                faqQuestions.forEach(q => {
                    if (q !== question && q.parentNode.classList.contains('active')) {
                        q.parentNode.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            } else {
                // PC端：点击任意项展开所有项
                const isAnyActive = [...faqQuestions].some(q => q.parentNode.classList.contains('active'));
                
                if (isAnyActive) {
                    // 如果已有展开的项，则全部收起
                    faqQuestions.forEach(q => {
                        q.parentNode.classList.remove('active');
                    });
                } else {
                    // 如果没有展开的项，则全部展开
                    faqQuestions.forEach(q => {
                        q.parentNode.classList.add('active');
                    });
                }
            }
        });
    });
});