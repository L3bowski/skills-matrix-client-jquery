(function(js, navigation, ajax, paginatedList) {

    var htmlNodes = paginatedList.getHtmlNodes('skills-list-wrapper');

    var state = paginatedList.getState();
    state.hasSearcher = true;
    state.hasPagination = true;

    function render() {
        // State would be retrieved from the store in Redux
        paginatedList.render(htmlNodes, state, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><a class="reset" href="#" ' +
                'onclick="Navigation.navigate(\'skill-details-section\', {skillId: ' + skill.Id +
                ', readOnly: true})">' + skill.Name + '</a></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    };

    function getSkills(state) {
        js.stallPromise(ajax.get('/api/skill', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedList.defaultInstance), 1500)
        .then(function(paginatedList) {
            state.loadPhase = 'loaded';
            state.results = paginatedList.Items;
            state.totalPages = paginatedList.TotalPages;
            render();
        });
    }

    paginatedList.attachEvents(htmlNodes, state, render, getSkills);

    navigation.register('skills-list-section', function(navigationData) {
        state.loadPhase = 'loading';
        render();
        getSkills(state);
    });

})(window.JsCommons, window.Navigation, window.Ajax, window.PaginatedList);
