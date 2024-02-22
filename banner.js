const bannerTemplate = document.createElement("template");
bannerTemplate.innerHTML = `
    <style>
        .banner {
            display: flex;
            flex-direction: row;
            gap: 16px;
            margin: 16px auto;
            height: 160px;
            background-color: #79ADDC;
        }
        .banner-info {
            flex: 1;
            padding: 16px;
        }
        .banner-image {
            flex: 0 1 auto;
            width: auto;
            height: 100%;
            max-width: 200px;
            background-size: cover;
        }
    </style>
    <div class="banner">
        <div class="banner-info">
            <p id="title"></p>
            <p id="subtitle"></p>
        </div>
        <img class="banner-image" id="banner-img"/>
    </div>
`;

class Banner extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(bannerTemplate.content.cloneNode(true));
		this.initBanner();
	}

	initBanner() {
		this.shadowRoot.querySelector("#banner-img").src =
			this.getAttribute("image");
		this.shadowRoot.querySelector("#title").innerText =
			this.getAttribute("title");
		this.shadowRoot.querySelector("#subtitle").innerText =
			this.getAttribute("subtitle");
	}

	connectedCallback() {
		this.initBanner();
	}

	disconnectedCallback() {}
}

window.customElements.define("promo-banner", Banner);
