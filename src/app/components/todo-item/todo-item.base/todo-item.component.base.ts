import { Directive, EventEmitter, Input, OnInit, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ToDoStatus, TodoItem } from '../../../models/todo-group';

@Directive({})

export class TodoItemBaseComponent implements OnInit {
  ngOnInit(): void {
    this.description = this.todoItem.description;
  }

  @ViewChild('textarea') textarea!: ElementRef;

  /*
  ngAfterViewInit() {
    if (this.textarea) {
      this.autoResize(this.textarea.nativeElement.value);
    }
  } */

  @Input() todoItem!: TodoItem;
  @Input() index!: number;

  @Output() eventChangeDescription = new EventEmitter<{description: string, index: number}>();

  @Output() changeStatus = new EventEmitter<{ status: ToDoStatus, index: number }>();

  @Output() deleteItem = new EventEmitter<number>();

  public TodoStatus = ToDoStatus

  public isShowDescription = false;

  public description?: string;

  public emitChangeDescription(value:string) : void {
    this.eventChangeDescription.emit({description: value, index: this.index})
  }

  public emitChangeStatus(value: ToDoStatus) {
    this.changeStatus.emit({status: value, index: this.index})
  }

  public emitDeleteItem() : void {
    this.deleteItem.emit(this.index)
  }
  autoResize(): void {
    if (!this.textarea || !this.textarea.nativeElement) {
      return; // Выйдем, если элемент не определен
    }

    const textarea = this.textarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
