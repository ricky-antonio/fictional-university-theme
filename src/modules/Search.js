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
        $.when(
            $.getJSON(universityData.root_url+'/wp-json/wp/v2/posts?search='+this.searchField.val()),
            $.getJSON(universityData.root_url+'/wp-json/wp/v2/pages?search='+this.searchField.val())
        ).then(
            (posts, pages) => {
                var combinedResults = posts[0].concat(pages[0]);
                this.resultsDiv.html(`
                <h2 class="search-overlay__section-title">General Information</h2>
                ${combinedResults.length ? 
                    `<ul class="link-list min-list">
                        ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
                    </ul>`
                : `<p>no results found.</p>`}
                
            `);
            this.isSpinnerVisible = false;
            }, () => this.resultsDiv.html('<p>Unexpected error; please try again.</p>')
        );
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