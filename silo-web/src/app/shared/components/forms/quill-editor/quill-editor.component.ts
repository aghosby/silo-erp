import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true
    }
  ]
})
export class QuillEditorComponent implements OnInit, ControlValueAccessor {

  quillForm!:FormGroup

  @Input() minHeight:string = 'auto';
  @Input() quillToolbar:any = [
    ['bold', 'italic', 'underline'],        // toggled buttons
    // ['blockquote', 'code-block'],

    //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction
    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    // [{ 'align': [] }],
    // ['clean'],                                        // remove formatting button
    ['link', 'image', 'video']                         // link and image, video
  ];
  
  constructor() { }

  tools:any = {}

  /*****************************************************/
  writeValue(key: any):void {
    this.quillForm.patchValue({
      content: key
    })
  }
  propagateChange = (val:any | null) => {};
  touched = () => {};
  registerOnChange(fn: any): void {
    this.propagateChange = fn
  }
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}
  /*****************************************************/


  ngOnInit(): void {

    this.quillForm = new FormGroup({
      content: new FormControl('')
    })

    this.tools = {
      // imageResize: {},
      //syntax: true,
      toolbar: this.quillToolbar
    }

    this.quillForm.valueChanges.subscribe(val => {
      //console.log(val);
      this.propagateChange(val.content)
    })
  }

}
