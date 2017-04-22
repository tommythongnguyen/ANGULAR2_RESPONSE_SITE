export class ElementCalculation{
	public getOuterWidth(element: HTMLElement): number {
		let width = element.offsetWidth;
		let style = getComputedStyle(element);
		width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
		return width;
	}
	public getOffset(el) {
		let x = el.offsetLeft;
		let y = el.offsetTop;

		while (el = el.offsetParent) {
			x += el.offsetLeft;
			y += el.offsetTop;
		}

		return { left: x, top: y };
	}

	public getOuterHeight(element: HTMLElement): number {
		let height = element.offsetHeight;
		let style = getComputedStyle(element);
		height += parseFloat(style.marginBottom) + parseFloat(style.marginTop);
		return height;
	}

	public getViewport() {
		let width = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth;
		let height = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight;
		return { width: width, height: height };
	}
}