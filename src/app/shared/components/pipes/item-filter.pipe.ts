import { Pipe, PipeTransform} from '@angular/core';
@Pipe({name:'ItemFilterPipe', pure:false})
export class ItemFilterPipe implements PipeTransform{
	transform(target:any, filteredValue:string, field?:string){
		if(field){
			return target.filter(item => {
				let source = item[field].toString();
				return source.toLowerCase().includes(filteredValue.toLowerCase());
			});
		}

		let newValue = [];
		target.forEach((item) => {
			let ks = Object.keys(item);
			for (let k of ks) {
				let source = item[k].toString();
				if (source.toLowerCase().includes(filteredValue.toLowerCase())){
					newValue.push(item);
					break;
				}
			}
		});
		return newValue;
	}
}