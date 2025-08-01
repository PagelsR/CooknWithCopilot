// RSS Feed functionality for Cook'n With Copilot
class RSSFeedReader {
    constructor(feedUrl, containerId) {
        this.feedUrl = feedUrl;
        this.container = document.getElementById(containerId);
        this.maxItems = 5; // Number of items to display
    }

    async loadFeed() {
        try {
            // For local development and GitHub Pages, we'll read the RSS file directly
            const response = await fetch(this.feedUrl);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            this.displayFeed(xmlDoc);
        } catch (error) {
            console.error('Error loading RSS feed:', error);
            this.displayError();
        }
    }

    displayFeed(xmlDoc) {
        const items = xmlDoc.querySelectorAll('item');
        const feedHTML = this.generateFeedHTML(items);
        this.container.innerHTML = feedHTML;
    }

    generateFeedHTML(items) {
        let html = '<div class="rss-feed-container">';
        html += '<div class="rss-header">';
        html += '<h3 class="rss-title">Latest from RSS Feed</h3>';
        html += '<a href="rss.xml" class="rss-link" target="_blank">📡 Subscribe to RSS</a>';
        html += '</div>';
        html += '<div class="rss-items">';

        // Convert NodeList to Array and slice to get only the first maxItems
        const itemsArray = Array.from(items).slice(0, this.maxItems);
        
        itemsArray.forEach(item => {
            const title = this.getTextContent(item, 'title');
            const link = this.getTextContent(item, 'link');
            const description = this.getTextContent(item, 'description');
            const pubDate = this.getTextContent(item, 'pubDate');
            
            html += this.createItemHTML(title, link, description, pubDate);
        });

        html += '</div></div>';
        return html;
    }

    createItemHTML(title, link, description, pubDate) {
        const formattedDate = this.formatDate(pubDate);
        
        return `
            <div class="rss-item">
                <div class="rss-item-header">
                    <a href="${link}" class="rss-item-title" target="_blank">${title}</a>
                    <span class="rss-item-date">${formattedDate}</span>
                </div>
                <p class="rss-item-description">${description}</p>
            </div>
        `;
    }

    getTextContent(item, tagName) {
        const element = item.querySelector(tagName);
        return element ? element.textContent.trim() : '';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (error) {
            return dateString;
        }
    }

    displayError() {
        this.container.innerHTML = `
            <div class="rss-error">
                <p>Unable to load RSS feed at this time. Please try again later.</p>
                <a href="rss.xml" target="_blank">View RSS feed directly</a>
            </div>
        `;
    }
}

// Initialize RSS feed when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const rssReader = new RSSFeedReader('./rss.xml', 'rss-feed-section');
    rssReader.loadFeed();
});
