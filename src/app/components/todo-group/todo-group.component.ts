import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoGroup } from '../../models/todo-group';
import { ItemDoneComponent } from '../item-done/item-done.component';
import { ItemInProgressComponent } from '../item-in-progress/item-in-progress.component';
import { ItemNotStartedComponent } from '../item-not-started/item-not-started.component';

@Component({
  selector: 'app-todo-group',
  standalone: true,
  imports: [CommonModule, ItemDoneComponent, ItemInProgressComponent, ItemNotStartedComponent],
  templateUrl: './todo-group.component.html',
  styleUrl: './todo-group.component.css'
})
export class TodoGroupComponent {
  @Input() todoGroup!: TodoGroup;
  @Input() index!: number;
}
