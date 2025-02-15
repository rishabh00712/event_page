document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll(".lazy");

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0.5) {  // Image loads when 50% visible
                const img = entry.target;
                img.src = img.getAttribute("data-src");
                img.classList.add("loaded");
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.5 });  // Adjust visibility threshold (0 to 1)

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});

document.getElementById('search-bar').addEventListener('input', function() {
    let searchQuery = this.value.toLowerCase();
    let collegeSections = document.querySelectorAll('.college-section');
    
    collegeSections.forEach(function(college) {
        let collegeName = college.querySelector('.college-name').textContent.toLowerCase();
        if (collegeName.startsWith(searchQuery)) {
            college.style.display = 'block';
        } else {
            college.style.display = 'none';
        }
    });
});

function shareContent(college, event_title, event_date, event_des, url_web) { 
    console.log("hello key press"); 
    try {
        const message = `Hello, 

I wanted to share details about *${event_title}* happening at *${college}* on *${event_date}*.

*Event Details:*
${event_des}

For more information, visit: ${url_web}.
Looking forward to your thoughts. Let me know if you're interested!

Sending from ${window.location.href} Thank You 😇`;

        if (navigator.share) {
            navigator.share({
                title: "Event Information",
                text: message,
                
            }).catch(err => console.error("Error sharing:", err));
        } else {
            console.log("Sharing not supported on this device.");
        }
    } catch (error) {
        console.error("Error sharing content:", error);
    }
}
