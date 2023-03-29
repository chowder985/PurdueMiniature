const CARDS = {
    // contentID = 0
    0: {
        "id": "0",
        "question": "How do my personality, interests, skills and values come together to help me find a good-fit career?",
        "title": "Know Yourself",
        "top": "An in-depth understanding of your strengths is foundational to finding the right major and exploring suitable careers.",
        "isDoubleContent": false,
        "bot": ["FOCUS2 guides users through a reliable, intuitive career and education decision making model to help you choose a college, select a major, explore occupations, make informed career decisions and take action in your career development. Log in using your career account then take the five personal assessments, combine your results and explore good-fit careers."],
        "imgSrc": ["Images/FocusLogo_AI.png"],
        "href": ["https://fc.proxy.elasticsso.com/saml/module.php/elasticsso/sso.php?entityID=https://idp.purdue.edu/idp/shibboleth"],
    },
    // contentID = 1
    1: {
        "id": "1",
        "question": "How can I be more certain of what I want to do and know how to get where I want to go?",
        "title": "Find Where You Want To Go",
        "top": "Learn from others! Listening to the career choices other people have made can offer you ideas of your own!",
        "isDoubleContent": false,
        "bot": ["Watch interviews from industry experts. Learn about personalized career exploration tools. Listen to career stories of people in occupations ranging from scientists to professional athletes. Use your Purdue email to create an account, and refer to Purdue school code - PDUECCO."],
        "imgSrc": ["Images/Logo-Full-Green.png"],
        "href": ["https://roadtripnation.com/edu/purdue"],
    },
    // contentID = 2
    2: {
        "id": "2",
        "question": "What can I do with my major?",
        "title": "Find Where You Want To Go",
        "top": "Discover many of the possible career options related to your major and read about them so you can make the best choice for you!",
        "isDoubleContent": false,
        "bot": ["This website will help you connect majors to careers. Learn about typical career areas and the types of employers that hire people with your major, as well as strategies to help you get there."],
        "imgSrc": ["Images/WCIDWTM Web Link_Final.jpg"],
        "href": ["https://whatcanidowiththismajor.com/major/"],
    },
    // contentID = 3
    3: {
        "id": "3",
        "question": "How can Purdue help me find opportunities to get good experiences in my field?",
        "title": "Find Where You Want To Go",
        "top": "You don't know if you like something until you actually do it! Gain new skills and relevant experiences to help you narrow down your career interests.",
        "isDoubleContent": false,
        "bot": ["MyCCO is where Purdue students and alumni search and apply for internships, full-time positions, and part-time community jobs. You may also register for campus for career fairs, interviews, and information sessions."],
        "imgSrc": ["Images/myCCO_2018_full color_2.png"],
        "href": ["https://www.cco.purdue.edu/Home/myCCO"],
    },
    // contentID = 4
    4: {
        "id": "4",
        "question": "How do I write a resume so it gets me an interview?",
        "title": "Show Who You Are",
        "top": "Your resume is the employer’s first impression of you. Check out these resources to learn how to develop a strategic resume that is tailored to the position you are applying for.",
        "isDoubleContent": true,
        "bot": [
            "Upkey is a fun and easy program to help you build your first resume. Log in and click on “Resume” in the left navigation pane underneath “My Tools.”",
        
            "VMock is a resume critiquing tool that uses machine learning to provide customized and intelligent feedback to make your resume shine. "],
        "imgSrc": ["Images/myCCO_2018_full color_2.png", "Images/Vmock Logo.png"],
        "href": ["https://www.cco.purdue.edu/Home/myCCO", "https://www.vmock.com/purdue"],
        "linkText": ["MyCCO", "VMock"],
    },
    // contentID = 5
    5: {
        "question": "How do I make an appointment with a career consultant?",
        "title": "Make an Appointment",
        "top": "Receive personalized career guidance from a career consultant.<br>Schedule an appointment with a career consultant to discuss your career goals and get help with your career search.",
        "isDoubleContent": false,
        "bot": ["BoilerConnect is a student success system that links staff, faculty, and students in a coordinated support network.<br>Log in and click on “Make an Appointment” in the right panel underneath your profile. Then select “Career/Pre-Professional Advising” and any service under “CCO/~” from the drop-down menus."],
        "imgSrc": ["Images/BoilerConnectLogo.png"],
        "href": ["https://purdue.campus.eab.com/"],
    },
    // ContentID = 6
    // 6: {
    //     "question": "How do I prepare for an interview?",
    //     "title": "Show Who You Are",
    //     "top": "Learn how to communicate strategically with a potential employer. Do not plan to wing it! Convince employers to hire you.",
    //     "isDoubleContent": false,
    //     "bot": ["Big Interview is an interview prep system providing you with hands-on practice with mock interviews tailored to your specific industry, job and experience level."],
    //     "imgSrc": ["Images/BigInterview_Logo.png"],
    //     "href": ["https://purdue.biginterview.com/"],
    // },
    // // contentID = 7
    // 7: {
    //     "question": "How do I demonstrate my strength?",
    //     "title": "Build Your Network",
    //     "top": "You cannot ignore your online presence; that’s where many employers will look for you. Make sure your online network is active and working for you!",
    //     "isDoubleContent": false,
    //     "bot": ["LinkedIn is a professional social media platform that allows you to connect with the world's professionals. You can use LinkedIn to find the right job or internship, create and strengthen professional relationships, and learn the skills you need to succeed in your career."],
    //     "imgSrc": ["Images/LI-Logo.png"],
    //     "href":["https://www.linkedin.com/learning/learning-linkedin-3/set-up-a-new-linkedin-account-2?u=21108259 "],
    // },
    // // This is a content for the main menu
    // 8: {
    //     "question": "How do I address employers at career fairs and networking events?",
    //     "title": "Show Who You Are",
    //     "top": "Preparing your pitch will ensure you make a great impression in 20-30 seconds with potential employers.",
    //     "isDoubleContent": false,
    //     "bot": ["Upkey is an entertaining program to help you develop your pitch. Log in and click on “Resume” in the left navigation pane underneath “My Tools.”"],
    //     "imgSrc": ["Images/upkey logo.jfif"],
    //     "href": ["https://upkey.com/Purdue"],
    // }

};


function updateContent(document, contentToAdd) {
    if (typeof contentToAdd === 'undefined') return;

    let question = document.getElementById("question-card");
    let mobileQuestion = document.getElementById("mobile-question");
    let title = document.getElementById("title");
    let topContent = document.getElementById("top-content");
    let botContent = document.getElementById("bot-content");
    let logo = document.getElementById("logo");
    let link = document.getElementById("link");
    
    question.innerHTML = contentToAdd.question;
    mobileQuestion.innerHTML = contentToAdd.question;
    title.innerHTML = contentToAdd.title;
    topContent.innerHTML = contentToAdd.top;

    let mainContainer = document.getElementById("bottom-row");

    if (contentToAdd.isDoubleContent && !mainContainer.classList.contains("double-content")) {
        mainContainer.classList.add("double-content");
        let botContentRightContainer = document.createElement('div');
        botContentRightContainer.classList.add("col");
        botContentRightContainer.classList.add("d-flex");
        botContentRightContainer.classList.add("flex-column");
        botContentRightContainer.classList.add("justify-content-between");
        botContentRightContainer.id = "content-on-the-right";
        let botContentRightLogo = document.createElement('img');
        let botContentRightText = document.createElement('p');
        botContentRightText.classList.add("bot-content");
        let botContentRightLink = document.createElement('a');

        botContentRightLink.innerHTML = "Visit Website";
        botContentRightLink.classList.add("btn-secondary");
        botContentRightLink.classList.add("btn");
        botContentRightLink.classList.add("double-link");
        botContentRightLink.target = "_blank";
        botContentRightLink.innerHTML = contentToAdd.linkText[1];

        botContentRightContainer.appendChild(botContentRightLogo);
        botContentRightContainer.appendChild(botContentRightText);
        botContentRightContainer.appendChild(botContentRightLink);

        botContentRightLogo.src = contentToAdd.imgSrc[1];
        botContentRightLogo.classList.add("double-img");
        botContentRightText.innerHTML = contentToAdd.bot[1];
        botContentRightLink.href = contentToAdd.href[1];

        link.classList.add("double-link");
        link.innerHTML = contentToAdd.linkText[0];
        logo.classList.add("double-img");
        
        mainContainer.appendChild(botContentRightContainer);
    } else if (!contentToAdd.isDoubleContent && mainContainer.classList.contains("double-content")){
        mainContainer.classList.remove("double-content");
        document.getElementById("content-on-the-right").remove();
        link.classList.remove("double-link");
        link.innerHTML = "Visit Website";
        logo.classList.remove("double-img");
    }
    botContent.innerHTML = contentToAdd.bot[0];
    logo.src = contentToAdd.imgSrc[0];
    link.href = contentToAdd.href[0];
}

function removeCard() {
    document.getElementById("info-card").classList.remove("popShow");
    document.getElementById("info-card").classList.add("popHide");
    document.getElementById("info-card-container").classList.remove("blur");
    document.getElementById("question-container").classList.remove("popShow");
    document.getElementById("question-container").classList.add("popHide");
    document.getElementById("collapseCardBtn").classList.add("animate");
    document.getElementById("collapseCardBtn").classList.add("slide");
    document.getElementById("collapseCardBtn").classList.remove("d-none");
}

function addCard () {
    document.getElementById("info-card").classList.add("popShow");
    document.getElementById("info-card").classList.remove("popHide");
    document.getElementById("info-card-container").classList.add("blur");
    if (!document.getElementById("collapseCardBtn").classList.contains('d-none')) {
        document.getElementById("collapseCardBtn").classList.remove("animate");
        document.getElementById("collapseCardBtn").classList.remove("slide");
        document.getElementById("collapseCardBtn").classList.add("d-none");
    }
    if (window.outerWidth >= 576) {
        document.getElementById("question-container").classList.add("popShow");
        document.getElementById("question-container").classList.remove("popHide");
    }
}

function toggleCard() {
    if (document.getElementById("info-card").classList.contains("popShow")) {
        removeCard();
    } else {
        addCard();
    }
}

let currentID = -1;

function rotateCardsNext() {
    if (document.getElementById("info-card").classList.contains("popShow")) {
        removeCard();
    }
    if (currentID >= 5)
        currentID = -1;
    currentID += 1;
    updateContent(document, CARDS[currentID]);
    addCard();
}

function rotateCardsPrev() {
    if (document.getElementById("info-card").classList.contains("popShow")) {
        removeCard();
    }
    if (currentID <= 0)
        currentID = 6;
    currentID -= 1;
    updateContent(document, CARDS[currentID]);
    addCard();
}

export { updateContent, removeCard, addCard, toggleCard, CARDS, rotateCardsNext, rotateCardsPrev };


