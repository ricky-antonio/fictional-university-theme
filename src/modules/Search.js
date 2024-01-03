import $ from 'jquery';

class Search {
    // describe and create/initiate object
    constructor() {
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.events();
    }

    // events
    events() {
        this.openButton.on("click", this.toggleOverlay.bind(this));
        this.closeButton.on("click", this.toggleOverlay.bind(this));
    }
    // methods
    toggleOverlay() {
        this.searchOverlay.toggleClass("search-overlay--active")
    }
}

export default Search;