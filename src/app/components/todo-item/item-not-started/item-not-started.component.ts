import { Component } from '@angular/core';
import { TodoItemBaseComponent } from '../todo-item.base/todo-item.component.base';

@Component({
  selector: 'app-item-not-started',
  standalone: true,
  imports: [],
  templateUrl: './item-not-started.component.html',
  styleUrl: './item-not-started.component.css'
})
export class ItemNotStartedComponent extends TodoItemBaseComponent {

}
