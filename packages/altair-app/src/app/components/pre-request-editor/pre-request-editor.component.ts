import {
  Component,
  OnChanges,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  DoCheck,
  AfterViewInit
} from '@angular/core';

// Import the codemirror packages
import * as Codemirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
// import 'codemirror/addon/display/autorefresh';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/javascript/javascript';
import { handleEditorRefresh } from 'app/utils/codemirror/refresh-editor';
import { PreRequestService } from 'app/services';

const AUTOCOMPLETE_CHARS = /^[a-zA-Z0-9_]$/;

@Component({
  selector: 'app-pre-request-editor',
  templateUrl: './pre-request-editor.component.html',
  styles: []
})
export class PreRequestEditorComponent implements AfterViewInit, OnChanges, DoCheck {

  @Input() preRequest: any = {};
  @Output() preRequestScriptChange = new EventEmitter();
  @Output() preRequestEnabledChange = new EventEmitter();

  @ViewChild('editor', { static: true }) editor: ElementRef & { codeMirror: CodeMirror.Editor };

  preRequestEditorConfig = {
    mode: 'javascript',
    lineWrapping: true,
    lineNumbers: true,
    foldGutter: true,
    autoRefresh: true,
    dragDrop: false,
    autoCloseBrackets: true,
    keyMap: 'sublime',
    theme: 'default pre-request-editor mousetrap',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Cmd-/': (cm: CodeMirror.Editor) => cm.execCommand('toggleComment'),
      'Ctrl-/': (cm: CodeMirror.Editor) => cm.execCommand('toggleComment'),
    },
    hintOptions: {
      completeSingle: false,
      globalScope: this.createGlobalScope(),
    },
  };

  constructor() {}

  ngAfterViewInit() {
    if (this.editor?.codeMirror) {
      (this.editor.codeMirror as any).on('keyup', (cm: CodeMirror.Editor, event: KeyboardEvent) => this.onKeyUp(cm, event));
    }
  }

  ngOnChanges() {
  }

  ngDoCheck() {
    // Refresh the query result editor view when there are any changes
    // to fix any broken UI issues in it
    handleEditorRefresh(this.editor && this.editor.codeMirror);
  }

  /**
   * Handles the keyup event on the query editor
   * @param cm
   * @param event
   */
  onKeyUp(cm: CodeMirror.Editor, event: KeyboardEvent) {
    if (AUTOCOMPLETE_CHARS.test(event.key)) {
      this.editor.codeMirror.execCommand('autocomplete');
    }
  }

  private createGlobalScope() {
    return Object.create(null, {
      altair: {
        value: Object.create(null, {
          helpers: {
            value: Object.create(null, {
              getEnvironment: {
                value: null
              },
              setEnvironment: {
                value: null
              },
              getCookie: {
                value: null
              },
              request: {
                value: null
              },
            }),
          }
        })
      }
    })
  }
}
