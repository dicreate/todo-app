import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoGroup } from '../../models/todo-group';

@Component({
  selector: 'app-todo-group',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-group.component.html',
  styleUrl: './todo-group.component.css'
})
export class TodoGroupComponent {
  @Input() todoGroup!: TodoGroup;
  @Input() index!: number;
}
