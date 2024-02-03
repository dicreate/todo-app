import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoItem } from '../../../models/todo-group';

@Directive({})

export class TodoItemBaseComponent implements OnInit{
  ngOnInit(): void {
    this.description = this.todoItem.description;
  }

  @Input() todoItem!: TodoItem;
  @Input() index!: number;

  @Output() eventChangeDescription = new EventEmitter<{description: string, index: number}>();

  public isShowDescription = true;

  public description?: string;

  public emitChangeDescriptin(value:string) : void {
    this.eventChangeDescription.emit({description: value, index: this.index})
  }
}
