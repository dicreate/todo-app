import { Component, Input } from '@angular/core';
import { TodoItem } from '../../models/todo-group';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() todoItem!: TodoItem;
  @Input() index!: number;
}
