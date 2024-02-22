const carouselTemplate = document.createElement("template");
carouselTemplate.innerHTML = `
    <style type="text/css">
        @import url('./carousel.css');
    </style>
    <div class="slider">
        <div class="slide">
            <promo-banner title="This is my promo banner 1111" subtitle="This is my promo sub title" image="https://i.pickadummy.com/600x400"></promo-banner>
        </div>
        <div class="slide">
            <promo-banner title="This is my promo banner 2222" subtitle="This is my promo sub title" image="https://i.pickadummy.com/600x400"></promo-banner>
        </div>
        <div class="slide">
            <promo-banner title="This is my promo banner 3333" subtitle="This is my promo sub title" image="https://i.pickadummy.com/600x400"></promo-banner>
        </div>
        <div class="slide">
            <promo-banner title="This is my promo banner 4444" subtitle="This is my promo sub title" image="https://i.pickadummy.com/600x400"></promo-banner>
        </div>
        
        <button class="btn btn-next">></button>
        <button class="btn btn-prev"><</button>
        
        <div id="indicator"></div>
    </div>
`;

class Carousel extends HTMLElement {
	constructor() {
		super();
		this.initCarousel();
	}

	initCarousel() {
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(carouselTemplate.content.cloneNode(true));
		const slides = this.shadowRoot.querySelectorAll(".slide");
		const indicator = this.shadowRoot.querySelector("#indicator");
		this.nextBtn = this.shadowRoot.querySelector('.btn-next');
		this.prevBtn = this.shadowRoot.querySelector('.btn-prev');
		this.currentSlide = 0;
		this.intervalId = 0;

		slides.forEach((slide, idx) => {
			slide.style.transform = `translateX(${idx * 100}%)`;

			const button = document.createElement("button");
			button.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;`;
			button.classList.add("button");
			indicator.appendChild(button);
		});

		const dots = this.shadowRoot.querySelectorAll('#indicator button');
		dots[this.currentSlide].classList.add('button-selected');

		indicator.addEventListener('click', (e) => {
			const target = [].slice.call(e.target.parentNode.children).indexOf(e.target);
			if (target !== this.currentSlide && target < dots.length) {
				this.currentSlide = target;
				slides.forEach((slide, idx) => slide.style.transform = `translateX(${idx * 100}%)`);
				dots.forEach((btn) => btn.classList.remove('button-selected'));

				slides[target].style.transform = `translateX(0%)`;
				dots[target].classList.add('button-selected');
			}
		});
	}

	nextBtnHandler() {
		const slides = this.shadowRoot.querySelectorAll(".slide");
		let maxSlide = slides.length - 1;

		if (this.currentSlide === maxSlide) this.currentSlide = 0;
		else this.currentSlide++;

		slides.forEach((slide, idx) => slide.style.transform = `translateX(${100 * (idx - this.currentSlide)}%)`);
		const dots = this.shadowRoot.querySelectorAll('#indicator button');
		dots.forEach((btn, idx) => {
			if (idx === this.currentSlide) btn.classList.add('button-selected');
			else btn.classList.remove('button-selected');
		});
	}

	prevBtnHandler() {
		const slides = this.shadowRoot.querySelectorAll(".slide");
		let maxSlide = slides.length - 1;
		if (this.currentSlide === 0) this.currentSlide = maxSlide;
		else this.currentSlide--;
		slides.forEach((slide, idx) => slide.style.transform = `translateX(${100 * (idx - this.currentSlide)}%)`);
		const dots = this.shadowRoot.querySelectorAll('#indicator button');
		dots.forEach((btn, idx) => {
			if (idx === this.currentSlide) btn.classList.add('button-selected');
			else btn.classList.remove('button-selected');
		});
	}

	runCarousel = () => {
		this.nextBtnHandler();
	}

	connectedCallback() {
		this.prevBtn && this.prevBtn.addEventListener('click', (e) => this.prevBtnHandler());
		this.nextBtn && this.nextBtn.addEventListener('click', (e) => this.nextBtnHandler());
		this.intervalId = setInterval(this.runCarousel, 5000);
	}

	disconnectedCallback() {
		this.prevBtn && this.prevBtn.removeEventListener('click', this.prevBtnHandler);
		this.nextBtn && this.nextBtn.removeEventListener('click', this.prevBtnHandler);
		clearInterval(this.intervalId);
	}
}

window.customElements.define("custom-carousel", Carousel);
