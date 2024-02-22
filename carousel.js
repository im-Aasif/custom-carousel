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
		this.startX = null;
	}

	initCarousel() {
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(carouselTemplate.content.cloneNode(true));
		const slides = this.shadowRoot.querySelectorAll(".slide");
		const indicator = this.shadowRoot.querySelector("#indicator");
		this.slider = this.shadowRoot.querySelector('.slider');
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

		this.slider.addEventListener('touchstart', (e) => this.touchStart(e));
		this.slider.addEventListener('touchmove', (e) => this.touchMove(e));
		this.slider.addEventListener('touchend', (e) => this.touchEnd(e));
		this.slider.addEventListener('mousedown', (e) => this.mouseStart(e));
		this.slider.addEventListener('mouseup', (e) => this.mouseEnd(e));
		this.slider.addEventListener('mousemove', (e) => this.mouseMove(e));

	}

	updateCarousel(slides, dots) {
		slides.forEach((slide, idx) => slide.style.transform = `translateX(${100 * (idx - this.currentSlide)}%)`);
		dots.forEach((btn, idx) => {
			if (idx === this.currentSlide) btn.classList.add('button-selected');
			else btn.classList.remove('button-selected');
		});
	}

	mouseStart(e) {
		this.startX = e.clientX;
	}

	mouseMove(e) {
		if (!this.startX) return;
		const xDiff = e.clientX - this.startX;
		if (xDiff > 0) this.prevBtnHandler();
		else this.nextBtnHandler();
		this.startX = null;
	}

	mouseEnd(e) {
		this.startX = null;
	}

	touchStart(e) {
		this.startX = e.touches[0].clientX;
	}

	touchMove(e) {
		if (!this.startX) return;
		const xDiff = e.touches[0].clientX - this.startX;
		if (xDiff > 0) this.prevBtnHandler()
		else this.nextBtnHandler();
		this.startX = null;
	}

	touchEnd(e) {
		this.startX = null;
	}

	nextBtnHandler() {
		const slides = this.shadowRoot.querySelectorAll(".slide");
		const dots = this.shadowRoot.querySelectorAll('#indicator button');
		let maxSlide = slides.length - 1;

		if (this.currentSlide === maxSlide) this.currentSlide = 0;
		else this.currentSlide++;
		this.updateCarousel(slides, dots);
	}

	prevBtnHandler() {
		const slides = this.shadowRoot.querySelectorAll(".slide");
		const dots = this.shadowRoot.querySelectorAll('#indicator button');
		let maxSlide = slides.length - 1;
		if (this.currentSlide === 0) this.currentSlide = maxSlide;
		else this.currentSlide--;
		this.updateCarousel(slides, dots);
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
		if (this.slider) {
			this.slider.removeEventListener('touchstart', this.touchStart);
			this.slider.removeEventListener('touchend', this.touchEnd);
			this.slider.removeEventListener('touchmove', this.touchMove);
			this.slider.removeEventListener('mousedown', this.mouseStart);
			this.slider.removeEventListener('mouseup', this.mouseEnd);
			this.slider.removeEventListener('mousemove', this.mouseMove);
		}
		clearInterval(this.intervalId);
	}
}

window.customElements.define("custom-carousel", Carousel);
