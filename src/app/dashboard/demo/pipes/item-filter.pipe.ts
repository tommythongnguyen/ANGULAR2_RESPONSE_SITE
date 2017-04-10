import { Pipe, PipeTransform} from '@angular/core';
@Pipe({name:'ItemFilterPipe', pure:false})
export class ItemFilterPipe implements PipeTransform{
	transform(target:any, filteredValue:string, field?:string){
		console.log('value: ', target);
		console.log('field: ', field);
		return target.filter(item => {
			return item[field].includes(filteredValue);
		});
	}
}