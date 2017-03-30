export class ElementCalculation{
	public getOuterWidth(element: HTMLElement): number {
		let width = element.offsetWidth;
		let style = getComputedStyle(element);
		width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
		return width;
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