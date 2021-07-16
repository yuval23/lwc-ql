import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';

import MainApp from 'core/app';
const app = createElement('main-app', { is: MainApp });

// eslint-disable-next-line @lwc/lwc/no-document-query
const element = document.querySelector('#main');

window.addEventListener("DOMContentLoaded", () => {
    // sets default home page 
    const pageName = setHistoryPage('home');
    // passing the value into our app
    app.pathName = pageName;
    element.appendChild(app);
});

function setHistoryPage(statePage) {
    let pageName = statePage ? statePage : window.location.hash.substring(1, window.location.hash.length);

    window.history.pushState({ page: pageName.toLowerCase() },
        null,
        '#'.concat(pageName)
    );
    // scroll to top of the page
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    return pageName;
}