import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodoGroupComponent } from './components/todo-group/todo-group.component';
import { ToDoStatus, TodoGroup } from './models/todo-group';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TodoGroupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public todoGroups: TodoGroup[];

  constructor() {
    this.todoGroups = [{
      title: 'первый',
      items: [{
        title: 'Сделать ToDo',
        description: 'Делаем ToDo',
        status: ToDoStatus.IN_PROGRESS
      },
    ]
    }]
  }
}
