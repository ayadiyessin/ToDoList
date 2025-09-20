import { Pipe, PipeTransform } from '@angular/core';
import { TaskDTO } from '../models/task.model';

@Pipe({
  name: 'filterByStatus',
  standalone: true
})
export class FilterByStatusPipe implements PipeTransform {
  transform(tasks: TaskDTO[], status: string): TaskDTO[] {
    return tasks.filter(task => task.status === status);
  }
}
