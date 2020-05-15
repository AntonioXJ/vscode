/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { CoreNavigationCommands } from 'vs/editor/browser/controller/coreCommands';
import { CursorMove } from 'vs/editor/common/controller/cursorMoveCommands';
import { Position } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
import { withTestCodeEditor, ITestCodeEditor } from 'vs/editor/test/browser/testCodeEditor';
import { ViewModel } from 'vs/editor/common/viewModel/viewModelImpl';

suite('Cursor move command test', () => {

	const TEXT = [
		'    \tMy First Line\t ',
		'\tMy Second Line',
		'    Third Line🐶',
		'',
		'1'
	].join('\n');

	function executeTest(callback: (editor: ITestCodeEditor, viewModel: ViewModel) => void): void {
		withTestCodeEditor(TEXT, {}, (editor, viewModel) => {
			callback(editor, viewModel);
		});
	}

	test('move left should move to left character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveLeft(editor, viewModel);
			cursorEqual(viewModel, 1, 7);
		});
	});

	test('move left should move to left by n characters', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveLeft(editor, viewModel, 3);
			cursorEqual(viewModel, 1, 5);
		});
	});

	test('move left should move to left by half line', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveLeft(editor, viewModel, 1, CursorMove.RawUnit.HalfLine);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move left moves to previous line', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 2, 3);
			moveLeft(editor, viewModel, 10);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move right should move to right character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 5);
			moveRight(editor, viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move right should move to right by n characters', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 2);
			moveRight(editor, viewModel, 6);
			cursorEqual(viewModel, 1, 8);
		});
	});

	test('move right should move to right by half line', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 4);
			moveRight(editor, viewModel, 1, CursorMove.RawUnit.HalfLine);
			cursorEqual(viewModel, 1, 14);
		});
	});

	test('move right moves to next line', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveRight(editor, viewModel, 100);
			cursorEqual(viewModel, 2, 1);
		});
	});

	test('move to first character of line from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveToLineStart(editor, viewModel);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move to first character of line from first non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 6);
			moveToLineStart(editor, viewModel);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move to first character of line from first character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 1);
			moveToLineStart(editor, viewModel);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move to first non white space character of line from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveToLineFirstNonWhitespaceCharacter(editor, viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to first non white space character of line from first non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 6);
			moveToLineFirstNonWhitespaceCharacter(editor, viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to first non white space character of line from first character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 1);
			moveToLineFirstNonWhitespaceCharacter(editor, viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to end of line from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveToLineEnd(editor, viewModel);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to end of line from last non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 19);
			moveToLineEnd(editor, viewModel);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to end of line from line end', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 21);
			moveToLineEnd(editor, viewModel);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to last non white space character from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveToLineLastNonWhitespaceCharacter(editor, viewModel);
			cursorEqual(viewModel, 1, 19);
		});
	});

	test('move to last non white space character from last non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 19);
			moveToLineLastNonWhitespaceCharacter(editor, viewModel);
			cursorEqual(viewModel, 1, 19);
		});
	});

	test('move to last non white space character from line end', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 21);
			moveToLineLastNonWhitespaceCharacter(editor, viewModel);
			cursorEqual(viewModel, 1, 19);
		});
	});

	test('move to center of line not from center', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 8);
			moveToLineCenter(editor, viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move to center of line from center', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 11);
			moveToLineCenter(editor, viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move to center of line from start', () => {
		executeTest((editor, viewModel) => {
			moveToLineStart(editor, viewModel);
			moveToLineCenter(editor, viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move to center of line from end', () => {
		executeTest((editor, viewModel) => {
			moveToLineEnd(editor, viewModel);
			moveToLineCenter(editor, viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move up by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveUp(editor, viewModel, 2);
			cursorEqual(viewModel, 1, 5);

			moveUp(editor, viewModel, 1);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move up by model line cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveUpByModelLine(editor, viewModel, 2);
			cursorEqual(viewModel, 1, 5);

			moveUpByModelLine(editor, viewModel, 1);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move down by model line cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveDownByModelLine(editor, viewModel, 2);
			cursorEqual(viewModel, 5, 2);

			moveDownByModelLine(editor, viewModel, 1);
			cursorEqual(viewModel, 5, 2);
		});
	});

	test('move up with selection by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveUp(editor, viewModel, 1, true);
			cursorEqual(viewModel, 2, 2, 3, 5);

			moveUp(editor, viewModel, 1, true);
			cursorEqual(viewModel, 1, 5, 3, 5);
		});
	});

	test('move up and down with tabs by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(editor, viewModel, 1, 5);
			cursorEqual(viewModel, 1, 5);

			moveDown(editor, viewModel, 4);
			cursorEqual(viewModel, 5, 2);

			moveUp(editor, viewModel, 1);
			cursorEqual(viewModel, 4, 1);

			moveUp(editor, viewModel, 1);
			cursorEqual(viewModel, 3, 5);

			moveUp(editor, viewModel, 1);
			cursorEqual(viewModel, 2, 2);

			moveUp(editor, viewModel, 1);
			cursorEqual(viewModel, 1, 5);
		});
	});

	test('move up and down with end of lines starting from a long one by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveToEndOfLine(editor, viewModel);
			cursorEqual(viewModel, 1, 21);

			moveToEndOfLine(editor, viewModel);
			cursorEqual(viewModel, 1, 21);

			moveDown(editor, viewModel, 2);
			cursorEqual(viewModel, 3, 17);

			moveDown(editor, viewModel, 1);
			cursorEqual(viewModel, 4, 1);

			moveDown(editor, viewModel, 1);
			cursorEqual(viewModel, 5, 2);

			moveUp(editor, viewModel, 4);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to view top line moves to first visible line if it is first line', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 10, 1);

			moveTo(editor, viewModel, 2, 2);
			moveToTop(editor, viewModel);

			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to view top line moves to top visible line when first line is not visible', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(2, 1, 10, 1);

			moveTo(editor, viewModel, 4, 1);
			moveToTop(editor, viewModel);

			cursorEqual(viewModel, 2, 2);
		});
	});

	test('move to view top line moves to nth line from top', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 10, 1);

			moveTo(editor, viewModel, 4, 1);
			moveToTop(editor, viewModel, 3);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view top line moves to last line if n is greater than last visible line number', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 3, 1);

			moveTo(editor, viewModel, 2, 2);
			moveToTop(editor, viewModel, 4);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view center line moves to the center line', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(3, 1, 3, 1);

			moveTo(editor, viewModel, 2, 2);
			moveToCenter(editor, viewModel);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view bottom line moves to last visible line if it is last line', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 5, 1);

			moveTo(editor, viewModel, 2, 2);
			moveToBottom(editor, viewModel);

			cursorEqual(viewModel, 5, 1);
		});
	});

	test('move to view bottom line moves to last visible line when last line is not visible', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(2, 1, 3, 1);

			moveTo(editor, viewModel, 2, 2);
			moveToBottom(editor, viewModel);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view bottom line moves to nth line from bottom', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 5, 1);

			moveTo(editor, viewModel, 4, 1);
			moveToBottom(editor, viewModel, 3);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view bottom line moves to first line if n is lesser than first visible line number', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(2, 1, 5, 1);

			moveTo(editor, viewModel, 4, 1);
			moveToBottom(editor, viewModel, 5);

			cursorEqual(viewModel, 2, 2);
		});
	});
});

// Move command

function move(editor: ITestCodeEditor, viewModel: ViewModel, args: any) {
	CoreNavigationCommands.CursorMove.runCoreEditorCommand(editor, viewModel, viewModel.getCursors(), args);
}

function moveToLineStart(editor: ITestCodeEditor, viewModel: ViewModel) {
	move(editor, viewModel, { to: CursorMove.RawDirection.WrappedLineStart });
}

function moveToLineFirstNonWhitespaceCharacter(editor: ITestCodeEditor, viewModel: ViewModel) {
	move(editor, viewModel, { to: CursorMove.RawDirection.WrappedLineFirstNonWhitespaceCharacter });
}

function moveToLineCenter(editor: ITestCodeEditor, viewModel: ViewModel) {
	move(editor, viewModel, { to: CursorMove.RawDirection.WrappedLineColumnCenter });
}

function moveToLineEnd(editor: ITestCodeEditor, viewModel: ViewModel) {
	move(editor, viewModel, { to: CursorMove.RawDirection.WrappedLineEnd });
}

function moveToLineLastNonWhitespaceCharacter(editor: ITestCodeEditor, viewModel: ViewModel) {
	move(editor, viewModel, { to: CursorMove.RawDirection.WrappedLineLastNonWhitespaceCharacter });
}

function moveLeft(editor: ITestCodeEditor, viewModel: ViewModel, value?: number, by?: string, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.Left, by: by, value: value, select: select });
}

function moveRight(editor: ITestCodeEditor, viewModel: ViewModel, value?: number, by?: string, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.Right, by: by, value: value, select: select });
}

function moveUp(editor: ITestCodeEditor, viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.Up, by: CursorMove.RawUnit.WrappedLine, value: noOfLines, select: select });
}

function moveUpByModelLine(editor: ITestCodeEditor, viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.Up, value: noOfLines, select: select });
}

function moveDown(editor: ITestCodeEditor, viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.Down, by: CursorMove.RawUnit.WrappedLine, value: noOfLines, select: select });
}

function moveDownByModelLine(editor: ITestCodeEditor, viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.Down, value: noOfLines, select: select });
}

function moveToTop(editor: ITestCodeEditor, viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.ViewPortTop, value: noOfLines, select: select });
}

function moveToCenter(editor: ITestCodeEditor, viewModel: ViewModel, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.ViewPortCenter, select: select });
}

function moveToBottom(editor: ITestCodeEditor, viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(editor, viewModel, { to: CursorMove.RawDirection.ViewPortBottom, value: noOfLines, select: select });
}

function cursorEqual(viewModel: ViewModel, posLineNumber: number, posColumn: number, selLineNumber: number = posLineNumber, selColumn: number = posColumn) {
	positionEqual(viewModel.getPosition(), posLineNumber, posColumn);
	selectionEqual(viewModel.getSelection(), posLineNumber, posColumn, selLineNumber, selColumn);
}

function positionEqual(position: Position, lineNumber: number, column: number) {
	assert.deepEqual(position, new Position(lineNumber, column), 'position equal');
}

function selectionEqual(selection: Selection, posLineNumber: number, posColumn: number, selLineNumber: number, selColumn: number) {
	assert.deepEqual({
		selectionStartLineNumber: selection.selectionStartLineNumber,
		selectionStartColumn: selection.selectionStartColumn,
		positionLineNumber: selection.positionLineNumber,
		positionColumn: selection.positionColumn
	}, {
		selectionStartLineNumber: selLineNumber,
		selectionStartColumn: selColumn,
		positionLineNumber: posLineNumber,
		positionColumn: posColumn
	}, 'selection equal');
}

function moveTo(editor: ITestCodeEditor, viewModel: ViewModel, lineNumber: number, column: number, inSelectionMode: boolean = false) {
	if (inSelectionMode) {
		CoreNavigationCommands.MoveToSelect.runCoreEditorCommand(editor, viewModel, viewModel.getCursors(), {
			position: new Position(lineNumber, column)
		});
	} else {
		CoreNavigationCommands.MoveTo.runCoreEditorCommand(editor, viewModel, viewModel.getCursors(), {
			position: new Position(lineNumber, column)
		});
	}
}

function moveToEndOfLine(editor: ITestCodeEditor, viewModel: ViewModel, inSelectionMode: boolean = false) {
	if (inSelectionMode) {
		CoreNavigationCommands.CursorEndSelect.runCoreEditorCommand(editor, viewModel, viewModel.getCursors(), {});
	} else {
		CoreNavigationCommands.CursorEnd.runCoreEditorCommand(editor, viewModel, viewModel.getCursors(), {});
	}
}
