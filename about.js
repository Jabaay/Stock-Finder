document.addEventListener('DOMContentLoaded', function () {
    var carouselText = document.getElementById('carouselTextContent');
    var carousel = document.getElementById('carouselExample');
    var logoutButton = $(".logout");
    var carouselInstance = new bootstrap.Carousel(carousel);

        logoutButton.click(function() {
        var username = localStorage.getItem('username');
        var session = localStorage.getItem('session');
        var url = "http://172.17.12.56/final.php/logout?username="+username+"&session="+session+"";

        a = $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            // do nothing.
        }).fail(function(error) {
            alert("Failed to logout")
        });
    });

    carousel.addEventListener('slid.bs.carousel', function (event) {
        console.log("Test");
        var activeSlide = event.relatedTarget;
        var slideIndex = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(activeSlide);
        var newText = '';
        switch (slideIndex) {
            case 0:
                newText = "Hello my name is Aiden Hill. I am a computer science major here at Miami University. I will be graduating in May of 2025 and be moving into industry. This summer I will be a PML Intern in Textron’s IT Leadership Development program allowing me to better understand not only Product Management as a whole but what it is like to work in industry. I have taken many classes here at Miami University learning important tools for the future such as Java, C++, R, JavaScript, CSS, HTML, Agile Frameworks, the product management lifecycle, and many other frameworks and libraries. For CSE 383 I have had to be a quick learner pulling in previous knowledge in order to pick up fun and new skills. Overall, I have had a great time learning new languages, libraries, frameworks, and other web applications.";
                break;
            case 1:
                newText = "I have many hobbies that I currently enjoy and many that I would like to explore further soon. Currently my most invested hobby is pool/billiards. I am an active member in Miami University's pool club, joining my friends in order to play and practice at least once a week. Another hobby that I participate in is motorcycle riding! It is my favorite thing to do in the summer, feeling the breeze as I ride down the road and hanging out with and meeting new friends is always something that I enjoy doing. Recently I have been getting more involved with playing pickleball which has been an interesting game to learn. While fun, I still believe that I enjoy playing tennis more. Overall I believe that any hobby outdoors is for me, but the hobby that I am looking forward to getting into the most is drone flying which I hope to learn more about this summer.";
                break;
            case 2:
                newText = "I have always had an entrepreneurial spirit instilled in me by my parents who dabble in small businesses themselves. I will own my own small business someday, but for now I am going to go out into industry to learn as much as I can from those that have succeeded and failed while gaining skills that are sure to help me succeed. I am hopeful that the more I explore the world and its people the more that I can find something that sticks out to me as a passion that I can use to help others and make the lives of those in need easier while allowing me to continue to live a life of exploration, learning and teaching. ";
                break;
            default:
                newText = "Default text for unknown slide.";
                break;
        }
        carouselText.innerHTML = newText;
    });
});
