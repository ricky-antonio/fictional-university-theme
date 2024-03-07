import $ from 'jquery';

class Search {
    // describe and create/initiate object
    constructor() {
        this.addSearchHTML();
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $("#search-term");
        this.resultsDiv = $("#search-overlay__results")
        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.previousValue;
        this.typingTimer;
    }

    // events
    events() {
        this.openButton.on("click", this.toggleOverlay.bind(this));
        this.closeButton.on("click", this.toggleOverlay.bind(this));
        $(document).on("keydown", this.keyPressDispatcher.bind(this));
        this.searchField.on("keyup", this.typingLogic.bind(this));
    }
    // methods

    typingLogic() {
        if (this.searchField.val() != this.previousValue) {
            clearTimeout(this.typingTimer);
            if (this.searchField.val()) {
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750);
            } else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }
        }

        this.previousValue = this.searchField.val();
    }

    getResults() {
        $.getJSON(universityData.root_url+'/wp-json/university/v1/search?term='+this.searchField.val(), (results) => {
            this.resultsDiv.html(`
                <div class="row">
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.generalInfo.length ? 
                            `<ul class="link-list min-list">
                                ${results.generalInfo.map(item => 
                                    `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}
                            </ul>`
                        : `<p>no results found.</p>`}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${results.programs.length ? 
                            `<ul class="link-list min-list">
                                ${results.programs.map(item => 
                                    `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
                            </ul>`
                        : `<p>no results found. <a href="${universityData.root_url}/programs">View All Programs</a></p>`}
                        <h2 class="search-overlay__section-title">Professors</h2>
                        ${results.professors.length ? 
                            `<ul class="professor-cards">
                                ${results.professors.map(item => 
                                    `
                                    <li class="professor-card__list-item">
                                        <a class="professor-card" href="${item.permalink}">
                                            <img 
                                                src="${item.image}" 
                                                alt="${item.title}" 
                                                class="professor-card__image"
                                            >
                                            <span class="professor-card__name">${item.title}</span>
                                        </a>
                                    </li>
                                    `).join('')}
                            </ul>`
                        : `<p>no results found.</p>`}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Campuses</h2>
                        ${results.campuses.length ? 
                            `<ul class="link-list min-list">
                                ${results.campuses.map(item => 
                                    `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
                            </ul>`
                        : `<p>no results found. <a href="${universityData.root_url}/campuses">View All campuses</a></p>`}
                        <h2 class="search-overlay__section-title">Events</h2>
                        ${results.events.length ? 
                            `
                                ${results.events.map(item => 
                                    `
                                    <div class="event-summary">
                                        <a class="event-summary__date t-center" href="${item.permalink}">
                                        <span class="event-summary__month">${item.month}</span>
                                        <span class="event-summary__day">${item.day}</span>
                                        </a>
                                        <div class="event-summary__content">
                                            <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                                            <p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
                                        </div>
                                    </div>
                                    `).join('')}
                            `
                        : `<p>no results found. <a href="${universityData.root_url}/events">View All events</a></p>`}
                    </div>
                </div>
            `);
            this.isSpinnerVisible = false;
        });

        
    }
    
    toggleOverlay() {
        this.searchOverlay.toggleClass("search-overlay--active");
        $("body").toggleClass("body-no-scroll");
        this.searchField.val('');
        setTimeout(() => this.searchField.focus(), 301);
        this.isOverlayOpen = !this.isOverlayOpen;
    }

    keyPressDispatcher(e) {
        // s = 83
        if (e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {
            this.toggleOverlay();
        }
        // esc = 27
        if (e.keyCode == 27  && this.isOverlayOpen) {
            this.toggleOverlay();
        }
    }

    addSearchHTML() {
        $("body").append(`
            <div class="search-overlay">
                <div class="search-overlay__top">
                    <div class="container">
                        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                        <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term"
                            autocomplete="off">
                        <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                    </div>
                </div>

                <div class="container">
                    <div id="search-overlay__results">
                        
                    </div>
                </div>
            </div>
        `)
    }
}

export default Search;