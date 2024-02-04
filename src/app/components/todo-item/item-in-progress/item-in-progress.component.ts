import { Component } from '@angular/core';
import { TodoItemBaseComponent } from '../todo-item.base/todo-item.component.base';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-in-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-in-progress.component.html',
  styleUrl: './item-in-progress.component.css'
})
export class ItemInProgressComponent extends TodoItemBaseComponent {

}
