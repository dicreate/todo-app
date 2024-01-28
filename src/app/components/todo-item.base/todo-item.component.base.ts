import { Directive, Input } from '@angular/core';
import { TodoItem } from '../../models/todo-group';

@Directive({})

export class TodoItemBaseComponent {
  @Input() todoItem!: TodoItem;
  @Input() index!: number;
}
