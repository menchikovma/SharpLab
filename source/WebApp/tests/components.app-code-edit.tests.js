import { createMockProxy } from 'jest-mock-proxy';
import mirrorsharp from 'mirrorsharp';
import AppCodeEdit from '../components/app-code-edit.js';
import { vueNextTickWithErrorHandling } from './helpers.js';

jest.mock('mirrorsharp');
let cm;
beforeEach(() => {
    cm = createMockProxy();
    cm.getWrapperElement.mockReturnValue(createMockProxy());

    // @ts-ignore
    mirrorsharp.mockReturnValueOnce({
        getCodeMirror: () => cm
    });
});

test('app-code-edit replaces newlines in line value notes', async () => {
    cm.getLine.mockReturnValue('');

    const edit = new AppCodeEdit({
        el: document.createElement('app-code-edit')
    });
    await vueNextTickWithErrorHandling();
    edit.executionFlow = [{ line: 1, notes: '\r\r\n\n' }];
    await vueNextTickWithErrorHandling();

    expect(cm.setBookmark).toBeCalledWith(
        expect.objectContaining({ line: 0 }),
        /* have to check the widget separately as expect.objectMatching does not work with HTML element */
        expect.objectContaining({ widget: expect.anything() })
    );
    expect(cm.setBookmark.mock.calls[0][1].widget.textContent).toBe('\\r\\r\\n\\n');
});