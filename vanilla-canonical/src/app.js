const fetchPosts = async (url) => {
    const response = await fetch(url);
    return response.json();
};

const renderCards = async (url, cols = 3) => {
    const posts = await fetchPosts(url);
    const l = posts.length;
    const rows = Math.ceil(l / cols);

    let html = '';
    for (let i = 0; i < rows; i++) {
        html += '<div class="row">';

        for (let j = 0; (j < cols) && ((i * cols + j) < l); j++) {
            const post = posts[i * cols + j];

            const fullDate = new Date(post.date).toDateString();
            const author = post._embedded.author[0];

            html += `
                <div class="col-${Math.round(12 / cols)}">
                    <div class="p-card u-no-padding">
                        <div class="p-card__inner">
                            CLOUD AND SERVER
                        </div>
                        <hr class="u-no-margin--top u-padded__x">
                        <img class="p-card__image p-card-image__padded" src="${post.featured_media}" alt="" />
                        <div class="p-card__inner">
                            <a href="${post.link}">
                                <h4>${post.title.rendered}</h4>
                            </a>
                        </div>
                        <div class="p-card__inner author">
                            <em>By <a href="${author.link}">${author.name}</a> on ${fullDate}</em>
                        </div>
                        <hr class="u-no-margin--bottom u-padded__x">
                        <div class="p-card__inner">Article</div>
                    </div>
                </div>
            `;
        }
        html += '</div>';
    }

     return html;
}

renderCards('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json').then(html => {
    const container = document.getElementById('container');
    const loading = document.getElementById('loading');

    loading.classList.add('hide');

    container.innerHTML = html;
});