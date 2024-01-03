import $ from 'jquery';

class Search {
    // describe and create/initiate object
    constructor() {
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
                this.typingTimer = setTimeout(this.getResults.bind(this), 1000);
            } else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }
        }

        this.previousValue = this.searchField.val();
    }

    getResults() {
        this.resultsDiv.html("results here")
        this.isSpinnerVisible = false;
    }
    
    toggleOverlay() {
        this.searchOverlay.toggleClass("search-overlay--active");
        $("body").toggleClass("body-no-scroll");
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
}

export default Search;